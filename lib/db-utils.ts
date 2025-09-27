// Database utility functions for the admin system

import type { Product, Crop, KrushiArticle } from "./types"

// In-memory storage (replace with actual database in production)
const products: Product[] = []
const crops: Crop[] = []
const articles: KrushiArticle[] = []

// Product utilities
export const getAllProducts = (): Product[] => products

export const getProductsByCategory = (category: Product["category"]): Product[] =>
  products.filter((p) => p.category === category)

export const createProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
  const product: Product = {
    ...productData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(product)
  return product
}

export const updateProduct = (id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null => {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return products[index]
}

export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}

// Crop utilities
export const getAllCrops = (): Crop[] => crops

export const createCrop = (cropData: Omit<Crop, "id" | "createdAt" | "updatedAt">): Crop => {
  const crop: Crop = {
    ...cropData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  crops.push(crop)
  return crop
}

export const updateCrop = (id: string, updates: Partial<Omit<Crop, "id" | "createdAt">>): Crop | null => {
  const index = crops.findIndex((c) => c.id === id)
  if (index === -1) return null

  crops[index] = {
    ...crops[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return crops[index]
}

export const deleteCrop = (id: string): boolean => {
  const index = crops.findIndex((c) => c.id === id)
  if (index === -1) return false

  crops.splice(index, 1)
  return true
}

// Article utilities
export const getAllArticles = (): KrushiArticle[] => articles

export const createArticle = (articleData: Omit<KrushiArticle, "id" | "createdAt" | "updatedAt">): KrushiArticle => {
  const article: KrushiArticle = {
    ...articleData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  articles.push(article)
  return article
}

export const updateArticle = (
  id: string,
  updates: Partial<Omit<KrushiArticle, "id" | "createdAt">>,
): KrushiArticle | null => {
  const index = articles.findIndex((a) => a.id === id)
  if (index === -1) return null

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return articles[index]
}

export const deleteArticle = (id: string): boolean => {
  const index = articles.findIndex((a) => a.id === id)
  if (index === -1) return false

  articles.splice(index, 1)
  return true
}

// Seed data for demonstration
export const seedData = () => {
  // Add some sample products
  if (products.length === 0) {
    createProduct({
      title: "NPK Fertilizer 19:19:19",
      titleHindi: "एनपीके उर्वरक 19:19:19",
      description: "Balanced NPK fertilizer for all crops",
      price: 850,
      category: "fertilizer",
      inStock: true,
      image: "/npk-fertilizer-bag.png",
    })

    createProduct({
      title: "Chlorpyrifos 20% EC",
      titleHindi: "क्लोरपायरिफॉस 20% ईसी",
      description: "Effective insecticide for pest control",
      price: 320,
      category: "pesticide",
      inStock: true,
      image: "/pesticide-bottle.jpg",
    })
  }

  // Add some sample crops
  if (crops.length === 0) {
    createCrop({
      title: "Cotton Seeds - BT Variety",
      titleHindi: "कपास के बीज - बीटी किस्म",
      description: "High yielding BT cotton seeds",
      image: "/cotton-seeds.jpg",
    })

    createCrop({
      title: "Wheat Seeds - HD-2967",
      titleHindi: "गेहूं के बीज - एचडी-2967",
      description: "Premium wheat variety for high yield",
      image: "/wheat-seeds.png",
    })
  }

  // Add some sample articles
  if (articles.length === 0) {
    createArticle({
      title: "Modern Irrigation Techniques for Better Crop Yield",
      titleHindi: "बेहतर फसल उत्पादन के लिए आधुनिक सिंचाई तकनीक",
      content:
        "Learn about drip irrigation, sprinkler systems, and water management techniques that can significantly improve your crop yield while conserving water resources.",
      image: "/agricultural-irrigation.png",
    })

    createArticle({
      title: "Organic Pest Control Methods",
      titleHindi: "जैविक कीट नियंत्रण विधियां",
      content:
        "Discover natural and organic methods to control pests in your crops without harmful chemicals. Learn about beneficial insects, neem-based solutions, and integrated pest management.",
      image: "/organic-farm.png",
    })
  }
}
