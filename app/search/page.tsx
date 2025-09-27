import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-4xl mx-auto p-4">
        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 text-center mb-4">Search Everything</h1>

          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search products, articles, videos, stores..."
              className="pl-10 pr-20 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-lime-400 hover:bg-lime-500 text-blue-700 px-4 py-1 h-8 rounded-lg">
              Search
            </Button>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Find products, farming tips, videos, and store locations all in one place
          </p>
        </div>

        {/* Popular Searches */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Popular Searches</h2>

          <div className="space-y-3">
            {[
              "Cotton Seeds",
              "Pesticides for Wheat",
              "Organic Fertilizers",
              "Herbicides",
              "Fungicides",
              "Insecticides",
              "Crop Protection",
              "Agricultural Equipment",
            ].map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{search}</span>
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
