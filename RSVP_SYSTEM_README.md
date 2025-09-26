# GJS 20th Anniversary RSVP System

A complete event management system with RSVP tracking, invite management, and live SharePoint integration.

## 🎉 Features

### ✅ **Complete RSVP Management**
- **Real-time RSVP Collection** - Guests can RSVP through personalized invite links
- **Email Confirmations** - Automatic confirmation emails to guests and organizers
- **Database Storage** - All RSVPs stored in SQLite with full data persistence
- **Admin Dashboard** - Complete management interface with real-time statistics

### ✅ **Invite Management System**
- **Bulk Invite Creation** - Add multiple guests at once via CSV or form
- **Personalized Invite Links** - Each guest gets a unique, pre-filled RSVP link
- **Email Sending** - Automated invite email sending with beautiful templates
- **Status Tracking** - Track pending, sent, and responded invites
- **Copy Invite URLs** - Easy sharing of individual invite links

### ✅ **Live SharePoint Integration**
- **Real-time Excel Updates** - Every RSVP automatically updates SharePoint Excel file
- **Microsoft Graph API** - Secure, modern integration with SharePoint
- **Manual Sync Options** - Bulk sync and export capabilities
- **Error Handling** - Graceful fallbacks if SharePoint is unavailable

### ✅ **Export & Reporting**
- **Multiple Export Formats** - Excel (.xlsx) and CSV exports
- **Comprehensive Reports** - Complete summary with RSVPs, invites, and statistics
- **Real-time Statistics** - Live dashboard with attendance counts and trends
- **SharePoint Integration** - Direct access to live Excel file

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local` file:
```env
# Email Configuration
RESEND_API_KEY=re_your_resend_api_key_here
ORGANIZER_EMAIL=organizer@yourcompany.com

# SharePoint Configuration (Optional)
SHAREPOINT_CLIENT_ID=your_azure_app_client_id
SHAREPOINT_CLIENT_SECRET=your_azure_app_client_secret
SHAREPOINT_TENANT_ID=your_azure_tenant_id
SHAREPOINT_SITE_ID=your_sharepoint_site_id
SHAREPOINT_DRIVE_ID=your_sharepoint_drive_id
SHAREPOINT_FILE_NAME=GJS_20th_Anniversary_RSVPs.xlsx
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access Admin Dashboard
Visit `http://localhost:3000/admin` to manage RSVPs and invites.

## 📋 How to Use

### **For Event Organizers:**

1. **Create Invites**
   - Go to Admin Dashboard → Invites tab
   - Add individual invites or bulk upload
   - Copy invite URLs to share with guests

2. **Send Invite Emails**
   - Use "Send All Pending" to email all pending invites
   - Or select specific invites to send
   - Beautiful email templates with event details

3. **Track RSVPs**
   - View real-time statistics on dashboard
   - See who has responded and their attendance status
   - Export data to Excel or CSV

4. **SharePoint Integration**
   - Set up SharePoint credentials (see setup guide)
   - RSVPs automatically sync to Excel file
   - Access live Excel file directly from dashboard

### **For Guests:**

1. **Receive Invite**
   - Get personalized invite email or link
   - Click "RSVP Now" button

2. **Submit RSVP**
   - Form pre-filled with your details
   - Select attendance (Yes/No)
   - Add dietary requirements if needed
   - Submit response

3. **Confirmation**
   - Receive confirmation email
   - Add event to calendar
   - Get event details and location

## 🔧 System Architecture

### **Database Schema**
- **RSVPs Table** - Stores all RSVP responses with timestamps
- **Invites Table** - Tracks invite creation, sending, and response status
- **SQLite** - Lightweight, file-based database for reliability

### **API Endpoints**
- `/api/rsvp` - Handle RSVP submissions
- `/api/invites` - Manage invite creation and retrieval
- `/api/send-invites` - Send invite emails
- `/api/export` - Export data in various formats
- `/api/sync-sharepoint` - Sync data to SharePoint
- `/api/admin/*` - Admin dashboard data endpoints

### **Components**
- **Admin Dashboard** - Complete management interface
- **Invite Management** - Bulk invite creation and sending
- **RSVP Forms** - Guest-facing RSVP interface
- **SharePoint Integration** - Live Excel file updates

## 📊 Admin Dashboard Features

### **Overview Tab**
- Real-time statistics (Total RSVPs, Attending, Not Attending, Pending)
- Export options (Complete summary, RSVPs only, Invites only)
- SharePoint sync status and controls
- Quick access to live Excel file

### **RSVPs Tab**
- Complete list of all RSVP responses
- Filter by attendance status
- View dietary requirements and timestamps
- Export individual RSVP data

### **Invites Tab**
- Manage all created invites
- Bulk invite creation
- Send invite emails
- Track invite status (Pending, Sent, Responded)
- Copy individual invite URLs

## 🔗 SharePoint Setup

See `SHAREPOINT_SETUP.md` for detailed instructions on:
- Creating Azure App Registration
- Configuring SharePoint permissions
- Setting up environment variables
- Testing the integration

## 📧 Email Templates

### **Invite Email**
- Beautiful, responsive design
- Event details and location
- Direct RSVP button
- Calendar integration links

### **Confirmation Email**
- RSVP confirmation details
- Event information
- Calendar links (Google, Outlook, Apple)
- Dietary requirements summary

### **Organizer Notification**
- New RSVP alerts
- Complete guest details
- Timestamp and confirmation ID

## 🛡️ Security Features

- **Input Validation** - Zod schema validation for all inputs
- **XSS Protection** - HTML sanitization for user inputs
- **Environment Variables** - Secure credential management
- **Error Handling** - Graceful error handling and logging
- **Rate Limiting** - Built-in protection against abuse

## 📱 Responsive Design

- **Mobile-First** - Optimized for all device sizes
- **Modern UI** - Beautiful glassmorphism design
- **Accessibility** - Proper contrast and keyboard navigation
- **Performance** - Fast loading and smooth animations

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Environment Variables for Production**
Set all required environment variables in your deployment platform:
- Resend API key for email sending
- SharePoint credentials for live sync
- Organizer email for notifications

## 📈 Monitoring & Analytics

- **Real-time Statistics** - Live dashboard updates
- **Export Capabilities** - Data export for analysis
- **SharePoint Integration** - Live Excel file for team collaboration
- **Error Logging** - Comprehensive error tracking

## 🔄 Data Flow

1. **Invite Creation** → Database storage → Email sending
2. **RSVP Submission** → Database storage → Email confirmations → SharePoint sync
3. **Admin Management** → Real-time dashboard → Export options
4. **SharePoint Sync** → Live Excel updates → Team collaboration

## 🆘 Troubleshooting

### **Common Issues**
- **Email not sending** - Check Resend API key configuration
- **SharePoint sync failing** - Verify Azure app permissions
- **Database errors** - Check file permissions for SQLite database
- **Invite links not working** - Verify base URL configuration

### **Support**
- Check browser console for client-side errors
- Review server logs for API errors
- Verify all environment variables are set correctly
- Test with a simple RSVP submission first

## 🎯 Next Steps

The system is now complete with:
- ✅ Full RSVP management
- ✅ Invite creation and sending
- ✅ Live SharePoint integration
- ✅ Admin dashboard
- ✅ Export capabilities
- ✅ Email notifications

You can now:
1. Set up your environment variables
2. Configure SharePoint integration (optional)
3. Start creating invites for your guests
4. Monitor RSVPs in real-time
5. Export data for event planning

**Happy Event Planning! 🎉**

