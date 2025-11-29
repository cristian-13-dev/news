"use client"

import React, { useEffect, useState } from "react"
import { formatDate, timeAgo } from "@/lib/utils"

interface RelativeTimeProps {
  date?: string
  newThresholdDays?: number
  showBadge?: boolean
}

export default function RelativeTime({ date, newThresholdDays = 3, showBadge = false }: RelativeTimeProps) {
  const [nowTick, setNowTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setNowTick((t) => t + 1), 60_000) // update every minute
    return () => clearInterval(id)
  }, [])

  if (!date) return null

  const ago = timeAgo(date)
  const full = formatDate(date)

  const ms = Date.now() - new Date(date).getTime()
  const isNew = ms >= 0 && ms < newThresholdDays * 24 * 60 * 60 * 1000

  return (
    <div className="flex items-center gap-2">
      <time dateTime={date} title={full} className="text-xs text-black/60">
        {ago}
      </time>
      {showBadge && isNew && (
        <span className="inline-block text-[10px] font-medium text-white bg-black px-2 py-1 rounded">New</span>
      )}
    </div>
  )
}
