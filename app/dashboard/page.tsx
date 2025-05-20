"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import type { Pet, AdoptionApplication } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PawPrint, Clock, CheckCircle, XCircle } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [reportedPets, setReportedPets] = useState<Pet[]>([])
  const [applications, setApplications] = useState<AdoptionApplication[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      setIsLoadingData(true)

      try {
        // Fetch reported pets
        const { data: petsData, error: petsError } = await supabase
          .from("pets")
          .select("*")
          .eq("reported_by", user.id)
          .order("created_at", { ascending: false })

        if (petsError) throw petsError
        setReportedPets(petsData || [])

        // Fetch adoption applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from("adoption_applications")
          .select(`
            *,
            pet:pets(*)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (applicationsError) throw applicationsError
        setApplications(applicationsData || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [user])

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <Tabs defaultValue="applications">
        <TabsList className="mb-8">
          <TabsTrigger value="applications">Your Applications</TabsTrigger>
          <TabsTrigger value="reported">Reported Pets</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Adoption Applications</h2>
              <Button asChild>
                <Link href="/pets">Find More Pets</Link>
              </Button>
            </div>

            {isLoadingData ? (
              <p className="text-center py-12">Loading your applications...</p>
            ) : applications.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4">
                          <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={
                                application.pet?.image_url ||
                                `/placeholder.svg?height=200&width=200&text=${application.pet?.name}`
                              }
                              alt={application.pet?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-semibold">
                              <Link href={`/pets/${application.pet_id}`} className="hover:text-emerald-600">
                                {application.pet?.name}
                              </Link>
                            </h3>
                            <ApplicationStatusBadge status={application.status} />
                          </div>

                          <div className="text-sm text-gray-500 mb-4">
                            <p>Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium mb-1">Your reason for adopting:</h4>
                            <p className="text-gray-700">{application.reason}</p>
                          </div>

                          {application.status === "Pending" && (
                            <div className="flex items-center text-amber-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">Your application is being reviewed</span>
                            </div>
                          )}

                          {application.status === "Approved" && (
                            <div className="flex items-center text-emerald-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Congratulations! Your application has been approved.</span>
                            </div>
                          )}

                          {application.status === "Rejected" && (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Unfortunately, your application was not approved.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center py-12">
                  <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't applied to adopt any pets yet. Browse our available pets and find your perfect match!
                  </p>
                  <Button asChild>
                    <Link href="/pets">Find a Pet</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reported">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Pets You've Reported</h2>
              <Button asChild>
                <Link href="/report">Report a Pet</Link>
              </Button>
            </div>

            {isLoadingData ? (
              <p className="text-center py-12">Loading your reported pets...</p>
            ) : reportedPets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportedPets.map((pet) => (
                  <Card key={pet.id} className="overflow-hidden h-full">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={pet.image_url || `/placeholder.svg?height=300&width=400&text=${pet.name}`}
                        alt={pet.name}
                        className="object-cover w-full h-full"
                      />
                      {pet.is_adopted && (
                        <div className="absolute top-0 right-0 bg-gray-900/80 text-white px-3 py-1 text-sm font-medium">
                          Adopted
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{pet.name}</h3>
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
                      <div className="flex justify-between items-center mt-4">
                        <Button size="sm" asChild>
                          <Link href={`/pets/${pet.id}`}>View Details</Link>
                        </Button>
                        <span className="text-xs text-gray-500">
                          Reported on {new Date(pet.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center py-12">
                  <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No reported pets</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't reported any pets for adoption yet. Help pets find their forever homes by reporting
                    them.
                  </p>
                  <Button asChild>
                    <Link href="/report">Report a Pet</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApplicationStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Approved":
      return <Badge className="bg-emerald-500">Approved</Badge>
    case "Rejected":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-600">
          Pending
        </Badge>
      )
  }
}
