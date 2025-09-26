import { Client } from '@microsoft/microsoft-graph-client';
import { ConfidentialClientApplication } from '@azure/msal-node';
import * as XLSX from 'xlsx';
import { RSVPRecord } from './database';

interface SharePointConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  siteId: string;
  driveId: string;
  fileName: string;
}

class SharePointService {
  private graphClient: Client | null = null;
  private config: SharePointConfig;

  constructor() {
    this.config = {
      clientId: process.env.SHAREPOINT_CLIENT_ID || '',
      clientSecret: process.env.SHAREPOINT_CLIENT_SECRET || '',
      tenantId: process.env.SHAREPOINT_TENANT_ID || '',
      siteId: process.env.SHAREPOINT_SITE_ID || '',
      driveId: process.env.SHAREPOINT_DRIVE_ID || '',
      fileName: process.env.SHAREPOINT_FILE_NAME || 'GJS_20th_Anniversary_RSVPs.xlsx'
    };

    // Graph client will be initialized lazily when needed
  }

  private async ensureGraphClient(): Promise<Client> {
    if (!this.graphClient) {
      if (!this.isConfigured()) {
        throw new Error('SharePoint is not configured');
      }
      this.graphClient = await this.initializeGraphClient();
    }
    return this.graphClient;
  }

  private async initializeGraphClient(): Promise<Client> {
    const msalConfig = {
      auth: {
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        authority: `https://login.microsoftonline.com/${this.config.tenantId}`
      }
    };

    const cca = new ConfidentialClientApplication(msalConfig);

    try {
      const tokenResponse = await cca.acquireTokenByClientCredential({
        scopes: ['https://graph.microsoft.com/.default']
      });

      return Client.init({
        authProvider: (done) => {
          done(null, tokenResponse.accessToken);
        }
      });
    } catch (error) {
      console.error('Failed to initialize Graph client:', error);
      throw new Error('SharePoint authentication failed');
    }
  }

  async getExcelFile(): Promise<XLSX.WorkBook | null> {
    try {
      const graphClient = await this.ensureGraphClient();
      const filePath = `/sites/${this.config.siteId}/drives/${this.config.driveId}/root:/${this.config.fileName}:/content`;
      const response = await graphClient.api(filePath).get();
      
      if (response) {
        // Convert ArrayBuffer to Workbook
        const workbook = XLSX.read(response, { type: 'array' });
        return workbook;
      }
      return null;
    } catch (error) {
      console.error('Error reading Excel file from SharePoint:', error);
      return null;
    }
  }

  async createExcelFile(rsvps: RSVPRecord[]): Promise<boolean> {
    try {
      // Create a new workbook with RSVP data
      const workbook = XLSX.utils.book_new();
      
      // Convert RSVPs to worksheet format
      const worksheetData = rsvps.map(rsvp => ({
        'Name': rsvp.name,
        'Email': rsvp.email,
        'Attendance': rsvp.attendance === 'yes' ? 'Yes' : 'No',
        'Dietary Requirements': rsvp.dietary_requirements || '',
        'RSVP Date': new Date(rsvp.rsvp_date).toLocaleDateString('en-AU'),
        'Confirmation ID': rsvp.confirmation_id || '',
        'Created At': new Date(rsvp.created_at).toLocaleDateString('en-AU')
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'RSVPs');

      // Convert workbook to buffer
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      // Upload to SharePoint
      const filePath = `/sites/${this.config.siteId}/drives/${this.config.driveId}/root:/${this.config.fileName}:/content`;
      const graphClient = await this.ensureGraphClient();
      await graphClient.api(filePath).put(excelBuffer);

      return true;
    } catch (error) {
      console.error('Error creating Excel file on SharePoint:', error);
      return false;
    }
  }

  async updateExcelFile(rsvps: RSVPRecord[]): Promise<boolean> {
    try {
      // Get existing file or create new one
      const workbook = await this.getExcelFile();
      
      if (!workbook) {
        // File doesn't exist, create it
        return await this.createExcelFile(rsvps);
      }

      // Update existing file
      const worksheetData = rsvps.map(rsvp => ({
        'Name': rsvp.name,
        'Email': rsvp.email,
        'Attendance': rsvp.attendance === 'yes' ? 'Yes' : 'No',
        'Dietary Requirements': rsvp.dietary_requirements || '',
        'RSVP Date': new Date(rsvp.rsvp_date).toLocaleDateString('en-AU'),
        'Confirmation ID': rsvp.confirmation_id || '',
        'Created At': new Date(rsvp.created_at).toLocaleDateString('en-AU')
      }));

      // Update or create RSVPs sheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      workbook.Sheets['RSVPs'] = worksheet;
      workbook.SheetNames = ['RSVPs'];

      // Convert workbook to buffer
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      // Upload updated file to SharePoint
      const filePath = `/sites/${this.config.siteId}/drives/${this.config.driveId}/root:/${this.config.fileName}:/content`;
      const graphClient = await this.ensureGraphClient();
      await graphClient.api(filePath).put(excelBuffer);

      return true;
    } catch (error) {
      console.error('Error updating Excel file on SharePoint:', error);
      return false;
    }
  }

  async appendRSVPToExcel(rsvp: RSVPRecord): Promise<boolean> {
    try {
      // Get existing file
      const workbook = await this.getExcelFile();
      
      if (!workbook) {
        // File doesn't exist, create it with this RSVP
        return await this.createExcelFile([rsvp]);
      }

      // Read existing data
      const worksheet = workbook.Sheets['RSVPs'];
      const existingData = XLSX.utils.sheet_to_json(worksheet);

      // Add new RSVP
      const newRow = {
        'Name': rsvp.name,
        'Email': rsvp.email,
        'Attendance': rsvp.attendance === 'yes' ? 'Yes' : 'No',
        'Dietary Requirements': rsvp.dietary_requirements || '',
        'RSVP Date': new Date(rsvp.rsvp_date).toLocaleDateString('en-AU'),
        'Confirmation ID': rsvp.confirmation_id || '',
        'Created At': new Date(rsvp.created_at).toLocaleDateString('en-AU')
      };

      existingData.push(newRow);

      // Create updated worksheet
      const updatedWorksheet = XLSX.utils.json_to_sheet(existingData);
      workbook.Sheets['RSVPs'] = updatedWorksheet;

      // Convert workbook to buffer
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      // Upload updated file to SharePoint
      const filePath = `/sites/${this.config.siteId}/drives/${this.config.driveId}/root:/${this.config.fileName}:/content`;
      const graphClient = await this.ensureGraphClient();
      await graphClient.api(filePath).put(excelBuffer);

      return true;
    } catch (error) {
      console.error('Error appending RSVP to Excel file on SharePoint:', error);
      return false;
    }
  }

  async getFileUrl(): Promise<string | null> {
    try {
      const filePath = `/sites/${this.config.siteId}/drives/${this.config.driveId}/root:/${this.config.fileName}`;
      const graphClient = await this.ensureGraphClient();
      const file = await graphClient.api(filePath).get();
      return file.webUrl || null;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  }

  isConfigured(): boolean {
    return !!(
      this.config.clientId &&
      this.config.clientSecret &&
      this.config.tenantId &&
      this.config.siteId &&
      this.config.driveId
    );
  }
}

export const sharePointService = new SharePointService();
export default sharePointService;
