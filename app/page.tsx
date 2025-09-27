"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import { Camera, MessageCircle, Target, Sprout, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import type { Slider } from "@/lib/types"

export default function HomePage() {
  const [bestSellerIndex, setBestSellerIndex] = useState(0)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [sliders, setSliders] = useState<Slider[]>([])

  const bestSellerSlides = sliders.filter((s) => s.group === "bestSeller")
  const featuredSlides = sliders.filter((s) => s.group === "featured")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/sliders", { cache: "no-store" })
        const data = await res.json()
        setSliders(Array.isArray(data) ? data : [])
      } catch {
        setSliders([])
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (bestSellerSlides.length === 0) return
    const timer = setInterval(() => {
      setBestSellerIndex((prev) => (prev + 1) % bestSellerSlides.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [bestSellerSlides.length])

  useEffect(() => {
    if (featuredSlides.length === 0) return
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredSlides.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [featuredSlides.length])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Best Seller Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4" style={{ color: "#0b4e8f" }}>
            Best Seller
          </h2>

          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={(bestSellerSlides[bestSellerIndex]?.image) || "/placeholder.svg"}
                alt="Best Seller Banner"
                className="w-full h-48 md:h-56 lg:h-64 object-cover"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-[#0b4e8f] rounded-full shadow-md backdrop-blur-sm"
              onClick={() =>
                setBestSellerIndex((prev) => (prev - 1 + bestSellerSlides.length) % bestSellerSlides.length)
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-[#0b4e8f] rounded-full shadow-md backdrop-blur-sm"
              onClick={() => setBestSellerIndex((prev) => (prev + 1) % bestSellerSlides.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {bestSellerSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === bestSellerIndex ? "bg-white scale-110 shadow-md" : "bg-white/60 hover:bg-white/80"
                  }`}
                  onClick={() => setBestSellerIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Shop By Category */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4" style={{ color: "#0b4e8f" }}>
            Shop By Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Seeds", icon: Sprout },
              { name: "Insecticides", icon: Sprout },
              { name: "Herbicides", icon: Sprout },
              { name: "Fungicides", icon: Sprout },
            ].map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant="outline"
                className="flex flex-col items-center gap-3 p-6 h-auto border-2 border-[#0b4e8f]/20 hover:border-[#0b4e8f] hover:bg-[#0b4e8f]/5 bg-white rounded-3xl shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105"
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: "#0b4e8f" }}
                >
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "#0b4e8f" }}>
                  {name}
                </span>
              </Button>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4" style={{ color: "#0b4e8f" }}>
            Featured Products
          </h2>

          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src={(featuredSlides[featuredIndex]?.image) || "/placeholder.svg"}
                alt="Featured Product Banner"
                className="w-full h-48 md:h-56 lg:h-64 object-cover"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-[#0b4e8f] rounded-full shadow-md backdrop-blur-sm"
              onClick={() => setFeaturedIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 text-[#0b4e8f] rounded-full shadow-md backdrop-blur-sm"
              onClick={() => setFeaturedIndex((prev) => (prev + 1) % featuredSlides.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === featuredIndex ? "bg-white scale-110 shadow-md" : "bg-white/60 hover:bg-white/80"
                  }`}
                  onClick={() => setFeaturedIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Get Instant Pesticide Advice */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6" style={{ color: "#0b4e8f" }}>
            Get Instant Pesticide Advice
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center bg-white p-6 rounded-3xl shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#0b4e8f] to-[#0b4e8f]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Camera className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#0b4e8f" }}>
                1. Click Photo
              </h3>
              <p className="text-xs md:text-sm text-gray-600">Take A Clear Photo Of Your Crop Issue</p>
            </div>

            <div className="text-center bg-white p-6 rounded-3xl shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#9fd93b] to-[#8bc832] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="h-8 w-8 md:h-10 md:w-10 text-[#0b4e8f]" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#0b4e8f" }}>
                2. Send to WhatsApp
              </h3>
              <p className="text-xs md:text-sm text-gray-600">Share With Our Agricultural Experts</p>
            </div>

            <div className="text-center bg-white p-6 rounded-3xl shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#0b4e8f] to-[#0b4e8f]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: "#0b4e8f" }}>
                3. Get Results
              </h3>
              <p className="text-xs md:text-sm text-gray-600">Receive Personalized Recommendations</p>
            </div>
          </div>

          <Button
            className="w-full font-bold rounded-3xl py-4 text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: "#9fd93b", color: "#0b4e8f" }}
            onClick={() => window.open("https://wa.me/919898543628", "_blank")}
          >
            Click Start WhatsApp Chat
          </Button>
        </section>

        {/* All Products */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4" style={{ color: "#0b4e8f" }}>
            All Products
          </h2>

          <Button
            variant="outline"
            className="w-full font-bold rounded-3xl py-4 text-base bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: "#9fd93b", color: "#0b4e8f", borderColor: "#9fd93b" }}
          >
            View All Products →
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  )
}
