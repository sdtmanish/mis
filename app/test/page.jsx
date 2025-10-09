'use client'
import { useEffect, useState, useRef } from 'react';

export default function TabChangeDetector() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(null)

  useEffect(()=>{
    prevCount.current = count;
  },[count])


  return (
    <div className="flex flex-col justify-center items-center mt-20 text-xl">
    
    <p>Current : {count}</p>
    <p>Prevous: {prevCount.current}</p>

    <button onClick={()=>setCount(count+1)}>Increnment</button>
    </div>
  );
}
