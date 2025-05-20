import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import type { Pet } from "@/types"
import AdoptionForm from "@/components/adoption-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Heart, AlertCircle } from "lucide-react"
import Link from "next/link"

interface PetDetailsPageProps {
  params: {
    id: string
  }
}

async function getPet(id: string): Promise<Pet | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("pets").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching pet:", error)
    return null
  }

  return data
}

export default async function PetDetailsPage({ params }: PetDetailsPageProps) {
  const pet = await getPet(params.id)

  if (!pet) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pet Image */}
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden bg-gray-100 aspect-video">
            <img
              src={pet.image_url || `/placeholder.svg?height=600&width=800&text=${pet.name}`}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">About {pet.name}</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {pet.description ||
                  `Meet ${pet.name}, a lovely ${pet.gender?.toLowerCase() || ""} ${pet.breed || pet.species.toLowerCase()} looking for a forever home. ${pet.name} is ${pet.age} years old and has a ${pet.size?.toLowerCase() || "medium"} build.`}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Health Information</h3>
              <p className="text-gray-700">
                {pet.health_status || `${pet.name} is in good health and has received all necessary vaccinations.`}
              </p>
            </div>
          </div>
        </div>

        {/* Pet Info & Adoption */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{pet.species}</Badge>
                    {pet.breed && <Badge variant="outline">{pet.breed}</Badge>}
                  </div>
                </div>
                {pet.is_adopted && <Badge className="bg-gray-500">Adopted</Badge>}
              </div>

              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  {pet.age !== null && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span>
                        {pet.age} {pet.age === 1 ? "year" : "years"} old
                      </span>
                    </div>
                  )}
                  {pet.gender && (
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-gray-400" />
                      <span>{pet.gender}</span>
                    </div>
                  )}
                  {pet.size && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <span>{pet.size} size</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>Local shelter</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {!pet.is_adopted ? (
            <AdoptionForm petId={pet.id} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Already Adopted</h3>
                <p className="text-gray-600 mb-4">
                  This pet has already found their forever home. Check out other pets that are still looking for a home.
                </p>
                <Button asChild>
                  <Link href="/pets">Browse Other Pets</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
