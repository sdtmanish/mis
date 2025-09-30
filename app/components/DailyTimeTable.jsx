'use client'
import { useState, useEffect } from 'react'

function processCellData(htmlString) {
  if (!htmlString || htmlString.trim() === '') {
    return { __html: '' };
  }

  // Split string by "Scheduled" but keep the delimiter
  const entries = htmlString.split(/(?=Scheduled)/);

  // Filter and normalize
  const cleanEntries = entries.filter(entry => entry.trim() !== '');

  // Wrap each entry in <div>, clean <br>
  const separatedHtml = cleanEntries
    .map(entry => {
      const singleLineEntry = entry.replace(/<br\s*\/?>/gi, ' ');
      const formattedEntry = singleLineEntry.replace(/\s+/g, ' ').trim();
      return `<div class="mb-2">${formattedEntry}</div>`;
    })
    .join('');

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
          body: JSON.stringify({ date: "2025-09-25" })
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
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading timetable...
        </div>
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
        <div className="text-xl font-medium text-gray-600">
          No timetable data available for this date.
        </div>
      </div>
    );
  }

  return (
  <div className="p-4  flex justify-center mt-8">
    <div className="max-w-[96vw]   lg:max-w-[90vw] border-b border-t border-gray-300 ">

      {/* Desktop / tablet view */}
      <div className="hidden md:block  overflow-y-auto max-h-[80vh] ">
        <table className="w-full bg-white border-collapse rounded-xl">
          <thead className="bg-gray-100  text-gray-700 sticky top-0 z-10 ">
            <tr className="border-b-2 border-indigo-200">
              <th className="px-2 py-2 lg:py-4 lg:px-6 text-center text-sm font-bold uppercase tracking-wider border border-gray-300 text-gray-600">
                S.No.
              </th>
              <th className="px-2 py-2 lg:py-4 lg:px-6 text-center text-sm font-bold uppercase tracking-wider border border-gray-300 text-gray-600">
                Course
              </th>
              {["I","II","III","IV","V","VI","VII","VIII"].map((sem) => (
                <th
                  key={sem}
                  className="px-2 py-2 lg:py-4 lg:px-6 text-center text-sm text-gray-600 font-bold uppercase tracking-wider border border-gray-300"
                >
                  {sem}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeTableData.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-200 transition-transform duration-200 ease-in-out ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-200 cursor-pointer hover:shadow-lg`}
              >
                <td className=" lg:py-4 lg:px-6 text-sm text-gray-800 border border-gray-300 text-center">
                  {item.sno}
                </td>
                <td
                  className="lg:py-4 lg:px-6 text-sm text-gray-800 border border-gray-300"
                  dangerouslySetInnerHTML={processCellData(item.course)}
                ></td>
                {[item.I, item.II, item.III, item.IV, item.V, item.VI, item.VII, item.VIII].map(
                  (val, i) => (
                    <td
                      key={i}
                      className="lg:py-4 lg:px-6 text-sm text-gray-800 border border-gray-300 text-center"
                      dangerouslySetInnerHTML={processCellData(val)}
                    ></td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {timeTableData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 mb-4 transition-transform transform hover:scale-[1.01] hover:shadow-xl duration-200"
          >
            <div className="font-bold text-lg mb-2 text-blue-600">
              Item {item.sno}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-500">Course:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.course)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">I:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.I)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">II:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.II)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">III:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.III)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">IV:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.IV)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">V:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.V)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">VI:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.VI)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">VII:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.VII)}></span>
              </div>
              <div>
                <span className="font-medium text-gray-500">VIII:</span>{" "}
                <span dangerouslySetInnerHTML={processCellData(item.VIII)}></span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
);

}
