"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Card } from "@/components/ui/card"
import { Sprout } from "lucide-react"
import { useEffect, useState } from "react"

type Crop = {
  id: string
  title: string
  titleHindi?: string
  image?: string
  description?: string
}

export default function AllCropsPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const res = await fetch("/api/crops")
        const data = await res.json()
        setCrops(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load crops:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCrops()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b4e8f] mb-2">Premium Seeds Collection</h1>
          <p className="text-gray-600 text-sm md:text-base">
            High-quality seeds from trusted varieties for successful farming and gardening. All seeds are tested for
            purity and germination rates.
          </p>
        </div>

        {/* All Crops Section */}
        <Card className="p-4 md:p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-[#0b4e8f]">All Crops</h2>
            <span className="text-sm text-gray-500">{crops.length} varieties available</span>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading crops...</div>
          ) : crops.length === 0 ? (
            <div className="text-center py-8">
              <Sprout className="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-[#0b4e8f] font-semibold mb-2">No crops available</h3>
              <p className="text-gray-500 text-sm">Please check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <Card key={crop.id} className="p-3 hover:shadow-lg transition-shadow">
                  <img
                    src={crop.image || "/placeholder.svg?height=160&width=240&query=crop seed"}
                    alt={crop.title}
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="font-semibold text-[#0b4e8f] mt-2">{crop.title}</div>
                  {crop.titleHindi && <div className="text-sm text-gray-600">{crop.titleHindi}</div>}
                  {crop.description && <p className="text-sm text-gray-500 mt-1">{crop.description}</p>}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  )
}
