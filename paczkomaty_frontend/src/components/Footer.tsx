'use client'

import Link from "next/link"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div>
            <motion.h3 
              className="text-xl font-semibold mb-4 text-white"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              PackSmart
            </motion.h3>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nowoczesny system paczkomatów dla szybkiej i wygodnej wysyłki.
            </motion.p>
          </div>
          
          {[
            {
              title: "Informacje",
              links: [
                { href: "/about", text: "O nas" },
                { href: "/contact", text: "Kontakt" },
                { href: "/career", text: "Kariera" }
              ]
            },
            {
              title: "Pomoc",
              links: [
                { href: "/faq", text: "FAQ" },
                { href: "/support", text: "Wsparcie" },
                { href: "/terms", text: "Warunki" }
              ]
            }
          ].map((section, sectionIndex) => (
            <div key={section.title}>
              <motion.h4 
                className="font-medium mb-4 text-gray-200"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * sectionIndex }}
                viewport={{ once: true }}
              >
                {section.title}
              </motion.h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.2 + (0.1 * linkIndex) + (0.2 * sectionIndex) 
                    }}
                    viewport={{ once: true }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <motion.h4 
              className="font-medium mb-4 text-gray-200"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Kontakt
            </motion.h4>
            <motion.address 
              className="not-italic text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p>ul. Kurierska 45</p>
              <p>00-001 Warszawa</p>
              <p className="mt-2">kontakt@packsmart.pl</p>
              <p>+48 123 456 789</p>
            </motion.address>
          </div>
        </motion.div>
        
        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} PackSmart. Wszelkie prawa zastrzeżone.</p>
        </motion.div>
      </div>
    </footer>
  )
} 