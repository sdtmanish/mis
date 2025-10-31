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
import FeedBackFacultyProfiles from './FeebBackFacultyProfiles'
import FeedbackNameDropdown from '../dropdowns/FeedbackNameDropdown'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function FeedBackNames() {
  const [data, setData] = useState([])
  const [courseData, setCourseData] = useState([])
  const [selectedFbId, setSelectedFbId] = useState(null)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [photoData, setPhotoData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sessionDropDownData, setSessionDropDownData] = useState(null)
  const [selectedSessionId, setSelectedSessionId] = useState(25) // Default session ID

  // ✅ Fetch feedback names dynamically
  const fetchFeedBackNames = async (sessionId) => {
    setLoading(true)
    try {
      const feedbackRes = await fetch('http://dolphinapi.myportal.co.in/api/ShowFeedbacks', {
        method: 'POST',
        headers: {
          'APIKey': 'Sdt!@#321',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionid: Number(sessionId) }),
      })

      const feedbackNames = await feedbackRes.json()
      setData(feedbackNames)

      if (feedbackNames?.length > 0) {
        const sorted = [...feedbackNames].sort(
          (a, b) => new Date(b.datefrom) - new Date(a.datefrom)
        )
        const firstFeedback = sorted[0]

        if (firstFeedback) {
          setSelectedFeedback(firstFeedback)
          await fetchCourseDetails(firstFeedback.Fb_id)
        }
      }
    } catch (err) {
      console.error('Error fetching feedback names:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch available sessions once on mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionDropdownRes = await fetch(
          'http://dolphinapi.myportal.co.in/api/FeedBackSession',
          {
            method: 'POST',
            headers: {
              'APIKey': 'Sdt!@#321',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          }
        )
        const sessions = await sessionDropdownRes.json()
        setSessionDropDownData(sessions)
      } catch (err) {
        console.error('Error fetching sessions:', err)
      }
    }

    fetchSessions()
    fetchFeedBackNames(selectedSessionId) // ✅ initial fetch
  }, [])

  // ✅ Called when session changes from dropdown
  const handleSessionChange = async (sessionId) => {
    console.log('Session selected in parent:', sessionId)
    setSelectedSessionId(sessionId)
    await fetchFeedBackNames(sessionId)
  }

  // ✅ Fetch course details for specific feedback
  const fetchCourseDetails = async (Fb_id) => {
    try {
      const fetchCourseData = await fetch('http://dolphinapi.myportal.co.in/api/FeedBackClasses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'APIKey': 'Sdt!@#321',
        },
        body: JSON.stringify({ Fb_id }),
      })

      if (!fetchCourseData.ok) throw new Error(`HTTP error ${fetchCourseData.status}`)

      const cData = await fetchCourseData.json()
      setCourseData(cData)
      setSelectedFbId(Fb_id)
    } catch (err) {
      console.log('Error fetching course details:', err)
    }
  }

  // ✅ Row click handler
  const handleClick = async (Fb_id) => {
    if (selectedFbId !== Fb_id) {
      const fbRow = data.find(d => d.Fb_id === Fb_id)
      setSelectedFeedback(fbRow)
      fetchCourseDetails(Fb_id)
    }
  }

  // ✅ Analyze button handler
  const handleAnalyze = async (Fb_id) => {
    try {
      const fetchPhotos = await fetch('http://dolphinapi.myportal.co.in/api/FeedbackEmployeeWithPhoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'APIKey': 'Sdt!@#321',
        },
        body: JSON.stringify({ Fb_id }),
      })

      if (!fetchPhotos.ok) throw new Error(`HTTP error ${fetchPhotos.status}`)

      const fpData = await fetchPhotos.json()
      setPhotoData(fpData)

      if (Array.isArray(fpData) && fpData.length > 0) {
        const summaryMap = fpData.reduce((acc, item) => {
          acc[item.e_Code] = {
            totalstudents: item.totalstudents || 0,
            attempted: item.attempted || 0,
          }
          return acc
        }, {})

        localStorage.removeItem(`feedback_summary_${Fb_id}`)
        localStorage.setItem(
          `feedback_summary_${Fb_id}`,
          JSON.stringify(summaryMap)
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getSummary = (dataArr) => {
    const totalStudents = dataArr?.reduce((sum, c) => sum + c.TotalStudents, 0)
    const totalAttempted = dataArr?.reduce((sum, c) => sum + c.Attempted, 0)
    return { totalStudents, totalAttempted }
  }

  const summary = getSummary(courseData)

  if (photoData) {
    return (
      <FeedBackFacultyProfiles
        data={photoData}
        onClose={() => setPhotoData(null)}
      />
    )
  }

  if (loading) {
    return (
      <p className="text-black flex justify-center items-center mt-12">
        Loading Data...
      </p>
    )
  }

  return (
    <div className="relative flex flex-col gap-[0.2] min-h-[80vh] justify-start items-center mt-2 w-[90vw] mx-auto">
      {/* ✅ Dropdown for selecting session */}
      <FeedbackNameDropdown
        sessionDropDownData={sessionDropDownData}
        onSessionChange={handleSessionChange}
      />

      {/* ✅ Feedbacks Table */}
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-green-500/60 border border-green-400 font-semibold rounded-t-md">
            <th className="w-[10%] text-center p-2 border-r border-l border-gray-300">SNo</th>
            <th className="w-[30%] text-center p-1.5 border-r border-gray-300">FBName</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Date From</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Date To</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Total Students</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Attempted</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Percentage</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Status</th>
            <th className="w-[10%] text-center p-1.5 border-r border-gray-300">Action</th>
          </tr>
        </thead>

        <tbody>
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

              const isActive = selectedFbId === r.Fb_id

              return (
                <tr
                  key={i}
                  className={`border-b border-gray-300 cursor-pointer transition-all duration-200 
                    ${isActive ? 'bg-emerald-200' : 'hover:bg-green-200'}`}
                  onClick={() => handleClick(r.Fb_id)}
                >
                  <td className="text-center border-r border-l border-gray-300 p-1.5">{i + 1}</td>
                  <td className="text-left border-r border-gray-300 p-1.5">{r.FBName}</td>
                  <td className="text-center border-r border-gray-300 p-1.5">{dateFrom.toLocaleDateString('en-GB')}</td>
                  <td className="text-center border-r border-gray-300 p-1.5">{dateTo.toLocaleDateString('en-GB')}</td>
                  <td className="text-center border-r border-gray-300 p-1.5">{r.TotalStudents}</td>
                  <td className="text-center border-r border-gray-300 p-1.5">{r.Attempted}</td>
                  <td className="text-center border-r border-gray-300 p-1.5">
                    {r.TotalStudents ? ((r.Attempted / r.TotalStudents) * 100).toFixed(2) : 0}%
                  </td>
                  <td className={`text-center border-r border-gray-300 p-1.5 font-semibold 
                    ${status === 'Closed' ? 'text-red-600' : status === 'Scheduled' ? 'text-yellow-600' : 'text-green-600'}`}>
                    <div className="flex flex-row justify-center items-center">
                      {status === 'Closed' && <HiOutlineLockClosed size={18} />}
                      {status === 'Scheduled' && <Clock size={18} />}
                      {status === 'Running' && <MdRunningWithErrors size={18} />}
                      <span className="ml-1">{status}</span>
                    </div>
                  </td>
                  <td className="text-center p-1.5 border-r border-gray-300">
                    <button
                      className="bg-emerald-500 text-white font-semibold py-1 px-2 rounded-md shadow-md 
                        hover:bg-emerald-600 hover:scale-105 flex items-center justify-center gap-2 transition-all duration-200 active:bg-emerald-400"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAnalyze(r.Fb_id)
                      }}
                    >
                      <MdAnalytics size={18} /> Analyze
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>

      {/* ✅ Show Course Data & Summary */}
      {courseData?.length > 0 && (
        <div className="mt-6 w-[90vw] h-[400px] bg-green-50 rounded-lg shadow-md flex flex-col md:flex-row p-4 gap-6">
          <div className="flex-1 flex flex-col">
            <div className="text-black font-semibold text-lg mb-3">
              Feedback: {selectedFeedback?.FBName || 'Select Feedback'}
            </div>

            <div className="overflow-y-auto max-h-[300px]">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-emerald-400 text-white sticky top-0 z-10">
                  <tr className="border border-gray-300 font-semibold text-black">
                    <th className="w-[5%] p-2 border-r border-l border-gray-300">SNo</th>
                    <th className="w-[40%] p-2 border-r border-gray-300">Course</th>
                    <th className="w-[20%] p-2 border-r border-gray-300">Total Students</th>
                    <th className="w-[15%] p-2 border-r border-gray-300">Attempted</th>
                    <th className="w-[20%] p-2 border-r border-gray-300">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.map((c, index) => (
                    <tr
                      key={c.classsectioncode}
                      className={`border-b border-gray-300 text-center hover:bg-emerald-100 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="border-r border-l border-gray-300 p-2">{index + 1}</td>
                      <td className="border-r border-gray-300 text-left p-2">{c.Course}</td>
                      <td className="border-r border-gray-300 p-2">{c.TotalStudents}</td>
                      <td className="border-r border-gray-300 p-2">{c.Attempted}</td>
                      <td className="border-r border-gray-300 p-2">
                        {c.TotalStudents ? ((c.Attempted / c.TotalStudents) * 100).toFixed(2) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Feedback Summary Chart */}
          <div className="w-1/3 h-[300px] mt-7 flex flex-col justify-center items-center border border-gray-300 p-4 rounded-md">
            <p className="font-semibold mb-2 text-emerald-700 text-center">
              Feedback Summary
            </p>
            <Pie
              data={{
                labels: ['Attempted', 'Remaining'],
                datasets: [
                  {
                    label: 'Students',
                    data: [
                      summary.totalAttempted,
                      summary.totalStudents - summary.totalAttempted,
                    ],
                    backgroundColor: ['#22d3ee', '#d946ef'],
                    borderColor: ['#059669', '#B91C1C'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
