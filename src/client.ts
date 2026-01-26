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
        'https://auth.tribecrm.nl/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: 'read write offline',
          ...(this.config.organizationId && { organization_id: this.config.organizationId }),
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
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Get a single entity by ID
   * @param entityType OData entity type (e.g. 'Relation_Organization', 'Relation_Person')
   * @param entityId Entity UUID
   * @param expand Optional $expand parameter
   * @param select Optional $select parameter
   */
  async getEntity(
    entityType: string,
    entityId: string,
    expand?: string,
    select?: string
  ): Promise<Entity> {
    await this.ensureAuthenticated();
    const params: any = {};
    if (expand) params.$expand = expand;
    if (select) params.$select = select;
    
    const response = await this.axiosInstance.get(`/v1/odata/${entityType}(${entityId})`, { params });
    return response.data;
  }

  /**
   * Create a new entity
   * @param entityType OData entity type
   * @param data Entity data (without ID)
   */
  async createEntity(entityType: string, data: Record<string, any>): Promise<Entity> {
    await this.ensureAuthenticated();
    const response = await this.axiosInstance.post(`/v1/odata/${entityType}`, data);
    return response.data;
  }

  /**
   * Update an existing entity
   * @param entityType OData entity type
   * @param entityId Entity UUID
   * @param data Entity data (must include ID)
   */
  async updateEntity(entityType: string, entityId: string, data: Record<string, any>): Promise<Entity> {
    await this.ensureAuthenticated();
    const payload = { ...data, ID: entityId };
    const response = await this.axiosInstance.post(`/v1/odata/${entityType}`, payload);
    return response.data;
  }

  /**
   * Delete an entity
   * @param entityType OData entity type
   * @param entityId Entity UUID
   */
  async deleteEntity(entityType: string, entityId: string): Promise<void> {
    await this.ensureAuthenticated();
    await this.axiosInstance.delete(`/v1/odata/${entityType}(${entityId})`);
  }

  /**
   * Search/query entities with OData filters
   * @param entityType OData entity type
   * @param options Query options (filter, select, expand, orderby, top, skip, count)
   */
  async queryEntities(
    entityType: string,
    options?: {
      filter?: string;
      select?: string;
      expand?: string;
      orderby?: string;
      top?: number;
      skip?: number;
      count?: boolean;
    }
  ): Promise<any> {
    await this.ensureAuthenticated();
    
    const params: any = {};
    if (options?.filter) params.$filter = options.filter;
    if (options?.select) params.$select = options.select;
    if (options?.expand) params.$expand = options.expand;
    if (options?.orderby) params.$orderby = options.orderby;
    if (options?.top) params.$top = options.top;
    if (options?.skip) params.$skip = options.skip;
    if (options?.count) params.$count = 'true';

    const response = await this.axiosInstance.get(`/v1/odata/${entityType}`, { params });
    return response.data;
  }

  /**
   * Get current employee information
   */
  async getCurrentEmployee(expand?: string): Promise<any> {
    await this.ensureAuthenticated();
    const params: any = {};
    if (expand) params.$expand = expand;
    
    const response = await this.axiosInstance.get('/v1/odata/GetCurrentEmployee()', { params });
    return response.data;
  }

  /**
   * List available entity types (metadata)
   */
  async listEntityTypes(): Promise<EntityType[]> {
    await this.ensureAuthenticated();
    try {
      const response = await this.axiosInstance.get('/v1/odata/$metadata');
      // Parse OData metadata XML - simplified version
      // In production, you'd parse the XML properly
      return [
        { code: 'Relation_Organization', name: 'Organizations', fields: [] },
        { code: 'Relation_Person', name: 'Persons', fields: [] },
        { code: 'Relationship_Organization_CommercialRelationship_Customer', name: 'Customers', fields: [] },
        { code: 'Relationship_Organization_CommercialRelationship_Lead', name: 'Leads', fields: [] },
        { code: 'Activity_Invoice', name: 'Invoices', fields: [] },
        { code: 'Activity_Appointment', name: 'Appointments', fields: [] },
        { code: 'Product', name: 'Products', fields: [] },
      ];
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return [];
    }
  }
}
