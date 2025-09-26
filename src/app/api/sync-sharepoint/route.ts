import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/database';
import { sharePointService } from '@/lib/sharepoint';

export async function POST(request: NextRequest) {
  try {
    // Check if SharePoint is configured
    if (!sharePointService.isConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'SharePoint is not configured. Please set the required environment variables.' 
        },
        { status: 400 }
      );
    }

    // Get all RSVPs from database
    const rsvps = dbOperations.getAllRSVPs();
    
    if (rsvps.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'No RSVPs found to sync.' 
        },
        { status: 404 }
      );
    }

    // Update Excel file on SharePoint
    const success = await sharePointService.updateExcelFile(rsvps);
    
    if (success) {
      const fileUrl = await sharePointService.getFileUrl();
      
      return NextResponse.json({
        success: true,
        message: `Successfully synced ${rsvps.length} RSVPs to SharePoint`,
        rsvpCount: rsvps.length,
        fileUrl: fileUrl
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to sync RSVPs to SharePoint' 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('SharePoint sync error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error during SharePoint sync' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if SharePoint is configured
    if (!sharePointService.isConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'SharePoint is not configured. Please set the required environment variables.',
          configured: false
        },
        { status: 400 }
      );
    }

    // Get file URL
    const fileUrl = await sharePointService.getFileUrl();
    
    return NextResponse.json({
      success: true,
      configured: true,
      fileUrl: fileUrl,
      message: 'SharePoint is configured and accessible'
    });

  } catch (error) {
    console.error('SharePoint status check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check SharePoint status',
        configured: false
      },
      { status: 500 }
    );
  }
}

