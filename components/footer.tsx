import { Shield, Truck, Award } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-blue-700 text-white p-6 mt-8">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-8 w-8" />
            <h3 className="font-semibold text-sm">Premium Quality</h3>
            <p className="text-xs opacity-90">
              High-grade agrochemicals from trusted manufacturers with guaranteed efficacy
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Truck className="h-8 w-8" />
            <h3 className="font-semibold text-sm">Gujarat-wide Delivery</h3>
            <p className="text-xs opacity-90">Fast delivery across all cities in Gujarat with secure packaging</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Award className="h-8 w-8" />
            <h3 className="font-semibold text-sm">Expert Guidance</h3>
            <p className="text-xs opacity-90">
              Professional agricultural advice and personalized product recommendations
            </p>
          </div>
        </div>

        <div className="text-center text-xs opacity-75 mt-6 pt-4 border-t border-blue-600">
          © 2025 Vigyat Chemicals. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
