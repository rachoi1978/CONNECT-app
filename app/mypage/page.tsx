'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaHeart, FaEye, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  content: string
  mainImage: string
  author: {
    name: string
  }
  createdAt: string
}

export default function MyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'liked' | 'viewed'>('liked')
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [viewedPosts, setViewedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      // 로컬 스토리지에서 좋아요한 게시물 ID 가져오기
      const savedLikes = localStorage.getItem('likedPosts')
      const likedIds = savedLikes ? JSON.parse(savedLikes) : []
      
      // 로컬 스토리지에서 본 게시물 ID 가져오기
      const savedViews = localStorage.getItem('viewedPosts')
      const viewedIds = savedViews ? JSON.parse(savedViews) : []

      // 더미 데이터 (실제로는 API 호출)
      const dummyLikedPosts: Post[] = [
        {
          _id: '1',
          title: '힙합 댄스 워크샵',
          content: '서울에서 진행되는 워크샵',
          mainImage: '/api/placeholder/300/200',
          author: { name: '김댄서' },
          createdAt: new Date().toISOString()
        }
      ]

      const dummyViewedPosts: Post[] = [
        {
          _id: '2',
          title: '발레 기초 클래스',
          content: '초보자 환영',
          mainImage: '/api/placeholder/300/200',
          author: { name: '이발레' },
          createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          title: '재즈댄스 공연',
          content: '공연 정보',
          mainImage: '/api/placeholder/300/200',
          author: { name: '박재즈' },
          createdAt: new Date().toISOString()
        }
      ]

      setLikedPosts(dummyLikedPosts)
      setViewedPosts(dummyViewedPosts)
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (session) {
      await signOut({ callbackUrl: '/main' })
    } else {
      router.push('/main')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-xl font-semibold">마이페이지</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span className="text-sm">{session ? '로그아웃' : '나가기'}</span>
          </button>
        </div>
      </header>

      {/* 프로필 섹션 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="프로필"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <FaUser className="text-3xl text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {session?.user?.name || '게스트'}
              </h2>
              <p className="text-gray-500">
                {session?.user?.email || '로그인이 필요합니다'}
              </p>
              {!session && (
                <Link
                  href="/auth/login"
                  className="inline-block mt-2 text-sm text-primary hover:underline"
                >
                  로그인하기
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b mt-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'liked'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <FaHeart className="inline mr-2" />
              좋아요한 게시물
            </button>
            <button
              onClick={() => setActiveTab('viewed')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'viewed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <FaEye className="inline mr-2" />
              본 게시물
            </button>
          </div>
        </div>
      </div>

      {/* 게시물 목록 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeTab === 'liked' ? likedPosts : viewedPosts).map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                className="card hover:shadow-lg transition-all"
              >
                <div className="flex">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={post.mainImage}
                      alt={post.title}
                      fill
                      className="object-cover rounded-l-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/128/128'
                      }}
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="text-xs text-gray-400">
                      {post.author.name} · {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {(activeTab === 'liked' ? likedPosts : viewedPosts).length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                {activeTab === 'liked' 
                  ? '좋아요한 게시물이 없습니다' 
                  : '본 게시물이 없습니다'}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
