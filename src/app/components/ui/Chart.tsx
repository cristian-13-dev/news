"use client"

import * as React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
  Label,
} from "recharts";

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
  const { x, y, width, height, value } = props;
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
  const { payload } = props || {};
  if (!payload || !Array.isArray(payload)) return null;
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
  );
}

function renderPieLabel(props: any, isMobile = false) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, value } = props as any;
  const text = String(value?.display ?? value?.value ?? value ?? "");
  const padding = 6;
  const fontSize = 12;

  // Keep skipping very small slices to avoid overlap
  if (typeof percent === 'number' && percent < 0.04) return null;

  const radius = (innerRadius + outerRadius) / 2;
  const RAD = Math.PI / 180;
  const angle = -midAngle * RAD;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);

  if (isMobile) {
    // On mobile render plain white bold text (no background)
    return (
      <text x={x} y={y + fontSize / 3} textAnchor="middle" fill="#ffffff" fontSize={fontSize} fontWeight={700}>{text}</text>
    );
  }

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

  const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = windowWidth < 640;

  const barData = (bars || []).map((b: any) => ({ label: b.label, value: toNumber(b.value), color: b.color }));
  const pieData = (slices && slices.length ? slices : barData);
  const palette = COLORS;

  function shuffleArray<T>(arr: T[]) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  const shuffledPaletteForBars = React.useMemo(() => shuffleArray(palette), [JSON.stringify(barData.map((d: any) => d.label))]);
  const shuffledPaletteForSeries = React.useMemo(() => shuffleArray(palette), [JSON.stringify((series || []).map((s: any) => s.label))]);
  const shuffledPaletteForPie = React.useMemo(() => shuffleArray(palette), [JSON.stringify(pieData.map((p: any) => p.label))]);

  if (effectiveType === "bar") {
    if (!bars || bars.length === 0) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for bar chart.</div>;
    }
    const isHorizontal = direction === "horizontal";
    const needShuffle = barData.length > 0 && barData.every((d: any) => !d.color);
    const usedPalette = needShuffle ? shuffledPaletteForBars : palette;

    const minHeight = isMobile ? 260 : 220;
    return (
      <ChartCanvas title={title} minHeight={minHeight}>
        <ResponsiveContainer width="100%" aspect={isMobile ? Math.min(aspect, 1.2) : aspect}>
          <ReBarChart data={barData} layout={isHorizontal ? "vertical" : "horizontal"}>
            <CartesianGrid stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3 3" />
            {isHorizontal ? (
              <>
                <XAxis type="number" hide={isMobile} />
                <YAxis dataKey="label" type="category" hide={isMobile} />
              </>
            ) : (
              <>
                <XAxis dataKey="label" type="category" padding={{ left: 0, right: 0 }} hide={isMobile} />
                <YAxis hide={isMobile} />
              </>
            )}
            <Tooltip />
              <Bar dataKey="value" radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}> 
              {barData.map((d: any, i: number) => (
                <Cell key={i} fill={d.color || usedPalette[i % usedPalette.length]} />
              ))}
              <LabelList dataKey="value" content={renderBarValueLabel} />
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
        {showLegend ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
            {renderLegend({ payload: barData.map((d: any, i: number) => ({ value: d.label, color: d.color || palette[i % palette.length], payload: { name: d.label, color: d.color || palette[i % palette.length] } })) })}
          </div>
        ) : null}
      </ChartCanvas>
    );
  }

  if (effectiveType === "line" || effectiveType === "area") {
    const seriesArr = series || [];
    if (!seriesArr.length) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for line/area chart.</div>;
    }
    const needShuffleSeries = seriesArr.length > 0 && seriesArr.every((s: any) => !s.color);
    const usedPaletteSeries = needShuffleSeries ? shuffledPaletteForSeries : palette;
    const labels = Array.from(new Set(seriesArr.flatMap((s: any) => (s.values || []).map((v: any) => v.label)))) as string[];
    const tickInterval = isMobile && labels.length > 4 ? Math.ceil(labels.length / 4) : 0;
    const chartData = labels.map((label) => {
      const item: any = { label };
      seriesArr.forEach((s: any, i: number) => {
        const f = (s.values || []).find((v: any) => v.label === label);
        item[`s${i}`] = toNumber(f?.value);
      });
      return item;
    });

    const minHeight = isMobile ? 200 : 240;
    return (
      <ChartCanvas title={title} minHeight={minHeight}>
        <ResponsiveContainer width="100%" aspect={isMobile ? Math.min(aspect, 1.4) : aspect}>
          {effectiveType === "line" ? (
            <LineChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3 3" />
              <XAxis dataKey="label" type="category" interval={isMobile ? tickInterval : 0} padding={{ left: 0, right: 0 }} tick={{ angle: isMobile ? -45 : 0, textAnchor: isMobile ? 'end' : 'middle', fontSize: isMobile ? 11 : 13 } as any} height={isMobile ? 56 : undefined} />
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
                      stroke={s.color || usedPaletteSeries[si % usedPaletteSeries.length]}
                      dot={s?.showDots ? { r: isMobile ? 2 : 3, stroke: s.color || usedPaletteSeries[si % usedPaletteSeries.length], strokeWidth: 1, fill: '#fff' } : false}
                      strokeWidth={s?.strokeWidth ?? (isMobile ? 1.5 : 2)}
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
              <XAxis dataKey="label" type="category" interval={isMobile ? tickInterval : 0} padding={{ left: 0, right: 0 }} tick={{ angle: isMobile ? -45 : 0, textAnchor: isMobile ? 'end' : 'middle', fontSize: isMobile ? 11 : 13 } as any} height={isMobile ? 56 : undefined} />
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
                      stroke={s.color || usedPaletteSeries[si % usedPaletteSeries.length]}
                      fill={s.color || usedPaletteSeries[si % usedPaletteSeries.length]}
                      fillOpacity={s?.fillOpacity ?? 0.45}
                      strokeWidth={s?.strokeWidth ?? (isMobile ? 1.5 : 2)}
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
    // Reduce pie/donut canvas size to better fit mobile and avoid excessive whitespace
    const pieHeight = isMobile ? 240 : 380;
    const outerRadius = isMobile ? 80 : 140;
    const innerRadius = isDonut ? (isMobile ? 48 : 84) : 0;
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
                label={(p: any) => renderPieLabel(p, isMobile)}
                labelLine={false}
                paddingAngle={3}
                cornerRadius={8}
                stroke="#ffffff"
                strokeWidth={1}
              >
                {(() => {
                  const needShufflePie = pieData.length > 0 && pieData.every((p: any) => !p.color);
                  const usedPalettePie = needShufflePie ? shuffledPaletteForPie : palette;
                  return pieData.map((entry: any, i: number) => (
                    <Cell key={entry._key || i} fill={entry.color || usedPalettePie[i % usedPalettePie.length]} />
                  ));
                })()}
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
