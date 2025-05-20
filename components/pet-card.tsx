import Link from "next/link"
import type { Pet } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PetCardProps {
  pet: Pet
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={pet.image_url || `/placeholder.svg?height=300&width=300&text=${pet.name}`}
            alt={pet.name}
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
          {pet.is_adopted && (
            <div className="absolute top-0 right-0 bg-gray-900/80 text-white px-3 py-1 text-sm font-medium">
              Adopted
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">{pet.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {pet.species}
            </Badge>
            {pet.breed && (
              <Badge variant="outline" className="text-xs">
                {pet.breed}
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            {pet.age !== null && (
              <p>
                Age: {pet.age} {pet.age === 1 ? "year" : "years"}
              </p>
            )}
            {pet.gender && <p>Gender: {pet.gender}</p>}
            {pet.size && <p>Size: {pet.size}</p>}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-sm text-emerald-600 font-medium">View Details</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
