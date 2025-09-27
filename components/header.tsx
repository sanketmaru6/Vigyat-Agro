import { ArrowLeft, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="text-white p-4" style={{ backgroundColor: "#0b4e8f" }}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Image
              src="/agro-store-logo.png"
              alt="Vigyat AgroStore Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
          <div className="text-lg font-semibold">
            <div>Vigyat AgroStore</div>
            <div className="text-sm font-normal">Welcomes You !</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600 rounded-full bg-white/20">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600 rounded-full bg-white/20">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-600 rounded-full bg-white/20">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
