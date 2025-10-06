'use client'
import { useState, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import { HiMiniChevronUpDown } from 'react-icons/hi2'
import { useSortData } from '../Hooks/useSortData'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import UtilizationDropdown from './dropdowns/UtilizationDropdown'

export default function Utilization() {
  const nodeRef = useRef(null)
  const [data, setData] = useState([])
  const [selectedCell, setSelectedCell] = useState(null);
  const [popupData, setPopupData] = useState([])
  const [isOpen, setIsOpen] = useState(false)

//dropdowns states
  const [buildingBlocks, setBuildingBlocks] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [colleges, setColleges]= useState([])
  const [selectedFilters, setSelectedFilters] = useState({
    programType: '',
    college:'',
    block:'',
  })


  const { items: sortedData, requestSort, sortConfig } = useSortData(popupData || [], {
    key: 'faculty',
    direction: 'asc'
  })

  const rowColors = ['bg-sky-100', 'bg-white']

  useEffect(() => {
    const fetchUtilizationDetails = async () => {
      try {

        const apis = [
          {
            name:'utilizationDetails',
            url: 'http://dolphinapi.myportal.co.in/api/ClassRoomUtilisation',
            method: 'POST',
            body: { date: new Date().toISOString().split("T")[0] }
          },
          {
            name: 'programTypes',
            url: 'http://dolphinapi.myportal.co.in/api/Display/listofprogramtypes',
            method: 'GET'
          },
          {
            name:'colleges',
            url: 'http://dolphinapi.myportal.co.in/api/Display/listofcolleges',
            method: 'GET'
          },
          {
            name:'buildingBlocks',
            url: 'http://dolphinapi.myportal.co.in/api/Display/listofblocks',
            method: 'GET'
          }
        ]
         

        //preparing all fetches
        const requests = apis.map(api => {
          const options = {
            method: api.method,
            headers: {
               'Content-Type': 'application/json',
              'APIKey': 'Sdt!@#321',

            }
          }

          if(api.method === 'POST' && api.body){
            options.body = JSON.stringify(api.body);
          }

          return fetch(api.url, options);
        })


        //Run in Parallel 
        const responses = await Promise.all(requests);

       const failed = responses.find(r => !r.ok);
       if(failed) throw new Error(`HTTP Erroor: ${failed.status}`);


       //parsing json for all
       const results = await Promise.all(responses.map(r=> r.json()));

       const dataMap = {};

       apis.forEach((api, index)=>{
        dataMap[api.name] = results[index];
       })
      

        setData(dataMap.utilizationDetails);
        setProgramTypes(dataMap.programTypes);
        setColleges(dataMap.colleges);
        setBuildingBlocks(dataMap.buildingBlocks)

      } catch (err) {
        console.log("Error fetching multiple APIs", err)
      }
    }

    fetchUtilizationDetails()
  }, [])


  // LEFT CHART — Attendance vs Enrolled
  const getStudentAttendanceChartData = (cell) => {
    const present = Number(cell?.TotalPresent || 0);
    const total = Number(cell?.TotalStudents || 0);
    const absent = total - present;

    return [{ name: "Students", present, absent, total }];
  };

  // RIGHT CHART — Attendance vs Room Capacity
  const getClassStrengthChartData = (cell) => {
    const present = Number(cell?.TotalPresent || 0);
    const totalStrength = Number(cell?.TotalClassStrength || 0);

    return [{ name: "Class Strength", present, totalStrength }];
  };


  if (!data || data.length === 0) {
    return (
      <p className="text-black flex justify-center items-center mt-12 ">
        Loading Data...
      </p>
    )
  }

  // 🔹 Days (columns)
  const dayObjects = Array.from(
    new Map(
      data.map((item) => [item.dow, { dow: item.dow, date: new Date(item.ttdate) }])
    ).values()
  )
  dayObjects.sort((a, b) => a.date - b.date)
  const days = dayObjects.map((d) => d.dow)

  // 🔹 Timings (rows)
  const timingsSet = new Map()
  data.forEach((item) => {
    if (!timingsSet.has(item.Timings)) {
      timingsSet.set(item.Timings, item)
    }
  })

  const timings = Array.from(timingsSet.keys()).sort((a, b) => {
    const parseTime = (str) => {
      const match = str.match(/(\d{1,2}):(\d{2})/)
      if (!match) return 0
      const hours = parseInt(match[1], 10)
      const minutes = parseInt(match[2], 10)
      return hours * 60 + minutes
    }
    return parseTime(a) - parseTime(b)
  })

  // 🔹 Pivot structure
  const pivot = {}
  data.forEach((item) => {
    if (!pivot[item.Timings]) pivot[item.Timings] = {}
    pivot[item.Timings][item.dow] = item
  })

  // 🔹 Handle popup fetch
  const handleClick = async (date, periodcode) => {
    try {
      const response = await fetch(
        'http://dolphinapi.myportal.co.in/api/ClassRoomUtilisationstrength',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'APIKey': 'Sdt!@#321',
          },
          body: JSON.stringify({ date, periodcode }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const classStrength = await response.json()
      setPopupData(classStrength)
      setIsOpen(true)
    } catch (err) {
      console.log(err)
    }
  }

  //function for exporting in excelsheet
  const exportToExcel = (data, fileName = "table-data.xlsx") => {

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  }



  return (
    <div className="text-gray-800 flex flex-col justify-center items-center mt-2">

      <UtilizationDropdown  
      programTypes={programTypes}
      colleges={colleges}
      buildingBlocks={buildingBlocks}
      selectedFilters={selectedFilters}
      onFilterChange={setSelectedFilters}

      />


      {/* Main Table */}
      <table className="border border-gray-300 w-[98vw] xl:w-[95vw]  h-[80vh] ">
        <thead className="bg-slate-600 text-white text-lg">
          <tr>
            <th className="border border-slate-400 px-1 py-2 font-bold">S.No</th>
            <th className="border border-gray-300 px-2 py-2 font-bold">Timings</th>
            {days.map((day, i) => (
              <th
                key={i}
                className="border border-gray-300 px-2 py-2 font-bold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timings.map((time, idx) => (
            <tr key={idx}>
              <td className="border border-slate-400 px-2 py-1 text-center text-lg">
                {idx + 1}
              </td>
              <td
                className="border border-slate-400 px-2 py-1 text-base xl:text-lg text-center font-normal"
                dangerouslySetInnerHTML={{ __html: time }}
              />
              {days.map((day, j) => {
                const cell = pivot[time][day];
                return (
                  <td
                    key={j}
                    className={`
              border border-slate-400 px-2 py-1 text-center cursor-pointer font-normal text-2xl 
              hover:bg-green-200
              ${selectedCell === `${time}-${day}` && 'bg-orange-300/50'}
            `}
                    onClick={() => {
                      if (cell) {
                        handleClick(cell.ttdate, cell.periodcode);
                        setSelectedCell(`${time}-${day}`);
                      }
                    }}
                  >
                    {cell ? (
                      <div className="relative w-full h-[60px] flex items-center justify-between bg-transparent p-0.3">

                        {/* LEFT CHART — Present vs Total Students */}
                        <div className="w-[22%] h-full bg-transparent z-55 text-base font-bold">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getStudentAttendanceChartData(cell)}
                              layout="horizontal"
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                            >
                              <XAxis type="category" dataKey="name" hide />
                              <Tooltip />
                              {/* 🟢 Total Students */}
                              <Bar dataKey="total" fill="#14b8a6" />
                              {/* 🔵 Present Students */}
                              <Bar dataKey="present" fill="#0f766e" />
                            </BarChart>
                          </ResponsiveContainer>
                          <p className="text-[10px] 2xl:text-xs font-bold text-lg text-center text-slate-700">Students</p>
                        </div>

                        {/* Center Overlay Text */}
                        <span className="absolute inset-0 flex items-center justify-center text-sm xl:text-lg font-semibold text-black px-1 rounded pointer-events-none">
                          {cell.dis} {Number(cell.dis) === 1 ? "class" : "classes"}
                        </span>

                        {/* RIGHT CHART — Present vs Total Class Strength */}
                        <div className="w-[22%] h-full bg-transparent z-60 text-base font-bold">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={getClassStrengthChartData(cell)}
                              layout="horizontal"
                              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                            >
                              <XAxis type="category" dataKey="name" hide />
                              <Tooltip />
                              {/* 🩶 Total Class Strength */}
                              <Bar dataKey="totalStrength" fill="#94a3b8" />
                              {/* ⚫ Present Students */}
                              <Bar dataKey="present" fill="#334155" />
                            </BarChart>
                          </ResponsiveContainer>
                          <p className="text-[10px] 2xl:text-xs  font-bold text-center text-slate-700">Strength</p>
                        </div>

                      </div>
                    ) : null}


                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>


      </table>

      {/* Popup */}
      {isOpen && popupData && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-99">
          <Draggable handle=".drag-handle" nodeRef={nodeRef}>
            <div
              ref={nodeRef}
              className="bg-white rounded-lg shadow-lg max-w-[80vw] max-h-[70vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="drag-handle flex justify-between items-center px-4 py-2 cursor-move bg-gray-50 border-b border-slate-600">
                <h2 className="text-lg font-medium text-gray-700">
                  Class Strength Details
                </h2>
                <h2 className="text-gray-700">{popupData[0]?.date}</h2>

                <div className=" flex flex-row justify-center items-center gap-2">
                  <button
                    onClick={() => exportToExcel(sortedData, 'UtilizationData.xlsx')}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-1 rounded-sm cursor-pointer"
                  >
                    To Excel
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-800 hover:text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 active:bg-gray-100 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Popup Content */}
              <div className="overflow-y-auto overflow-x-hidden">
                <table className="w-[80vw] table-fixed border border-gray-300 border-t border-collapse">
                  <thead className="bg-slate-600 border-t border-slate-600 text-white sticky top-0 z-20">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold w-1/4 cursor-pointer"
                        onClick={() => requestSort('faculty')}
                      >
                        <div className="flex flex-row justify-center items-center gap-1">
                          Faculty Name <HiMiniChevronUpDown size={16} />
                          {sortConfig?.key === 'faculty'}
                        </div>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold w-2/4 truncate cursor-pointer"
                        onClick={() => requestSort('program')}
                      >
                        <div className="flex flex-row justify-center items-center gap-1">
                          Program Semester <HiMiniChevronUpDown size={16} />
                          {sortConfig?.key == 'program'}
                        </div>
                      </th>
                      <th
                        onClick={() => requestSort('students')}
                        className="border border-gray-300 px-4 py-2 text-center font-semibold w-1/4 cursor-pointer"
                      >
                        <div className="flex flex-row justify-center items-center gap-1">
                          Students <HiMiniChevronUpDown size={16} />
                          {sortConfig?.key === 'students'}
                        </div>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center font-semibold w-1/4">
                        Class Room
                      </th>
                      <th
                        onClick={() => requestSort('AttStatus')}
                        className="border border-gray-300 px-4 py-2 text-center font-semibold w-1/4 cursor-pointer"
                      >
                        <div className="flex flex-row justify-center items-center gap-1">
                          Attendance Status <HiMiniChevronUpDown size={16} />
                          {sortConfig?.key === 'AttStatus'}
                        </div>
                      </th>
                      <th
                        onClick={() => requestSort('Utilisation')}
                        className="border border-gray-300 px-4 py-2 text-center font-semibold w-1/4 cursor-pointer"
                      >
                        <div className="flex flex-row justify-center items-center gap-1">
                          Utilisation <HiMiniChevronUpDown size={16} />
                          {sortConfig?.key === 'Utilisation'}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((i, index) => (
                      <tr
                        key={index}
                        className={`${rowColors[index % rowColors.length]} hover:bg-green-300/50 cursor-pointer transition`}
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
                        <td className="border border-gray-300 px-4 py-2 text-gray-700 text-center">
                          {i.RoomNo}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-700 text-center">
                          {i.AttStatus}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-gray-700 text-center">
                          {i.Utilisation}
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
