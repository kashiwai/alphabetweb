import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    env: {
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? 'SET' : 'NOT SET',
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? 'SET' : 'NOT SET',
      ADMIN_API_KEY: process.env.ADMIN_API_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_ADMIN_API_KEY: process.env.NEXT_PUBLIC_ADMIN_API_KEY ? 'SET' : 'NOT SET',
    },
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL || 'false'
  })
}