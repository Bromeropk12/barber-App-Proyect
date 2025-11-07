"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import "./Header-style.css"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY
    const maxScroll = 200
    const newOpacity = Math.min(scrollPosition / maxScroll, 1)
    setHeaderOpacity(newOpacity)

    if (scrollPosition > 0 && !isScrolled) {
      setIsScrolled(true)
    } else if (scrollPosition === 0) {
      setIsScrolled(false)
    }
  }, [isScrolled])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState)
  }, [])

  const navItems = [
    { href: "/", text: "Inicio" },
    { href: "/about", text: "Sobre Nosotros" },
    { href: "/services", text: "Servicios" },
    { href: "/gallery", text: "Galería" },
    { href: "/contact", text: "Contacto" },
  ]

  const handleNavClick = (href: string) => {
    if (href === "/") {
      // Para la página principal, hacer scroll suave al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${headerOpacity})` }}
    >
      <div className="header-content">
        <div className={`logo-container ${isScrolled ? "scrolled" : ""}`}>
          <Link href="/">
            <Image
              src="/ASSETS/material/logo.png"
              alt="Brookings Barber Shop Logo"
              width={140}
              height={140}
              className="logo"
            />
          </Link>
        </div>

        <div className="nav-container">
          <nav className={`desktop-nav ${isScrolled ? "scrolled" : ""}`}>
             {navItems.map((item) => (
               <Link
                 key={item.href}
                 href={item.href}
                 className="nav-link"
                 onClick={() => handleNavClick(item.href)}
               >
                 {item.text}
               </Link>
             ))}
           </nav>
        </div>

        <button className={`menu-toggle ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <nav className="mobile-nav">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-nav-link"
                onClick={toggleMenu}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <span className="nav-decoration"></span>
                <span className="nav-text">{item.text}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

