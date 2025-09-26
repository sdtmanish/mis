'use client'
import { useState, useEffect } from 'react'

export default function TodayLectures() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLecturesData = async () => {
      try {
        const response = await fetch('http://dolphinapi.myportal.co.in/api/TodatLecturers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'APIKey': "Sdt!@#321"
          },
          body: JSON.stringify({
            date: "2025-09-26"
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const lecturesData = await response.json();
        console.log(lecturesData);
        setData(lecturesData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLecturesData();
  }, []);

  return (
    <div className=" max-h-[82vh] overflow-y-auto  text-gray-700 w-full overflow-x-auto p-4">
      <table className=" border-collapse border border-gray-100 w-full text-sm text-left">
        {/* Table Head */}
        <thead className="bg-blue-300 font-semibold sticky top-0 z-10">
          <tr>
            <th className="border border-gray-100 px-4 py-2">Program Semester</th>
            <th className="border border-gray-100 px-4 py-2">Faculty</th>
            <th className="border border-gray-100 px-4 py-2">Course</th>
            <th className="border border-gray-100 px-4 py-2">Course Type</th>
            <th className="border border-gray-100 px-4 py-2 text-center">Group</th>
            <th className="border border-gray-100 px-4 py-2">Period</th>
            <th className="border border-gray-100 px-4 py-2">Attendance Status</th>
            <th className="border border-gray-100 px-4 py-2">Period Start</th>
            <th className="border border-gray-100 px-4 py-2">Period End</th>
            <th className="border border-gray-100 px-4 py-2">Period Status</th>
            <th className="border border-gray-100 px-4 py-2">Engaged To</th>
            <th className="border border-gray-100 px-4 py-2">DPR Status</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((i, index) => (
            <tr key={i.ttcode ?? index} className="hover:bg-gray-100">
              <td className="border border-gray-100 px-4 py-2">{i.course}</td>
              <td className="border border-gray-100 px-4 py-2">{i.Faculty}</td>
              <td className="border border-gray-100 px-4 py-2">{i.subject}</td>
              <td className="border border-gray-100 px-4 py-2">{i.SubjectType}</td>
              <td className="border border-gray-100 px-2 py-2 text-center">{i.GroupName}</td>
              <td className="border border-gray-100 px-4 py-2">{i.Period}</td>
              <td className="border border-gray-100 px-4 py-2">{i.AttendanceMarkedNotMarked}</td>
              <td className="border border-gray-100 px-4 py-2">{i.TS}</td>
              <td className="border border-gray-100 px-4 py-2">{i.TE}</td>
              <td className="border border-gray-100 px-4 py-2">{i.Status}</td>
              <td className="border border-gray-100 px-4 py-2 text-center">{i.Engagedto ?? '-'}</td>
              <td className="border border-gray-100 px-4 py-2">{i.TopicStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
