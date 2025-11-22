'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaHeart, FaRegHeart, FaPlus, FaBars } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  _id: string
  title: string
  content: string
  mainImage: string
  additionalImages?: string[]
  instagramUrl?: string
  author: {
    name: string
    email: string
    image?: string
  }
  likes: string[]
  createdAt: string
}

export default function MainPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchPosts()
    // 로컬 스토리지에서 좋아요한 게시물 불러오기
    const savedLikes = localStorage.getItem('likedPosts')
    if (savedLikes) {
      setLikedPosts(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const newLikedPosts = new Set(likedPosts)
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    
    setLikedPosts(newLikedPosts)
    localStorage.setItem('likedPosts', JSON.stringify(Array.from(newLikedPosts)))

    // API 호출로 서버에 좋아요 상태 업데이트
    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Failed to update like:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR')
  }

  // 더미 데이터 (API가 준비되지 않았을 때)
  const dummyPosts: Post[] = [
    {
      _id: '1',
      title: '힙합 댄스 워크샵 참가자 모집',
      content: '서울에서 진행되는 힙합 댄스 워크샵에 참가하실 분들을 모집합니다.',
      mainImage: '/api/placeholder/400/300',
      author: {
        name: '김댄서',
        email: 'dancer@example.com'
      },
      likes: ['user1', 'user2'],
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: '발레 기초 클래스 오픈',
      content: '초보자를 위한 발레 기초 클래스를 새롭게 오픈했습니다.',
      mainImage: '/api/placeholder/400/300',
      author: {
        name: '이발레',
        email: 'ballet@example.com'
      },
      likes: ['user3'],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]

  const displayPosts = posts.length > 0 ? posts : dummyPosts

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/main" className="text-2xl font-bold text-primary">
            CONNECT
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaBars className="text-xl text-gray-700" />
          </button>
        </div>

        {/* 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="absolute right-4 top-16 bg-white rounded-lg shadow-lg py-2 min-w-[160px] z-50">
            <Link
              href="/auth/login"
              className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              로그인
            </Link>
            <Link
              href="/mypage"
              className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              마이페이지
            </Link>
            <Link
              href="/messages"
              className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              메시지
            </Link>
          </div>
        )}
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <article
                key={post._id}
                className="card cursor-pointer transform transition-all duration-200 hover:-translate-y-1"
                onClick={() => router.push(`/post/${post._id}`)}
              >
                <div className="relative h-48 bg-gray-200">
                  {post.mainImage && (
                    <Image
                      src={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/400/300'
                      }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {post.author.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        · {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleLike(post._id, e)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {likedPosts.has(post._id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 플로팅 업로드 버튼 */}
      <Link
        href="/upload"
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 z-40"
      >
        <FaPlus className="text-xl" />
      </Link>
    </div>
  )
}
