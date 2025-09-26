import { connectOdoo } from "./connect"

async function testConnection() {
  try {
    const odoo = await connectOdoo()
    console.log("✅ Odoo connection successful!")
  } catch (error) {
    console.error("❌ Odoo connection failed:", error)
  }
}

testConnection()