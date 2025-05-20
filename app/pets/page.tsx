import { createServerClient } from "@/lib/supabase"
import type { Pet, PetFilters } from "@/types"
import PetCard from "@/components/pet-card"
import PetFiltersComponent from "@/components/pet-filters"

interface PetsPageProps {
  searchParams: {
    species?: string
    breed?: string
    minAge?: string
    maxAge?: string
    size?: string
    gender?: string
    adopted?: string
  }
}

async function getPets(filters: PetFilters): Promise<Pet[]> {
  const supabase = createServerClient()

  let query = supabase.from("pets").select("*").order("created_at", { ascending: false })

  if (filters.species) {
    query = query.eq("species", filters.species)
  }

  if (filters.breed) {
    query = query.ilike("breed", `%${filters.breed}%`)
  }

  if (filters.minAge !== undefined) {
    query = query.gte("age", filters.minAge)
  }

  if (filters.maxAge !== undefined) {
    query = query.lte("age", filters.maxAge)
  }

  if (filters.size) {
    query = query.eq("size", filters.size)
  }

  if (filters.gender) {
    query = query.eq("gender", filters.gender)
  }

  if (filters.isAdopted !== undefined) {
    query = query.eq("is_adopted", filters.isAdopted)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching pets:", error)
    return []
  }

  return data || []
}

export default async function PetsPage({ searchParams }: PetsPageProps) {
  const filters: PetFilters = {
    species: searchParams.species,
    breed: searchParams.breed,
    minAge: searchParams.minAge ? Number.parseInt(searchParams.minAge) : undefined,
    maxAge: searchParams.maxAge ? Number.parseInt(searchParams.maxAge) : undefined,
    size: searchParams.size,
    gender: searchParams.gender,
    isAdopted: searchParams.adopted === "true" ? true : searchParams.adopted === "false" ? false : undefined,
  }

  const pets = await getPets(filters)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Your Perfect Pet</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PetFiltersComponent initialFilters={filters} />
        </div>

        <div className="lg:col-span-3">
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new pets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
