import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbOperations } from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

// Input validation schema
const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email address').max(255, 'Email too long').toLowerCase().trim(),
  attendance: z.enum(['yes', 'no']),
  dietaryRequirements: z.string().max(500, 'Dietary requirements too long').optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured (optional)
    const emailConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder';

    const body = await request.json();
    
    // Validate input data
    const validationResult = rsvpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, email, attendance, dietaryRequirements } = validationResult.data;

    // Sanitize HTML content to prevent XSS
    const sanitizeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedDietary = dietaryRequirements ? sanitizeHtml(dietaryRequirements) : '';

    // Calendar event details (Sydney timezone - AEDT in October)
    const eventDate = '20251030';
    const eventStartTime = '050000'; // 4:00 PM Sydney time in UTC (AEDT is UTC+11)
    const eventEndTime = '090000';   // 8:00 PM Sydney time in UTC (AEDT is UTC+11)
    const eventTitle = 'GJS 20th Year Celebration';
    const eventDescription = 'The GJS Property Team would love you to join us for our 20th year Celebration for some canapés and drink or two 🥂';
    const eventLocation = 'Level 10, Shell House, 37 Margaret Street, Sydney (Via Wynyard Lane)';
    
    // Calendar links (Sydney timezone)
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}T${eventStartTime}Z/${eventDate}T${eventEndTime}Z&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
    const outlookUrl = `ms-outlook://calendar/action/compose?subject=${encodeURIComponent(eventTitle)}&startdt=2025-10-30T05:00:00Z&enddt=2025-10-30T09:00:00Z&body=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;
    const appleUrl = `webcal://p01-calendarws.icloud.com/published/2/MTUyMzQwOTI1ODQ1MTUyM3xGSlMgMjB0aCBZZWFyIENlbGVicmF0aW9ufEdKUyBQcm9wZXJ0eSBUZWFtIHdvdWxkIGxvdmUgeW91IHRvIGpvaW4gdXMgZm9yIG91ciAyMHRoIHllYXIgQ2VsZWJyYXRpb24gZm9yIGEgY2FuYXDDqSBhbmQgZHJpbmsgb3IgdHdvIOKApnwyMDI1LTEwLTMwVDA1OjAwOjAwWi8yMDI1LTEwLTMwVDA5OjAwOjAwWnxMZXZlbCAxMCwgU2hlbGwgSG91c2UsIDM3IE1hcmdhcmV0IFN0cmVldCwgU3lkbmV5IChWaWEgV3lueWFyZCBMYW5lKQ`;

    // Email to RSVP person (confirmation) - only if email is configured
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let confirmationEmail: any = null;
    if (emailConfigured) {
      confirmationEmail = await resend.emails.send({
      from: 'GJS Property Team <noreply@gjsproperty.events>',
      to: [email],
      subject: 'RSVP Confirmation - GJS 20th Year Celebration',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <img src="https://gjsproperty.events/Primary_Dark-GJS@150pp.png" alt="GJS Property" style="height: 60px; width: auto; margin: 0 auto; display: block;">
            </div>
            <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.2em; color: #ffffff; margin: 0 0 10px 0;">RSVP CONFIRMED</h1>
            <h2 style="font-size: 32px; font-weight: 700; margin: 0 0 10px 0; color: #ffffff;">GJS</h2>
            <h3 style="font-size: 18px; font-weight: 300; letter-spacing: 0.1em; color: #cccccc; margin: 0;">20th YEAR CELEBRATION</h3>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px; border-left: 4px solid #007bff;">
              <h4 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0; color: #333333;">RSVP Confirmed! ✅</h4>
              <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 15px 0;">
                Dear ${sanitizedName},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">
                Thank you for your RSVP! We're delighted to confirm your attendance for our 20th Year Celebration.
              </p>
            </div>
            
            <!-- Event Details -->
            <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h5 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #333333;">📅 Event Details</h5>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333333; font-size: 16px;">Date:</strong>
                <span style="color: #555555; font-size: 16px; margin-left: 8px;">Thursday, 30th October 2025</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333333; font-size: 16px;">Time:</strong>
                <span style="color: #555555; font-size: 16px; margin-left: 8px;">4:00 PM - 8:00 PM</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333333; font-size: 16px;">Location:</strong>
                <span style="color: #555555; font-size: 16px; margin-left: 8px;">Level 10, Shell House, 37 Margaret Street, Sydney</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333333; font-size: 16px;">Access:</strong>
                <span style="color: #555555; font-size: 16px; margin-left: 8px;">Via Wynyard Lane</span>
              </div>
              <div style="margin-bottom: 0;">
                <span style="color: #666666; font-size: 14px; font-style: italic;">Starting from 4pm until 8pm - feel free to arrive when convenient for you!</span>
              </div>
            </div>
            
            <!-- Calendar Links -->
            <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: center;">
              <h5 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #333333;">📱 Add to Calendar</h5>
              <p style="font-size: 14px; color: #666666; margin: 0 0 20px 0;">Click your preferred calendar app:</p>
              <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="${googleCalendarUrl}" style="background: #4285f4; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Google Calendar</a>
                <a href="${outlookUrl}" style="background: #0078d4; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Outlook</a>
                <a href="${appleUrl}" style="background: #000000; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Apple Calendar</a>
              </div>
            </div>
            
            <!-- RSVP Details -->
            <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h5 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #333333;">📋 Your RSVP Details</h5>
              <div style="margin-bottom: 15px;">
                <strong style="color: #333333; font-size: 16px;">Attendance:</strong>
                <span style="color: #555555; font-size: 16px; margin-left: 8px;">${attendance === 'yes' ? '✅ Yes, I will attend' : '❌ No, I cannot attend'}</span>
              </div>
              ${sanitizedDietary ? `
              <div style="margin-bottom: 0;">
                <strong style="color: #333333; font-size: 16px;">Dietary Requirements:</strong>
                <span style="color: #555555; font-size: 16px; margin-left: 8px;">${sanitizedDietary}</span>
              </div>
              ` : ''}
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px 0; text-align: center;">
              We look forward to celebrating with you! If you have any questions, please don't hesitate to contact us.
            </p>
            
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef;">
              <p style="font-size: 14px; color: #999999; margin: 0;">
                Best regards,<br>
                <strong>The GJS Property Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
      });
    }

    // Store RSVP in database
    const rsvpResult = await dbOperations.insertRSVP({
      name: sanitizedName,
      email: sanitizedEmail,
      attendance,
      dietary_requirements: sanitizedDietary || undefined,
      confirmation_id: confirmationEmail?.data?.id || undefined,
    });

    // Update invite status if this person was invited
    await dbOperations.updateInviteStatus(sanitizedEmail, 'responded', rsvpResult.lastInsertRowid as number);


    // Email to organizer (RSVP notification) - only if email is configured
    if (emailConfigured) {
      await resend.emails.send({
      from: 'GJS Property Team <noreply@gjsproperty.events>',
      to: [
        'admin@wynt.com.au',
        'regan@gjsproperty.com.au',
        'gordon@gjsproperty.com.au'
      ],
      subject: `New RSVP - ${sanitizedName} - GJS 20th Year Celebration`,
      html: `
        <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; color: #333; padding: 40px;">
          <h2 style="color: #333; margin-bottom: 30px;">New RSVP Received</h2>
          
          <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 30px; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 20px;">RSVP Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; font-weight: 600; color: #333;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; color: #666;">${sanitizedName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; font-weight: 600; color: #333;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; color: #666;">${sanitizedEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; font-weight: 600; color: #333;">Attendance:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; color: #666;">${attendance === 'yes' ? 'Yes, will attend' : 'No, cannot attend'}</td>
              </tr>
              ${sanitizedDietary ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; font-weight: 600; color: #333;">Dietary Requirements:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; color: #666;">${sanitizedDietary}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; font-weight: 600; color: #333;">RSVP Date:</td>
                <td style="padding: 10px 0; color: #666;">${new Date().toLocaleDateString('en-AU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      confirmationId: confirmationEmail?.data?.id,
      rsvpId: rsvpResult.lastInsertRowid
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}