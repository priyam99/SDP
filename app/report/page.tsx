"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ReportPetPage() {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    size: "",
    gender: "",
    description: "",
    healthStatus: "",
    imageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/login?redirect=/report")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // First, check if the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      // If no profile exists, create one
      if (profileError || !profile) {
        const { error: insertProfileError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || "User",
        })

        if (insertProfileError) {
          throw insertProfileError
        }
      }

      // Now insert the pet
      const { error: insertError } = await supabase.from("pets").insert({
        name: formData.name,
        species: formData.species,
        breed: formData.breed || null,
        age: formData.age ? Number.parseInt(formData.age) : null,
        size: formData.size || null,
        gender: formData.gender || null,
        description: formData.description || null,
        health_status: formData.healthStatus || null,
        image_url: formData.imageUrl || null,
        reported_by: user.id,
        is_adopted: false,
      })

      if (insertError) {
        throw insertError
      }

      toast({
        title: "Pet reported successfully",
        description: "Thank you for reporting this pet for adoption.",
      })

      router.push("/pets")
    } catch (err) {
      console.error("Error reporting pet:", err)
      setError("Failed to report pet. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Want to report a pet for adoption?</h3>
            <p className="text-gray-600 mb-4">Please sign in or create an account to report a pet for adoption.</p>
            <Button asChild>
              <Link href="/login?redirect=/report">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report a Pet for Adoption</CardTitle>
          <CardDescription>Provide information about a pet that needs a new home</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value) => handleSelectChange("species", value)}
                    required
                  >
                    <SelectTrigger id="species">
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Small & Furry">Small & Furry</SelectItem>
                      <SelectItem value="Reptile">Reptile</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input id="breed" name="breed" value={formData.breed} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input id="age" name="age" type="number" min="0" value={formData.age} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={formData.size} onValueChange={(value) => handleSelectChange("size", value)}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small">Small</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the pet's personality, habits, and any special needs"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthStatus">Health Status</Label>
                <Textarea
                  id="healthStatus"
                  name="healthStatus"
                  value={formData.healthStatus}
                  onChange={handleChange}
                  placeholder="Describe the pet's health, vaccinations, and any medical conditions"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/pet-image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Provide a URL to an image of the pet. If you don't have one, leave this blank.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Pet for Adoption"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
