'use client'
import { useState, useEffect } from 'react'

export default function FeedbackNameDropdown({ sessionDropDownData, onSessionChange }) {
  const [sessionId, setSessionId] = useState(25)

  const handleOnChange = (sessionId) => {
    setSessionId(sessionId)
    console.log("selected session id", sessionId)
    onSessionChange && onSessionChange(sessionId)
  }

  // ✅ Trigger onSessionChange once on mount
  useEffect(() => {
    if (sessionId) {
      console.log("Initial session trigger:", sessionId)
      onSessionChange && onSessionChange(sessionId)
    }
  }, []) // Run only once on mount

  return (
    <div className="mb-2">
      <div className="relative w-[200px]">
        <select
          className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 appearance-none"
          value={sessionId}
          onChange={(e) => handleOnChange(e.target.value)}
        >
          <option value="">Select Session</option>
          {sessionDropDownData?.map((item, index) => (
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
