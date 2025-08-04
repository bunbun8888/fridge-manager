// app/supplies/components/ItemCard.tsx

'use client'

import { Button } from '@/components/ui/button'
import { Minus, ShoppingCart } from 'lucide-react'
import { Supply } from '../types'

export default function ItemCard({ item }: { item: Supply }) {
  return (
    <div className="border p-3 rounded-xl shadow-sm flex justify-between items-center">
      <div className="flex-1">
        <div className="font-medium text-lg">{item.name}</div>
        <div className="text-sm text-muted-foreground">{item.memo}</div>
        <div className="mt-1 text-sm">
          残り：<span className="font-bold">{item.quantity}</span> {item.unit}
        </div>
      </div>

      <div className="flex flex-col space-y-2 items-end ml-4">
        <Button size="icon" variant="outline" className="h-8 w-8">
          <Minus size={16} />
        </Button>
        <Button size="icon" variant="secondary" className="h-8 w-8">
          <ShoppingCart size={16} />
        </Button>
      </div>
    </div>
  )
}
