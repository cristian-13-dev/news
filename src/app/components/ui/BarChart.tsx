"use client"

import * as React from 'react'
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList, LineChart, Line, AreaChart, Area, PieChart, Pie, Legend } from 'recharts'

const PALETTES: Record<string, string[]> = {
  default: ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'],
  pastel: ['#A7F3D0', '#FBCFE8', '#C7D2FE', '#FDE68A', '#FECACA', '#E7E6FF'],
  vibrant: ['#FF6238', '#FFB02E', '#7BD389', '#4AA3FF', '#A36BFF', '#FF4FB2'],
  mono: ['#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'],
}

export interface BarChartData {
  label: string
  value: number
  color?: string
}

export interface BarGroup {
  label?: string
  bars: BarChartData[]
}

export interface BarChartValue {
  title?: string
  bars?: BarChartData[]
  groups?: BarGroup[]
  chartType?: 'bar' | 'line' | 'area' | 'pie' | 'donut'
  series?: Array<{
    label?: string
    color?: string
    values?: BarChartData[]
  }>
  slices?: BarChartData[]
  direction?: 'vertical' | 'horizontal'
  presentation?: 'pie' | 'donut'
  aspectRatio?: string
  groupGap?: number
  grid?: {
    show?: boolean
    color?: string
    strokeWidth?: number
    spacing?: number
    opacity?: number
  }
}

export interface BarChartProps {
  value: BarChartValue
}

export const BarChartComponent: React.FC<BarChartProps> = ({ value }) => {
  const {
    title,
    bars = [],
    chartType = 'pie',
    series = [],
    slices = [],
    groups = [],
    direction = 'vertical',
    aspectRatio = '16:10',
    groupGap = 6,
    grid = { show: false, color: '#E5E7EB', strokeWidth: 1, opacity: 0.6 },
  } = value || {}

  // Palette removed from schema; always use default palette
  const colors = PALETTES.default
  const hasGroups = Array.isArray(groups) && groups.length > 0
  // local defaults (legacy fields removed from schema)
  const groupGapDefault = 6

  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    function check() {
      setIsMobile(typeof window !== 'undefined' ? window.innerWidth <= 640 : false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const ratioParts = (aspectRatio || '16:10').split(':')
  const ratio = ratioParts.length === 2 ? Number(ratioParts[1]) / Number(ratioParts[0]) : 0.625
  const paddingTop = `${(ratio * 100).toFixed(2)}%`

  function renderLegend(data: BarChartData[]) {
    if (!data || data.length === 0) return null
    return (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 24 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: '#374151' }}>
            <div style={{ width: 12, height: 12, background: d.color || colors[i % colors.length], borderRadius: 3 }} />
            <div>{d.label}</div>
          </div>
        ))}
      </div>
    )
  }

  function renderValueLabel(props: any) {
    const { x = 0, y = 0, value, index, width = 0, height = 0 } = props
    // center based on bar dimensions
    const cx = x + width / 2
    const cy = y + height / 2
    const text = String(value)
    const w = Math.max(28, text.length * 8)
    const h = 20
    const rx = 6
    const rectX = cx - w / 2
    const rectY = cy - h / 2
    const color = (props.fill || colors[index % colors.length])
    return (
      <g>
        <rect x={rectX} y={rectY} width={w} height={h} rx={rx} fill="#fff" />
        <text x={cx} y={rectY + h / 2} fill={color} fontWeight={700} fontSize={12} textAnchor="middle" dominantBaseline="middle">{text}</text>
      </g>
    )
  }

  function SingleChart({ data, isHorizontal, chartTitle }: { data: BarChartData[]; isHorizontal: boolean; chartTitle?: string }) {
    const layout = isHorizontal ? 'vertical' : 'horizontal'

    // BAR chart
    if (chartType === 'bar') {
      return (
        <>
          <div style={{ position: 'relative', width: '100%', paddingTop }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={data} layout={layout} margin={{ top: 4, right: 12, left: 12, bottom: 24 }} barCategoryGap={'30%'} barGap={8}>
                  {isHorizontal ? (
                    <>
                      <XAxis type="number" />
                      <YAxis dataKey="label" type="category" width={80} />
                    </>
                  ) : (
                    <>
                      <XAxis dataKey="label" type="category" />
                      <YAxis hide />
                    </>
                  )}
                  <Tooltip />
                  {/* grid support removed; legacy `grid` field is ignored */}
                  <Bar dataKey="value" radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}>
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color || colors[i % colors.length]} />
                    ))}
                    <LabelList dataKey="value" content={renderValueLabel} />
                  </Bar>
                  {chartTitle ? <text x="50%" y="99%" textAnchor="middle" fill="#374151" fontWeight={700} fontSize={12}>{chartTitle}</text> : null}
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {isMobile && data && data.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, padding: 10, marginTop: 8, background: '#ffffff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}>
              {data.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#374151', minWidth: 0 }}>
                  <div style={{ width: 12, height: 12, background: d.color || colors[i % colors.length], borderRadius: 3, flex: '0 0 auto' }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )
    }

    // LINE / AREA charts — expect `series` array
    if (chartType === 'line' || chartType === 'area') {
      // build unified data by label
      const allLabels = Array.from(new Set(series.flatMap((s) => (s.values || []).map((v) => v.label))))
      const chartData = allLabels.map((label) => {
        const item: any = { label }
        series.forEach((s, si) => {
          const found = (s.values || []).find((v) => v.label === label)
          item[`s${si}`] = found ? found.value : 0
        })
        return item
      })

      return (
        <div style={{ position: 'relative', width: '100%', paddingTop }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 24 }}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {series.map((s, i) => (
                    <Line key={i} type="monotone" dataKey={`s${i}`} stroke={s.color || colors[i % colors.length]} dot={false} />
                  ))}
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 24 }}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {series.map((s, i) => (
                    <Area key={i} type="monotone" dataKey={`s${i}`} stroke={s.color || colors[i % colors.length]} fill={s.color || colors[i % colors.length]} />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    // PIE / DONUT charts — expect `slices` array
    if (chartType === 'pie' || chartType === 'donut') {
      const pieData = slices || data
      const isDonut = chartType === 'donut' || (value as any)?.presentation === 'donut' || (value as any)?.isDonut
      return (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie data={pieData as any} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={isDonut ? 40 : 0} label />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    }

    return null
  }

  if (hasGroups) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Math.max(4, groupGapDefault) }}>
            {groups.map((g, gi) => {
              const data = (g.bars || []).map((b) => ({ label: b.label, value: b.value, color: b.color }))
              return (
                <div key={gi} style={{ padding: 8, borderRadius: 8 }}>
                  <SingleChart data={data} isHorizontal={direction === 'horizontal'} />
                  {g.label && <div style={{ textAlign: 'center', fontWeight: 600, marginTop: 8 }}>{g.label}</div>}
                </div>
              )
            })}
          </div>
        </div>
        {title && <h3 style={{ textAlign: 'center', marginTop: 12 }}>{title}</h3>}
      </div>
    )
  }

  const data = (bars || []).map((b) => ({ label: b.label, value: b.value, color: b.color }))
  return (
    <div style={{ width: '100%' }}>
      <div style={{ borderRadius: 8, padding: 8, marginTop: 8 }}>
        <SingleChart data={data} isHorizontal={direction === 'horizontal'} chartTitle={title} />
      </div>
    </div>
  )
}
