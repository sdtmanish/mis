'use client'

export default function AttendanceSheetDropdown() {

    return (
        <div className=" flex flex-row justify-center gap-8 ">

            <div className="relative w-[200px]">
                <input type="date" className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-500 appearance-none"/>
            </div>

            <div className="relative w-[200px]">
                <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-500 appearance-none">
                    <option>Department</option>
                    <option>Physics</option>
                    <option>Forestry</option>
                    <option>Zoology</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
            </div>

            <div className="relative w-[200px]">
                <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-500 appearance-none">
                    <option>Type</option>
                    <option>Academic</option>
                    <option>Admin</option>
                    
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
            </div>

            <div className="relative w-[200px]">
                <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-500 appearance-none">
                     <option>Status</option>
                     <option>Absentees</option>                    
                    <option>On Leave</option>
                    <option>Late Comers</option>
                    <option>Early Goers</option>
                    
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
            </div>
        </div>
    )
}