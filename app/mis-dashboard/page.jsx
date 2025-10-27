'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DailyTimeTable from "../components/DailyTimeTable";
import TodayLectures from '../components/TodayLectures';
import Leave from '../components/Leave';
import Utilization from '../components/Utilization';
import EmployeeAttendanceSheet from '../components/EmployeeAttendanceSheet';
import FeedBackNames from '../components/Feedback/FeedBackNames';

const tabs = [
  { id: 'registration', name: 'Registration', component: <div className="text-black">Registration</div> },
  { id: 'today-lecture', name: "Today's Lectures", component: <div className="text-black">{"Today's Lectures"}</div> },
  { id: 'attendance', name: 'Attendance', component: <div className="text-black">Attendance</div> },
  { id: 'syllabus-coverage', name: 'Syllabus Coverage', component: <div className="text-black">Syllabus Coverage</div> },
  { id: 'syllabus-coverage-faculty-wise', name: 'Syllabus Coverage(Faculty Wise)', component: <div className="text-black">Syllabus Coverage (Faculty Wise)</div> },
  { id: 'leave', name: 'Leave', component: <div className="text-black">Leave</div> },
  { id: 'daily-time-table', name: 'Master Time Table', component: <div className="text-black">Daily Time Table</div> },
  { id: 'attendance-sheet', name: 'Attendance Sheet', component: <div className="text-black">Attendance Sheet</div> },
  { id: 'lectures-status-on-leave', name: 'Lectures Status On Leave', component: <div className="text-black">Lectures Status On Leave</div> },
  { id: 'feedback', name: 'Feedback', component: <div className="text-black">Feedback</div> },
  { id: 'utillization', name: 'Utillization/Occupancy', component: <div className="text-black">Utillization</div> },
];

export default function Home() {

   const router = useRouter();

  const [activeTab, setActiveTab] = useState('daily-time-table');

  useEffect(()=>{
   
    const userData = localStorage.getItem('userData');

    if(userData === null ){
      router.push('/')
    }
console.log('userData in mis dashboard page', userData);
 const savedTab = localStorage.getItem('activeTab');
    if(savedTab){
      setActiveTab(savedTab);
    }
  },[]);

  const handleTabClick = (tabId)=>{
    setActiveTab(tabId);
    localStorage.setItem('activeTab',tabId)
  }

  const handleLogout = ()=>{
    router.push('/')
    localStorage.removeItem('userData');
  }

  return (
    
    <div className="px-4 ">
<div className="sticky top-0 z-999 bg-white shadow-md ">
  {/* Top bar */}
  <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
    <div className="flex items-center gap-3">
      {/* Logo placeholder */}
      <div className="w-8 h-8 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-lg"><Image src="/assets/DolphinLogo.png" width="30" height="30" alt="Logo" /></div>
      <h1 className="text-lg font-semibold text-gray-700">MIS Dashboard</h1>
    </div>
    <div className="flex flex-row gap-4 justify-center items-center">
    <div className="text-base font-bold text-gray-800">Welcome, User 👋</div>
    <button className="bg-red-500 px-3 py-1.5 rounded-lg text-white cursor-pointer hover:bg-red-600 active:bg-red-500"
    onClick={handleLogout}
    >Logout</button>
    </div>

  </div>

  {/* Tabs */}
  <div className="flex flex-wrap justify-center gap-2 px-2 py-2 2xl:gap-4  bg-gray-50">
    {tabs.map(tab => (
      <button
        key={tab.id}
        className={`
          relative px-2 py-1 text-sm 2xl:text-base font-bold transition-colors cursor-pointer
          ${activeTab === tab.id 
            ? 'text-blue-600' 
            : 'text-gray-600 hover:text-gray-800'}
        `}
        onClick={() => handleTabClick(tab.id)}
      >
        {tab.name}
        {activeTab === tab.id && (
          <span className="absolute left-0 bottom-0 w-full h-[3px] bg-blue-600 rounded-full transition-all duration-300"></span>
        )}
      </button>
    ))}
  </div>
</div>



       {activeTab === 'registration' && <div className="text-black">Registration</div>}  

              {activeTab === 'today-lecture' && <div>
                
                <TodayLectures/>
                
                
                </div>}  

                     {activeTab === 'attendance' && <div > Attendance </div>}  
       {activeTab === 'syllabus-coverage' && <div className="text-black">Syllabus Coverage</div>}  
       {activeTab === 'syllabus-coverage-faculty-wise' && <div className="text-black">Syllabus Coverage (Faculty Wise)</div>}  
       {activeTab === 'leave' && <div className="text-black"><Leave/></div>}  


      {activeTab === 'daily-time-table' && <div>
        <DailyTimeTable />
      </div>
      }

       {activeTab === 'attendance-sheet' && <div ><EmployeeAttendanceSheet/></div>}  
       
       {activeTab === 'lectures-status-on-leave' && <div className="text-black">Lectures Status On Leave</div>}  
       
       {activeTab === 'feedback' && <div className="text-black"><FeedBackNames/></div>}  
       
       {activeTab === 'utillization' && <div> <Utilization/> </div>}  
      


    </div>
  );
}