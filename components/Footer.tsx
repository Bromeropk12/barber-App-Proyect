import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="mb-4">&copy; 2025 Brookings Barber Shop. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mb-4">
          <Link href="https://www.facebook.com/profile.php?id=61562333762828">
            <Image src="/ASSETS/material/facebook.png" alt="Facebook" width={40} height={40} />
          </Link>
          <Link href="https://www.instagram.com/brookingsbarber/">
            <Image src="/ASSETS/material/instagram.png" alt="Instagram" width={40} height={40} />
          </Link>
          <Link href="https://www.tiktok.com/@brookingsbarber">
            <Image src="/ASSETS/material/tiktok.png" alt="TikTok" width={40} height={40} />
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

