export type HostingType = 'cpanel' | 'plesk' | 'directadmin' | 'ftp' | 'ssh' | 'wordpress' | 'other';

export interface Hosting {
  id: string;
  name: string;
  type: HostingType;
  url: string;
  username: string;
  password: string;
  adminPanelUrl?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite?: boolean;
}

export interface HostingFormData {
  name: string;
  type: HostingType;
  url: string;
  username: string;
  password: string;
  adminPanelUrl?: string;
  notes?: string;
  tags: string[];
  favorite?: boolean;
}
