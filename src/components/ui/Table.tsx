interface TableProps {
  value: {
    rows?: Array<{
      cells?: string[]
    }>
    caption?: string
  }
}

export function Table({ value }: TableProps) {
  if (!value.rows || value.rows.length === 0) {
    return null
  }

  const firstRow = value.rows[0]
  const headerRow = firstRow
  const dataRows = value.rows.slice(1)

  return (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
        {headerRow && headerRow.cells && (
          <thead className="bg-gray-50">
            <tr>
              {headerRow.cells.map((cell, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-300 last:border-r-0"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-200 bg-white">
          {dataRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.cells?.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {value.caption && (
        <p className="mt-2 text-center text-sm text-gray-600">
          {value.caption}
        </p>
      )}
    </div>
  )
}
