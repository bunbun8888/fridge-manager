// src/components/FooterMenu.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FooterMenu() {
  const pathname = usePathname()

  const navItems = [
    { label: 'ホーム', href: '/', icon: '🏠' },
    { label: '一覧', href: '/fridge/items', icon: '📋' },
    { label: '追加', href: '/fridge/items/new', icon: '➕' },
    { label: 'OCR', href: '/fridge/ocr-test', icon: '📷' },
    { label: '設定', href: '/fridge/settings', icon: '⚙️' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <ul className="flex justify-around items-center h-14 text-xs">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex flex-col items-center justify-center ${
                pathname === item.href ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
