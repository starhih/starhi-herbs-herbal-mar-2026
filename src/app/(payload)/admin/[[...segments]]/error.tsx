'use client';

import React, { useEffect } from 'react';

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('==================================================');
    console.error('[PAYLOAD ADMIN ERROR CAUGHT BY ERROR BOUNDARY]');
    console.error('Error Message:', error?.message);
    console.error('Error Digest:', error?.digest);
    console.error('Error Stack:', error?.stack);
    console.error('==================================================');
  }, [error]);

  return (
    <div
      style={{
        padding: '32px',
        margin: '24px',
        backgroundColor: '#1f1315',
        border: '1px solid #ff4444',
        borderRadius: '8px',
        color: '#ffffff',
        fontFamily: 'monospace',
        maxWidth: '1200px',
      }}
    >
      <h2 style={{ color: '#ff6b6b', fontSize: '20px', marginTop: 0, marginBottom: '16px' }}>
        ⚠️ Admin View Render Error Detected
      </h2>
      <div style={{ marginBottom: '16px', padding: '12px', background: '#2d181b', borderRadius: '4px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#ffb3b3' }}>
          <strong>Error Message:</strong> {error?.message || 'Unknown error'}
        </p>
        {error?.digest && (
          <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>
            <strong>Digest:</strong> {error.digest}
          </p>
        )}
      </div>

      {error?.stack && (
        <details open style={{ marginTop: '16px' }}>
          <summary style={{ cursor: 'pointer', color: '#ff9999', marginBottom: '8px' }}>
            <strong>Component Stack Trace:</strong>
          </summary>
          <pre
            style={{
              background: '#0d0708',
              padding: '16px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: '12px',
              lineHeight: '1.5',
              color: '#f8d7da',
              whiteSpace: 'pre-wrap',
            }}
          >
            {error.stack}
          </pre>
        </details>
      )}

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#258F67',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
