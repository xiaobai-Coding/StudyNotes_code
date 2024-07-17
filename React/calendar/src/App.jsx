import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Calendar from "./component/Calendar"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>日历组件📅</h1>
      <Calendar defaultValue={new Date('2024-07-01')} onChange={(date)=>{alert(date.toLocaleDateString())}} />
      <div className='m-10'></div>
      <Calendar defaultValue={new Date('2024-10-04')} />
    </>
  )
}


export default App
