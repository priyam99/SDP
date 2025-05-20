"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PawPrint, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <PawPrint className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-bold text-emerald-600">Pet Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/pets" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Find a Pet
          </Link>
          <Link href="/report" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Report a Pet
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user.email || ""} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              href="/pets"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Find a Pet
            </Link>
            <Link
              href="/report"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Report a Pet
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={toggleMenu}
            >
              Contact
            </Link>

            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-emerald-600 transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start px-0 hover:bg-transparent hover:text-emerald-600"
                    onClick={() => {
                      signOut()
                      toggleMenu()
                    }}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="ghost"
                    className="justify-start px-0 hover:bg-transparent hover:text-emerald-600"
                    asChild
                  >
                    <Link href="/login" onClick={toggleMenu}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" onClick={toggleMenu}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
