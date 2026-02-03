import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { itemId, action } = await req.json()

    const item = await prisma.moderationQueue.update({
      where: { id: itemId },
      data: {
        status: action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'EDITED',
        decision: action,
        reviewedAt: new Date(),
        reviewedBy: 'admin' // TODO: Pegar do session
      }
    })

    // Se aprovado, atualizar o post/comment
    if (action === 'APPROVE' && item.postId) {
      await prisma.post.update({
        where: { id: item.postId },
        data: {
          isApproved: true,
          isUnderReview: false
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling moderation action:', error)
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
