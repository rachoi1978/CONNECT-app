'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FaArrowLeft, FaHeart, FaRegHeart, FaInstagram, FaPaperPlane } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  content: string
  mainImage: string
  additionalImages?: string[]
  instagramUrl?: string
  author: {
    _id: string
    name: string
    email: string
    image?: string
  }
  likes: string[]
  createdAt: string
}

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (postId) {
      fetchPost()
      checkIfLiked()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        // 더미 데이터
        setPost({
          _id: postId,
          title: '힙합 댄스 워크샵 참가자 모집',
          content: `안녕하세요! 서울에서 진행되는 힙합 댄스 워크샵에 참가하실 분들을 모집합니다.
          
          📅 일시: 2024년 1월 20일 (토) 오후 2시-5시
          📍 장소: 강남구 댄스 스튜디오
          💰 참가비: 50,000원
          👥 모집인원: 20명
          
          초보자부터 중급자까지 모두 환영합니다!
          편한 복장과 실내운동화를 준비해주세요.
          
          신청은 아래 인스타그램 DM으로 부탁드립니다.`,
          mainImage: '/api/placeholder/800/600',
          additionalImages: [
            '/api/placeholder/600/400',
            '/api/placeholder/600/400',
            '/api/placeholder/600/400'
          ],
          instagramUrl: 'https://instagram.com/dance_workshop',
          author: {
            _id: 'user1',
            name: '김댄서',
            email: 'dancer@example.com'
          },
          likes: ['user2', 'user3'],
          createdAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfLiked = () => {
    const savedLikes = localStorage.getItem('likedPosts')
    if (savedLikes) {
      const likedPosts = new Set(JSON.parse(savedLikes))
      setLiked(likedPosts.has(postId))
    }
  }

  const handleLike = async () => {
    setLiked(!liked)
    
    const savedLikes = localStorage.getItem('likedPosts')
    const likedPosts = savedLikes ? new Set(JSON.parse(savedLikes)) : new Set()
    
    if (liked) {
      likedPosts.delete(postId)
    } else {
      likedPosts.add(postId)
    }
    
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(likedPosts)))

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to update like:', error)
    }
  }

  const handleContact = () => {
    if (post) {
      router.push(`/messages/new?userId=${post.author._id}&userName=${post.author.name}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">게시물을 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push('/main')}
            className="btn-primary"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const allImages = [post.mainImage, ...(post.additionalImages || [])]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-xl font-semibold">게시물</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* 이미지 갤러리 */}
          <div className="relative">
            <div className="relative h-96 md:h-[500px] bg-gray-200">
              <Image
                src={allImages[currentImageIndex]}
                alt={post.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/800/600'
                }}
              />
            </div>
            
            {/* 이미지 인디케이터 */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-8' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 썸네일 이미지들 */}
          {allImages.length > 1 && (
            <div className="flex space-x-2 p-4 overflow-x-auto">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`이미지 ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/80/80'
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* 게시물 내용 */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{post.author.name}</span>
                  <span className="mx-2">·</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={handleLike}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                {liked ? (
                  <FaHeart className="text-2xl text-red-500" />
                ) : (
                  <FaRegHeart className="text-2xl text-gray-500" />
                )}
              </button>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap text-gray-700">{post.content}</p>
            </div>

            {/* 인스타그램 링크 */}
            {post.instagramUrl && (
              <div className="mb-6">
                <a
                  href={post.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-primary hover:underline"
                >
                  <FaInstagram className="text-xl" />
                  <span>Instagram에서 더 보기</span>
                </a>
              </div>
            )}

            {/* 연락하기 버튼 */}
            <button
              onClick={handleContact}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <FaPaperPlane />
              <span>연락하기</span>
            </button>
          </div>
        </article>
      </main>
    </div>
  )
}
