'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SplashPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogoClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/main')
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div 
        className="cursor-pointer transform transition-all duration-300 hover:scale-105"
        onClick={handleLogoClick}
      >
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4 animate-fade-in">
            CONNECT
          </h1>
          <p className="text-gray-500 text-lg animate-slide-up">
            댄스로 연결되는 우리
          </p>
          {isLoading && (
            <div className="mt-8 flex justify-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
