import { useState } from 'react'
import './App.css'
import Calendar from './component/Calendar'
function App() {
  return (
    <>
      <h1>mini日历组件📅</h1>
      <Calendar defaultValue={'2024-07-19'} onChange={(date)=>{alert(date.toLocaleDateString())}} />
    </>
  )
}

export default App
