import { useState } from 'react'
import Calendar from './Calendar'
import './App.css'
import dayjs from 'dayjs'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Calendar 
      value={ dayjs() } 
      className={'aaa'} 
      style={null} 
      locale="en-US"
      onChange={(date)=>{
        alert(date.format("YYYY-MM-DD"))
      }}
      />
    </>
  )
}

export default App
