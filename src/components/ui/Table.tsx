interface TableProps {
  value: {
    rows?: Array<{
      cells?: string[];
    }>;
    caption?: string;
  };
  /** If true, always render desktop variants (useful for previewing on small screens) */
  forceDesktop?: boolean;
}

export function Table({ value, forceDesktop = false }: TableProps) {
  if (!value.rows || value.rows.length === 0) {
    return null;
  }

  const firstRow = value.rows[0];
  const headerRow = firstRow;
  const dataRows = value.rows.slice(1);

  return (
    <div className="my-8">
      {/* Desktop - very simple table */}
      <div
        className={
          forceDesktop
            ? "block overflow-x-auto"
            : "hidden sm:block overflow-x-auto"
        }
      >
        <div className="w-full">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 border border-slate-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-2xl">
            <table
              className="w-full table-auto text-sm border-separate bg-white"
              style={{ borderSpacing: 0, borderCollapse: "separate" }}
            >
              {headerRow && headerRow.cells && (
                <thead className="bg-slate-50/90 backdrop-blur-sm shadow-sm">
                  <tr>
                    {headerRow.cells.map((cell, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`px-6 py-3 text-center text-sm font-semibold text-slate-900 tracking-wide ${index === 0 ? "pr-8" : ""}`}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}

              <tbody>
                {dataRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="group hover:bg-slate-50 transition-colors duration-150"
                  >
                    {row.cells?.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-6 py-4 text-sm align-middle ${cellIndex === 0 ? "text-center font-semibold text-slate-900 border-r border-slate-300 pr-8" : "text-slate-700"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {value.caption && (
              <div className="mt-3 text-center text-xs text-slate-500">
                {value.caption}
              </div>
            )}
          </div>
        </div>
      </div>

      {value.caption && (
        <p className="sm:hidden mb-3 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-400">
          {value.caption}
        </p>
      )}

      {/* Mobile Card View - Hidden on desktop */}
      <div className="sm:hidden space-y-4 px-1.5 mt-2">
        {dataRows.map((row, rowIndex) => (
          <article
            key={rowIndex}
            className="group bg-white border border-neutral-200 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] overflow-hidden transition-all duration-150 hover:shadow-[0_8px_22px_rgba(15,23,42,0.12)] hover:-translate-y-px"
          >
            {/* Card Header - main identifier */}
            <header className="bg-linear-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.12em] mb-0 line-clamp-1">
                  {headerRow?.cells?.[0]}
                </p>
                <p className="text-[15px] font-semibold text-slate-950 truncate text-center">
                  {row.cells?.[0]}
                </p>
              </div>
              {/* subtle affordance icon to the right (kept for affordance) */}
              <div
                className="absolute right-3 top-3 shrink-0 text-slate-300 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </header>

            {/* Card Body - label/value pairs */}
            <div className="px-4 py-3">
              <div className="space-y-3 divide-y divide-slate-100">
                {row.cells?.slice(1).map((cell, cellIndex) => {
                  const label = headerRow?.cells?.[cellIndex + 1];

                  if (!label && !cell) return null;

                  return (
                    <div
                      key={cellIndex}
                      className="flex items-baseline justify-between gap-4 py-2 first:pb-4"
                    >
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.14em] whitespace-nowrap">
                        {label}
                      </span>
                      <span className="text-sm text-slate-900 font-semibold text-right leading-snug wrap-break-word">
                        {cell}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>

      {value.caption && (
        <p className="hidden sm:block mt-4 text-center text-sm text-slate-600">
          {value.caption}
        </p>
      )}
    </div>
  );
}
