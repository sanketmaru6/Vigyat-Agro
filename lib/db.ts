// Simple in-memory storage for demo - replace with real database in production
let products: any[] = []
let crops: any[] = []
let articles: any[] = []
let storeInfo: any = {}

export const db = {
  // Products
  getProducts: () => products,
  addProduct: (product: any) => {
    const newProduct = { ...product, id: Date.now().toString() }
    products.push(newProduct)
    return newProduct
  },
  deleteProduct: (id: string) => {
    products = products.filter((p) => p.id !== id)
  },

  // Crops
  getCrops: () => crops,
  addCrop: (crop: any) => {
    const newCrop = { ...crop, id: Date.now().toString() }
    crops.push(newCrop)
    return newCrop
  },
  deleteCrop: (id: string) => {
    crops = crops.filter((c) => c.id !== id)
  },

  // Articles
  getArticles: () => articles,
  addArticle: (article: any) => {
    const newArticle = { ...article, id: Date.now().toString(), createdAt: new Date().toISOString() }
    articles.push(newArticle)
    return newArticle
  },
  deleteArticle: (id: string) => {
    articles = articles.filter((a) => a.id !== id)
  },

  // Store Info
  getStoreInfo: () => storeInfo,
  setStoreInfo: (info: any) => {
    storeInfo = { ...storeInfo, ...info }
    return storeInfo
  },
}
