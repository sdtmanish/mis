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
  const isFirstRender = useRef(true);
  const [loading, setLoading] = useState(false);
  const [weekNotSelected, setWeekNotSelected] = useState(null);


  //dropdowns states
  const [buildingBlocks, setBuildingBlocks] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);
  const [colleges, setColleges] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({
    programtype: '',
    college: '',
    buildingblock: '',
    month: '',
    week: '',
    weekNotSelected: ''
  })


  const { items: sortedData, requestSort, sortConfig } = useSortData(popupData || [], {
    key: 'faculty',
    direction: 'asc'
  })

  const rowColors = ['bg-sky-100', 'bg-white']

  // 🟢 1️⃣ On first mount — load dropdown data + initial unfiltered table
  useEffect(() => {
    const fetchUtilizationDetails = async () => {
      try {
        setLoading(true);

        const [programRes, collegeRes, blockRes] = await Promise.all([
          fetch("http://dolphinapi.myportal.co.in/api/Display/listofprogramtypes", {
            method: "GET",
            headers: { APIKey: "Sdt!@#321" },
          }),
          fetch("http://dolphinapi.myportal.co.in/api/Display/listofcolleges", {
            method: "GET",
            headers: { APIKey: "Sdt!@#321" },
          }),
          fetch("http://dolphinapi.myportal.co.in/api/Display/listofblocks", {
            method: "GET",
            headers: { APIKey: "Sdt!@#321" },
          }),
        ]);

        const [programTypes, colleges, buildingBlocks] = await Promise.all([
          programRes.json(),
          collegeRes.json(),
          blockRes.json(),
        ]);

        setProgramTypes(programTypes);
        setColleges(colleges);
        setBuildingBlocks(buildingBlocks);

        // 🔹 Initial unfiltered data (current date)
        await fetchFilteredUtilization();
      } catch (err) {
        console.log("Error fetching multiple APIs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUtilizationDetails();
  }, []);


  // 🟡 2️⃣ When Month + Week are both selected → fetch filtered data
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const bothSelected =
      selectedFilters.month !== "" && selectedFilters.week !== "";

    const bothEmpty =
      selectedFilters.month === "" && selectedFilters.week === "";

    const week = selectedFilters.month !== "" && selectedFilters.week === ""
    setWeekNotSelected(week);

    setIsOpen(false);
    setSelectedCell(null);
    setPopupData([]);

    if (bothSelected) {
      // ✅ User picked both → fetch filtered data
      fetchFilteredUtilization();
    } else if (bothEmpty) {
      // ✅ User cleared both → fetch unfiltered (default) data
      fetchFilteredUtilization();
    }
  }, [selectedFilters.month, selectedFilters.week]);


  // 🔵 3️⃣ When Program Type / College / Building Block change → always fetch (even when cleared)
  useEffect(() => {
    if (!isFirstRender.current) {
      setIsOpen(false);
      setSelectedCell(null);
      setPopupData([]);

      if (weekNotSelected) return;
      fetchFilteredUtilization();
    }
  }, [
    selectedFilters.college,
    selectedFilters.programtype,
    selectedFilters.buildingblock,
  ]);


  const fetchFilteredUtilization = async () => {
    try {
      setLoading(true);

      // Compute date:
      let computedDate;

      if (selectedFilters.month && selectedFilters.week) {
        computedDate = getDateForMonthWeek(
          Number(selectedFilters.month),
          Number(selectedFilters.week)
        );
      } else {
        // Default to today’s date if no month/week selected
        computedDate = new Date().toISOString().split("T")[0];
      }

      console.log("📅 Using date:", computedDate);

      const body = {
        date: computedDate, // ✅ Always send something valid
        programTypeId: selectedFilters.programtype
          ? Number(selectedFilters.programtype)
          : 0,
        BlockId: selectedFilters.buildingblock
          ? Number(selectedFilters.buildingblock)
          : 0,
        CollegeId: selectedFilters.college
          ? Number(selectedFilters.college)
          : 0,
      };

      const res = await fetch(
        "http://dolphinapi.myportal.co.in/api/ClassRoomUtilisation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "APIKey": "Sdt!@#321",
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      setData(data);
    } catch (err) {
      console.log("Error fetching utilization details:", err);
    } finally {
      setLoading(false);
    }
  };


  //helper function for getting date from month and week
  const getDateForMonthWeek = (month, week) => {

    if (month === "" || week === "") return null;


    const year = new Date().getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);

    const firstMonday = new Date(firstDayOfMonth);
    while (firstMonday.getDay() !== 1) {
      firstMonday.setDate(firstMonday.getDate() + 1);
    }

    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + (week) * 7);

    return targetDate.toISOString().split("T")[0];
  }



  useEffect(() => {
    // Close popup and reset selected cell when filters change
    setIsOpen(false);
    setSelectedCell(null);
    setPopupData([]);
  }, [selectedFilters]);



  // LEFT CHART — Attendance vs Enrolled
  const getStudentAttendanceChartData = (cell) => {
    const total = Number(cell?.TotalStudents || 0);
    const present = Number(cell?.TotalPresent || 0);

    const absent = total - present;

    return [{ name: "Students", total, present, absent, }];
  };

  // RIGHT CHART — Attendance vs Room Capacity
  const getClassStrengthChartData = (cell) => {
    const present = Number(cell?.TotalPresent || 0);
    const totalStrength = Number(cell?.TotalClassStrength || 0);

    return [{ name: "Class Strength", present, totalStrength }];
  };


  if (loading) {
    return (
      <p className="text-black flex justify-center items-center mt-12">
        Loading Data...
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-black flex justify-center items-center mt-12">
        No data available.
      </p>
    );
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
  const handleClick = async (date, periodcode,  BlockId, ProgramTypeid, CollegeId) => {
    try {
      const response = await fetch(
        'http://dolphinapi.myportal.co.in/api/ClassRoomUtilisationstrength',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'APIKey': 'Sdt!@#321',
          },
          body: JSON.stringify({ date, periodcode, BlockId, ProgramTypeid, CollegeId }),
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
        weekNotSelected={weekNotSelected}

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
    ${selectedCell === `${time}-${day}` && "bg-orange-300/50"}
  `}
                    onClick={() => {
                      if (cell) {
                        handleClick(cell.ttdate, cell.periodcode, cell.BlockId, cell.ProgramTypeId, cell.CollegeId);
                        setSelectedCell(`${time}-${day}`);
                      }
                    }}
                  >
                    {cell ? (() => {
                      // 🕓 Extract timing and build Date object
                      const timeMatch = cell.Timings.match(/(\d{1,2}:\d{2})/);
                      const startTime = timeMatch ? timeMatch[1] : "00:00";
                      const classDateTime = new Date(`${cell.ttdate.split("T")[0]}T${startTime}:00`);
                      const now = new Date();

                      // 🧮 Convert values
                      const totalClassStrength = Number(cell.TotalClassStrength);
                      const totalStudents = Number(cell.TotalStudents);
                      const totalPresent = Number(cell.TotalPresent);

                      // 🧭 Determine status
                      let classStatus = "";
                      if (now < classDateTime) {
                        classStatus = "future"; // 🟡 To be held
                      } else if (
                        now >= classDateTime &&
                        totalClassStrength === 0 &&
                        totalStudents === 0 &&
                        totalPresent === 0
                      ) {
                        classStatus = "missed"; // 🔴 Didn’t happen
                      } else if (now >= classDateTime) {
                        classStatus = "completed"; // 🟢 Happened
                      }

                      // 🧩 Render
                      return (
                        <div className="relative w-full min-h-[80px] flex flex-col items-center justify-center bg-transparent p-1">

                          {/* ALWAYS SHOW class count */}
                          <span className="text-base xl:text-lg font-semibold text-black text-center mb-1">
                            
                            {cell.dis} {Number(cell.dis) === 1 ? "class" : "classes"}
                          </span>

                          {/* 🟢 Show charts only if completed */}
                          {classStatus === "completed" && (
                            <div className="w-full flex items-center justify-between mb-1">
                              {/* LEFT CHART — Students */}
                              <div className="w-[22%] h-[45px] bg-transparent z-30">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={getStudentAttendanceChartData(cell)}
                                    layout="horizontal"
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                  >
                                    <XAxis type="category" dataKey="name" hide />
                                    <Tooltip
                                      content={({ payload }) => {
                                        if (!payload || !payload.length) return null;
                                        const total = payload.find(p => p.dataKey === "total")?.value;
                                        const present = payload.find(p => p.dataKey === "present")?.value;
                                        return (
                                          <div className="bg-white border border-gray-300 rounded-md px-2 py-2 text-sm shadow-md w-[150px]">
                                            <p className="font-semibold text-slate-700 mb-1 text-base">Students</p>
                                            <p className="text-teal-600 ">Total: {total}</p>
                                            <p className="text-emerald-700">Present: {present}</p>
                                          </div>
                                        );
                                      }}
                                    />
                                    <Bar dataKey="total" fill="#14b8a6" />
                                    <Bar dataKey="present" fill="#0f766e" />
                                  </BarChart>
                                </ResponsiveContainer>
                                <p className="text-xs">Students</p>
                              </div>

                              {/* RIGHT CHART — Seats */}
                              <div className="w-[22%] h-[45px] bg-transparent z-50 ">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={getClassStrengthChartData(cell)}
                                    layout="horizontal"
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                  >
                                    <XAxis type="category" dataKey="name" hide />
                                    <Tooltip
                                      content={({ payload }) => {
                                        if (!payload || !payload.length) return null;
                                        const totalStrength = payload.find(p => p.dataKey === "totalStrength")?.value;
                                        const present = payload.find(p => p.dataKey === "present")?.value;
                                        return (
                                          <div className="bg-white border border-gray-300 rounded-md px-2 py-2 text-sm shadow-md w-[150px]">
                                            <p className="font-semibold text-slate-700 mb-1 text-base">Seats</p>
                                            <p className="text-gray-500 ">Total: {totalStrength}</p>
                                            <p className="text-slate-700">Occupied: {present}</p>
                                          </div>
                                        );
                                      }}
                                    />
                                    <Bar dataKey="totalStrength" fill="#94a3b8" />
                                    <Bar dataKey="present" fill="#334155" />
                                  </BarChart>
                                </ResponsiveContainer>
                                <p className="text-xs">Seats</p>
                              </div>
                            </div>
                          )}

                          {/* Status line BELOW classes */}
                          {classStatus === "future" && (
                            <p className="text-gray-500 italic text-sm font-medium mt-1 animate-fadeIn">
                              To be held
                            </p>
                          )}
                          {classStatus === "missed" && (
                            <p className="text-red-600 italic text-sm font-medium mt-1 animate-fadeIn">
                              Yet to be updated
                            </p>
                          )}
                        </div>
                      );
                    })() : null}


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
                <h2 className="text-gray-700 text-lg">Total Classes: {popupData.length}</h2>

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
  {i.program
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  }
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
