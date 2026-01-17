import React from 'react';

interface TableProps {
    headers: string[];
    children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
    return (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50/50">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
