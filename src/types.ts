export interface TribeCRMConfig {
  apiUrl: string;
  authUrl: string;
  clientId: string;
  clientSecret: string;
  organizationId?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface Entity {
  id: string;
  type: string;
  [key: string]: any;
}

export interface EntityType {
  code: string;
  name: string;
  fields: EntityField[];
}

export interface EntityField {
  code: string;
  name: string;
  type: string;
  required: boolean;
}

export interface SearchResult {
  items: Entity[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface Connector {
  id: string;
  code: string;
  name: string;
  type: string;
  enabled: boolean;
}
