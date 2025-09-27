"use client"

import type React from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

const products = [
  {
    id: 1,
    name: "DiafenBeck",
    nameHindi: "डायफेनबेक कीटनाशक",
    composition: "Diafenthiuron 47% + Bifenthrin 9.4%",
    quantity: "1000 mL",
    price: 850,
    image: "/products/diafenbeck.png",
  },
  {
    id: 2,
    name: "Targaryen",
    nameHindi: "टारगेरियन कीटनाशक",
    composition: "Emamectin Benzoate 1.9% EC",
    quantity: "1000 mL",
    price: 920,
    image: "/products/targaryen.jpg",
  },
  {
    id: 3,
    name: "KyroXil",
    nameHindi: "कायरोक्सिल फंगीसाइड",
    composition: "Azoxystrobin 11% + Tebuconazole 18.3%",
    quantity: "1000 mL",
    price: 1150,
    image: "/products/kyroxil.png",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderForm, setOrderForm] = useState({
    name: "",
    contact: "",
    address: "",
    village: "",
  })

  useEffect(() => {
    const savedCart = localStorage.getItem("agroCart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const updateCartInStorage = (updatedCart: any[]) => {
    setCartItems(updatedCart)
    localStorage.setItem("agroCart", JSON.stringify(updatedCart))
  }

  const updateQuantity = (id: number, change: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item,
    )
    updateCartInStorage(updatedItems)
  }

  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    updateCartInStorage(updatedItems)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        items: cartItems.map((it) => ({
          id: String(it.id),
          name: it.name,
          price: Number(it.price),
          quantity: Number(it.quantity),
          image: it.image || "",
        })),
        customer: {
          name: orderForm.name,
          contact: orderForm.contact,
          address: orderForm.address,
          village: orderForm.village,
        },
        total: getTotalPrice(),
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = data?.error || 'Failed to place order'
        alert(msg)
        return
      }

      alert('Order placed successfully! We will contact you soon.')
      updateCartInStorage([])
      setShowCheckout(false)
      setOrderForm({ name: '', contact: '', address: '', village: '' })
    } catch (err) {
      alert('Something went wrong while placing the order.')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <FloatingWhatsApp />

        <main className="max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-sm p-8 text-center bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>

              <h1 className="text-xl font-semibold text-[#0b4e8f] mb-2">Your cart is empty</h1>

              <p className="text-gray-600 text-sm mb-6">Start shopping to add items to your cart!</p>

              <Link href="/agro-store">
                <Button className="bg-[#9fd93b] hover:bg-[#8bc832] text-[#0b4e8f] font-semibold px-8 py-2 rounded-2xl">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-[#0b4e8f] mb-6">Shopping Cart</h1>

        {!showCheckout ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 p-2"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0b4e8f]">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.nameHindi}</p>
                    <p className="text-xs text-gray-500">{item.composition}</p>
                    <p className="text-xs text-gray-500">Net Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-[#9fd93b]">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 rounded-full bg-transparent"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 rounded-full bg-transparent"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0 rounded-full text-red-500 hover:text-red-700 bg-transparent"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-6 bg-white rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-[#0b4e8f]">Total Amount:</span>
                <span className="text-xl font-bold text-[#9fd93b]">₹{getTotalPrice()}</span>
              </div>
              <Button
                className="w-full bg-[#0b4e8f] hover:bg-[#094080] text-white font-semibold py-3 rounded-2xl"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout (Cash on Delivery)
              </Button>
            </Card>
          </div>
        ) : (
          <Card className="p-6 bg-white rounded-2xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#0b4e8f] mb-6">Cash on Delivery Details</h2>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-[#0b4e8f] font-medium">
                  Name of Person
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  className="mt-1 rounded-2xl border-gray-300 focus:border-[#0b4e8f] focus:ring-[#0b4e8f]"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact" className="text-[#0b4e8f] font-medium">
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  required
                  className="mt-1 rounded-2xl border-gray-300 focus:border-[#0b4e8f] focus:ring-[#0b4e8f]"
                  value={orderForm.contact}
                  onChange={(e) => setOrderForm({ ...orderForm, contact: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-[#0b4e8f] font-medium">
                  Address
                </Label>
                <Textarea
                  id="address"
                  required
                  className="mt-1 rounded-2xl border-gray-300 focus:border-[#0b4e8f] focus:ring-[#0b4e8f]"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="village" className="text-[#0b4e8f] font-medium">
                  Village Name
                </Label>
                <Input
                  id="village"
                  type="text"
                  required
                  className="mt-1 rounded-2xl border-gray-300 focus:border-[#0b4e8f] focus:ring-[#0b4e8f]"
                  value={orderForm.village}
                  onChange={(e) => setOrderForm({ ...orderForm, village: e.target.value })}
                />
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-[#0b4e8f]">Total Amount:</span>
                  <span className="text-xl font-bold text-[#9fd93b]">₹{getTotalPrice()}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Payment Method: Cash on Delivery</p>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-2xl border-[#0b4e8f] text-[#0b4e8f] hover:bg-[#0b4e8f] hover:text-white bg-transparent"
                  onClick={() => setShowCheckout(false)}
                >
                  Back to Cart
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#9fd93b] hover:bg-[#8bc832] text-[#0b4e8f] font-semibold rounded-2xl"
                >
                  Place Order
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
