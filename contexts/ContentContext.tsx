"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BarberShopData, ContentUpdate } from '@/types/content'
import { contentManager } from '@/lib/content-manager'

interface ContentContextType {
  content: BarberShopData
  updateContent: (update: ContentUpdate) => void
  isLoading: boolean
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<BarberShopData>(contentManager.getContent())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar contenido inicial
    setContent(contentManager.getContent())
    setIsLoading(false)
  }, [])

  const updateContent = (update: ContentUpdate) => {
    contentManager.updateContent(update)
    setContent(contentManager.getContent())
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, isLoading }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}