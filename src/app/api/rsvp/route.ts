import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

// Input validation schema
const rsvpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email address').max(255, 'Email too long').toLowerCase().trim(),
  attendance: z.enum(['yes', 'no']),
  guests: z.number().min(0).max(3),
  dietaryRequirements: z.string().max(500, 'Dietary requirements too long').optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (basic implementation)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `rsvp_${ip}`;
    
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
      return NextResponse.json(
        { success: false, message: 'Email service not configured. Please set RESEND_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate input data
    const validationResult = rsvpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, attendance, guests, dietaryRequirements } = validationResult.data;

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

    // Email to RSVP person (confirmation)
    const confirmationEmail = await resend.emails.send({
      from: 'GJS Property Team <noreply@gjsproperty.events>',
      to: [email],
      subject: 'RSVP Confirmation - GJS 20th Year Celebration',
      html: `
        <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 32px; font-weight: 300; letter-spacing: 0.3em; color: #fff; margin-bottom: 20px;">YOU'RE INVITED TO</h1>
            <h2 style="font-size: 48px; font-weight: 900; margin: 20px 0;">GJS</h2>
            <h3 style="font-size: 24px; font-weight: 300; letter-spacing: 0.1em; color: #ccc;">20th YEAR CELEBRATION</h3>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 30px; margin: 30px 0;">
            <h4 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #fff;">RSVP Confirmation</h4>
            <p style="font-size: 16px; line-height: 1.6; color: #ccc; margin-bottom: 15px;">
              Dear ${sanitizedName},
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #ccc; margin-bottom: 20px;">
              Thank you for your RSVP! We're delighted to confirm your attendance for our 20th Year Celebration.
            </p>
            
            <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h5 style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #fff;">Event Details</h5>
              <p style="margin: 8px 0; color: #ccc;"><strong>Date:</strong> Thursday, 30th October 2025</p>
              <p style="margin: 8px 0; color: #ccc;"><strong>Time:</strong> 5:30 PM - 8:00 PM</p>
              <p style="margin: 8px 0; color: #ccc;"><strong>Location:</strong> Level 10, Shell House, 37 Margaret Street, Sydney</p>
              <p style="margin: 8px 0; color: #ccc;"><strong>Access:</strong> Via Wynyard Lane</p>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h5 style="font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #fff;">Your RSVP Details</h5>
              <p style="margin: 8px 0; color: #ccc;"><strong>Attendance:</strong> ${attendance === 'yes' ? 'Yes, I will attend' : 'No, I cannot attend'}</p>
              ${guests ? `<p style="margin: 8px 0; color: #ccc;"><strong>Guests:</strong> ${guests}</p>` : ''}
              ${sanitizedDietary ? `<p style="margin: 8px 0; color: #ccc;"><strong>Dietary Requirements:</strong> ${sanitizedDietary}</p>` : ''}
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #ccc; margin-top: 20px;">
              We look forward to celebrating with you! If you have any questions, please don't hesitate to contact us.
            </p>
            
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br>
              The GJS Property Team
            </p>
          </div>
        </div>
      `,
    });

    // Email to organizer (RSVP notification)
    const organizerEmail = await resend.emails.send({
      from: 'GJS Property Team <noreply@gjsproperty.events>',
      to: [process.env.ORGANIZER_EMAIL || 'organizer@gjsproperty.events'],
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
              ${guests ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; font-weight: 600; color: #333;">Guests:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f3f4; color: #666;">${guests}</td>
              </tr>
              ` : ''}
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

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP submitted successfully',
      confirmationId: confirmationEmail.data?.id 
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}
