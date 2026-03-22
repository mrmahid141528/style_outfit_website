"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-gray-100 z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span
              className="text-3xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              STYLE
            </span>
          </Link>

          {/* Desktop Nav - Elegant Pill Shapes */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/" 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === "/" ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname.includes("/categories") ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === "/about" ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === "/contact" ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Contact Us
            </Link>
            
            {/* Admin icon */}
            <Link href="/admin" className="ml-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors border border-gray-100">
              <span className="sr-only">Admin</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-xl absolute w-full left-0">
          <div className="px-6 pt-4 pb-8 space-y-3 flex flex-col">
            <Link href="/" onClick={() => setIsOpen(false)} className={`px-5 py-3 rounded-2xl text-center font-medium ${pathname === "/" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>Home</Link>
            <Link href="/categories" onClick={() => setIsOpen(false)} className={`px-5 py-3 rounded-2xl text-center font-medium ${pathname.includes("/categories") ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>Categories</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className={`px-5 py-3 rounded-2xl text-center font-medium ${pathname === "/about" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>About Us</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className={`px-5 py-3 rounded-2xl text-center font-medium ${pathname === "/contact" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>Contact Us</Link>
            <Link href="/admin" onClick={() => setIsOpen(false)} className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-500 text-center font-medium mt-6">Admin Panel</Link>
          </div>
        </div>
      )}
    </header>
  );
}
