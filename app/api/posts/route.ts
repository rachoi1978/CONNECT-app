import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Post from '@/models/Post'
import User from '@/models/User'

// GET: 게시물 목록 조회
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const posts = await Post.find()
      .populate('author', 'name email image')
      .sort({ createdAt: -1 })
      .limit(20)
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST: 새 게시물 생성
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const instagramUrl = formData.get('instagramUrl') as string
    
    // 이미지 업로드 처리 (실제로는 Cloudinary 등 사용)
    // 여기서는 더미 URL 사용
    const mainImage = '/api/placeholder/800/600'
    const additionalImages: string[] = []
    
    // 임시 사용자 (실제로는 세션에서 가져옴)
    const tempUserId = '65a1234567890abcdef12345'
    
    const post = await Post.create({
      title,
      content,
      mainImage,
      additionalImages,
      instagramUrl,
      author: tempUserId,
    })
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email image')
    
    return NextResponse.json(populatedPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
