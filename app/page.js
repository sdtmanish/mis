'use client'
import { useState } from 'react'
import DailyTimeTable from "./components/DailyTimeTable";
import TodayLectures from './components/TodayLectures';
import Leave from './components/Leave';
import Utilization from './components/Utilization';
import EmployeeAttendanceSheet from './components/EmployeeAttendanceSheet';

const tabs = [
  { id: 'registration', name: 'Registration', component: <div className="text-black">Registration</div> },
  { id: 'today-lecture', name: "Today's Lectures", component: <div className="text-black">Today's Lectures</div> },
  { id: 'attendance', name: 'Attendance', component: <div className="text-black">Attendance</div> },
  { id: 'syllabus-coverage', name: 'Syllabus Coverage', component: <div className="text-black">Syllabus Coverage</div> },
  { id: 'syllabus-coverage-faculty-wise', name: 'Syllabus Coverage(Faculty Wise)', component: <div className="text-black">Syllabus Coverage (Faculty Wise)</div> },
  { id: 'leave', name: 'Leave', component: <div className="text-black">Leave</div> },
  { id: 'daily-time-table', name: 'Master Time Table', component: <DailyTimeTable /> },
  { id: 'attendance-sheet', name: 'Attendance Sheet', component: <div className="text-black">Attendance Sheet</div> },
  { id: 'lectures-status-on-leave', name: 'Lectures Status On Leave', component: <div className="text-black">Lectures Status On Leave</div> },
  { id: 'mis-report', name: 'MIS Report', component: <div className="text-black">MIS Report</div> },
  { id: 'utillization', name: 'Utillization/Occupancy', component: <div className="text-black">Utillization</div> },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('daily-time-table');

  return (
    <div className="p-4 ">
     <div className="bg-white text-black font-medium text-base m-4 pb-2 flex flex-wrap gap-4 justify-center  border-b border-gray-300">
        {tabs.map(tab => (
          <p
            key={tab.id}
            className={`cursor-pointer whitespace-nowrap px-2 py-1 ${activeTab === tab.id ? 'font-medium text-blue-600 border-b-3 border-blue-600' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </p>
        ))}
      </div>
         

       {activeTab === 'registration' && <div className="text-black">Registration</div>}  

              {activeTab === 'today-lecture' && <div>
                
                <TodayLectures/>
                
                
                </div>}  

                     {activeTab === 'attendance' && <div > <EmployeeAttendanceSheet/> </div>}  
       {activeTab === 'syllabus-coverage' && <div className="text-black">Syllabus Coverage</div>}  
       {activeTab === 'syllabus-coverage-faculty-wise' && <div className="text-black">Syllabus Coverage (Faculty Wise)</div>}  
       {activeTab === 'leave' && <div className="text-black"><Leave/></div>}  


      {activeTab === 'daily-time-table' && <div>
        <DailyTimeTable />
      </div>
      }

       {activeTab === 'attendance-sheet' && <div className="text-black">Attendance Sheet</div>}  
       
       {activeTab === 'lectures-status-on-leave' && <div className="text-black">Lectures Status On Leave</div>}  
       
       {activeTab === 'mis-report' && <div className="text-black">MIS Report</div>}  
       
       {activeTab === 'utillization' && <div> <Utilization/> </div>}  
      


    </div>
  );
}