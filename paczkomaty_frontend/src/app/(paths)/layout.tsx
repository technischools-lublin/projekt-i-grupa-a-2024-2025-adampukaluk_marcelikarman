import React from "react"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark">
      <body>
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
