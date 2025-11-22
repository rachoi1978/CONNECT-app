'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  _id: string
  participants: {
    _id: string
    name: string
    image?: string
  }[]
  lastMessage: {
    text: string
    createdAt: string
  }
  unreadCount: number
}

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      // 더미 데이터 (실제로는 API 호출)
      const dummyMessages: Message[] = [
        {
          _id: 'msg1',
          participants: [
            {
              _id: 'user1',
              name: '김댄서',
              image: '/api/placeholder/40/40'
            }
          ],
          lastMessage: {
            text: '안녕하세요! 워크샵 관련해서 문의드립니다.',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          unreadCount: 2
        },
        {
          _id: 'msg2',
          participants: [
            {
              _id: 'user2',
              name: '이발레'
            }
          ],
          lastMessage: {
            text: '네, 확인했습니다!',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          unreadCount: 0
        }
      ]

      setMessages(dummyMessages)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
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
          <h1 className="text-xl font-semibold">메시지</h1>
        </div>
      </header>

      {/* 메시지 목록 */}
      <main className="max-w-4xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="spinner"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">아직 메시지가 없습니다</p>
            <Link href="/main" className="btn-primary">
              게시물 둘러보기
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {messages.map((message, index) => (
              <Link
                key={message._id}
                href={`/messages/${message._id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center p-4 border-b last:border-b-0">
                  {/* 프로필 이미지 */}
                  <div className="flex-shrink-0 mr-3">
                    {message.participants[0].image ? (
                      <Image
                        src={message.participants[0].image}
                        alt={message.participants[0].name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <FaUserCircle className="text-4xl text-gray-400" />
                    )}
                  </div>

                  {/* 메시지 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {message.participants[0].name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {message.lastMessage.text}
                    </p>
                  </div>

                  {/* 읽지 않은 메시지 카운트 */}
                  {message.unreadCount > 0 && (
                    <div className="ml-3 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {message.unreadCount}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
