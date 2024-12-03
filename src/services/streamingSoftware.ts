import OBSWebSocket from 'obs-websocket-js';
import { useStreamStore } from '../store/useStreamStore';

type StreamingSoftwareType = 'OBS' | 'Streamlabs' | 'Unknown';

class StreamingSoftwareService {
  private obs: OBSWebSocket;
  private isConnected: boolean = false;
  private softwareType: StreamingSoftwareType = 'Unknown';

  constructor() {
    this.obs = new OBSWebSocket();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.obs.on('ConnectionOpened', async () => {
      this.isConnected = true;
      await this.detectSoftwareType();
      useStreamStore.getState().setStreamingSoftwareStatus('connected');
    });

    this.obs.on('ConnectionClosed', () => {
      console.log('Disconnected from streaming software');
      this.isConnected = false;
      this.softwareType = 'Unknown';
      useStreamStore.getState().setStreamingSoftwareStatus('disconnected');
    });

    this.obs.on('StreamStateChanged', (data) => {
      useStreamStore.getState().setStreamingSoftwareStatus(data.outputActive ? 'streaming' : 'connected');
    });

    // Handle Streamlabs-specific events
    this.obs.on('error', (error) => {
      console.error('Streaming software error:', error);
      if (error.code === 'NOT_CONNECTED') {
        this.isConnected = false;
        useStreamStore.getState().setStreamingSoftwareStatus('disconnected');
      }
    });
  }

  private async detectSoftwareType() {
    try {
      const { vendorName, version } = await this.obs.call('GetVersion');
      this.softwareType = vendorName.toLowerCase().includes('streamlabs') ? 'Streamlabs' : 'OBS';
      console.log(`Connected to ${this.softwareType}`);
    } catch (error) {
      console.error('Failed to detect software type:', error);
      this.softwareType = 'Unknown';
    }
  }

  async connect(address: string = 'ws://localhost:4455', password?: string) {
    try {
      // First try the provided address
      await this.obs.connect(address, password);
      return true;
    } catch (error) {
      // If the first attempt fails and it was OBS's default port, try Streamlabs' default port
      if (address === 'ws://localhost:4455') {
        try {
          // Streamlabs typically uses port 59650 by default
          await this.obs.connect('ws://localhost:59650', password);
          return true;
        } catch (streamlabsError) {
          console.error('Failed to connect to Streamlabs:', streamlabsError);
          return false;
        }
      }
      console.error('Failed to connect to streaming software:', error);
      return false;
    }
  }

  async startStreaming() {
    if (!this.isConnected) return false;
    try {
      await this.obs.call('StartStream');
      return true;
    } catch (error) {
      // Some versions of Streamlabs use different command names
      if (this.softwareType === 'Streamlabs') {
        try {
          await this.obs.call('StartStreaming');
          return true;
        } catch (streamlabsError) {
          console.error('Failed to start Streamlabs streaming:', streamlabsError);
          return false;
        }
      }
      console.error('Failed to start streaming:', error);
      return false;
    }
  }

  async stopStreaming() {
    if (!this.isConnected) return false;
    try {
      await this.obs.call('StopStream');
      return true;
    } catch (error) {
      // Some versions of Streamlabs use different command names
      if (this.softwareType === 'Streamlabs') {
        try {
          await this.obs.call('StopStreaming');
          return true;
        } catch (streamlabsError) {
          console.error('Failed to stop Streamlabs streaming:', streamlabsError);
          return false;
        }
      }
      console.error('Failed to stop streaming:', error);
      return false;
    }
  }

  async setCurrentScene(sceneName: string) {
    if (!this.isConnected) return false;
    try {
      await this.obs.call('SetCurrentProgramScene', { sceneName });
      return true;
    } catch (error) {
      // Streamlabs might use the older command name
      if (this.softwareType === 'Streamlabs') {
        try {
          await this.obs.call('SetCurrentScene', { 'scene-name': sceneName });
          return true;
        } catch (streamlabsError) {
          console.error('Failed to switch Streamlabs scene:', streamlabsError);
          return false;
        }
      }
      console.error('Failed to switch scene:', error);
      return false;
    }
  }

  async getScenes() {
    if (!this.isConnected) return [];
    try {
      const { scenes } = await this.obs.call('GetSceneList');
      return scenes;
    } catch (error) {
      console.error('Failed to get scenes:', error);
      return [];
    }
  }

  getSoftwareType() {
    return this.softwareType;
  }

  disconnect() {
    if (this.isConnected) {
      this.obs.disconnect();
    }
  }
}

export const streamingSoftware = new StreamingSoftwareService();