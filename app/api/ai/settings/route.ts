import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    return NextResponse.json({
      success: true,
      message: 'AI settings updated (stub)'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    persona: 'BALANCED',
    interventionRate: 50,
    frustrationThreshold: 120,
    cooldown: 5
  })
}
