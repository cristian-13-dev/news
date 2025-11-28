"use client"

import * as React from 'react'
import BarChartComponent from './Chart'

interface ChartWrapperProps {
  value: any
}

export default function ChartWrapper({ value }: ChartWrapperProps) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[ChartWrapper] chart value:', value)
  }, [value])

  const computed = React.useMemo(() => {
    if (!value) return { type: null, data: null };
    // Handle legacy block shape where the block _type may be 'barChart'
    if (value && value._type === 'barChart') {
      if (Array.isArray(value.bars)) {
        return {
          type: 'bars',
          data: (value.bars || []).map((b: any) => ({ label: b.label, value: b.value, color: b.color })),
        };
      }
      if (Array.isArray(value.groups)) {
        return {
          type: 'groups',
          data: value.groups.map((g: any) => ({ label: g.label, bars: (g.bars || []).map((b: any) => ({ label: b.label, value: b.value, color: b.color })) })),
        };
      }
      // If we got here and there are no bars/groups, still return the raw value for inspection
      return { type: 'bars', data: value.bars || [] };
    }

    if (Array.isArray(value.bars)) {
      return {
        type: 'bars',
        data: value.bars.map((b: any) => ({ label: b.label, value: b.value, color: b.color })),
      };
    }
    if (Array.isArray(value.groups)) {
      return {
        type: 'groups',
        data: value.groups.map((g: any) => ({ label: g.label, bars: (g.bars || []).map((b: any) => ({ label: b.label, value: b.value, color: b.color })) })),
      };
    }
    if (Array.isArray(value.series)) {
      const series = value.series as any[];
      const allLabels = Array.from(new Set(series.flatMap((s) => (s.values || []).map((v: any) => v.label))));
      const chartData = allLabels.map((label) => {
        const item: any = { label };
        series.forEach((s, si) => {
          const found = (s.values || []).find((v: any) => v.label === label);
          item[`s${si}`] = found ? found.value : 0;
        });
        return item;
      });
      return { type: 'series', data: { series, chartData } };
    }
    if (Array.isArray(value.slices)) {
      return { type: 'slices', data: value.slices };
    }
    // Support direct { type: 'bars', data: [...] } debug/test input
    if (value && value.type === 'bars' && Array.isArray(value.data)) {
      return {
        type: 'bars',
        data: value.data,
      };
    }
    // If nothing matched, return unknown but include the incoming shape so
    // it's easier to debug in the Studio / browser console.
    return { type: 'unknown', data: value };
  }, [value]);

  const [showDebug, setShowDebug] = React.useState(false)
  const [debugQueryEnabled, setDebugQueryEnabled] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [rect, setRect] = React.useState<any>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('chartDebug') === '1') {
        setDebugQueryEnabled(true)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  React.useEffect(() => {
    if (!debugQueryEnabled) return
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setRect({ width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) })
      // eslint-disable-next-line no-console
      console.log('[ChartWrapper debug] rect', r, 'computed:', computed)
    })
    obs.observe(el)
    // initial
    const r = el.getBoundingClientRect()
    setRect({ width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) })
    return () => obs.disconnect()
  }, [debugQueryEnabled, computed])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#374151' }}>Chart type: {computed.type || '—'}</div>
        <button onClick={() => setShowDebug((s) => !s)} style={{ fontSize: 12 }}>Toggle debug</button>
      </div>
      {showDebug ? (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: 12, borderRadius: 8, marginTop: 8 }}>{JSON.stringify(computed, null, 2)}</pre>
      ) : null}

      <div ref={containerRef} style={{ minHeight: 200, marginTop: 8, position: 'relative', outline: debugQueryEnabled ? '2px dashed magenta' : undefined }}>
        {/* If value is a debug/test { type: 'bars', data: [...] } object, map to BarChartComponent prop shape */}
        {value && value.type === 'bars' && Array.isArray(value.data) ? (
          <BarChartComponent value={{ bars: value.data }} />
        ) : (
          <BarChartComponent value={value} />
        )}
        {debugQueryEnabled ? (
          <div style={{ position: 'absolute', right: 8, top: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 8, borderRadius: 6, fontSize: 12, zIndex: 9999 }}>
            <div><strong>type:</strong> {computed.type}</div>
            <div><strong>rect:</strong> {rect ? `${rect.width}x${rect.height}` : 'measuring...'}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
