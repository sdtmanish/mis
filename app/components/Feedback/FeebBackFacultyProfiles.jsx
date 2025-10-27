'use client'
import { useState } from 'react';
import { Bar } from "react-chartjs-2";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FeedBackFacultyProfiles({ data, onClose }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [pieData, setPieData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ new state for search

  if (!data) return null;

  // ======== Fetch & Pivot Analysis Data ========
  const handlePhotoClick = async (e_Code, fb_id) => {
    try {
      const res = await fetch('http://dolphinapi.myportal.co.in/api/FeedBackByFac', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'APIKey': 'Sdt!@#321',
        },
        body: JSON.stringify({
          fb_id: fb_id,
          empcode: e_Code
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const rawData = await res.json();
      setEmployeeName(rawData?.[0]?.employee || "");

      // Pivot answers dynamically
      const pivotMap = {};
      rawData.forEach(item => {
        const question = item.question || item.Question;
        const answer = item.answers && item.answers.trim() !== "" ? item.answers : "No Response";

        if (!pivotMap[question]) pivotMap[question] = { Question: question, Total: 0 };
        if (!pivotMap[question][answer]) pivotMap[question][answer] = 0;
        pivotMap[question][answer] += 1;
        pivotMap[question].Total += 1;
      });

      const pivotData = Object.values(pivotMap);
      setAnalysisData(pivotData);
      setSelectedQuestionIndex(0); // default question

      // ✅ Get totalstudents & attempted from localStorage
      const storedSummary = localStorage.getItem(`feedback_summary_${fb_id}`);
      if (storedSummary) {
        const summaryData = JSON.parse(storedSummary);
        const facultySummary = summaryData[e_Code];

        if (facultySummary) {
          setPieData({
            totalstudents: facultySummary.totalstudents,
            attempted: facultySummary.attempted
          });
        } else {
          setPieData(null);
        }
      } else {
        setPieData(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseAnalysis = () => {
    setAnalysisData(null);
    setPieData(null);
    setEmployeeName("");
  };

  // ======== Render Analysis Table ========
  if (analysisData) {
    const allAnswersSet = new Set();
    analysisData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== "Question" && key !== "Total") allAnswersSet.add(key);
      });
    });
    const answerColumns = Array.from(allAnswersSet);

    const selectedItem = analysisData[selectedQuestionIndex];
    const labels = answerColumns;
    const values = labels.map(label => selectedItem[label] || 0);

    return (
      <div className="max-w-[95vw] mx-auto mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-gray-200 relative">
        <button 
          onClick={handleCloseAnalysis}
          className="cursor-pointer absolute top-4 right-4 text-red-500 text-xl font-bold hover:bg-gray-100 px-3 py-1 rounded-full transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-left">
          Feedback Analysis for <span className="text-emerald-900">{employeeName}</span>
        </h2>

        {/* TABLE */}
       <div className="overflow-x-auto overflow-y-auto max-h-[40vh] mb-6 ">
  <table className="min-w-full border-collapse text-sm">
    <thead className="bg-emerald-400 sticky top-0 z-10">
      <tr className="border border-gray-300 border-b ">
        <th className="text-left p-3 font-semibold border-r border-gray-300 ">
          Question
        </th>
        {answerColumns.map((col, idx) => (
          <th
            key={idx}
            className={`p-3 font-semibold border-r border-gray-300 
            }`}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>

    <tbody>
      {analysisData.map((item, idx) => (
        <tr
          key={idx}
          onClick={() => setSelectedQuestionIndex(idx)} // 👈 click to change chart
          className={`border-b border-gray-200 transition-colors ${
            idx === selectedQuestionIndex
              ? 'bg-emerald-100'
              : idx % 2 === 0
              ? 'bg-white'
              : 'bg-gray-50'
          } hover:bg-emerald-50 cursor-pointer`}
        >
          <td className="text-left p-3 font-medium max-w-xs border-r border-l border-gray-200">
            {item.Question}
          </td>
          {answerColumns.map((col, i) => (
            <td key={i} className="text-center p-3 border-r border-gray-200">
              {item[col] || 0}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* ✅ SINGLE HORIZONTAL BAR CHART + PIE CHART SIDE BY SIDE */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-6">
          <div className="bg-gray-50 p-6 rounded-xl shadow-lg w-[600px]">
            <h3 className="font-semibold mb-3 text-gray-700 text-center">
              {selectedItem.Question}
            </h3>
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    data: values,
                     backgroundColor: [
          '#10B981', // emerald
          '#3B82F6', // blue
          '#F59E0B', // amber
          '#EF4444', // red
          '#8B5CF6', // violet
          '#14B8A6', // teal
          '#F43F5E', // rose
        ],
                  },
                ],
              }}
              options={{
                indexAxis: "x",
                plugins: { legend: { display: false } },
                scales: { x: { beginAtZero: true } },
              }}
            />
          </div>

          {/* ✅ PIE CHART */}
          {pieData && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-[300px] h-[300px] flex flex-col justify-center items-center">
              <h4 className="font-semibold mb-3 text-emerald-700 text-center">Feedback Summary</h4>
              <Pie
                data={{
                  labels: ['Attempted', 'Remaining'],
                  datasets: [
                    {
                      label: 'Students',
                      data: [
                        pieData.attempted,
                        pieData.totalstudents - pieData.attempted,
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
          )}
        </div>
      </div>
    );
  }

  // ======== Render Employee Photos Grid ========

  // ✅ Apply search filter (by name or department)
  const filteredData = data.filter(item => {
    const nameMatch = item.EmpName?.toLowerCase().includes(searchTerm.toLowerCase());
    const deptMatch = item.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || deptMatch;
  });

  return (
    <div className="flex flex-col w-[98vw] mx-auto max-h-[85vh] overflow-y-auto bg-white px-6 rounded-2xl shadow-xl relative">
      <div className="sticky top-0 bg-white z-10 flex flex-col sm:flex-row justify-between items-center p-2 mb-4 border-b border-gray-200 gap-3">
        <h2 className="text-xl font-semibold text-emerald-700">Feedback Employee Photos</h2>
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-400 rounded-lg px-3 py-1.5 w-full sm:w-64 outline-none  focus:border-blue-500"
        />
        <button
          onClick={onClose}
          className="text-red-500 font-bold text-lg cursor-pointer hover:bg-gray-200 px-3 py-1 rounded-full transition"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6 p-2">
        {filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handlePhotoClick(item.e_Code, item.Fb_id)}
              className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer flex flex-col items-center justify-center shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <div className="w-28 h-28 mb-3">
                <img
                  src={item.PhotoUrl || '/assets/DolphinLogo.png'}
                  alt={item.EmpName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <p className="font-semibold text-center text-gray-800 text-sm mb-1">{item.EmpName}</p>
              <span className="text-xs text-white bg-emerald-500 px-2 py-1 rounded-full">{item.department}</span>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-10">
            No faculty found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
