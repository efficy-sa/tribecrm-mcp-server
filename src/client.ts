import axios, { AxiosInstance } from 'axios';
import { TribeCRMConfig, AuthToken, Entity, EntityType, SearchResult, Connector } from './types.js';

export class TribeCRMClient {
  private axiosInstance: AxiosInstance;
  private config: TribeCRMConfig;
  private token: AuthToken | null = null;
  private tokenExpiry: number = 0;

  constructor(config: TribeCRMConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async ensureAuthenticated(): Promise<void> {
    const now = Date.now();
    if (this.token && this.tokenExpiry > now + 60000) {
      return;
    }

    try {
      const response = await axios.post(
        `${this.config.apiUrl}/oauth/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.token = response.data;
      this.tokenExpiry = now + (this.token!.expires_in * 1000);
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token!.access_token}`;
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  async getEntity(entityType: string, entityId: string): Promise<Entity> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.get(`/api/entity/${entityType}/${entityId}`);
    return response.data;
  }

  async createEntity(entityType: string, data: Record<string, any>): Promise<Entity> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.post(`/api/entity/${entityType}`, data);
    return response.data;
  }

  async updateEntity(entityType: string, entityId: string, data: Record<string, any>): Promise<Entity> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.put(`/api/entity/${entityType}/${entityId}`, data);
    return response.data;
  }

  async deleteEntity(entityType: string, entityId: string): Promise<void> {
    await this.ensureAuthenticated();
    await this.axiosInstance.delete(`/api/entity/${entityType}/${entityId}`);
  }

  async searchEntities(
    entityType: string,
    query?: string,
    filters?: Record<string, any>,
    page: number = 1,
    pageSize: number = 20
  ): Promise<SearchResult> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.post(`/api/entity/${entityType}/search`, {
      query,
      filters,
      page,
      pageSize,
    });
    return response.data;
  }

  async listEntityTypes(): Promise<EntityType[]> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.get('/api/entity/types');
    return response.data;
  }

  async listConnectors(): Promise<Connector[]> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.get('/api/connector');
    return response.data;
  }

  async getConnector(connectorId: string): Promise<Connector> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.get(`/api/connector/${connectorId}`);
    return response.data;
  }
}
