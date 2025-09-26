import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbOperations } from '@/lib/database';

const inviteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email address').max(255, 'Email too long').toLowerCase().trim(),
});

const bulkInviteSchema = z.object({
  invites: z.array(inviteSchema).min(1, 'At least one invite is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a bulk invite or single invite
    if (body.invites && Array.isArray(body.invites)) {
      // Bulk invite
      const validationResult = bulkInviteSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { success: false, message: 'Invalid input data', errors: validationResult.error.issues },
          { status: 400 }
        );
      }

      const { invites } = validationResult.data;
      const results = [];

      for (const invite of invites) {
        try {
          // Check if invite already exists
          const existingInvites = dbOperations.getAllInvites();
          const existing = existingInvites.find(i => i.email === invite.email);
          
          if (existing) {
            results.push({
              email: invite.email,
              success: false,
              message: 'Invite already exists for this email'
            });
            continue;
          }

          // Generate invite URL
          const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gjsproperty.events'}/20-years?name=${encodeURIComponent(invite.name)}&email=${encodeURIComponent(invite.email)}`;
          
          // Create invite record
          const result = dbOperations.insertInvite({
            name: invite.name,
            email: invite.email,
            invite_url: inviteUrl
          });

          results.push({
            email: invite.email,
            success: true,
            message: 'Invite created successfully',
            inviteId: result.lastInsertRowid,
            inviteUrl: inviteUrl
          });
        } catch (error) {
          results.push({
            email: invite.email,
            success: false,
            message: 'Failed to create invite'
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Processed ${invites.length} invites`,
        results: results
      });

    } else {
      // Single invite
      const validationResult = inviteSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { success: false, message: 'Invalid input data', errors: validationResult.error.issues },
          { status: 400 }
        );
      }

      const { name, email } = validationResult.data;

      // Check if invite already exists
      const existingInvites = dbOperations.getAllInvites();
      const existing = existingInvites.find(i => i.email === email);
      
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Invite already exists for this email' },
          { status: 400 }
        );
      }

      // Generate invite URL
      const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://gjsproperty.events'}/20-years?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
      
      // Create invite record
      const result = dbOperations.insertInvite({
        name,
        email,
        invite_url: inviteUrl
      });

      return NextResponse.json({
        success: true,
        message: 'Invite created successfully',
        inviteId: result.lastInsertRowid,
        inviteUrl: inviteUrl
      });
    }

  } catch (error) {
    console.error('Invite creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create invite' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const invites = dbOperations.getAllInvites();
    
    return NextResponse.json({
      success: true,
      data: invites,
      count: invites.length
    });
  } catch (error) {
    console.error('Error fetching invites:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch invites' },
      { status: 500 }
    );
  }
}

