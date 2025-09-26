import { NextResponse } from 'next/server'
import { sharePointService } from '@/lib/sharepoint'

export async function GET() {
  try {
    const isConfigured = sharePointService.isConfigured()
    
    return NextResponse.json({
      success: true,
      configured: isConfigured,
      fileUrl: isConfigured ? process.env.SHAREPOINT_FILE_URL : undefined
    })
  } catch (error) {
    console.error('Error checking SharePoint status:', error)
    return NextResponse.json({
      success: false,
      configured: false,
      error: 'Failed to check SharePoint status'
    }, { status: 500 })
  }
}

