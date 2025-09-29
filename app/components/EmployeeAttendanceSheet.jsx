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
    <div className="text-gray-600 w-full flex justify-center max-h-[80vh] mt-12">
      <div className="max-w-[80vw] overflow-x-auto border-b border-t border-gray-300">
        <table className="border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 border border-gray-300  font-semibold  ">Code</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">Name</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">Department</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">Designation</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">Date</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">In Time</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold">Out Time</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">Schedule</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">By Late (Min)</th>
              <th className="px-4 py-2 border border-gray-300  font-semibold ">By Early (Min)</th>
              <th className="px-4 py-2 border border-gray-300 font-semibold ">Device</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i, index) => (
              <tr key={index} className="border-t hover:bg-green-200 cursor-pointer">
                <td className="px-4 py-2 text-center border border-gray-300">{i.code}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.Name}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.Department}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.Designation}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.date}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.inTime}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.OutTime}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.Schedule}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.ByLate}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.ByEarly}</td>
                <td className="px-4 py-2 text-center border border-gray-300">{i.Device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
