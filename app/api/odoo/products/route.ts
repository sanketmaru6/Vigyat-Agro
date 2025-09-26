import { NextRequest, NextResponse } from "next/server"
import { connectOdoo } from "../connect"

export async function GET(req: NextRequest) {
  try {
    const odoo: any = await connectOdoo()
    // Example: search for products
    odoo.execute_kw(
      "product.product",
      "search_read",
      [[[]], { fields: ["name", "list_price", "categ_id"] }],
      (err: any, products: any) => {
        if (err) {
          return NextResponse.json({ error: err.message }, { status: 500 })
        }
        return NextResponse.json({ products })
      }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}