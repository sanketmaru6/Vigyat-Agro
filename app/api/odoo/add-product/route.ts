// ...existing code...
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const payload = {
      name: formData.name,
      price: formData.price,
      category: formData.category,
      composition: formData.composition,
      description: formData.description,
      usageInstructions: formData.usageInstructions,
      // image: handle image upload separately if needed
    }

    const res = await fetch("/api/odoo/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to add product")

    alert("Product added successfully!")
    router.push("/admin/dashboard")
  } catch (error) {
    console.error("[v0] Error saving product:", error)
    alert("Error adding product. Please try again.")
  } finally {
    setIsLoading(false)
  }
}
// ...existing code...