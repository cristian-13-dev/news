"use client"

import * as React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, LabelList, LineChart, Line, AreaChart, Area, PieChart, Pie, Legend } from 'recharts'

const PALETTES: Record<string, string[]> = {
  default: ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'],
  pastel: ['#A7F3D0', '#FBCFE8', '#C7D2FE', '#FDE68A', '#FECACA', '#E7E6FF'],
  vibrant: ['#FF6238', '#FFB02E', '#7BD389', '#4AA3FF', '#A36BFF', '#FF4FB2'],
  mono: ['#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'],
}

function hexToRgba(hex: string, opacity = 1) {
  if (!hex) return `rgba(0,0,0,${opacity})`
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export default function BarChartRenderer({value}: {value: any}) {
  const {
    title,
    bars = [],
    groups = [],
    direction = 'vertical',
    palette = 'default',
    aspectRatio = '16:10',
    groupGap = 6,
    grid = { show: false, color: '#E5E7EB', strokeWidth: 1, spacing: 48, opacity: 0.6 },
  } = value || {}

  const colors = PALETTES[palette] || PALETTES.default

  if ((!bars || bars.length === 0) && (!groups || groups.length === 0)) {
    // Show the component name in Studio when there's no data
    return (
      <div style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, textAlign: 'center', color: '#6B7280' }}>
        <div style={{ fontWeight: 700 }}>Bar Chart</div>
      </div>
    )
  }

  // aspect ratio padding-top
  const ratioParts = (aspectRatio || '16:10').split(':')
  const ratio = ratioParts.length === 2 ? (Number(ratioParts[1]) / Number(ratioParts[0])) : 0.625
  const paddingTop = `${(ratio * 100).toFixed(2)}%`

  // grid settings
  const gridColor = grid?.color || '#E5E7EB'
  const gridOpacity = typeof grid?.opacity === 'number' ? grid.opacity : 0.6
  const gridStroke = typeof grid?.strokeWidth === 'number' ? grid.strokeWidth : 1

  // small legend renderer (row)
  function renderLegend(data: any[]) {
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

  // Helper: render a single Recharts BarChart for a bars array
  function renderValueLabel(props: any) {
    // custom SVG label: white rounded rect with colored bold text
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

  function SingleChart({data, isHorizontal, chartTitle}: {data: any[], isHorizontal: boolean, chartTitle?: string}) {
    const layout = isHorizontal ? 'vertical' : 'horizontal'

    // Determine chartType from outer value
    const chartType = (value && (value.chartType || 'pie'))

    if (chartType === 'bar') {
      return (
        <div style={{ position: 'relative', width: '100%', paddingTop }}>
          {renderLegend(data)}
          <div style={{ position: 'absolute', inset: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout={layout} margin={{ top: 4, right: 12, left: 12, bottom: 44 }} barCategoryGap={'30%'} barGap={8}>
                {isHorizontal ? (
                  <>
                    <XAxis type="number" />
                    <YAxis dataKey="label" type="category" width={100} />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="label" type="category" />
                    <YAxis />
                  </>
                )}
                <Tooltip />
                {grid?.show && <CartesianGrid stroke={gridColor} strokeWidth={gridStroke} opacity={gridOpacity} />}
                <Bar dataKey="value" radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color || colors[i % colors.length]} />
                  ))}
                  <LabelList dataKey="value" content={renderValueLabel} />
                </Bar>
                {chartTitle ? <text x="50%" y="99%" textAnchor="middle" fill="#374151" fontWeight={700} fontSize={12}>{chartTitle}</text> : null}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    // LINE / AREA: expect value.series to exist
    if (chartType === 'line' || chartType === 'area') {
      const series = (value && value.series) || []
      const allLabels = Array.from(new Set(series.flatMap((s: any) => (s.values || []).map((v: any) => v.label))))
      const chartData = allLabels.map((label) => {
        const item: any = { label }
        series.forEach((s: any, si: number) => {
          const found = (s.values || []).find((v: any) => v.label === label)
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
                  {series.map((s: any, i: number) => (
                    <Line key={i} type="monotone" dataKey={`s${i}`} stroke={s.color || colors[i % colors.length]} dot={false} />
                  ))}
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 24 }}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {series.map((s: any, i: number) => (
                    <Area key={i} type="monotone" dataKey={`s${i}`} stroke={s.color || colors[i % colors.length]} fill={s.color || colors[i % colors.length]} />
                  ))}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    // PIE / DONUT: expect value.slices or data
    if (chartType === 'pie' || chartType === 'donut') {
      const pieData = (value && value.slices) || data
      const isDonut = chartType === 'donut' || Boolean((value && value.isDonut))
      return (
        <div style={{ position: 'relative', width: '100%', paddingTop }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={pieData as any} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={isDonut ? 40 : 0} label>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }

    return null
  }

  // If groups provided, render one Recharts chart per group (keeps grouping clear)
  if (groups && groups.length > 0) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: Math.max(4, groupGap) }}>
            {groups.map((g: any, gi: number) => {
            const data = (g.bars || []).map((b: any) => ({ label: b.label, value: b.value, color: b.color }))
            return (
              <div style={{ width: '100%' }}>
                <SingleChart data={data} isHorizontal={direction === 'horizontal'} chartTitle={title} />
              </div>
            )
          })}
        </div>
        {title && <div style={{ textAlign: 'center', fontWeight: 700, marginTop: 10 }}>{title}</div>}
      </div>
    )
  }

  // No groups — single chart
  const data = (bars || []).map((b: any) => ({ label: b.label, value: b.value, color: b.color }))
  return (
    <div style={{ width: '100%' }}>
      <SingleChart data={data} isHorizontal={direction === 'horizontal'} />
      {title && <div style={{ textAlign: 'center', fontWeight: 700, marginTop: 10 }}>{title}</div>}
    </div>
  )
}
