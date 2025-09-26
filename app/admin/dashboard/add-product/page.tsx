"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ProductFormData {
  name: string
  price: string
  category: string
  composition: string
  description: string
  usageInstructions: string
  image: File | null
}

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    category: "",
    composition: "",
    description: "",
    usageInstructions: "",
    image: null,
  })

  const categories = [
    "Pesticide",
    "Fungicide",
    "Herbicide",
    "Fertilizer",
    "Growth Regulator",
    "Seed Treatment",
    "Organic Product",
  ]

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call - in real app, this would save to database
      console.log("[v0] Product data to save:", formData)

      // Get existing products from localStorage
      const existingProducts = JSON.parse(localStorage.getItem("agroProducts") || "[]")

      // Create new product
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        composition: formData.composition,
        description: formData.description,
        usageInstructions: formData.usageInstructions,
        image: imagePreview || "/diverse-agricultural-products.png",
        createdAt: new Date().toISOString(),
      }

      // Add to products array
      const updatedProducts = [...existingProducts, newProduct]
      localStorage.setItem("agroProducts", JSON.stringify(updatedProducts))

      // Show success message
      alert("Product added successfully!")

      // Redirect back to dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Error adding product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Button>
            </Link>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-semibold">Vigyat AgroStore</h1>
                <p className="text-slate-400 text-sm">Add New Product</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">Add New Agricultural Product</CardTitle>
                    <CardDescription className="text-slate-400">
                      Fill in the details to add a new product to your agricultural store
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name and Price */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        Product Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., DiafenBeck, Targaryen"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">
                        Price <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="₹450"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Category and Composition */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">
                        Category <span className="text-red-400">*</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select product category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-white hover:bg-slate-600">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="composition" className="text-white">
                        Composition
                      </Label>
                      <Input
                        id="composition"
                        placeholder="47% + 6.9%"
                        value={formData.composition}
                        onChange={(e) => handleInputChange("composition", e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Product Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Product Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the product benefits, usage, and key features..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                      rows={5}
                    />
                  </div>

                  {/* Usage Instructions */}
                  <div className="space-y-2">
                    <Label htmlFor="usage" className="text-white">
                      Usage Instructions
                    </Label>
                    <Textarea
                      id="usage"
                      placeholder="How to use this product, dosage, application method..."
                      value={formData.usageInstructions}
                      onChange={(e) => handleInputChange("usageInstructions", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px]"
                      rows={5}
                    />
                  </div>

                  {/* Product Image */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-white">
                      Product Image
                    </Label>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
                            className="mx-auto max-w-xs max-h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setImagePreview(null)
                              setFormData((prev) => ({ ...prev, image: null }))
                            }}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <svg
                              className="w-12 h-12 text-slate-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-2">Click to upload product image or drag and drop</p>
                            <p className="text-slate-500 text-sm">PNG, JPG up to 10MB</p>
                          </div>
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image")?.click()}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Link href="/admin/dashboard">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </Link>

                    <Button
                      type="submit"
                      disabled={isLoading || !formData.name || !formData.price || !formData.category}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isLoading ? "Adding Product..." : "Add Product to Store"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
