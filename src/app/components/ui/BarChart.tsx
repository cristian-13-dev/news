"use client"

import * as React from "react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, PieChart, Pie, Legend, CartesianGrid } from "recharts";

const COLORS = ["#4F46E5", "#06B6D4", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];
function toNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
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
    aspectRatio = "16:10",
    title,
  } = value;
  // Default to 'bar' if bars are present and chartType is missing, otherwise fallback to 'pie'
  const rawType = chartType || (bars && bars.length ? "bar" : "pie");
  const effectiveType = rawType === "pieDonut" ? (presentation || "pie") : rawType === "lineArea" ? (lineAreaType || "line") : rawType;
  const ratioParts = (aspectRatio || "16:10").split(":");
  const aspect = ratioParts.length === 2 ? Number(ratioParts[0]) / Number(ratioParts[1]) : 1.6;

  // Bar data
  const barData = (bars || []).map((b: any) => ({ label: b.label, value: toNumber(b.value), color: b.color }));
  // Pie data
  const pieData = (slices && slices.length ? slices : barData);
  if (effectiveType === "bar") {
    if (!bars || bars.length === 0) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for bar chart.</div>;
    }
    const isHorizontal = direction === "horizontal";
    return (
      <div style={{ width: "100%", minHeight: 200 }}>
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
            <Bar dataKey="value">
              {barData.map((d: any, i: number) => (
                <Cell key={i} fill={d.color || COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      </div>
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
    return (
      <div style={{ width: "100%", minHeight: 200 }}>
        <ResponsiveContainer width="100%" aspect={aspect}>
          {effectiveType === "line" ? (
            <LineChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="#D1D5DB" strokeWidth={1} strokeDasharray="3 3" />
                <XAxis dataKey="label" type="category" interval={0} padding={{ left: 0, right: 0 }} />
                <YAxis domain={[0, 'dataMax']} />
                <Tooltip />
                <Legend />
                {(() => {
                    const order = seriesArr.map((_: any, idx: number) => idx).reverse();
                      return order.map((si: number) => {
                    const s = seriesArr[si];
                    return (
                      <Line
                        key={si}
                        type="monotone"
                        dataKey={`s${si}`}
                        stroke={s.color || COLORS[si % COLORS.length]}
                        dot={false}
                        strokeWidth={2}
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
              <Legend />
              {(() => {
                  const order = seriesArr.map((_: any, idx: number) => idx).reverse();
                    return order.map((si: number) => {
                  const s = seriesArr[si];
                  return (
                    <Area
                      key={si}
                      type="monotone"
                      dataKey={`s${si}`}
                      stroke={s.color || COLORS[si % COLORS.length]}
                      fill={s.color || COLORS[si % COLORS.length]}
                      fillOpacity={0.6}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  );
                });
              })()}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  }
  if (effectiveType === "pie" || effectiveType === "donut") {
    if (!pieData || !pieData.length) {
      return <div style={{ color: '#EF4444', padding: 16 }}>No data for pie/donut chart.</div>;
    }
    const isDonut = effectiveType === "donut";
    // Slightly smaller than the previous very large size but still prominent
    const pieHeight = 520; // reduced fixed height
    const outerRadius = 180;
    const innerRadius = isDonut ? 90 : 0;
    return (
      <div style={{ width: "100%", minHeight: pieHeight }}>
        <ResponsiveContainer width="100%" height={pieHeight}>
          <PieChart>
            <Tooltip />
            <Pie data={pieData as any} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={outerRadius} innerRadius={innerRadius} label>
              {pieData.map((entry: any, i: number) => (
                <Cell key={entry._key || i} fill={entry.color || COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
