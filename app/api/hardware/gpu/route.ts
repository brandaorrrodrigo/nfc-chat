import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface GPUInfo {
  id: number
  name: string
  utilization: number
  temperature: number
  memoryUsed: number
  memoryTotal: number
  memoryUtilization: number
}

export async function GET() {
  try {
    // Executar nvidia-smi
    const { stdout } = await execAsync(
      'nvidia-smi --query-gpu=index,name,utilization.gpu,temperature.gpu,memory.used,memory.total --format=csv,noheader,nounits',
      { timeout: 5000 }
    )

    // Parse do output CSV
    const lines = stdout.trim().split('\n')
    const gpus: GPUInfo[] = []

    for (const line of lines) {
      const [id, name, util, temp, memUsed, memTotal] = line.split(', ').map(s => s.trim())

      gpus.push({
        id: parseInt(id),
        name,
        utilization: parseInt(util),
        temperature: parseInt(temp),
        memoryUsed: parseInt(memUsed),
        memoryTotal: parseInt(memTotal),
        memoryUtilization: Math.round((parseInt(memUsed) / parseInt(memTotal)) * 100)
      })
    }

    return NextResponse.json({
      success: true,
      gpus,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Error fetching GPU info:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      gpus: []
    }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
