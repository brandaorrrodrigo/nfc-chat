import { NextResponse } from 'next/server'

export async function GET() {
  // Mock data - implementar lógica real depois
  const data = {
    dau: 1234,
    posts7d: 5678,
    engagement: 87,
    fpCirculating: 45600
  }

  return NextResponse.json(data)
}

export const dynamic = 'force-dynamic'
