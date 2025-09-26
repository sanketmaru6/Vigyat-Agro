"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Mock product data - will be replaced by localStorage data
const defaultProducts = [
  {
    id: 1,
    name: "DiafenBeck",
    description: "Premium organic pesticide - 47% + 6.9%",
    category: "Pesticide",
    price: 450,
    image: "/agricultural-pesticide-bottle.jpg",
  },
  {
    id: 2,
    name: "Targaryen",
    description: "Advanced crop protection - 1.9%",
    category: "Fungicide",
    price: 320,
    image: "/crop-protection-spray-bottle.jpg",
  },
  {
    id: 3,
    name: "KyroXil",
    description: "High-performance fertilizer blend",
    category: "Fertilizer",
    price: 280,
    image: "/fertilizer-bag.png",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("agro-store")
  const [products, setProducts] = useState(defaultProducts)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load products from localStorage
    const savedProducts = localStorage.getItem("agroProducts")
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts)
      setProducts([...defaultProducts, ...parsedProducts])
    }

    // Show login success message
    const justLoggedIn = localStorage.getItem("justLoggedIn")
    if (justLoggedIn === "true") {
      setShowLoginSuccess(true)
      localStorage.removeItem("justLoggedIn")
      setTimeout(() => setShowLoginSuccess(false), 3000)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    router.push("/admin")
  }

  const tabs = [
    { id: "krushi-vigyan", label: "Krushi Vigyan", icon: "📚" },
    { id: "all-crops", label: "All Crops", icon: "🌾" },
    { id: "agro-store", label: "Agro Store", icon: "🏪" },
    { id: "store-info", label: "Store Info", icon: "📍" },
  ]

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Login Success Message */}
        {showLoginSuccess && (
          <div className="fixed top-4 right-4 z-50">
            <Card className="bg-green-800 border-green-600">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Login Successful</h3>
                    <p className="text-green-200 text-sm">Welcome to Vigyat AgroStore Admin Panel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <header className="bg-blue-600 px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-blue-100 hover:text-white hover:bg-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🏔️</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">Vigyat AgroStore</h1>
                  <p className="text-blue-100 text-sm">Welcomes You !</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-blue-700 w-10 h-10 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-blue-700 w-10 h-10 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-100 hover:text-white hover:bg-blue-700 w-10 h-10 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </header>

        <div className="bg-white py-8 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-16">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center space-y-3 group"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                    }`}
                  >
                    {tab.id === "krushi-vigyan" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    )}
                    {tab.id === "all-crops" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    )}
                    {tab.id === "agro-store" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    )}
                    {tab.id === "store-info" && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      activeTab === tab.id ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="py-8">
          {activeTab === "agro-store" && (
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-blue-600 mb-2">Agro Store Products</h2>
                  <p className="text-gray-600">Premium agricultural solutions for better crop protection</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">{products.length} products found</span>
                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 bg-transparent">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                      />
                    </svg>
                    Cart (0)
                  </Button>
                </div>
              </div>

              {/* Add Product Button */}
              <div className="mb-6">
                <Link href="/admin/dashboard/add-product">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Product
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold">₹{product.price}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab !== "agro-store" && (
            <div className="max-w-4xl mx-auto text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {tabs.find((tab) => tab.id === activeTab)?.label} Section
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </main>

        <div className="fixed bottom-6 right-6">
          <Button className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg" size="sm">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
          </Button>
        </div>

        {/* Logout Button */}
        <div className="fixed bottom-6 left-6">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </AuthGuard>
  )
}
