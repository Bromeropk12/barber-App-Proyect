"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { LogIn, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import "./Header-style.css"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    // Cargar información del usuario
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState)
  }, [])

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prevState) => !prevState)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      setIsUserMenuOpen(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navItems = [
    { href: "/", text: "Inicio", sectionId: "hero" },
    { href: "/about", text: "Sobre Nosotros", sectionId: "about" },
    { href: "/services", text: "Servicios", sectionId: "services" },
    { href: "/gallery", text: "Galería", sectionId: "gallery" },
    { href: "/contact", text: "Contacto", sectionId: "contact" },
  ]

  const handleNavClick = (href: string, sectionId?: string) => {
    // If we're on the home page, scroll to the section
    if (window.location.pathname === "/") {
      if (href === "/") {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Scroll to section on home page
      const section = document.getElementById(sectionId || href.replace('/', ''))
      if (section) {
        const headerHeight = 80
        const offsetTop = section.offsetTop - headerHeight
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
      }
      return
    }

    // If we're on a different page, navigate to home page and scroll to section
    if (href !== "/") {
      window.location.href = `/#${sectionId || href.replace('/', '')}`
    } else {
      window.location.href = "/"
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
              priority
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
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.href, item.sectionId)
                }}
              >
                {item.text}
              </Link>
            ))}
          </nav>
        </div>

        {/* Área de autenticación */}
        <div className="auth-button-container">
          {!isLoading && !user ? (
            <Link
              href="/auth/login"
              className="header-auth-button"
            >
              <LogIn className="auth-button-icon" />
              Iniciar Sesión
            </Link>
          ) : !isLoading && user ? (
            <div className="user-menu-container">
              <button
                className="user-menu-trigger"
                onClick={toggleUserMenu}
              >
                <div className="user-avatar">
                  {user.profile?.avatar_url ? (
                    <Image
                      src={user.profile.avatar_url}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="avatar-image"
                    />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <span className="user-name">
                  {user.profile?.full_name || user.email?.split('@')[0] || 'Usuario'}
                </span>
                <ChevronDown
                  size={16}
                  className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`}
                />
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-email">{user.email}</span>
                    {user.profile?.role && (
                      <span className="user-role">{user.profile.role}</span>
                    )}
                  </div>
                  
                  <div className="user-dropdown-menu">
                    <Link
                      href="/dashboard"
                      className="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Mi Panel
                    </Link>
                    
                    {user.profile?.role === 'super_admin' && (
                      <Link
                        href="/admin"
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        Administración
                      </Link>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="dropdown-item dropdown-signout"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <button
          className={`menu-toggle ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
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
                onClick={(e) => {
                  e.preventDefault()
                  toggleMenu()
                  handleNavClick(item.href, item.sectionId)
                }}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <span className="nav-decoration"></span>
                <span className="nav-text">{item.text}</span>
              </Link>
            ))}
            
            {/* Auth section en menú móvil */}
            <div className="mobile-auth-section">
              {!isLoading && !user && (
                <Link
                  href="/auth/login"
                  className="mobile-nav-link mobile-auth-link"
                  onClick={toggleMenu}
                >
                  <span className="nav-decoration"></span>
                  <span className="nav-text">
                    <LogIn className="mobile-auth-icon" />
                    Iniciar Sesión
                  </span>
                </Link>
              )}
              
              {!isLoading && user && (
                <>
                  <div className="mobile-user-info">
                    <div className="user-avatar">
                      {user.profile?.avatar_url ? (
                        <Image
                          src={user.profile.avatar_url}
                          alt="Avatar"
                          width={40}
                          height={40}
                          className="avatar-image"
                        />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="user-details">
                      <span className="user-name">
                        {user.profile?.full_name || user.email?.split('@')[0] || 'Usuario'}
                      </span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="mobile-nav-link"
                    onClick={toggleMenu}
                  >
                    <span className="nav-decoration"></span>
                    <span className="nav-text">
                      <Settings size={20} />
                      Mi Panel
                    </span>
                  </Link>
                  
                  {user.profile?.role === 'super_admin' && (
                    <Link
                      href="/admin"
                      className="mobile-nav-link"
                      onClick={toggleMenu}
                    >
                      <span className="nav-decoration"></span>
                      <span className="nav-text">
                        <Settings size={20} />
                        Administración
                      </span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleSignOut()
                      toggleMenu()
                    }}
                    className="mobile-nav-link mobile-signout"
                  >
                    <span className="nav-decoration"></span>
                    <span className="nav-text">
                      <LogOut size={20} />
                      Cerrar Sesión
                    </span>
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

