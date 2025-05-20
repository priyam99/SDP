import { Card, CardContent } from "@/components/ui/card"
import { PawPrint, Heart, Users, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About PawFinder</h1>

        <div className="mb-12">
          <p className="text-lg text-gray-700 mb-4">
            PawFinder is a dedicated platform connecting loving homes with pets in need of adoption. Our mission is to
            reduce the number of homeless pets and ensure every animal finds a caring forever home.
          </p>
          <p className="text-lg text-gray-700">
            Founded in 2023, we've already helped hundreds of pets find their perfect match. We work closely with
            shelters, rescue organizations, and individuals to provide a comprehensive platform for pet adoption.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compassion</h3>
              <p className="text-gray-600">
                We believe every animal deserves love, care, and a safe home. Our platform is built on compassion for
                all creatures.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                We foster a community of pet lovers who share knowledge, resources, and support to ensure the best
                outcomes for pets.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Responsibility</h3>
              <p className="text-gray-600">
                We promote responsible pet ownership through education and thorough adoption processes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 p-3 rounded-full mb-4">
                <PawPrint className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advocacy</h3>
              <p className="text-gray-600">
                We advocate for animal welfare and work to reduce pet homelessness through our platform and
                partnerships.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: "Priyam",
              role: "Founder & CEO",
              bio: "Animal lover with 10+ years in animal rescue and welfare.",
              avatar: "/placeholder.svg?height=150&width=150",
            },
            {
              name: "Sam Rodriguez",
              role: "Head of Operations",
              bio: "Former shelter manager with a passion for connecting pets with loving homes.",
              avatar: "/placeholder.svg?height=150&width=150",
            },
            {
              name: "Taylor Kim",
              role: "Community Manager",
              bio: "Dedicated to building a supportive community of pet adopters and advocates.",
              avatar: "/placeholder.svg?height=150&width=150",
            },
            {
              name: "Taylor Kim",
              role: "Community Manager",
              bio: "Dedicated to building a supportive community of pet adopters and advocates.",
              avatar: "/placeholder.svg?height=150&width=150",
            },
            
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg text-gray-700 mb-6">
            Whether you're looking to adopt, report a pet in need, or support our cause, we welcome you to the PawFinder
            community.
          </p>
          <p className="text-gray-600">
            Together, we can make a difference in the lives of pets and the people who love them.
          </p>
        </div>
      </div>
    </div>
  )
}
