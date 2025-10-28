'use client'
import { useState, useEffect } from 'react'
import { HiMiniChevronUpDown } from 'react-icons/hi2';
import { useSortData } from '../Hooks/useSortData'
import { useExportExcelData } from '../Hooks/useExportExcelData';
import AttendanceSheetDropdown from './dropdowns/AttendanceSheetDropdown';

export default function EmployeeAttendanceSheet() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { items: sortedData, requestSort, sortConfig } = useSortData(data || [], {
    key: 'Name',
    direction: 'asc'
  })

  const { exportToExcel } = useExportExcelData();
  const rowColors = ['bg-sky-100', 'bg-white'];

  useEffect(() => {
    const fetchEmployeeAttendanceSheet = async () => {
      try {
        const response = await fetch('/api/proxy', {
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
    <div className="text-gray-800 w-full flex flex-col  justify-center max-h-[80vh] mt-2">
      <div className="flex flex-row gap-8 justify-center items-center mb-1 bg-white">
        <AttendanceSheetDropdown/>
        <button
        onClick={() => exportToExcel(sortedData, "EmployeeAttendanceData.xlsx")}
        className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-1 rounded-sm cursor-pointer"
      >
        To Excel
      </button>
      </div>
      
      <div className="w-full border-b border-gray-300  overflow-y-auto overflow-x-auto ">
        <table className="min-w-[900px] border border-gray-300 text-sm">
          <thead className="bg-slate-700  sticky top-0 z-10 text-base text-white">
            <tr>
              <th className="w-[11%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold ">
                Code
              </th>
              <th className=" px-2 lg:px-4 py-2 border border-gray-300 font-semibold cursor-pointer"
                onClick={() => requestSort('Name')}
              >
                <div className="flex flex-row justify-center items-center gap-1 cursor-pointer">
                  Name <HiMiniChevronUpDown size={16} />
                  {sortConfig?.key === 'Name'}
                </div>
              </th>
              <th className="w-[11%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold">Department</th>
              <th className="w-[13%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">Designation</th>
             
              <th className="w-[6%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold"
              onClick={()=> requestSort('inTime')}
              >
                <div className="flex flex-row justify-center items-center gap-1 cursor-pointer">
                  In Time <HiMiniChevronUpDown size={16}/>
                  {sortConfig?.key === 'inTime'}
                </div>
              </th>
              <th className="w-[6%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold"
              onClick={()=> requestSort('OutTime')}
              >
                <div className="flex flex-row justify-center items-center gap-1 cursor-pointer">
                  Out Time <HiMiniChevronUpDown size={16}/>
                  {sortConfig?.key === 'OutTime'}
                </div>
              </th>
              <th className="w-[10%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">Schedule</th>
              <th className="w-[5%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">By Late</th>
              <th className="w-[5%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold">By Early</th>
              <th className="w-[10%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold">Device</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((i, index) => (
              <tr key={index} className={`border-t hover:bg-green-200 cursor-pointer ${rowColors[index % rowColors.length]}`}>
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.code}</td>
                <td className="px-2 lg:px-4 py-2 text-left border border-gray-300 text-sm">{i.Name}</td>
                <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.Department}</td>
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.Designation}</td>
                
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300">{i.inTime}</td>
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300">{i.OutTime}</td>
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.Schedule}</td>
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.ByLate} mins</td>
                <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.ByEarly} mins</td>
                <td className="px-2 lg:px-4 py-2 text-center border border-gray-300">{i.Device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}
