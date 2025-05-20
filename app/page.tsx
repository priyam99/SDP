import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase"
import type { Pet } from "@/types"
import PetCard from "@/components/pet-card"
import { ArrowRight, Heart, Search, Shield } from "lucide-react"

async function getFeaturedPets(): Promise<Pet[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("is_adopted", false)
    .order("created_at", { ascending: false })
    .limit(4)

  if (error) {
    console.error("Error fetching featured pets:", error)
    return []
  }

  return data || []
}

export default async function Home() {
  const featuredPets = await getFeaturedPets()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Furry Companion</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connecting loving homes with pets in need. Browse our adoptable pets and find your new best friend today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-emerald-600 hover:bg-gray-100">
              <Link href="/pets">Find a Pet</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/report">Report a Pet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Pets</h2>
            <Link href="/pets" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all pets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {featuredPets.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No pets available for adoption at the moment.</p>
              <Button asChild>
                <Link href="/report">Report a Pet for Adoption</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Browse Pets</h3>
              <p className="text-gray-600">
                Search through our database of pets looking for their forever homes. Filter by species, age, size, and
                more.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Apply to Adopt</h3>
              <p className="text-gray-600">
                Found a pet you love? Submit an adoption application and our team will review it promptly.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Welcome Home</h3>
              <p className="text-gray-600">
                Once approved, you'll be able to welcome your new family member to their forever home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse our available pets and start your adoption journey today.
          </p>
          <Button size="lg" asChild className="bg-white text-emerald-600 hover:bg-gray-100">
            <Link href="/pets">Find a Pet Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
