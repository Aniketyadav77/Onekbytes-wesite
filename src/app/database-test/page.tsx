'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface TableStatus {
  name: string
  exists: boolean
  error?: string
  count?: number
}

export default function DatabaseTest() {
  const [tables, setTables] = useState<TableStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkTables = async () => {
      const tablesToCheck = ['jobs', 'job_applications', 'general_applications', 'profiles']
      const results: TableStatus[] = []

      for (const tableName of tablesToCheck) {
        try {
          console.log(`Checking table: ${tableName}`)
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })

          if (error) {
            console.error(`Error checking ${tableName}:`, error)
            results.push({
              name: tableName,
              exists: false,
              error: error.message
            })
          } else {
            console.log(`✅ ${tableName} table exists with ${count} rows`)
            results.push({
              name: tableName,
              exists: true,
              count: count || 0
            })
          }
        } catch (err) {
          console.error(`Exception checking ${tableName}:`, err)
          results.push({
            name: tableName,
            exists: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          })
        }
      }

      setTables(results)
      setLoading(false)
    }

    checkTables()
  }, [])

  const createMissingTables = async () => {
    alert('Please run the complete-database-setup.sql script in your Supabase SQL editor to create the missing tables.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Checking database tables...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Status</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Table Status</h2>
          
          <div className="space-y-4">
            {tables.map((table) => (
              <div
                key={table.name}
                className={`p-4 rounded-lg border ${
                  table.exists 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{table.name}</h3>
                    {table.exists ? (
                      <p className="text-green-600">
                        ✅ Exists ({table.count} rows)
                      </p>
                    ) : (
                      <div>
                        <p className="text-red-600">❌ Does not exist</p>
                        {table.error && (
                          <p className="text-sm text-red-500 mt-1">{table.error}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tables.some(t => !t.exists) && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Missing Tables Detected</h3>
              <p className="text-yellow-700 mb-4">
                Some required database tables are missing. This is causing the application errors.
              </p>
              <button
                onClick={createMissingTables}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Show Setup Instructions
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Setup Instructions</h3>
            <ol className="text-blue-700 space-y-1 text-sm">
              <li>1. Go to your Supabase dashboard</li>
              <li>2. Navigate to the SQL Editor</li>
              <li>3. Run the complete-database-setup.sql script</li>
              <li>4. Refresh this page to verify tables are created</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
