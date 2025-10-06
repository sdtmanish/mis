'use client'

export default function UtilizationDropdown({
    programTypes = [],
    colleges = [],
    buildingBlocks = [],
    selectedFilters,
    onFilterChange
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
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>
  <div className="relative w-[200px]">
  <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none">
    <option>Month</option>
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>
<div className="relative w-[200px]">
  <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none">
    <option>Week</option>
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>

{/* College Type */}
  <div className="relative w-[200px]">
  <select className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none"
  value={selectedFilters.college || ''}
  onChange={(e)=> handleChange('college', e.target.value)}
  
  >

    <option>College</option>
    {colleges.map((type,i)=>(
        <option key={i} value={(type.collegename)}>
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
      <option key={i} value={type.programtypename}>
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
    <option>Building Blocks</option>
    {buildingBlocks.map((type, i) => (
  <option key={i} value={type.BlockName} >
    {type.BlockName}
  </option>
))}

  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
</div>
</div >

    )
}