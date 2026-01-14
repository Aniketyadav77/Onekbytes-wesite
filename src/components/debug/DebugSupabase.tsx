'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Debug component to test direct Supabase access
export default function DebugSupabase() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testQuery = async () => {
      try {
        console.log('Testing direct Supabase query...');
        setLoading(true);
        setError(null);

        // Test basic connection
        const { data, error: queryError } = await supabase
          .from('jobs')
          .select('id, job_title, status')
          .limit(5);

        if (queryError) {
          console.error('Supabase query error:', queryError);
          setError(`Query Error: ${queryError.message}`);
        } else {
          console.log('Supabase query success:', data);
          setResult(data);
        }
      } catch (err) {
        console.error('Connection error:', err);
        setError(`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    testQuery();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>Supabase Debug Test</h3>
      {loading && <p>Testing connection...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {result && Array.isArray(result) ? (
        <div>
          <p style={{ color: 'green' }}>Success! Found {result.length} jobs</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}
