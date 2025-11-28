"use client"

import * as React from "react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, PieChart, Pie, Legend, CartesianGrid, LabelList, Label } from "recharts";

const COLORS = [
  "#f07165", // Red
  "#f0b665", // Orange
  "#ffde82", // Yellow
  "#6eeb78", // Green
  "#6ecceb", // Blue
  "#8679f7", // Indigo
  "#bc79f7", // Purple
  "#fa89cf", // Pink
];
function renderBarValueLabel(props: any) {
  const { x, y, width, height, value, index } = props;
  const cx = x + (width || 0) / 2;
  const cy = y + (height || 0) / 2;
  const text = String(value?.display ?? value?.value ?? value ?? "");
  const padding = 6;
  const fontSize = 12;
  const textWidth = Math.min(120, text.length * (fontSize * 0.6) + 8);
  const rectW = textWidth + padding * 2;
  const rectH = fontSize + padding;
  const rectX = cx - rectW / 2;
  const rectY = cy - rectH / 2;
  return (
    <g>
      <rect x={rectX} y={rectY} width={rectW} height={rectH} rx={6} fill="#fff" />
      <text x={cx} y={rectY + rectH / 2 + fontSize / 3} textAnchor="middle" fill="#111827" fontSize={fontSize} fontWeight={600}>{text}</text>
    </g>
  );
}

function renderLegend(props: any) {
  const { payload } = props || {}
  if (!payload || !Array.isArray(payload)) return null
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '8px 0' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: '0 6px', background: 'transparent', borderRadius: 0, boxShadow: 'none', border: 'none', maxWidth: 'min(720px, 100%)' }}>
        {payload.map((p: any, i: number) => (
          <div key={p?.value ?? i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#374151', fontSize: 13, lineHeight: '16px' }}>
            <span style={{ width: 10, height: 10, background: p?.color || p?.payload?.color || '#111827', borderRadius: 3, display: 'inline-block', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }} />
            <span style={{ opacity: 0.95, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 160 }}>{p?.value ?? p?.payload?.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderPieLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, value } = props as any;
  const text = String(value?.display ?? value?.value ?? value ?? "");
  const padding = 6;
  const fontSize = 12;

  // Skip rendering labels for very small slices to avoid overlap
  if (typeof percent === 'number' && percent < 0.04) return null;

  // Compute centroid inside the slice: halfway between inner and outer radius
  const radius = (innerRadius + outerRadius) / 2;
  const RAD = Math.PI / 180;
  const angle = -midAngle * RAD; // Recharts midAngle is in degrees; invert for canvas coords
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);

  const textWidth = Math.min(120, text.length * (fontSize * 0.6) + 8);
  const rectW = textWidth + padding * 2;
  const rectH = fontSize + padding;
  const rectX = x - rectW / 2;
  const rectY = y - rectH / 2;

  return (
    <g>
      <rect x={rectX} y={rectY} width={rectW} height={rectH} rx={6} fill="#fff" />
      <text x={x} y={rectY + rectH / 2 + fontSize / 3} textAnchor="middle" fill="#111827" fontSize={fontSize} fontWeight={600}>{text}</text>
    </g>
  );
}
function toNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function ChartCanvas({ title, children, minHeight }: any) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '14px 0' }}>
      <div style={{ width: '100%', maxWidth: 1100, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 8px 24px rgba(16,24,40,0.04)', border: '1px solid rgba(15,23,42,0.04)' }}>
        {title ? <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 8, textAlign: 'center' }}>{title}</div> : null}
        <div style={{ width: '100%', minHeight }}>{children}</div>
      </div>
    </div>
  );
}

export default function BarChartComponent({ value }: { value: any }) {
  if (!value) return null;
  const {
    chartType,
    presentation,
    lineAreaType,
    bars = [],
    series = [],
    slices = [],
    direction = "vertical",
    showLegend = true,
    aspectRatio = "16:9",
    title,
  } = value;
  const rawType = chartType || (bars && bars.length ? "bar" : "pie");
  const effectiveType = rawType === "pieDonut" ? (presentation || "pie") : rawType === "lineArea" ? (lineAreaType || "line") : rawType;
  const ratioParts = (aspectRatio || "16:10").split(":");
  const aspect = ratioParts.length === 2 ? Number(ratioParts[0]) / Number(ratioParts[1]) : 16 / 9;

  const barData = (bars || []).map((b: any) => ({ label: b.label, value: toNumber(b.value), color: b.color }));
  const pieData = (slices && slices.length ? slices : barData);
  const palette = COLORS;
  if (effectiveType === "bar") {
    if (!bars || bars.length === 0) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for bar chart.</div>;
    }
    const isHorizontal = direction === "horizontal";

    const minHeight = 220;
    return (
      <ChartCanvas title={title} minHeight={minHeight}>
        <ResponsiveContainer width="100%" aspect={aspect}>
          <ReBarChart data={barData} layout={isHorizontal ? "vertical" : "horizontal"}>
            <CartesianGrid stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3 3" />
            {isHorizontal ? (
              <>
                <XAxis type="number" />
                <YAxis dataKey="label" type="category" />
              </>
            ) : (
              <>
                  <XAxis dataKey="label" type="category" padding={{ left: 0, right: 0 }} />
                <YAxis />
              </>
            )}
            <Tooltip />
            {showLegend ? <Legend content={renderLegend} layout="horizontal" verticalAlign="bottom" align="center" /> : null}
            <Bar dataKey="value" radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}> 
              {barData.map((d: any, i: number) => (
                <Cell key={i} fill={d.color || palette[i % palette.length]} />
              ))}
              <LabelList dataKey="value" content={renderBarValueLabel} />
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </ChartCanvas>
    );
  }
  if (effectiveType === "line" || effectiveType === "area") {
    const seriesArr = series || [];
    if (!seriesArr.length) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for line/area chart.</div>;
    }
    const labels = Array.from(new Set(seriesArr.flatMap((s: any) => (s.values || []).map((v: any) => v.label)))) as string[];
    const chartData = labels.map((label) => {
      const item: any = { label };
      seriesArr.forEach((s: any, i: number) => {
        const f = (s.values || []).find((v: any) => v.label === label);
        item[`s${i}`] = toNumber(f?.value);
      });
      return item;
    });
    const minHeight = 240;
    return (
      <ChartCanvas title={title} minHeight={minHeight}>
        <ResponsiveContainer width="100%" aspect={aspect}>
          {effectiveType === "line" ? (
            <LineChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3 3" />
                <XAxis dataKey="label" type="category" interval={0} padding={{ left: 0, right: 0 }} />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                {showLegend ? <Legend content={renderLegend} layout="horizontal" verticalAlign="bottom" align="center" /> : null}
                {(() => {
                    const order = seriesArr.map((_: any, idx: number) => idx).reverse();
                      return order.map((si: number) => {
                    const s = seriesArr[si];
                    return (
                      <Line
                        key={si}
                        name={s?.label || s?.name}
                        type={s?.curve || 'monotone'}
                        dataKey={`s${si}`}
                        stroke={s.color || palette[si % palette.length]}
                        dot={s?.showDots ? { r: 3, stroke: s.color || palette[si % palette.length], strokeWidth: 1, fill: '#fff' } : false}
                        strokeWidth={s?.strokeWidth ?? 2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        isAnimationActive={false}
                      />
                    );
                  });
                })()}
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3 3" />
              <XAxis dataKey="label" type="category" interval={0} padding={{ left: 0, right: 0 }} />
              <YAxis domain={[0, 'dataMax']} />
              <Tooltip />
              {showLegend ? <Legend content={renderLegend} layout="horizontal" verticalAlign="bottom" align="center" /> : null}
              {(() => {
                  const order = seriesArr.map((_: any, idx: number) => idx).reverse();
                    return order.map((si: number) => {
                  const s = seriesArr[si];
                  return (
                      <Area
                      key={si}
                      name={s?.label || s?.name}
                      type={s?.curve || 'monotone'}
                      dataKey={`s${si}`}
                      stroke={s.color || palette[si % palette.length]}
                      fill={s.color || palette[si % palette.length]}
                      fillOpacity={s?.fillOpacity ?? 0.45}
                      strokeWidth={s?.strokeWidth ?? 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      isAnimationActive={false}
                    />
                  );
                });
              })()}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </ChartCanvas>
    );
  }
  if (effectiveType === "pie" || effectiveType === "donut") {
    if (!pieData || !pieData.length) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for pie/donut chart.</div>;
    }
    const isDonut = effectiveType === "donut";
    const pieHeight = 520;
    const outerRadius = 180;
    const innerRadius = isDonut ? 90 : 0;
    const total = (pieData || []).reduce((s: number, x: any) => s + toNumber(x?.value), 0);
    const totalDisplay = typeof total === 'number' ? total.toLocaleString() : String(total);

    return (
      <ChartCanvas title={title} minHeight={pieHeight}>
        <div style={{ position: 'relative', width: '100%' }}>
          <ResponsiveContainer width="100%" height={pieHeight}>
            <PieChart>
              <Tooltip />
              {showLegend ? <Legend content={renderLegend} layout="horizontal" verticalAlign="bottom" align="center" /> : null}
              <Pie
                data={pieData as any}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                label={renderPieLabel}
                labelLine={false}
                paddingAngle={3}
                cornerRadius={8}
                stroke="#ffffff"
                strokeWidth={1}
              >
                {pieData.map((entry: any, i: number) => (
                  <Cell key={entry._key || i} fill={entry.color || palette[i % palette.length]} />
                ))}
                {isDonut ? (
                  <Label
                    position="center"
                    content={(props: any) => {
                      const cx = props.cx ?? (props.viewBox && props.viewBox.x + (props.viewBox.width || 0) / 2) ?? 0;
                      const cy = props.cy ?? (props.viewBox && props.viewBox.y + (props.viewBox.height || 0) / 2) ?? 0;
                      const rectW = 86;
                      const rectH = 36;
                      const rectX = cx - rectW / 2;
                      const rectY = cy - rectH / 2;
                      return (
                        <g>
                          <defs>
                            <filter id="donut-center-shadow" x="-50%" y="-50%" width="200%" height="200%">
                              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#101828" floodOpacity="0.06" />
                            </filter>
                          </defs>
                          <rect x={rectX} y={rectY} width={rectW} height={rectH} rx={10} fill="#fff" stroke="rgba(15,23,42,0.04)" strokeWidth={1} filter="url(#donut-center-shadow)" />
                          <text x={cx} y={rectY + 18} textAnchor="middle" fill="#111827" fontSize={15} fontWeight={700}>{totalDisplay}</text>
                          <text x={cx} y={rectY + 30} textAnchor="middle" fill="#6B7280" fontSize={11}>Total</text>
                        </g>
                      );
                    }}
                  />
                ) : null}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCanvas>
    );
  }

  return null;
}
