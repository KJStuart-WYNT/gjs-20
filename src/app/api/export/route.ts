import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { dbOperations } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'rsvps';
    const format = searchParams.get('format') || 'xlsx';

    let data: Array<Record<string, unknown>> = [];
    let filename = '';

    if (type === 'rsvps') {
      data = dbOperations.getAllRSVPs();
      filename = `GJS_20th_Anniversary_RSVPs_${new Date().toISOString().split('T')[0]}`;
    } else if (type === 'invites') {
      data = dbOperations.getAllInvites();
      filename = `GJS_20th_Anniversary_Invites_${new Date().toISOString().split('T')[0]}`;
    } else if (type === 'summary') {
      const rsvps = dbOperations.getAllRSVPs();
      const invites = dbOperations.getAllInvites();
      const rsvpStats = dbOperations.getRSVPStats();
      const inviteStats = dbOperations.getInviteStats();
      
      // Create summary data
      data = [
        { Sheet: 'RSVP Summary', 'Total RSVPs': rsvps.length, 'Attending': rsvpStats.find(s => s.attendance === 'yes')?.count || 0, 'Not Attending': rsvpStats.find(s => s.attendance === 'no')?.count || 0 },
        { Sheet: 'Invite Summary', 'Total Invites': invites.length, 'Sent': inviteStats.find(s => s.status === 'sent')?.count || 0, 'Responded': inviteStats.find(s => s.status === 'responded')?.count || 0, 'Pending': inviteStats.find(s => s.status === 'pending')?.count || 0 },
        { Sheet: 'Event Details', 'Event': 'GJS 20th Year Celebration', 'Date': 'October 30, 2025', 'Time': '4:00 PM - 8:00 PM', 'Location': 'Level 10, Shell House, 37 Margaret Street, Sydney' }
      ];
      filename = `GJS_20th_Anniversary_Summary_${new Date().toISOString().split('T')[0]}`;
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }

    if (format === 'csv') {
      // Convert to CSV
      if (data.length === 0) {
        return NextResponse.json({ error: 'No data to export' }, { status: 404 });
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape CSV values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      });
    } else {
      // Convert to Excel
      const workbook = XLSX.utils.book_new();

      if (type === 'summary') {
        // Create multiple sheets for summary
        const rsvps = dbOperations.getAllRSVPs();
        const invites = dbOperations.getAllInvites();
        
        // RSVPs sheet
        if (rsvps.length > 0) {
          const rsvpSheet = XLSX.utils.json_to_sheet(rsvps.map(rsvp => ({
            'Name': rsvp.name,
            'Email': rsvp.email,
            'Attendance': rsvp.attendance === 'yes' ? 'Yes' : 'No',
            'Dietary Requirements': rsvp.dietary_requirements || '',
            'RSVP Date': new Date(rsvp.rsvp_date).toLocaleDateString('en-AU'),
            'Confirmation ID': rsvp.confirmation_id || ''
          })));
          XLSX.utils.book_append_sheet(workbook, rsvpSheet, 'RSVPs');
        }

        // Invites sheet
        if (invites.length > 0) {
          const inviteSheet = XLSX.utils.json_to_sheet(invites.map(invite => ({
            'Name': invite.name,
            'Email': invite.email,
            'Status': invite.status.charAt(0).toUpperCase() + invite.status.slice(1),
            'Invite Sent Date': invite.invite_sent_date ? new Date(invite.invite_sent_date).toLocaleDateString('en-AU') : '',
            'Invite URL': invite.invite_url || '',
            'Created Date': new Date(invite.created_at).toLocaleDateString('en-AU')
          })));
          XLSX.utils.book_append_sheet(workbook, inviteSheet, 'Invites');
        }

        // Summary sheet
        const summarySheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      } else {
        // Single sheet export
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, type === 'rsvps' ? 'RSVPs' : 'Invites');
      }

      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        },
      });
    }

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

