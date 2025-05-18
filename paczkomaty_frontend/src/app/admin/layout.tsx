import React from "react"
import AdminNavBar from "@/components/AdminNavBar"
import Footer from "@/components/Footer"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark">
      <body className={`dark:bg-gray-900`}>
        <AdminNavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
