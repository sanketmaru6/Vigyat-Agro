import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, Star, NavigationIcon, PhoneCall } from "lucide-react"

const stores = [
  {
    id: 1,
    name: "Vigyat AgroStore Main Branch",
    rating: 4.8,
    reviews: 145,
    address: "123 Agriculture Road, Farmville District",
    distance: "2.5 km away",
    phone: "+91 98765 43210",
    hours: "Mon-Sat: 8:00 AM - 8:00 PM",
    category: "Main Branch",
    image: "/placeholder.svg?height=80&width=80&text=Store",
  },
  {
    id: 2,
    name: "Vigyat Seeds & Fertilizers",
    rating: 4.6,
    reviews: 89,
    address: "45 Green Valley, Crop Circle Area",
    distance: "8.2 km away",
    phone: "+91 98765 43211",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM",
    category: "Specialized",
    image: "/placeholder.svg?height=80&width=80&text=Seeds",
  },
  {
    id: 3,
    name: "Vigyat Organic Solutions",
    rating: 4.7,
    reviews: 112,
    address: "67 Eco Street, Sustainable Farming Zone",
    distance: "12.1 km away",
    phone: "+91 98765 43212",
    hours: "Mon-Sun: 8:30 AM - 7:30 PM",
    category: "Organic",
    image: "/placeholder.svg?height=80&width=80&text=Organic",
  },
  {
    id: 4,
    name: "Vigyat Equipment Hub",
    rating: 4.5,
    reviews: 78,
    address: "89 Machinery Lane, Industrial Area",
    distance: "28.5 km away",
    phone: "+91 98765 43213",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM",
    category: "Equipment",
    image: "/placeholder.svg?height=80&width=80&text=Equipment",
  },
  {
    id: 5,
    name: "Vigyat Pesticide Center",
    rating: 4.4,
    reviews: 95,
    address: "15 Protection Avenue, Safety Zone",
    distance: "36.2 km away",
    phone: "+91 98765 43214",
    hours: "Mon-Fri: 8:00 AM - 7:00 PM",
    category: "Pesticides",
    image: "/placeholder.svg?height=80&width=80&text=Pesticides",
  },
  {
    id: 6,
    name: "Vigyat Rural Outlet",
    rating: 4.3,
    reviews: 64,
    address: "34 Village Road, Rural District",
    distance: "42.8 km away",
    phone: "+91 98765 43215",
    hours: "Mon-Sat: 8:30 AM - 6:30 PM",
    category: "Rural",
    image: "/placeholder.svg?height=80&width=80&text=Rural",
  },
]

export default function StoreInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <FloatingWhatsApp />

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-700 mb-2">Store Locations</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Find your nearest Vigyat AgroStore and explore all our locations
          </p>
        </div>

        {/* Nearest Store */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Nearest Store</h2>
          </div>

          <Card className="p-4 md:p-6 rounded-xl">
            <div className="flex gap-3">
              <div className="relative">
                <img
                  src={stores[0].image || "/placeholder.svg"}
                  alt="Store"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1">
                  Nearest Store
                </Badge>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-blue-700 mb-1">{stores[0].name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(stores[0].rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {stores[0].rating} ({stores[0].reviews} reviews)
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{stores[0].address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NavigationIcon className="h-3 w-3" />
                    <span className="text-green-600 font-medium">{stores[0].distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{stores[0].phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{stores[0].hours}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1">
                    <NavigationIcon className="h-3 w-3 mr-1" />
                    Get Directions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <PhoneCall className="h-3 w-3 mr-1" />
                    Call Store
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* All Other Stores */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-blue-700" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">All Other Stores</h2>
            <span className="text-sm text-gray-500">({stores.length - 1} locations)</span>
          </div>

          <div className="space-y-4">
            {stores.slice(1).map((store) => (
              <Card key={store.id} className="p-4 md:p-6 rounded-xl">
                <div className="flex gap-3">
                  <div className="relative">
                    <img
                      src={store.image || "/placeholder.svg"}
                      alt="Store"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <Badge className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs px-1 py-0.5">
                      {store.category}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-700 mb-1">{store.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(store.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {store.rating} ({store.reviews} reviews)
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <NavigationIcon className="h-3 w-3" />
                        <span>{store.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{store.hours}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1">
                        <NavigationIcon className="h-3 w-3 mr-1" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
