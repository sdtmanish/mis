'use client'
import { useState, useEffect } from 'react'

function processCellData(htmlString) {
  if (!htmlString || htmlString.trim() === '') {
    return { __html: '' };
  }

  // Use a regular expression to split the string by 'Scheduled' 
  // without removing the delimiter itself. This is the key to preventing duplicates.
  const entries = htmlString.split(/(?=Scheduled)/);

  // Filter out any empty strings and normalize content
  const cleanEntries = entries.filter(entry => entry.trim() !== '');

  // Wrap each entry in a div with a bottom margin and remove extra line breaks
  const separatedHtml = cleanEntries.map(entry => {
    // Remove all <br> tags and replace them with a space
    const singleLineEntry = entry.replace(/<br\s*\/?>/gi, ' ');
    // Remove extra whitespace and trim
    const formattedEntry = singleLineEntry.replace(/\s+/g, ' ').trim();
    return `<div class="mb-2">${formattedEntry}</div>`;
  }).join('');

  return { __html: separatedHtml };
}

export default function DailyTimeTable() {
    const [timeTableData, setTimeTableData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://dolphinapi.myportal.co.in/api/DailyTimeTable', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'APIKey': "Sdt!@#321"
                    },
                    body: JSON.stringify({
                        "date": "2025-09-25"
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setTimeTableData(data);
                console.log(data);
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-medium text-gray-600 animate-pulse">Loading timetable...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-medium text-red-500">{error}</div>
            </div>
        );
    }

    if (!timeTableData || timeTableData.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-xl font-medium text-gray-600">No timetable data available for this date.</div>
            </div>
        );
    }

    return (
        <div className=" p-4 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold text-center text-gray-800 mb-4">Daily Time Table</h1>
            
            {/* //desktop/tablet view hidden on mobile */}
            <div className="hidden md:block overflow-x-auto shadow-xl rounded-xl">
                <table className="min-w-full bg-white border-collapse rounded-xl overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <tr className="border-b-2 border-indigo-200">
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">S.No.</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">Course</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">I</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">II</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">III</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">IV</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">V</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">VI</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">VII</th>
                            <th className="py-4 px-6 text-center text-sm font-bold uppercase tracking-wider">VIII</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeTableData.map((item, index) => (
                            <tr 
                                key={index} 
                                className={`
                                    border-b border-gray-200 transition-transform duration-200 ease-in-out
                                    ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                    hover:bg-blue-50 hover:shadow-lg
                                `}>
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200">{item.sno}</td>
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.course)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.I)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.II)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.III)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.IV)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.V)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.VI)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.VII)} />
                                <td className="py-4 px-6 text-sm text-gray-800 border-r border-gray-200" dangerouslySetInnerHTML={processCellData(item.VIII)} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* //mobile view hidden on Desktop */}
            <div className="md:hidden">
                {timeTableData.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md p-4 mb-4 transition-transform transform hover:scale-[1.01] hover:shadow-xl duration-200">
                        <div className="font-bold text-lg mb-2 text-blue-600">Item {item.sno}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="font-medium text-gray-500">Course:</span> <span dangerouslySetInnerHTML={processCellData(item.course)} /></div>
                            <div><span className="font-medium text-gray-500">I:</span> <span dangerouslySetInnerHTML={processCellData(item.I)} /></div>
                            <div><span className="font-medium text-gray-500">II:</span> <span dangerouslySetInnerHTML={processCellData(item.II)} /></div>
                            <div><span className="font-medium text-gray-500">III:</span> <span dangerouslySetInnerHTML={processCellData(item.III)} /></div>
                            <div><span className="font-medium text-gray-500">IV:</span> <span dangerouslySetInnerHTML={processCellData(item.IV)} /></div>
                            <div><span className="font-medium text-gray-500">V:</span> <span dangerouslySetInnerHTML={processCellData(item.V)} /></div>
                            <div><span className="font-medium text-gray-500">VI:</span> <span dangerouslySetInnerHTML={processCellData(item.VI)} /></div>
                            <div><span className="font-medium text-gray-500">VII:</span> <span dangerouslySetInnerHTML={processCellData(item.VII)} /></div>
                            <div><span className="font-medium text-gray-500">VIII:</span> <span dangerouslySetInnerHTML={processCellData(item.VIII)} /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}