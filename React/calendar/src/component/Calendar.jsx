import { useState } from "react"
function Calendar(props){
  const [date, setDete] = useState(new Date(props.defaultValue))
  // 1. 根据当前月份获取上月和下月
  // 上月
  const handlePrevMonth = () =>{
    setDete(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }
  // 下月
  const handleNextMonth = () =>{
    setDete(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }
  // 2. 根据当前月份来渲染日期
  // 获取每个月有多少天
  const daysOfMonth = (year, month) =>{
    return new Date(year, month + 1, 0).getDate()
  }
  // 获取每个月第一天是星期几
  const firstDayOfMonth = (year, month) =>{
    return new Date(year, month, 1).getDay()
  }
  const renderDays = () => {
    const days = []
    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth())
    const firstDays = firstDayOfMonth(date.getFullYear(), date.getMonth())

    for(let i = 0; i<firstDays; i++){
      days.push(<div key={`empty-${i}`} className="empty"></div>)
    }
    for(let i = 1; i<=daysCount; i++){
      const handelClick = () =>{
        const current = new Date(date.getFullYear(), date.getMonth(), i)
        setDete(current)
        props.onChange(current)
      }
      if(i === date.getDate()){
        days.push(<div key={i} className="day selected" onClick={()=>handelClick()}>{i}</div>)
      }else{
        days.push(<div key={i} className="day" onClick={()=>handelClick()}>{i}</div>)
      }
    }
    return days
  }
  return (
    <div className="calendar">
      <div className="header">
        <button onClick={ handlePrevMonth }>&lt;</button>
        <div>{date.getFullYear()}年{date.getMonth() + 1}月</div>
        <button onClick={ handleNextMonth }>&gt;</button>
      </div>
      <div className="days">
        <div className="day">日</div>
        <div className="day">一</div>
        <div className="day">二</div>
        <div className="day">三</div>
        <div className="day">四</div>
        <div className="day">五</div>
        <div className="day">六</div>
        {renderDays()}
      </div>
    </div>
  );
}
export default Calendar