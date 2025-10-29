'use client'

import {useState, useEffect} from 'react'

export default function useFetch(){
  
  const numbers = [10,20,30,40,50,60,90,30];
  const fruits = ["apple","banana","cherry", "apple"];

  //includes -> check if an array contains an specific value

  console.log(numbers.includes(15))
  console.log(fruits.includes('apple'))

  //indexOf()-> return the first index of value 
  console.log(numbers.indexOf(30))
  console.log(fruits.indexOf("banana"))

  //lastIndexOf()-> return the last index of value(searches from the end )
  console.log(numbers.lastIndexOf(30))
  console.log(fruits.lastIndexOf('apple'))

  //find()-> return the first element that matches the condition 
  //return the value not index
  const res = numbers.find(num => num%3)
  console.log(res)

  //findIndex() -> 
  const idx = numbers.findIndex(num => num>25);
  console.log(idx)


  //findLast()-> similar to find ,searches from end to start 
  const lastBig = numbers.findLast(num => num>25)
  console.log(lastBig)

  //findLastIndex()->  similar to findIndex, searches from end to start 
  const lastBigIndex = numbers.findLastIndex(num => num>25)
  console.log(lastBigIndex)

  //some()-> checks if any element satisfies a conditon
  const hasLarge = numbers.some(num => num>40)
  console.log(hasLarge)

  const allPositie = numbers.every(num => num>0)
  console.log(allPositie)



  return (
    <div>test</div>
  )

}