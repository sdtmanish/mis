'use client'
import { useState, useEffect } from 'react'
import { HiOutlineLockClosed } from 'react-icons/hi2'
import { MdRunningWithErrors, MdAnalytics } from 'react-icons/md'
import { Clock } from 'lucide-react'
import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function FeedBackNames() {
    const [data, setData] = useState([])
    const [courseData, setCourseData] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const fetchFeedBackNames = async () => {
            try {
                const feedBackNamesRes = await fetch('http://dolphinapi.myportal.co.in/api/ShowFeedbacks', {
                    method: 'POST',
                    headers: {
                        'APIKey': 'Sdt!@#321',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionid: 20 }),
                })

                if (!feedBackNamesRes.ok) throw new Error(`HTTP error ${feedBackNamesRes.status}`)
                const r = await feedBackNamesRes.json()
                setData(r)
            } catch (err) {
                console.log(err)
            }
        }
        fetchFeedBackNames()
    }, [])

    const handleClick = async (Fb_id) => {
        try {
            const fetchCourseData = await fetch('http://dolphinapi.myportal.co.in/api/FeedBackClasses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'APIKey': 'Sdt!@#321',
                },
                body: JSON.stringify({ Fb_id })
            })

            if (!fetchCourseData.ok) throw new Error(`HTTP error ${fetchCourseData.status}`)
            const cData = await fetchCourseData.json()
            setCourseData(cData)
            setSelectedCourse(null) // reset selected course for pie chart
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="flex flex-col gap-2 h-[80vh] justify-start items-center mt-8 w-[90vw] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center bg-green-500/60 p-2 border border-green-400 rounded-t-md font-semibold w-full">
                <div className="w-[10%] text-center">SNo</div>
                <div className="w-[30%] text-center">FBName</div>
                <div className="w-[10%] text-center">Date From</div>
                <div className="w-[10%] text-center">Date To</div>
                <div className="w-[10%] text-center">Total Students</div>
                <div className="w-[10%] text-center">Attempted</div>
                <div className="w-[10%] text-center">Percentage</div>
                <div className="w-[10%] text-center">Status</div>
                <div className="w-[10%] text-center">Action</div>
            </div>

            {/* Rows */}
            {[...data]
                .sort((a, b) => new Date(b.datefrom) - new Date(a.datefrom))
                .slice(0, 6)
                .map((r, i) => {
                    const today = new Date()
                    const dateFrom = new Date(r.datefrom)
                    const dateTo = new Date(r.dateto)

                    let status = ''
                    if (dateTo < today) status = 'Closed'
                    else if (dateFrom > today) status = 'Scheduled'
                    else status = 'Running'

                    return (
                        <div
                            key={i}
                            onClick={() => handleClick(r.Fb_id)}
                            className="flex justify-between items-center bg-green-500/40 p-2 w-full cursor-pointer border border-green-400 hover:bg-green-200  transition-all duration-200"
                        >
                            <div className="w-[10%] text-center">{i + 1}</div>
                            <div className="w-[30%] text-start">{r.FBName}</div>
                            <div className="w-[10%] text-center">{dateFrom.toLocaleDateString('en-GB')}</div>
                            <div className="w-[10%] text-center">{dateTo.toLocaleDateString('en-GB')}</div>
                            <div className="w-[10%] text-center">{r.TotalStudents}</div>
                            <div className="w-[10%] text-center">{r.Attempted}</div>
                            <div className="w-[10%] text-center">
                                {r.TotalStudents ? ((r.Attempted / r.TotalStudents) * 100).toFixed(2) : 0}%
                            </div>
                            <div
                                className={`w-[10%] flex items-center justify-center gap-2 font-semibold ${status === 'Closed'
                                    ? 'text-red-600'
                                    : status === 'Scheduled'
                                        ? 'text-yellow-600'
                                        : 'text-green-600'
                                    }`}
                            >
                                {status === 'Closed' && <HiOutlineLockClosed size={18} />}
                                {status === 'Scheduled' && <Clock size={18} />}
                                {status === 'Running' && <MdRunningWithErrors size={18} />}
                                {status}
                            </div>

                            <div className="w-[10%] flex justify-center">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedCourse(r) }}
                                    className="bg-emerald-500 text-white cursor-pointer font-semibold py-1 px-2 rounded-md shadow-md hover:bg-emerald-600 hover:scale-105 flex items-center justify-center gap-2 transition-all duration-200 active:bg-emerald-400"
                                >
                                    <MdAnalytics size={18} /> Analyze
                                </button>
                            </div>
                        </div>
                    )
                })}

            {/* Course Table + Pie Chart */}
            {courseData.length > 0 && selectedCourse && (
                <div className="mt-6 w-[90vw] h-[300px] bg-green-50 rounded-lg shadow-md flex flex-col md:flex-row p-4 gap-6">
                    {/* Left: Course Table */}
                    {/* Left: Course Table */}
<div className="flex-1 flex flex-col">
  <div className="text-black font-semibold mb-2">FeedBack Id: {selectedCourse.Fb_id}</div>

 {/* Scrollable container */}
<div className="overflow-y-auto max-h-[400px]">
  {/* Header */}
  <div className="w-full grid grid-cols-[5%_25%_20%_15%_15%_20%] text-center bg-emerald-400  font-semibold py-2 rounded-t-md sticky top-0 z-10">
    <p>SNo</p>
    <p>Course</p>
    <p>College</p>
    <p>Total Students</p>
    <p>Attempted</p>
    <p>Percentage</p>
  </div>

  {/* Rows */}
  {courseData.map((c, index) => (
    <div
      key={c.Course + index}
      className="w-full grid grid-cols-[5%_25%_20%_15%_15%_20%] text-center items-center bg-white py-2 border-b border-gray-200 hover:bg-emerald-100 transition-all duration-200"
    >
      <p>{index + 1}</p>
      <p>{c.Course}</p>
      <p>College</p>
      <p>{c.TotalStudents}</p>
      <p>{c.Attempted}</p>
      <p>{c.TotalStudents ? ((c.Attempted / c.TotalStudents) * 100).toFixed(2) : 0}%</p>
    </div>
  ))}
</div>

</div>


                    {/* Right: Pie Chart */}
                    <div className="w-1/3 flex justify-center items-center border border-gray-300 p-2">
                        <Pie
                            data={{
                                labels: ['Attempted', 'Remaining'],
                                datasets: [
                                    {
                                        label: 'Students',
                                        data: [
                                            selectedCourse.Attempted,
                                            selectedCourse.TotalStudents - selectedCourse.Attempted
                                        ],
                                        backgroundColor: ['#10B981', '#ec5934ff'],
                                        borderColor: ['#059669', '#ec5934ff'],
                                        borderWidth: 1,
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'bottom' }
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
