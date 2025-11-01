'use client'
import { useState, useEffect } from 'react'

export default function FeedbackNameDropdown({ sessionDropDownData = [], onSessionChange }) {
  const [sessionId, setSessionId] = useState(25)
  const [hasTriggered, setHasTriggered] = useState(false)

  // ✅ Debounced session change handler
  const handleOnChange = (newId) => {
    setSessionId(newId)
    console.log('User selected session:', newId)
    if (onSessionChange) {
      // add a short debounce to prevent rapid consecutive triggers
      clearTimeout(window._sessionTimeout)
      window._sessionTimeout = setTimeout(() => {
        onSessionChange(Number(newId))
      }, 250)
    }
  }

  // ✅ Trigger once when sessions are loaded (not on every render)
 useEffect(() => {
  // Trigger only once when dropdown gets session data
  if (
    !hasTriggered &&
    Array.isArray(sessionDropDownData) &&
    sessionDropDownData.length > 0 &&
    sessionId
  ) {
    console.log('Dropdown initial trigger for session:', sessionId)
    onSessionChange?.(Number(sessionId))
    setHasTriggered(true)
  }
  // ✅ this must depend on sessionDropDownData only
}, [sessionDropDownData])

  return (
    <div className="mb-2">
      <div className="relative w-[200px]">
        <select
          className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:border-emerald-500 appearance-none"
          value={sessionId}
          onChange={(e) => handleOnChange(e.target.value)}
        >
          <option value="">Select Session</option>
          {Array.isArray(sessionDropDownData) &&
            sessionDropDownData.map((item, index) => (
              <option key={index} value={item.sessionid}>
                {item.sessionname}
              </option>
            ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          ▼
        </span>
      </div>
    </div>
  )
}
