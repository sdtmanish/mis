'use client'

export default function UtilizationDropdown({
    programTypes = [],
    colleges = [],
    buildingBlocks = [],
    selectedFilters,
    onFilterChange,
    weekNotSelected
}) {

    //herper for select handling 
    const handleChange = (key, value) =>{
        onFilterChange({...selectedFilters, [key]:value});
    }


    

    return (

    
        < div className = "w-full flex flex-row justify-center gap-8 mb-2" >
 <div className="relative w-[200px]">
  <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none">
    <option>Session</option>
    <option>2025-2026</option>
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>
  <div className="relative w-[200px]">
  <select
  value={selectedFilters.month}
   onChange={(e)=> handleChange('month',e.target.value)}
   className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none">
    <option value="">Month</option>
    
    <option value="7">Aug</option>
    <option value="8">Sep</option>
    <option value="9">Oct</option>
    <option value="10">Nov</option>
    <option value="11">Dec</option>
    <option value="0">Jan</option>
    <option value="1">Feb</option>
    <option value="2">Mar</option>
    <option value="3">Apr</option>
    <option value="4">May</option>
    <option value="5">June</option>
    <option value="6">July</option>
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>
<div className="relative w-[200px]">
  <select
  value={selectedFilters.week || ''}
  onChange={(e) => handleChange('week', e.target.value)}
  className={`w-full px-2 py-1 border rounded-md shadow-sm appearance-none 
    focus:outline-none 
    ${weekNotSelected 
      ? 'border-red-500/60 focus:border-red-500/60 bg-red-200 ' 
      : 'border-gray-300 focus:border-blue-500'}
  `}
>

   {weekNotSelected? <option value="select week " className="text-red">select week</option>: <option value="">Week </option>}
    <option value="0">Week I</option>
    <option value="1">Week II</option>
    <option value="2">Week III</option>
    <option value="3">Week IV</option>
    <option value="4">Week V</option>
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>

{/* College Type */}
  <div className="relative w-[200px]">
  <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none"
  value={selectedFilters.college || ''}
  onChange={(e)=> handleChange('college', e.target.value)}
  
  >

    <option value="">College</option>
    {colleges.map((type,i)=>(
        <option key={i} value={(type.collegeid)}>
            {type.collegename || type.name}
        </option>
    ))}
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>

  {/* Program Type */}
     <div className="relative w-[200px]">
  <select
    className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none "
    value={selectedFilters.programtype || ''}
    onChange={(e) => handleChange('programtype', e.target.value)}
  >
    <option value="">Program Type</option>
    {programTypes.map((type, i) => (
      <option key={i} value={type.programtypeid}>
        {type.programtypename }
      </option>
    ))}
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>

{/* Building Blocks */}
 <div className="relative w-[200px] ">
  <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:border-blue-500 appearance-none"
  value={selectedFilters.buildingblock || ''}
  onChange={(e)=> handleChange('buildingblock', e.target.value)}
  >
    <option value="">Building Blocks</option>
    {buildingBlocks.map((type, i) => (
  <option key={i} value={type.BlockID} >
    {type.BlockName}
  </option>
))}

  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>
</div >

    )
}