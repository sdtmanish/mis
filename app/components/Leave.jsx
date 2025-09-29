'use client'
import { useState, useEffect } from 'react';

export default function Leave() {
  const [data, setData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await fetch('http://dolphinapi.myportal.co.in/api/EmployeeLeaveDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'APIKey': "Sdt!@#321"
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const leaveDetails = await response.json();
        console.log(leaveDetails);

        // Pivot transformation
        const result = {};
        const leaveTypeSet = new Set();

        leaveDetails.forEach(item => {
          const key = item.EmployeeCode;

          if (!result[key]) {
            result[key] = {
              Name: item.Name,
              EmployeeCode: item.EmployeeCode,
              WorkedDays: item.WorkedDays
            };
          }

          result[key][item.LeaveDescription] = item.Leaves;
          leaveTypeSet.add(item.LeaveDescription);
        });

        setData(Object.values(result));
        setLeaveTypes([...leaveTypeSet]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLeave();
  }, []);

  return (
    <div className="p-4 overflow-x-auto text-gray-700 mt-8 flex justify-center">
      {/* scroll container */}
      <div className="max-h-[80vh] w-[80vw] overflow-y-auto ">
        <table className="table-auto border-collapse w-full text-sm">
          <thead className="bg-gray-100 font-semibold sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2">Employee Code</th>
              <th className="border border-gray-300 px-4 py-2">Worked Days</th>
              {leaveTypes.map(type => (
                <th key={type} className="border border-gray-300 px-4 py-2">
                  {type}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((emp, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{emp.Name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{emp.EmployeeCode}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{emp.WorkedDays}</td>
                {leaveTypes.map(type => (
                  <td key={type} className="border border-gray-300 px-4 py-2 text-center">
                    {emp[type] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
