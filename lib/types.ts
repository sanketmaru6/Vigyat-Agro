// Database types for the admin system

export interface Product {
  id: string
  name: string // Changed from title to name to match API usage
  nameHindi?: string // Changed from titleHindi to nameHindi
  description?: string
  price: number // Made required since price is essential for products
  image?: string
  type?: string // Changed from category enum to flexible string for better Redis compatibility
  composition?: string // Added composition field used in forms
  quantity?: string // Added quantity field used in forms
  inStock?: boolean // Made optional with default handling
  createdAt: string
  updatedAt: string
}

export interface Crop {
  id: string
  title: string
  titleHindi?: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface KrushiArticle {
  id: string
  title: string
  titleHindi?: string
  content: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface StoreInfo {
  id?: string
  name?: string
  phone?: string
  whatsapp?: string
  address?: string
  banner?: string
  createdAt?: string
  updatedAt?: string
}

export interface Admin {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface RedisProduct extends Omit<Product, "id"> {
  id: string
}

export interface RedisCrop extends Omit<Crop, "id"> {
  id: string
}

export interface RedisArticle extends Omit<KrushiArticle, "id"> {
  id: string
}

export interface RedisStoreInfo extends Omit<StoreInfo, "id"> {
  id: string
}

export interface Slider {
  id: string
  group: "bestSeller" | "featured"
  image: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CustomerInfo {
  name: string
  contact: string
  village: string
  address: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  customer: CustomerInfo
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface RedisSlider extends Omit<Slider, "id"> {
  id: string
}

export interface RedisOrder extends Omit<Order, "id"> {
  id: string
}
