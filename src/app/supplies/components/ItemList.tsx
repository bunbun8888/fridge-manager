// app/supplies/components/ItemList.tsx

'use client'

import ItemCard from './ItemCard'
import { Supply } from '../types'

export default function ItemList({ items }: { items: Supply[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}