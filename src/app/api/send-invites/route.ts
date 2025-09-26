import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { dbOperations } from '@/lib/database';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
      return NextResponse.json(
        { success: false, message: 'Email service not configured. Please set RESEND_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { inviteIds, sendToAll = false } = body;

    let invitesToSend = [];

    if (sendToAll) {
      // Get all pending invites
      const allInvites = await dbOperations.getAllInvites();
      invitesToSend = allInvites.filter(invite => invite.status === 'pending');
    } else if (inviteIds && Array.isArray(inviteIds)) {
      // Get specific invites
      const allInvites = await dbOperations.getAllInvites();
      invitesToSend = allInvites.filter(invite => inviteIds.includes(invite.id));
    } else {
      return NextResponse.json(
        { success: false, message: 'Please specify inviteIds or set sendToAll to true' },
        { status: 400 }
      );
    }

    if (invitesToSend.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No invites found to send' },
        { status: 404 }
      );
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const invite of invitesToSend) {
      try {
        // Send invite email
        const emailResult = await resend.emails.send({
          from: 'GJS Property Team <noreply@gjsproperty.events>',
          to: [invite.email],
          subject: 'You\'re Invited! GJS 20th Year Celebration',
          html: generateInviteEmailHTML(invite.name, invite.invite_url || ''),
        });

        if (emailResult.data?.id) {
          // Update invite status
          await dbOperations.updateInviteStatus(invite.email, 'sent');
          
          results.push({
            email: invite.email,
            success: true,
            messageId: emailResult.data.id
          });
          successCount++;
        } else {
          throw new Error('Email sending failed');
        }
      } catch (error) {
        console.error(`Failed to send invite to ${invite.email}:`, error);
        results.push({
          email: invite.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        failCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} invites successfully, ${failCount} failed`,
      results: results,
      successCount,
      failCount
    });

  } catch (error) {
    console.error('Send invites error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send invites' },
      { status: 500 }
    );
  }
}

function generateInviteEmailHTML(name: string, inviteUrl: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333333; padding: 0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center;">
        <div style="margin-bottom: 20px;">
          <img src="https://gjsproperty.events/Primary_Dark-GJS@150pp.png" alt="GJS Property" style="height: 60px; width: auto; margin: 0 auto; display: block;">
        </div>
        <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.2em; color: #ffffff; margin: 0 0 10px 0;">YOU'RE INVITED</h1>
        <h2 style="font-size: 32px; font-weight: 700; margin: 0 0 10px 0; color: #ffffff;">GJS</h2>
        <h3 style="font-size: 18px; font-weight: 300; letter-spacing: 0.1em; color: #cccccc; margin: 0;">20th YEAR CELEBRATION</h3>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 40px 30px; background: #ffffff;">
        <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 30px; border-left: 4px solid #007bff;">
          <h4 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0; color: #333333;">Join Us for a Special Celebration! 🎉</h4>
          <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 15px 0;">
            Dear ${name},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">
            We're thrilled to invite you to celebrate a remarkable milestone - GJS Property's 20th anniversary! Join us for an evening of celebration, connection, and cheers to two decades of excellence.
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
        
        <!-- RSVP Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);">
            RSVP Now
          </a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px 0; text-align: center;">
          We look forward to celebrating this special milestone with you! If you have any questions, please don't hesitate to contact us.
        </p>
        
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="font-size: 14px; color: #999999; margin: 0;">
            Best regards,<br>
            <strong>The GJS Property Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}

