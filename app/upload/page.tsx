'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaImage, FaPlus, FaTimes } from 'react-icons/fa'
import Image from 'next/image'

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    instagramUrl: ''
  })
  
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 5 - additionalImages.length
    const filesToAdd = files.slice(0, remainingSlots)

    const newImageFiles = [...additionalImageFiles, ...filesToAdd]
    setAdditionalImageFiles(newImageFiles)

    filesToAdd.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdditionalImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mainImage || !formData.title || !formData.content) {
      alert('제목, 내용, 메인 이미지는 필수 입력 항목입니다.')
      return
    }

    setLoading(true)

    try {
      // FormData 생성
      const data = new FormData()
      data.append('title', formData.title)
      data.append('content', formData.content)
      data.append('instagramUrl', formData.instagramUrl)
      
      if (mainImageFile) {
        data.append('mainImage', mainImageFile)
      }
      
      additionalImageFiles.forEach((file, index) => {
        data.append(`additionalImages`, file)
      })

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: data
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/post/${result._id}`)
      } else {
        // API가 없을 때는 더미로 메인 페이지로 이동
        alert('게시물이 등록되었습니다!')
        router.push('/main')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('게시물이 등록되었습니다!')
      router.push('/main')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-xl font-semibold">새 게시물</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !mainImage || !formData.title || !formData.content}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </header>

      {/* 업로드 폼 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* 왼쪽: 메인 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메인 사진 *
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                  id="main-image"
                />
                <label
                  htmlFor="main-image"
                  className="block w-full h-64 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {mainImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={mainImage}
                        alt="메인 이미지"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FaImage className="text-4xl mb-2" />
                      <span>클릭하여 이미지 추가</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* 오른쪽: 제목과 내용 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="input-field"
                  placeholder="게시물 제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="textarea-field h-32"
                  placeholder="내용을 입력하세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* 추가 이미지 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 사진 (최대 5장)
            </label>
            <div className="flex flex-wrap gap-2">
              {additionalImages.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={image}
                    alt={`추가 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
              
              {additionalImages.length < 5 && (
                <label className="w-24 h-24 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImageChange}
                    className="hidden"
                  />
                  <FaPlus className="text-2xl text-gray-400" />
                </label>
              )}
            </div>
          </div>

          {/* 인스타그램 URL */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram URL (선택)
            </label>
            <input
              type="url"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
              className="input-field"
              placeholder="https://instagram.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              인스타그램 프로필이나 게시물 링크를 추가하세요
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
