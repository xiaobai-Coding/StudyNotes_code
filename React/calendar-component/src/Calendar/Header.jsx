import dayjs from "dayjs"
import { useContext } from 'react';
import LocaleContext from './LocaleContext.jsx';
import allLocales from './locale/index.js';
function Header(props){
  const localeContest = useContext(LocaleContext)

  const {
    curMonth,
    nextMonthHandler,
    prevMonthHandler,
    todayHandler
  } = props
  const CalendarLocale = allLocales[localeContest.locale]
  return <div className="calendar-header">
  <div className="calendar-header-left">
      <div className="calendar-header-icon" onClick={prevMonthHandler}>&lt;</div>
      <div className="calendar-header-value">{curMonth.format('YYYY 年 MM 月')}</div>
      <div className="calendar-header-icon" onClick={nextMonthHandler}>&gt;</div>
      <button className="calendar-header-btn" onClick={todayHandler}>{CalendarLocale.today}</button>
  </div>
</div>
}

export default Header