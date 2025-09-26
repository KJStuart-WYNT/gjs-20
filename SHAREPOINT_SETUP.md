# SharePoint Integration Setup Guide

This guide will help you set up live Excel file updates to SharePoint for your GJS 20th Anniversary RSVP system.

## Prerequisites

- Microsoft 365/Azure AD tenant
- SharePoint site with appropriate permissions
- Azure App Registration

## Step 1: Create Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: GJS RSVP System
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Leave blank for now
5. Click **Register**

## Step 2: Configure API Permissions

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Choose **Application permissions**
5. Add these permissions:
   - `Sites.ReadWrite.All`
   - `Files.ReadWrite.All`
6. Click **Grant admin consent** (requires admin privileges)

## Step 3: Create Client Secret

1. In your app registration, go to **Certificates & secrets**
2. Click **New client secret**
3. Add a description: "GJS RSVP System Secret"
4. Choose expiration (recommend 24 months)
5. Click **Add**
6. **IMPORTANT**: Copy the secret value immediately - you won't be able to see it again

## Step 4: Get SharePoint Site Information

1. Go to your SharePoint site
2. Click the **Settings** gear icon
3. Select **Site information**
4. Copy the **Site ID** from the URL or use PowerShell:
   ```powershell
   Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/yoursite"
   Get-PnPSite | Select Id
   ```

## Step 5: Get Drive ID

1. In SharePoint, go to **Documents** library
2. The Drive ID is in the URL: `https://yourtenant.sharepoint.com/sites/yoursite/_layouts/15/onedrive.aspx?id=/sites/yoursite/Documents&viewid=...`
3. Or use PowerShell:
   ```powershell
   Get-PnPList -Identity "Documents" | Select Id
   ```

## Step 6: Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# SharePoint Configuration
SHAREPOINT_CLIENT_ID=your_azure_app_client_id
SHAREPOINT_CLIENT_SECRET=your_azure_app_client_secret
SHAREPOINT_TENANT_ID=your_azure_tenant_id
SHAREPOINT_SITE_ID=your_sharepoint_site_id
SHAREPOINT_DRIVE_ID=your_sharepoint_drive_id
SHAREPOINT_FILE_NAME=GJS_20th_Anniversary_RSVPs.xlsx
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `/admin` in your browser
3. Check if "SharePoint Connected" shows green
4. Click "Sync to SharePoint" to test the connection

## How It Works

- **Automatic Sync**: Every RSVP submission automatically updates the SharePoint Excel file
- **Manual Sync**: Use the admin dashboard to sync all RSVPs at once
- **Live Updates**: The Excel file on SharePoint is updated in real-time
- **Backup**: All data is also stored locally in SQLite database

## Troubleshooting

### Common Issues

1. **"SharePoint Not Configured"**
   - Check all environment variables are set correctly
   - Verify the Azure app has the correct permissions

2. **"Authentication Failed"**
   - Verify client ID, secret, and tenant ID are correct
   - Check if the app registration has admin consent

3. **"File Not Found"**
   - The Excel file will be created automatically on first sync
   - Check if the site ID and drive ID are correct

4. **Permission Errors**
   - Ensure the app has `Sites.ReadWrite.All` and `Files.ReadWrite.All` permissions
   - Verify admin consent has been granted

### Testing with PowerShell

```powershell
# Connect to SharePoint
Connect-PnPOnline -Url "https://yourtenant.sharepoint.com/sites/yoursite"

# List files in Documents library
Get-PnPListItem -List "Documents"

# Check if your Excel file exists
Get-PnPFile -Url "/sites/yoursite/Documents/GJS_20th_Anniversary_RSVPs.xlsx"
```

## Security Notes

- Store client secrets securely
- Use environment variables, never commit secrets to code
- Regularly rotate client secrets
- Monitor app permissions and usage

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the server logs for detailed error information
3. Verify all configuration steps were completed correctly
4. Test with a simple file upload first before using the full RSVP system

