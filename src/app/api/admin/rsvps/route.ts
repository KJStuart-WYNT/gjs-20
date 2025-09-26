import { NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';

export async function GET() {
  try {
    const rsvps = await dbOperations.getAllRSVPs();
    
    return NextResponse.json({
      success: true,
      data: rsvps,
      count: rsvps.length
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

