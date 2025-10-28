'use client'

import {useState, useEffect} from 'react'

export default function useFetch(){

  //Array.isArray()
  const a = [1,3,4];
  const b = "hello"
  console.log(Array.isArray(a));
  console.log("b is ",Array.isArray(b));

  

  //Array.from() -> creates a new arrayy from an iterable like string, set, map, or nodelist
  console.log(Array.from(b));

 const set = new Set([1,2,3]);
  console.log(set)
  console.log(Array.from(set))

  //Array.of() ->
  console.log(Array.of(1,2,4));
  console.log(Array.of('a','b'))

  console.log(Array.of());
  console.log(Array(3));
  console.log(Array.of(3));


  //constructor 
  const arr = [10,20,30];
  console.log(arr.constructor === Array)
  console.log(arr.constructor)
  const newArr = new arr.constructor(5,6,7);
  console.log(newArr);
  console.log(arr.length)

  const c = [1,5,6,7,8,0]
  console.log(c.length)

  c.push(11);
  console.log(c)
  c.push(133);
  console.log(c)
  c.pop();
  console.log(c)
  c.pop();
  console.log(c)
  //unshift -> adds one or more elements to the beginning of the array

  c.unshift(55);
  console.log(c)
  c.unshift(44,66)
  console.log(c)

  c.shift()
  console.log(c)

const d = [9,6,5,4,4]

console.log(c.concat(d))

console.log(d.slice(2,4))
console.log(d.slice(2))



//splice -> can add , remove, replace elements at any position
//mo

const colors = ['red', 'green', 'yellow'];
const z = colors.splice(0,0,'pink')
console.log(z)
console.log(colors)

console.log(colors.splice(3,3))
console.log(colors)

colors.splice(2,1,'black');
console.log(colors)

  return (
    <div>test</div>
  )

}