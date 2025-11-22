import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'

// POST: 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const post = await Post.findById(params.id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // 임시 사용자 ID (실제로는 세션에서 가져옴)
    const tempUserId = '65a1234567890abcdef12345'
    
    const likeIndex = post.likes.indexOf(tempUserId as any)
    
    if (likeIndex > -1) {
      // 이미 좋아요한 경우 - 좋아요 취소
      post.likes.splice(likeIndex, 1)
    } else {
      // 좋아요 추가
      post.likes.push(tempUserId as any)
    }
    
    await post.save()
    
    return NextResponse.json({
      liked: likeIndex === -1,
      likesCount: post.likes.length
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}
