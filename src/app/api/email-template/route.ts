import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const templatePath = join(process.cwd(), 'email-templates', 'announcement-email.html');
    const htmlContent = readFileSync(templatePath, 'utf8');
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error reading email template:', error);
    return new NextResponse('Template not found', { status: 404 });
  }
}

