import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const invites = await dbOperations.getAllInvites();
    
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

