"use client"

import { useContent } from '@/contexts/ContentContext'
import './intro.css';

export default function Intro() {
  const { content } = useContent()

  return (
    <section className="intro-container">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center animate-fade-in">
          {content.intro.title}
        </h2>
        <p className="text-lg text-center animate-slide-in">
          {content.intro.description}
        </p>
      </div>
    </section>
  )
}
