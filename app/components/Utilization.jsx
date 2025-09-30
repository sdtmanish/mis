'use client'
import { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'


export default function Utilization() {
    const nodeRef = useRef(null)   // ✅ add ref
    const [data, setData] = useState([]);
    const [popupData, setPopupData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        const fetchUtilizationDetails = async () => {

            try {

                const response = await fetch('http://dolphinapi.myportal.co.in/api/ClassRoomUtilisation', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'APIKey': "Sdt!@#321"
                    },
                    body: JSON.stringify({
                        "date": "2025-09-29"
                    })

                })

                if (!response.ok) {
                    throw new Error(`HTTP  Error : ${response.status} `)
                }

                const utilizationDetails = await response.json();
                console.log(utilizationDetails);
                setData(utilizationDetails)



            } catch (err) {
                console.log(err);
                ;
            }

        }

        fetchUtilizationDetails();

    }, [])


    if (!data || data.length === 0) {
        return <p className="text-black flex justify-center items-center mt-12 ">Loading...</p>
    }

    //getting unique days(columns) and sort them
    const dayObjects = Array.from(
        new Map(
            data.map(item => [item.dow, { dow: item.dow, date: new Date(item.ttdate) }])
        ).values()
    );
    dayObjects.sort((a, b) => a.date - b.date);
    const days = dayObjects.map(d => d.dow);

    //getting unique timings(rows) and sort them by start time
    const timingsSet = new Map();
    data.forEach(item => {
        if (!timingsSet.has(item.Timings)) {
            timingsSet.set(item.Timings, item);
        }
    });

    const timings = Array.from(timingsSet.keys()).sort((a, b) => {
        const parseTime = (str) => {
            const match = str.match(/(\d{1,2}):(\d{2})/); // match HH:MM
            if (!match) return 0;
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);
            return hours * 60 + minutes;
        };

        return parseTime(a) - parseTime(b);
    });

    // pivot structure (store full item, not just dis)
    const pivot = {};
    data.forEach((item) => {
        if (!pivot[item.Timings]) pivot[item.Timings] = {};
        pivot[item.Timings][item.dow] = item;  // save whole item
    });


    const handleClick = async (date, periodcode) => {

        try {

            const response = await fetch('http://dolphinapi.myportal.co.in/api/ClassRoomUtilisationstrength', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'APIKey': "Sdt!@#321"
                },
                body: JSON.stringify({

                    date: date,
                    periodcode: periodcode

                })


            })

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const classStrength = await response.json();
            console.log("Class Strength Response:", classStrength);

            setPopupData(classStrength);
            setIsOpen(true);

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="text-black flex justify-center mt-12">
            <table className="border border-gray-300 w-[90vw] lg:w-[90vw] h-[80vh] ">
                <thead className="bg-gray-100">
                    <tr >
                        <th className="border border-gray-300 px-2 py-3 font-light">S.No</th>
                        <th className="border border-gray-300 px-2 py-3 font-light">Timings</th>
                        {days.map((day, i) => (
                            <th key={i} className="border border-gray-300 px-2 py-3 font-medium">{day}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {timings.map((time, idx) => (
                        <tr key={idx}>
                            <td className="border border-gray-300 px-2 py-1">{idx + 1}</td>
                            <td
                                className="border border-gray-300 px-2 py-1"
                                dangerouslySetInnerHTML={{ __html: time }}
                            />
                            {days.map((day, j) => {
                                const cell = pivot[time][day];
                                return (
                                    <td
                                        key={j}
                                        className="border border-gray-300 px-2 py-1 text-center cursor-pointer hover:bg-green-200 active:bg-green-200"
                                        onClick={() => cell && handleClick(cell.ttdate, cell.periodcode)}
                                    >
                                        {cell ? cell.dis : ''}
                                    </td>
                                );
                            })}

                        </tr>
                    ))}
                </tbody>
            </table>


          {isOpen && popupData && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <Draggable handle=".drag-handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef} // ✅ pass ref here
        className="bg-white rounded-lg shadow-lg max-w-[80vw] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="drag-handle flex justify-between items-center px-4 py-2 cursor-move bg-gray-50 border-b border-gray-300">
          <h2 className="text-lg font-medium text-gray-700">
            Class Strength Details
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-800 hover:text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 active:bg-gray-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto overflow-x-hidden">
          <table className="w-[80vw] table-fixed border border-gray-300 border-t-0 border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-1/4">
                  Faculty
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 w-2/4 truncate">
                  Program
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 w-1/4">
                  Students
                </th>
              </tr>
            </thead>
            <tbody>
              {popupData.map((i, index) => (
                <tr
                  key={index}
                  className="hover:bg-green-300/50 cursor-pointer transition"
                >
                  <td className="border border-gray-300 px-4 py-2 text-left text-gray-700">
                    {i.faculty}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700 truncate">
                    {i.program}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-700 text-center">
                    {i.students}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Draggable>
  </div>
)}


        </div>
    )

}