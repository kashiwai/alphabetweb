import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // データベース接続テスト
    const result = await db.execute('SELECT COUNT(*) as count FROM estimates')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      estimateCount: result.rows[0].count,
      env: {
        hasUrl: !!process.env.TURSO_DATABASE_URL,
        hasToken: !!process.env.TURSO_AUTH_TOKEN
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      env: {
        hasUrl: !!process.env.TURSO_DATABASE_URL,
        hasToken: !!process.env.TURSO_AUTH_TOKEN
      }
    }, { status: 500 })
  }
}