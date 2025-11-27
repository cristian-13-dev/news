"use client"

import * as React from 'react'
import BarChartComponent from './BarChart'

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
    return { type: 'unknown', data: value };
  }, [value]);

  const [showDebug, setShowDebug] = React.useState(false)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#374151' }}>Chart type: {computed.type || '—'}</div>
        <button onClick={() => setShowDebug((s) => !s)} style={{ fontSize: 12 }}>Toggle debug</button>
      </div>
      {showDebug ? (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: 12, borderRadius: 8, marginTop: 8 }}>{JSON.stringify(computed, null, 2)}</pre>
      ) : null}

      <div style={{ minHeight: 200, marginTop: 8 }}>
        {/* If value is a debug/test { type: 'bars', data: [...] } object, map to BarChartComponent prop shape */}
        {value && value.type === 'bars' && Array.isArray(value.data) ? (
          <BarChartComponent value={{ bars: value.data }} />
        ) : (
          <BarChartComponent value={value} />
        )}
      </div>
    </div>
  )
}
