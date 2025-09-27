"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Plus } from "lucide-react"
import { useEffect, useState } from "react"

type Product = {
  id: string
  name: string
  nameHindi?: string
  type: string
  composition?: string
  quantity?: string
  price: number
  image?: string
  description?: string
}

export default function AgroStorePage() {
  const [cart, setCart] = useState<any[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    // Store in localStorage for cart page
    const updatedCart = existingItem
      ? cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { ...product, quantity: 1 }]

    localStorage.setItem("agroCart", JSON.stringify(updatedCart))
    alert(`${product.name} added to cart!`)
  }

  const openDetails = (product: Product) => {
    setSelected(product)
    setShowDetails(true)
  }
  const closeDetails = () => {
    setShowDetails(false)
    setSelected(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0b4e8f] mb-2">Agro Store Products</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Premium agricultural solutions for better crop protection
          </p>
        </div>

        {/* Product Count */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">{products.length} products found</div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingCart className="h-4 w-4" />
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-[#0b4e8f] font-semibold mb-2">No products available</h3>
            <p className="text-gray-500 text-sm">Please check back soon or contact admin to add products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-xl border-0 shadow-md"
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-[#0b4e8f] truncate">{product.name}</h3>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => openDetails(product)}
                      className="rounded-full px-3 py-2 text-xs sm:text-sm border-[#0b4e8f] text-[#0b4e8f] bg-white"
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => addToCart(product)}
                      className="bg-[#9fd93b] hover:bg-[#8bc832] text-white rounded-full px-3 py-2 text-xs sm:text-sm flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* Details Popup */}
        <DetailsModal
          open={showDetails}
          onClose={closeDetails}
          product={selected}
          onAdd={(p) => {
            addToCart(p)
            closeDetails()
          }}
        />
      </main>

      <Footer />
    </div>
  )
}

// Details Modal overlay
// Keeping simple inline modal for zero-dependency popup
// Renders after the page content
export function DetailsModal({ open, onClose, product, onAdd }: {
  open: boolean
  onClose: () => void
  product: Product | null
  onAdd: (p: Product) => void
}) {
  if (!open || !product) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6 m-0 sm:m-4">
        <div className="flex items-start gap-3">
          <img src={product.image || '/placeholder.svg'} alt={product.name} className="w-24 h-24 object-contain rounded-xl bg-gradient-to-br from-green-50 to-blue-50 p-2" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-[#0b4e8f] truncate">{product.name}</h3>
            {product.nameHindi && <p className="text-sm text-gray-600">{product.nameHindi}</p>}
            {product.type && <span className="inline-block bg-[#9fd93b] text-white text-xs px-2 py-1 rounded-full mt-1">{product.type}</span>}
          </div>
        </div>
        <div className="mt-3 space-y-1 text-sm text-gray-700">
          {product.composition && <p><span className="font-medium text-[#0b4e8f]">Composition:</span> {product.composition}</p>}
          {product.quantity && <p><span className="font-medium text-[#0b4e8f]">Net Quantity:</span> {product.quantity}</p>}
          {product.description && <p className="text-gray-600">{product.description}</p>}
          <p className="font-semibold text-[#0b4e8f]">Price: ₹{product.price}</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-full border-[#0b4e8f] text-[#0b4e8f]">Close</Button>
          <Button onClick={() => onAdd(product)} className="rounded-full bg-[#9fd93b] hover:bg-[#8bc832] text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
