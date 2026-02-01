import { NextResponse } from 'next/server'
import { getRealtimeMetrics } from '@/lib/utils/metrics'

export async function GET() {
  try {
    const metrics = await getRealtimeMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
