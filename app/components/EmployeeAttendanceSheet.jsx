'use client'
import { useState, useEffect } from 'react'
import { useSortData } from '../Hooks/useSortData';
import { HiMiniChevronUpDown } from 'react-icons/hi2'

export default function EmployeeAttendanceSheet() {
  const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {items:sortedData, requestSort, sortConfig} = useSortData(data  || [], {
      key:'faculty',
      direction:'asc'
    })



  useEffect(() => {
    const fetchEmployeeAttendanceSheet = async () => {
      try {
        const response = await fetch('http://dolphinapi.myportal.co.in/api/EmployeeAttendanceSheet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'APIKey': "Sdt!@#321"
          },
          body: JSON.stringify({ date: "2025-09-27" })
        });

        if (!response.ok) {
          throw new Error(`HTTP error : ${response.status}`);
        }

        const EmployeeAttendanceSheet = await response.json();
        console.log(EmployeeAttendanceSheet);
        setData(EmployeeAttendanceSheet);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeAttendanceSheet();
  }, []);


   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading timetable...
        </div>
      </div>
    );
  }
  return (
<div className="text-gray-800 w-full flex justify-center max-h-[80vh] mt-12 overflow-y-auto overflow-x-auto">
  <div className="w-full border-b border-gray-300">
    <table className="min-w-[900px] border border-gray-300 text-sm">
      <thead className="bg-slate-600  sticky top-0 z-10 text-base text-white">
        <tr>
          <th className="w-[11%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold ">Code</th>
          <th className="w-[10%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold"
           
          >
             <div className="flex flex-row justify-center items-center gap-1 cursor-pointer"
             onClick={() => requestSort('Name')}>
                                     Name <HiMiniChevronUpDown size={16} />
                                      {sortConfig?.key === 'Name'}
                                    </div>
          
          </th>
          <th className="w-[11%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold">
            <div className="flex flex-row justify-center items-center gap-1 cursor-pointer"
             onClick={() => requestSort('Department')}>
                                      Department <HiMiniChevronUpDown size={16} />
                                      {sortConfig?.key === 'Department'}
                                    </div>
          </th>
          <th className="w-[13%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">Designation</th>
          <th className="w-[11%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">Date</th>
          <th className="w-[6%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">In Time</th>
          <th className="w-[6%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">Out Time</th>
          <th className="w-[10%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">Schedule</th>
          <th className="w-[5%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">By Late</th>
          <th className="w-[5%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">By Early</th>
          <th className="w-[10%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold">Device</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((i, index) => (
          <tr key={index} className="border-t hover:bg-green-200 cursor-pointer">
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.code}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.Name}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.Department}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.Designation}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.Attdate}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300">{i.inTime}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300">{i.OutTime}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.Schedule}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.ByLate}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.ByEarly}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300">{i.Device}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  )
}
