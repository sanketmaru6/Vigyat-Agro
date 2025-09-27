"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Product, Crop, KrushiArticle, StoreInfo, Slider, Order } from "@/lib/types"
import { Plus, Trash2, RefreshCw, LogOut, Database, AlertCircle, CheckCircle2 } from "lucide-react"

function SectionTabs({ tab, setTab }: { tab: string; setTab: (v: string) => void }) {
  const tabs = [
    { id: "products", label: "Agro Store", icon: "🌾" },
    { id: "crops", label: "All Crops", icon: "🌱" },
    { id: "krushi", label: "Krushi Gyan", icon: "📚" },
    { id: "orders", label: "Orders", icon: "🧾" },
    { id: "sliders", label: "Sliders", icon: "🖼️" },
    { id: "store", label: "Store Info", icon: "🏪" },
  ]
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-6 mb-8 p-4 bg-white rounded-xl shadow-sm border">
      {tabs.map((t) => (
        <Button
          key={t.id}
          variant={tab === t.id ? "default" : "outline"}
          className={`${
            tab === t.id
              ? "bg-gradient-to-r from-[#0b4e8f] to-[#1e5a96] text-white shadow-lg"
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          } px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2`}
          onClick={() => setTab(t.id)}
        >
          <span className="text-lg">{t.icon}</span>
          {t.label}
        </Button>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState("products")

  // data state
  const [products, setProducts] = useState<Product[]>([])
  const [crops, setCrops] = useState<Crop[]>([])
  const [articles, setArticles] = useState<KrushiArticle[]>([])
  const [info, setInfo] = useState<StoreInfo | null>(null)
  const [sliders, setSliders] = useState<Slider[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const [loading, setLoading] = useState(true)
  const [dbOk, setDbOk] = useState<boolean | null>(null)
  const [msg, setMsg] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      // ping DB
      try {
        const h = await fetch("/api/health").then((r) => r.json())
        setDbOk(!!h?.ok)
      } catch {
        setDbOk(false)
      }
      const [p, c, k, s, sl, od] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/crops").then((r) => r.json()),
        fetch("/api/krushi").then((r) => r.json()),
        fetch("/api/store-info").then((r) => r.json()),
        fetch("/api/sliders").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
      ])
      // Normalize responses to prevent runtime errors when API returns an error object
      setProducts(Array.isArray(p) ? p : [])
      setCrops(Array.isArray(c) ? c : [])
      setArticles(Array.isArray(k) ? k : [])
      setInfo(s && !Array.isArray(s) && typeof s === "object" ? s : null)
      setSliders(Array.isArray(sl) ? sl : [])
      setOrders(Array.isArray(od) ? od : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  // Actions
  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    const form = new FormData(formEl)
    // handle optional local image file
    let image = String(form.get("image") || "")
    const file = form.get("imageFile") as File | null
    if (file && file.size > 0) {
      if (file.size > 1024 * 1024) {
        setMsg("Image size must be less than 1MB")
        return
      }
      const up = new FormData()
      up.append("file", file)
      const resUp = await fetch("/api/upload", { method: "POST", body: up, credentials: "include" })
      if (resUp.ok) {
        const { url } = await resUp.json()
        image = url
      } else {
        setMsg("Image upload failed")
        return
      }
    }
    const body = Object.fromEntries(form.entries()) as any
    // coerce numeric fields
    if (body.price != null) body.price = Number(body.price)
    body.image = image
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (res.ok) {
      setMsg("Product added")
      load()
      formEl.reset()
    } else {
      let err = "Failed to add product"
      try {
        const data = await res.json()
        if (data?.error) err = data.error
      } catch {}
      setMsg(err)
      if (res.status === 401) {
        // Not authenticated, redirect to login
        router.push("/admin/login")
      }
    }
  }
  const delProduct = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("Product deleted")
      load()
    } else {
      setMsg("Failed to delete product")
    }
  }

  // Bulk delete handlers
  const delAllProducts = async () => {
    if (!confirm("Delete ALL products? This cannot be undone.")) return
    const res = await fetch(`/api/products`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("All products deleted")
      load()
    } else {
      setMsg("Failed to delete all products")
    }
  }

  const addCrop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    const form = new FormData(formEl)
    let image = String(form.get("image") || "")
    const file = form.get("imageFile") as File | null
    if (file && file.size > 0) {
      if (file.size > 1024 * 1024) {
        setMsg("Image size must be less than 1MB")
        return
      }
      const up = new FormData()
      up.append("file", file)
      const resUp = await fetch("/api/upload", { method: "POST", body: up, credentials: "include" })
      if (resUp.ok) {
        const { url } = await resUp.json()
        image = url
      } else {
        setMsg("Image upload failed")
        return
      }
    }
    const body = Object.fromEntries(form.entries()) as any
    body.image = image
    const res = await fetch("/api/crops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (res.ok) {
      setMsg("Crop added")
      load()
      formEl.reset()
    } else setMsg("Failed to add crop")
  }
  const delCrop = async (id: string) => {
    const res = await fetch(`/api/crops/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("Crop deleted")
      load()
    } else {
      setMsg("Failed to delete crop")
    }
  }

  const delAllCrops = async () => {
    if (!confirm("Delete ALL crops? This cannot be undone.")) return
    const res = await fetch(`/api/crops`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("All crops deleted")
      load()
    } else {
      setMsg("Failed to delete all crops")
    }
  }

  const addArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    const form = new FormData(formEl)
    let image = String(form.get("image") || "")
    const file = form.get("imageFile") as File | null
    if (file && file.size > 0) {
      if (file.size > 1024 * 1024) {
        setMsg("Image size must be less than 1MB")
        return
      }
      const up = new FormData()
      up.append("file", file)
      const resUp = await fetch("/api/upload", { method: "POST", body: up, credentials: "include" })
      if (resUp.ok) {
        const { url } = await resUp.json()
        image = url
      } else {
        setMsg("Image upload failed")
        return
      }
    }
    const body = Object.fromEntries(form.entries()) as any
    body.image = image
    const res = await fetch("/api/krushi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (res.ok) {
      setMsg("Article added")
      load()
      formEl.reset()
    } else setMsg("Failed to add article")
  }
  const delArticle = async (id: string) => {
    const res = await fetch(`/api/krushi/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("Article deleted")
      load()
    } else {
      setMsg("Failed to delete article")
    }
  }

  const delAllArticles = async () => {
    if (!confirm("Delete ALL articles? This cannot be undone.")) return
    const res = await fetch(`/api/krushi`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("All articles deleted")
      load()
    } else {
      setMsg("Failed to delete all articles")
    }
  }

  // Order actions
  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
      credentials: "include",
    })
    load()
  }
  const deleteOrder = async (id: string) => {
    const ok = confirm("Remove this order permanently?")
    if (!ok) return
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("Order deleted")
      load()
    } else {
      setMsg("Failed to delete order")
    }
  }

  // Slider actions
  const addSlider = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget as HTMLFormElement
    const form = new FormData(formEl)
    let image = String(form.get("image") || "")
    const file = form.get("imageFile") as File | null
    if (file && file.size > 0) {
      if (file.size > 1024 * 1024) {
        setMsg("Image size must be less than 1MB")
        return
      }
      const up = new FormData()
      up.append("file", file)
      const resUp = await fetch("/api/upload", { method: "POST", body: up, credentials: "include" })
      if (resUp.ok) {
        const { url } = await resUp.json()
        image = url
      } else {
        setMsg("Image upload failed")
        return
      }
    }
    const body: any = Object.fromEntries(form.entries())
    body.image = image
    const res = await fetch("/api/sliders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (res.ok) {
      setMsg("Slider added")
      load()
      formEl.reset()
    } else {
      setMsg("Failed to add slider")
    }
  }
  const delSlider = async (id: string) => {
    const res = await fetch(`/api/sliders/${id}`, { method: "DELETE", credentials: "include" })
    if (res.ok) {
      setMsg("Slider deleted")
      load()
    } else {
      setMsg("Failed to delete slider")
    }
  }

  const saveStore = async (e: any) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body = Object.fromEntries(form.entries())
    const res = await fetch("/api/store-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    })
    if (res.ok) {
      setMsg("Store info saved")
      load()
    } else setMsg("Failed to save store info")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#0b4e8f] to-[#1e5a96] rounded-xl">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your agricultural store content</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={load}
              className="flex items-center gap-2 hover:bg-gray-50 bg-transparent"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 flex items-center gap-2" onClick={logout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {dbOk === false && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold">Database Connection Error</h3>
            </div>
            <p className="mb-3">Unable to connect to Upstash Redis. Please check your configuration:</p>
            <div className="bg-white p-3 rounded-lg border border-red-200 font-mono text-sm">
              <div className="text-gray-600 mb-2">Redis Connection String:</div>
              <code className="text-red-700">redis://default:***@desired-bedbug-8711.upstash.io:6379</code>
            </div>
          </div>
        )}
        {dbOk && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 border border-green-200 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              
              <span className="text-sm bg-green-100 px-2 py-1 rounded-full">Online</span>
            </div>
          </div>
        )}

        <SectionTabs tab={tab} setTab={setTab} />

        {msg && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle2 className="w-4 h-4" />
              {msg}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#0b4e8f]" />
            <div className="text-gray-500 text-lg">Loading dashboard data...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {tab === "products" && (
              <Card className="p-6 shadow-lg border-0 bg-white rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#9fd93b] rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                </div>

                <form onSubmit={addProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Product Name *</label>
                      <input
                        name="name"
                        placeholder="Enter product name"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
                      <input
                        name="price"
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="type"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      >
                        <option value="">Select category</option>
                        <option value="fertilizer">Fertilizer</option>
                        <option value="pesticide">Pesticide</option>
                        <option value="seeds">Seeds</option>
                        <option value="equipment">Equipment</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Quantity/Pack Size</label>
                      <input
                        name="quantity"
                        placeholder="e.g., 1kg, 500ml, 1 piece"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Composition</label>
                      <input
                        name="composition"
                        placeholder="Active ingredients"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        name="image"
                        type="url"
                        placeholder="https://example.com/product.jpg"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500">You can paste a direct image URL or use the upload field below.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Upload Image</label>
                      <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product Name (gujrati)</label>
                    <input
                      name="nameHindi"
                      placeholder="ઉત્પાદનનું નામ ગુજરાતીમાં"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      placeholder="Product description, usage instructions, benefits..."
                      rows={4}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-[#9fd93b] to-[#8bc832] hover:from-[#8bc832] hover:to-[#7ab82a] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg">
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="bg-[#0b4e8f] text-white px-3 py-1 rounded-full text-sm">{products.length}</span>
                      Products
                    </h3>
                    {products.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={delAllProducts}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                      <Card
                        key={p.id}
                        className="p-4 shadow-md hover:shadow-lg transition-shadow border-0 rounded-xl bg-white"
                      >
                        <div className="aspect-square bg-gray-50 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={p.image || "/placeholder.svg?height=200&width=200"}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-gray-900 line-clamp-2">{p.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#0b4e8f]">₹{p.price}</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">{p.type}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2 bg-transparent"
                            onClick={() => delProduct(p.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {tab === "orders" && (
              <Card className="p-6 shadow-lg border-0 bg-white rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#9fd93b] rounded-lg">
                    <span className="text-lg">🧾</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-[#0b4e8f] text-white px-3 py-1 rounded-full text-sm">{orders.length}</span>
                  <span className="text-gray-700">total orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No orders yet.</div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <Card key={o.id} className="p-4 bg-white rounded-xl border-0 shadow-md">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-[#0b4e8f]">Order #{o.id}</div>
                              <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <div className="font-semibold mb-1">Customer</div>
                              <div>Name: {o.customer?.name}</div>
                              <div>Contact: {o.customer?.contact}</div>
                              <div>Village: {o.customer?.village}</div>
                              <div>Address: {o.customer?.address}</div>
                            </div>
                          </div>
                          <div className="md:w-1/2">
                            <div className="font-semibold text-sm text-gray-700 mb-2">Items</div>
                            <div className="space-y-2">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden">
                                    <img src={it.image || "/placeholder.svg"} alt={it.name} className="w-full h-full object-contain" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-800">{it.name}</div>
                                    <div className="text-xs text-gray-600">Qty: {it.quantity}</div>
                                  </div>
                                  <div className="text-sm font-semibold text-[#0b4e8f]">₹{Number(it.price) * Number(it.quantity)}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t pt-2">
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <span>Status:</span>
                                <select
                                  className="border rounded-md px-2 py-1 text-sm"
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                              <div className="text-lg font-bold text-[#0b4e8f]">Total: ₹{o.total}</div>
                            </div>
                            <div className="mt-3 flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-700 border-green-200 hover:bg-green-50 bg-transparent"
                                onClick={() => updateOrderStatus(o.id, "delivered")}
                              >
                                Mark as Done
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                onClick={() => deleteOrder(o.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {tab === "sliders" && (
              <Card className="p-6 shadow-lg border-0 bg-white rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#9fd93b] rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Manage Sliders</h2>
                </div>

                <form onSubmit={addSlider} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Group</label>
                      <select
                        name="group"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        required
                        defaultValue="bestSeller"
                      >
                        <option value="bestSeller">Best Seller</option>
                        <option value="featured">Featured</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        name="image"
                        type="url"
                        placeholder="https://example.com/banner.jpg"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500">Paste a direct image URL or use the upload field.</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Upload Image</label>
                      <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="bg-gradient-to-r from-[#9fd93b] to-[#8bc832] hover:from-[#8bc832] hover:to-[#7ab82a] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg">
                      <Plus className="w-4 h-4" />
                      Add Slide
                    </Button>
                  </div>
                </form>

                <div className="mt-8 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Best Seller Slides</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {sliders.filter((s) => s.group === "bestSeller").map((s) => (
                        <Card key={s.id} className="p-4 shadow-md border-0 rounded-xl bg-white">
                          <div className="aspect-video bg-gray-50 rounded-lg mb-3 overflow-hidden">
                            <img src={s.image || "/placeholder.svg"} alt="slide" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            onClick={() => delSlider(s.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Slides</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {sliders.filter((s) => s.group === "featured").map((s) => (
                        <Card key={s.id} className="p-4 shadow-md border-0 rounded-xl bg-white">
                          <div className="aspect-video bg-gray-50 rounded-lg mb-3 overflow-hidden">
                            <img src={s.image || "/placeholder.svg"} alt="slide" className="w-full h-full object-cover" />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                            onClick={() => delSlider(s.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {tab === "crops" && (
              <Card className="p-6 shadow-lg border-0 bg-white rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#9fd93b] rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Crop</h2>
                </div>

                <form onSubmit={addCrop} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Crop Title *</label>
                      <input
                        name="title"
                        placeholder="Enter crop name"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Title (gujrati)</label>
                      <input
                        name="titleHindi"
                        placeholder="ગુજરાતીમાં પાકનું નામ"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        name="image"
                        type="url"
                        placeholder="https://example.com/crop.jpg"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500">You can paste a direct image URL or use the upload field below.</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Upload Image</label>
                      <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      placeholder="Crop details, growing conditions, harvest time..."
                      rows={4}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-[#9fd93b] to-[#8bc832] hover:from-[#8bc832] hover:to-[#7ab82a] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg">
                      <Plus className="w-4 h-4" />
                      Add Crop
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="bg-[#0b4e8f] text-white px-3 py-1 rounded-full text-sm">{crops.length}</span>
                      Crops
                    </h3>
                    {crops.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={delAllCrops}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crops.map((c) => (
                      <Card
                        key={c.id}
                        className="p-4 shadow-md hover:shadow-lg transition-shadow border-0 rounded-xl bg-white"
                      >
                        <div className="aspect-video bg-gray-50 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={c.image || "/placeholder.svg?height=150&width=200"}
                            alt={c.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-gray-900">{c.title}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2 bg-transparent"
                            onClick={() => delCrop(c.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {tab === "krushi" && (
              <Card className="p-6 shadow-lg border-0 bg-white rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#9fd93b] rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Article</h2>
                </div>

                <form onSubmit={addArticle} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Article Title *</label>
                      <input
                        name="title"
                        placeholder="Enter article title"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Title (gujrati)</label>
                      <input
                        name="titleHindi"
                        placeholder="ગુજરાતીમાં લેખનું શીર્ષક"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        name="image"
                        type="url"
                        placeholder="https://example.com/article.jpg"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-gray-500">You can paste a direct image URL or use the upload field below.</p>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Upload Image</label>
                      <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Content *</label>
                    <textarea
                      name="content"
                      placeholder="Write your farming knowledge article here..."
                      rows={6}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-[#9fd93b] to-[#8bc832] hover:from-[#8bc832] hover:to-[#7ab82a] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg">
                      <Plus className="w-4 h-4" />
                      Add Article
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="bg-[#0b4e8f] text-white px-3 py-1 rounded-full text-sm">{articles.length}</span>
                      Articles
                    </h3>
                    {articles.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        onClick={delAllArticles}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete All
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles.map((a) => (
                      <Card
                        key={a.id}
                        className="p-4 shadow-md hover:shadow-lg transition-shadow border-0 rounded-xl bg-white"
                      >
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-900 text-lg">{a.title}</h4>
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{a.content}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2 bg-transparent"
                            onClick={() => delArticle(a.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {tab === "store" && (
              <Card className="p-6 shadow-lg border-0 bg-white rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#9fd93b] rounded-lg">
                    <span className="text-lg">🏪</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Store Information</h2>
                </div>

                <form onSubmit={saveStore} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Store Name</label>
                      <input
                        name="name"
                        placeholder="Your store name"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        defaultValue={info?.name || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        name="phone"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        defaultValue={info?.phone || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                      <input
                        name="whatsapp"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        defaultValue={info?.whatsapp || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Banner Image URL</label>
                      <input
                        name="banner"
                        placeholder="https://example.com/banner.jpg"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all"
                        defaultValue={info?.banner || ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      name="address"
                      placeholder="Complete store address"
                      rows={3}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0b4e8f] focus:border-transparent transition-all resize-none"
                      defaultValue={info?.address || ""}
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="bg-gradient-to-r from-[#9fd93b] to-[#8bc832] hover:from-[#8bc832] hover:to-[#7ab82a] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      Save Store Info
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
