"use client"

import React from "react"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function Navbar() {
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Browse PGs", href: "/pg" },
    { name: "My Bookings", href: "/bookings" },
    { name: "Support", href: "/support" },
  ]
  const { isAuthenticated, user, logout } = useAuth()
  
  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white border-b border-green-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
          PG<span className="text-black">Stay</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative group text-black font-medium hover:text-green-600 transition-colors"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          ))}

          {/* Profile Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-2 hover:bg-green-50">
                  <User className="h-5 w-5 text-green-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              href="/login" 
              className="bg-green-500 hover:bg-green-600 text-white p-2 px-4 rounded-md transition-colors font-medium"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-green-50">
                <Menu className="h-6 w-6 text-green-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white">
              <div className="flex flex-col gap-6 mt-8 ml-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative group text-black font-medium hover:text-green-600 transition-colors"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                  </Link>
                ))}

                <hr className="my-2 border-green-100" />

                {/* Auth Section */}
                {isAuthenticated ? (
                  <div className="flex flex-col gap-4">
                    <Link href="/account" className="text-black font-medium relative group hover:text-green-600 transition-colors">
                      Profile
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                    </Link>
                    <Link href="/settings" className="text-black font-medium relative group hover:text-green-600 transition-colors">
                      Settings
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="text-black font-medium relative group text-left hover:text-green-600 transition-colors"
                    >
                      Logout
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="bg-green-500 hover:bg-green-600 text-white p-2 px-4 rounded-md w-fit transition-colors font-medium"
                  >
                    Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}