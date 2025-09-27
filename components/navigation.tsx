import { BookOpen, Sprout, ShoppingBag, MapPin } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="bg-white p-4 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center">
          <Link href="/krushi-gyan" className="group">
            <div className="flex flex-col items-center gap-2 p-3 transition-all duration-200 hover:scale-110">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-700 group-hover:text-blue-600">Krushi Vigyan</span>
            </div>
          </Link>

          <Link href="/all-crops" className="group">
            <div className="flex flex-col items-center gap-2 p-3 transition-all duration-200 hover:scale-110">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-700 group-hover:text-blue-600">All Crops</span>
            </div>
          </Link>

          <Link href="/agro-store" className="group">
            <div className="flex flex-col items-center gap-2 p-3 transition-all duration-200 hover:scale-110">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-700 group-hover:text-blue-600">Agro Store</span>
            </div>
          </Link>

          <Link href="/store-info" className="group">
            <div className="flex flex-col items-center gap-2 p-3 transition-all duration-200 hover:scale-110">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-medium text-blue-700 group-hover:text-blue-600">Store Info</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}
