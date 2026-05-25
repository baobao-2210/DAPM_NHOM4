const Table = ({ children, className = '' }) => (
  <div className={`overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white ${className}`}>
    <table className="w-full text-sm">
      {children}
    </table>
  </div>
);

Table.Head = ({ children, className = '' }) => (
  <thead className={`bg-[#F8FAFC] border-b border-[#E2E8F0] ${className}`}>
    {children}
  </thead>
);

Table.HeadCell = ({ children, className = '', align = 'left' }) => (
  <th className={`px-5 py-3.5 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-${align} ${className}`}>
    {children}
  </th>
);

Table.Body = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-[#F1F5F9] ${className}`}>
    {children}
  </tbody>
);

Table.Row = ({ children, className = '', onClick, hoverable = true }) => (
  <tr
    onClick={onClick}
    className={`
      ${hoverable ? 'hover:bg-[#F8FAFC]' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      transition-colors duration-150
      ${className}
    `}
  >
    {children}
  </tr>
);

Table.Cell = ({ children, className = '' }) => (
  <td className={`px-5 py-4 text-[#0F172A] ${className}`}>
    {children}
  </td>
);

export default Table;
