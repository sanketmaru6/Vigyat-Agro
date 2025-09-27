"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, User, Calendar, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"

type KrushiArticle = {
  id: string
  title: string
  titleHindi?: string
  content: string
  image?: string
  createdAt?: string
}

const featuredVideos = [
  {
    id: 1,
    title: "Modern Farming Techniques",
    duration: "15:30",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Modern+Farming",
  },
  {
    id: 2,
    title: "Organic Pest Control",
    duration: "12:45",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Pest+Control",
  },
]

export default function KrushiGyanPage() {
  const [articles, setArticles] = useState<KrushiArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const res = await fetch("/api/krushi")
        const data = await res.json()
        setArticles(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load articles:", error)
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-[#9fd93b] p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b4e8f] mb-2">Krushi Gyan</h1>
          <p className="text-[#0b4e8f] text-sm md:text-base">
            Expert agricultural knowledge, farming tips, and modern techniques to help you succeed in farming
          </p>
        </div>

        <div className="p-4 space-y-6">
          {/* Featured Videos */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Play className="h-5 w-5 text-[#0b4e8f]" />
              <h2 className="text-lg md:text-xl font-semibold text-[#0b4e8f]">Featured Videos</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {featuredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden rounded-xl">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-[#0b4e8f] line-clamp-2">{video.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Articles */}
          <section>
            <h2 className="text-lg md:text-xl font-semibold text-[#0b4e8f] mb-4">Latest Articles</h2>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading articles...</div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-[#0b4e8f] font-semibold mb-2">No articles available</h3>
                <p className="text-gray-500 text-sm">Please check back soon for farming knowledge and tips!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id} className="p-4 md:p-6 rounded-xl">
                    <div className="flex gap-3">
                      <img
                        src={article.image || "/placeholder.svg?height=80&width=120&query=farming article"}
                        alt={article.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <Badge className="bg-[#9fd93b] text-[#0b4e8f] text-xs mb-2">Farming Knowledge</Badge>

                        <h3 className="font-semibold text-[#0b4e8f] text-sm mb-2 line-clamp-2">{article.title}</h3>
                        {article.titleHindi && <p className="text-gray-600 text-xs mb-2">{article.titleHindi}</p>}

                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{article.content}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Vigyat Expert</span>
                          </div>
                          {article.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
