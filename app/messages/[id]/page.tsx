'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FaArrowLeft, FaPaperPlane, FaUserCircle } from 'react-icons/fa'
import Image from 'next/image'

interface ChatMessage {
  _id: string
  text: string
  sender: {
    _id: string
    name: string
  }
  createdAt: string
  isMe: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params.id as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [otherUser, setOtherUser] = useState({
    name: '김댄서',
    image: '/api/placeholder/40/40'
  })

  useEffect(() => {
    loadMessages()
    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      // 더미 데이터
      const dummyMessages: ChatMessage[] = [
        {
          _id: '1',
          text: '안녕하세요! 워크샵 관련해서 문의드립니다.',
          sender: {
            _id: 'other',
            name: '김댄서'
          },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          isMe: false
        },
        {
          _id: '2',
          text: '네, 안녕하세요! 무엇을 도와드릴까요?',
          sender: {
            _id: 'me',
            name: '나'
          },
          createdAt: new Date(Date.now() - 7000000).toISOString(),
          isMe: true
        },
        {
          _id: '3',
          text: '참가 인원이 몇 명 정도인가요?',
          sender: {
            _id: 'other',
            name: '김댄서'
          },
          createdAt: new Date(Date.now() - 6800000).toISOString(),
          isMe: false
        },
        {
          _id: '4',
          text: '최대 20명까지 가능합니다!',
          sender: {
            _id: 'me',
            name: '나'
          },
          createdAt: new Date(Date.now() - 6600000).toISOString(),
          isMe: true
        }
      ]

      setMessages(dummyMessages)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    const tempMessage: ChatMessage = {
      _id: Date.now().toString(),
      text: newMessage,
      sender: {
        _id: 'me',
        name: '나'
      },
      createdAt: new Date().toISOString(),
      isMe: true
    }

    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')

    // API 호출 (실제 구현 시)
    try {
      // await sendMessageAPI(chatId, newMessage)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <div className="flex items-center">
            {otherUser.image ? (
              <Image
                src={otherUser.image}
                alt={otherUser.name}
                width={36}
                height={36}
                className="rounded-full mr-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            ) : (
              <FaUserCircle className="text-3xl text-gray-400 mr-3" />
            )}
            <h1 className="text-lg font-semibold">{otherUser.name}</h1>
          </div>
        </div>
      </header>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  new Date(messages[index - 1].createdAt).toDateString() !== 
                  new Date(message.createdAt).toDateString()

                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-3 py-1">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${message.isMe ? 'order-2' : ''}`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.isMe 
                              ? 'bg-primary text-white' 
                              : 'bg-white shadow-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.text}
                          </p>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${
                          message.isMe ? 'text-right' : 'text-left'
                        }`}>
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* 메시지 입력 영역 */}
      <div className="bg-white border-t flex-shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-primary text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
