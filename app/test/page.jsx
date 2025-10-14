'use client'
import {useState, useEffect, useRef, createContext} from 'react'
import Utilization from '../components/Utilization'

export const ThemeContext = createContext("dark");

export default function Test(){

  return (
    <div>

       <Utilization/>
    </div>
  )
}