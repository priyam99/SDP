"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { PetFilters } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface PetFiltersProps {
  initialFilters: PetFilters
}

export default function PetFiltersComponent({ initialFilters }: PetFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState<PetFilters>(initialFilters)
  const [ageRange, setAgeRange] = useState<[number, number]>([initialFilters.minAge || 0, initialFilters.maxAge || 15])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (filters.species) params.set("species", filters.species)
    if (filters.breed) params.set("breed", filters.breed)
    if (filters.minAge !== undefined) params.set("minAge", filters.minAge.toString())
    if (filters.maxAge !== undefined) params.set("maxAge", filters.maxAge.toString())
    if (filters.size) params.set("size", filters.size)
    if (filters.gender) params.set("gender", filters.gender)
    if (filters.isAdopted !== undefined) params.set("adopted", filters.isAdopted.toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({})
    setAgeRange([0, 15])
    router.push(pathname)
  }

  useEffect(() => {
    setFilters({
      ...filters,
      minAge: ageRange[0],
      maxAge: ageRange[1],
    })
  }, [ageRange])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Pets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Select
            value={filters.species || ""}
            onValueChange={(value) => setFilters({ ...filters, species: value || undefined })}
          >
            <SelectTrigger id="species">
              <SelectValue placeholder="All species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All species</SelectItem>
              <SelectItem value="Dog">Dogs</SelectItem>
              <SelectItem value="Cat">Cats</SelectItem>
              <SelectItem value="Bird">Birds</SelectItem>
              <SelectItem value="Small & Furry">Small & Furry</SelectItem>
              <SelectItem value="Reptile">Reptiles</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            placeholder="Any breed"
            value={filters.breed || ""}
            onChange={(e) => setFilters({ ...filters, breed: e.target.value || undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label>Age Range (years)</Label>
          <div className="pt-4">
            <Slider defaultValue={ageRange} min={0} max={15} step={1} value={ageRange} onValueChange={setAgeRange} />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{ageRange[0]} years</span>
              <span>{ageRange[1]} years</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select
            value={filters.size || ""}
            onValueChange={(value) => setFilters({ ...filters, size: value || undefined })}
          >
            <SelectTrigger id="size">
              <SelectValue placeholder="Any size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any size</SelectItem>
              <SelectItem value="Small">Small</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={filters.gender || ""}
            onValueChange={(value) => setFilters({ ...filters, gender: value || undefined })}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Any gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any gender</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="adopted"
            checked={filters.isAdopted === true}
            onCheckedChange={(checked) => setFilters({ ...filters, isAdopted: checked ? true : undefined })}
          />
          <Label htmlFor="adopted">Show adopted pets</Label>
        </div>

        <div className="flex flex-col space-y-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
