'use client'
import { useState, useEffect } from 'react'

export default function TodayLectures() {
  const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


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
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturesData();
  }, []);

    if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading Data...
        </div>
      </div>
    );
  }

  return (
    <div className=" text-gray-800 p-1 mt-8 flex justify-center">
      <div className="max-h-[80vh] w-full overflow-y-auto overflow-x-auto ">
        <table className="border-collapse border border-gray-300  text-sm text-left ">
          {/* Table Head */}
          <thead className="bg-slate-600 text-white text-center text-base sticky top-0 z-10 ">
            <tr>
              <th className="w-[13%]  border border-gray-300 px-2 lg:px-4 py-2">Program Semester</th>
              <th className="w-[9%] border border-gray-300 px-2 lg:px-4 py-2">Faculty</th>
              <th className="w-[13%] border border-gray-300 px-2 lg:px-4 py-2">Course</th>
              <th className="w-[8%]  border border-gray-300 px-2 lg:px-4 py-2">Course Type</th>
              <th className="w-[6%]  border border-gray-300 px-2 lg:px-4 py-2 text-center">Group</th>
              <th className="w-[6%]  border border-gray-300 px-2 lg:px-4 py-2 text-center">Period</th>
              <th className="w-[9%] border border-gray-300 px-2 lg:px-4 py-2">Attendance Status</th>
              <th className="w-[8%]  border border-gray-300 px-2 lg:px-4 py-2">Period Starts</th>
              <th className="w-[8%]  border border-gray-300 px-2 lg:px-4 py-2">Period Ends</th>
              <th className="w-[7%]  border border-gray-300 px-2 lg:px-4 py-2">Period Status</th>
              <th className="w-[7%]  border border-gray-300 px-2 lg:px-4 py-2 ">Engaged To</th>
              <th className="w-[7%]  border border-gray-300 px-2 lg:px-4 py-2">DPR Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {data.map((i, index) => (
              <tr key={i.ttcode ?? index} className="hover:bg-green-200 cursor-pointer ">
                <td className="  border border-gray-300 px-2 lg:px-4 py-2">{i.course}</td>
                <td className=" border border-gray-300 px-2 lg:px-4 py-2">{i.Faculty}</td>
                <td className=" border border-gray-300 px-2 lg:px-4 py-2">{i.subject}</td>
                <td className="  border border-gray-300 px-2 lg:px-4 py-2">{i.SubjectType}</td>
                <td className="border border-gray-300 px-2 lg:px-4 py-2 text-center">{i.GroupName}</td>
                <td className="border border-gray-300 px-2 lg:px-4 py-2 text-center">{i.Period}</td>
                <td className=" border border-gray-300 px-2 lg:px-4 py-2">{i.AttendanceMarkedNotMarked}</td>
                <td className=" border border-gray-300 px-2 lg:px-4 py-2">{i.TS}</td>
                <td className="  border border-gray-300 px-2 lg:px-4 py-2">{i.TE}</td>
                <td className=" border border-gray-300 px-2 lg:px-4 py-2">{i.Status}</td>
                <td className=" border border-gray-300 px-2 lg:px-4 py-2 text-center">{i.Engagedto ?? '-'}</td>
                <td className="  border border-gray-300 px-2 lg:px-4 py-2">{i.TopicStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
