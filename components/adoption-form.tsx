"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface AdoptionFormProps {
  petId: string
}

export default function AdoptionForm({ petId }: AdoptionFormProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push("/login")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Check if user already has an application for this pet
      const { data: existingApplication } = await supabase
        .from("adoption_applications")
        .select("*")
        .eq("pet_id", petId)
        .eq("user_id", user.id)
        .single()

      if (existingApplication) {
        setError("You have already submitted an application for this pet.")
        return
      }

      const { error: insertError } = await supabase.from("adoption_applications").insert({
        pet_id: petId,
        user_id: user.id,
        reason,
        status: "Pending",
      })

      if (insertError) {
        throw insertError
      }

      toast({
        title: "Application submitted",
        description: "Your adoption application has been submitted successfully.",
      })

      router.refresh()
      setReason("")
    } catch (err) {
      console.error("Error submitting application:", err)
      setError("Failed to submit application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Want to adopt this pet?</h3>
          <p className="text-gray-600 mb-4">Please sign in or create an account to submit an adoption application.</p>
          <Button asChild>
            <Link href={`/login?redirect=/pets/${petId}`}>Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adopt This Pet</CardTitle>
        <CardDescription>Tell us why you would be a good match for this pet</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Why do you want to adopt this pet? What kind of home can you provide?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              required
              className="resize-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
