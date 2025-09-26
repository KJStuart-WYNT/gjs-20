'use client';

import { useState, useEffect } from 'react';

export default function EmailTemplatePage() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Read the HTML template file on the client side
    fetch('/api/email-template')
      .then(res => res.text())
      .then(content => setHtmlContent(content))
      .catch(err => console.error('Error loading template:', err));
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlContent);
    alert('HTML code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            GJS 20th Anniversary Email Template
          </h1>
          <p className="text-gray-600 mb-4">
            This is the HTML email template for your anniversary announcement. 
            You can copy the HTML code below to use with your email service provider.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">Preview:</h2>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                srcDoc={htmlContent}
                className="w-full h-96 border-0"
                title="Email Template Preview"
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">HTML Code:</h2>
            <textarea
              value={htmlContent}
              readOnly
              className="w-full h-64 p-3 text-sm font-mono bg-white border rounded-lg resize-none"
            />
            <button
              onClick={copyToClipboard}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy HTML Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
