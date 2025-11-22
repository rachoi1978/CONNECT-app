'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FaGoogle, FaComment, FaArrowLeft } from 'react-icons/fa'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session) {
      router.push('/main')
    }
  }, [session, router])

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/main' })
  }

  const handleKakaoLogin = () => {
    signIn('kakao', { callbackUrl: '/main' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          {/* 로고 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">CONNECT</h1>
            <p className="text-gray-600">댄스로 연결되는 우리들의 공간</p>
          </div>

          {/* 로그인 버튼들 */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-all"
            >
              <FaGoogle className="text-xl text-red-500" />
              <span className="font-medium">Google로 계속하기</span>
            </button>

            <button
              onClick={handleKakaoLogin}
              className="w-full flex items-center justify-center space-x-3 bg-yellow-400 rounded-lg px-4 py-3 hover:bg-yellow-500 transition-all"
            >
              <FaComment className="text-xl" />
              <span className="font-medium">카카오로 계속하기</span>
            </button>
          </div>

          {/* 구분선 */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 게스트로 둘러보기 */}
          <button
            onClick={() => router.push('/main')}
            className="w-full text-center text-gray-600 hover:text-primary transition-colors"
          >
            로그인 없이 둘러보기
          </button>

          {/* 안내 문구 */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>계속 진행하면 CONNECT의</p>
            <p>
              <a href="#" className="underline hover:text-primary">이용약관</a> 및{' '}
              <a href="#" className="underline hover:text-primary">개인정보 처리방침</a>에
            </p>
            <p>동의하는 것으로 간주됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
