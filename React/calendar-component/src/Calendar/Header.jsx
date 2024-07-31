import dayjs from "dayjs"

function Header(props){
  const {
    curMonth,
    nextMonthHandler,
    prevMonthHandler,
    todayHandler
  } = props
  return <div className="calendar-header">
  <div className="calendar-header-left">
      <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
      <div className="calendar-header-value">{curMonth.format('YYYY 年 MM 月')}</div>
      <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
      <button className="calendar-header-btn" onClick={todayHandler}>今天</button>
  </div>
</div>
}

export default Header