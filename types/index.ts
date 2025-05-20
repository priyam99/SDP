export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export type Pet = {
  id: string
  name: string
  species: string
  breed: string | null
  age: number | null
  size: "Small" | "Medium" | "Large" | null
  gender: "Male" | "Female" | null
  description: string | null
  health_status: string | null
  is_adopted: boolean
  reported_by: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export type AdoptionApplication = {
  id: string
  pet_id: string
  user_id: string
  status: "Pending" | "Approved" | "Rejected"
  reason: string | null
  created_at: string
  updated_at: string
  pet?: Pet
}

export type ChatbotFAQ = {
  id: string
  question: string
  answer: string
  category: string | null
  created_at: string
}

export type PetFilters = {
  species?: string
  breed?: string
  minAge?: number
  maxAge?: number
  size?: string
  gender?: string
  isAdopted?: boolean
}
