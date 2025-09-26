# 🔐 Authentication Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Admin Authentication (REQUIRED)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=GJS2025Admin123

# Optional: Hash your password with bcrypt for extra security
# ADMIN_PASSWORD_HASH=$2a$10$your-bcrypt-hash-here

# Email Configuration (Optional)
RESEND_API_KEY=re_your-resend-api-key-here

# SharePoint Integration (Optional)
SHAREPOINT_CLIENT_ID=your-azure-app-client-id
SHAREPOINT_CLIENT_SECRET=your-azure-app-client-secret
SHAREPOINT_TENANT_ID=your-azure-tenant-id
SHAREPOINT_SITE_ID=your-sharepoint-site-id
SHAREPOINT_DRIVE_ID=your-sharepoint-drive-id
SHAREPOINT_FILE_NAME=GJS_20th_Anniversary_RSVPs.xlsx
SHAREPOINT_FILE_URL=https://your-org.sharepoint.com/sites/your-site/Shared%20Documents/your-file.xlsx

# Organizer Email (Optional)
ORGANIZER_EMAIL=organizer@gjsproperty.events
```

## 🔑 Generating Secure Credentials

### 1. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### 2. Hash Admin Password (Optional but Recommended)
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

## 🛡️ Security Features

### Authentication System
- **NextAuth.js**: Industry-standard authentication
- **JWT Tokens**: Secure session management
- **Role-based Access**: Admin-only access to sensitive areas
- **Session Timeout**: 24-hour session expiration
- **Secure Headers**: CSRF protection and secure cookies

### Protected Routes
- `/admin/*` - All admin pages require authentication
- `/api/admin/*` - All admin APIs require authentication
- `/api/export` - Export functionality requires authentication
- `/api/sync-sharepoint` - SharePoint sync requires authentication

### Security Headers
- **CSRF Protection**: Built-in CSRF protection
- **Secure Cookies**: HttpOnly, Secure, SameSite cookies
- **Session Validation**: Server-side session validation
- **Role Verification**: Admin role verification on every request

## 🚀 Quick Setup

1. **Create `.env.local`** with the required variables above
2. **Set strong credentials**:
   - Use a complex `NEXTAUTH_SECRET` (32+ characters)
   - Use a strong `ADMIN_PASSWORD` (12+ characters, mixed case, numbers, symbols)
3. **Restart your development server**
4. **Access admin portal** at `http://localhost:3000/admin/login`

## 🔒 Production Security Checklist

- [ ] Change default `NEXTAUTH_SECRET`
- [ ] Use strong `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Enable HTTPS in production
- [ ] Consider IP whitelisting for admin access
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## 🆘 Troubleshooting

### Login Issues
- Check environment variables are set correctly
- Verify `NEXTAUTH_SECRET` is set
- Check browser console for errors
- Ensure cookies are enabled
- **Important**: If your password contains special characters like `#`, wrap it in quotes: `ADMIN_PASSWORD="password#with#hashes"`

### Access Denied
- Verify admin role in session
- Check middleware configuration
- Clear browser cookies and try again

### Session Expired
- Sessions expire after 24 hours
- Re-login to continue
- Check system time synchronization

### Password Issues
- If password contains `#`, `!`, `@`, or other special characters, wrap in quotes
- Example: `ADMIN_PASSWORD="MyPass!@#123"`
- Restart server after changing environment variables
