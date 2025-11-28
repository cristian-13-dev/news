"use client"

import * as React from 'react'
import BarChartComponent from './Chart'

interface ChartWrapperProps {
  value: any
}

export default function ChartWrapper({ value }: ChartWrapperProps) {
  // Chart wrapper: compute a normalized shape for the chart value

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



  return (
    <div>
      <div style={{ marginTop: 8 }}>
        <BarChartComponent value={value} />
      </div>
    </div>
  )
}
