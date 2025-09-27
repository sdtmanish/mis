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
    <div className="text-black w-full flex justify-center max-h-[80vh]">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Designation</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">In Time</th>
              <th className="px-4 py-2">Out Time</th>
              <th className="px-4 py-2">Schedule</th>
              <th className="px-4 py-2">By Late (Min)</th>
              <th className="px-4 py-2">By Early (Min)</th>
              <th className="px-4 py-2">Device</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 text-center">{i.code}</td>
                <td className="px-4 py-2 text-center">{i.Name}</td>
                <td className="px-4 py-2 text-center">{i.Department}</td>
                <td className="px-4 py-2 text-center">{i.Designation}</td>
                <td className="px-4 py-2 text-center">{i.date}</td>
                <td className="px-4 py-2 text-center">{i.inTime}</td>
                <td className="px-4 py-2 text-center">{i.OutTime}</td>
                <td className="px-4 py-2 text-center">{i.Schedule}</td>
                <td className="px-4 py-2 text-center">{i.ByLate}</td>
                <td className="px-4 py-2 text-center">{i.ByEarly}</td>
                <td className="px-4 py-2 text-center">{i.Device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
