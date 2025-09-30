'use client'
import { useState, useEffect } from 'react'

export default function EmployeeAttendanceSheet() {
  const [data, setData] = useState([]);

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
      }
    };

    fetchEmployeeAttendanceSheet();
  }, []);

  return (
<div className="text-gray-800 w-full flex justify-center max-h-[80vh] mt-12 overflow-y-auto overflow-x-auto">
  <div className="w-full border-b border-gray-300">
    <table className="min-w-[900px] border border-gray-300 text-sm">
      <thead className="bg-gray-100 sticky top-0 z-10 text-base text-gray-800">
        <tr>
          <th className="w-[11%] px-1 lg:px-2 py-2 border border-gray-300 font-semibold ">Code</th>
          <th className="w-[10%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold">Name</th>
          <th className="w-[11%] px-2 lg:px-4 py-2 border border-gray-300 font-semibold">Department</th>
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
        {data.map((i, index) => (
          <tr key={index} className="border-t hover:bg-green-200 cursor-pointer">
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.code}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.Name}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.Department}</td>
            <td className="px-1 lg:px-2 py-2 text-center border border-gray-300 text-sm">{i.Designation}</td>
            <td className="px-2 lg:px-4 py-2 text-center border border-gray-300 text-sm">{i.date}</td>
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
