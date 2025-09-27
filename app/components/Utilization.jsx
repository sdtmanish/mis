'use client'
import {useState, useEffect} from 'react'


export default function Utilization(){
    const [data, setDate] = useState(null);

    useEffect(()=>{

        const fetchUtilizationDetails = async () =>{

            try{

                const response = await fetch('http://dolphinapi.myportal.co.in/api/ClassRoomUtilisation',{

                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'APIKey':"Sdt!@#321"
                    },
                    body:JSON.stringify({
                        "date":"2025-09-27"
                    })

                })
               
                if(!response.ok){
                    throw new Error(`HTTP  Error : ${response.status} `)
                }

                const utilizationDetails = await response.json();
                console.log(utilizationDetails);



            }catch(err){
                console.log(err);
            }

        }

        fetchUtilizationDetails();

    },[])


    return (
        <div className="text-black">
            Utilization 
        </div>
    )
}