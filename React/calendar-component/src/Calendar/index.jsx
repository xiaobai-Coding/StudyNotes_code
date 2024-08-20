import { useState } from 'react';
import dayjs from "dayjs"
import classNames from 'classnames';
import MonthClendar from "./MonthCalendar"
import Header from "./Header"
import "./index.scss"
import LocaleContext from './LocaleContext';


function Calendar(props){

  const {
    value,
    style,
    className,
    dateRender,
    dateInnerContent,
    onChange,
    locale
  } = props
  const [curValue, setCurValue] = useState(value)
  const [curMonth, setCurMonth] = useState(value)
  const cs = classNames("calendar", className)

  function selectHandler(date){
    setCurValue(date)
    onChange(date)
  }
  function prevMonthHandler() {
      setCurMonth(curMonth.subtract(1, 'month'))
  }

  function nextMonthHandler() {
      setCurMonth(curMonth.add(1, 'month'))
  }

  function todayHandler() {
    const date = dayjs()
    setCurValue(date)
    setCurMonth(date)
    onChange(date)
}
  return <LocaleContext.Provider value={{ locale: locale || navigator.language}}>
    <div className={cs} style={style}>
      <Header curMonth={curMonth} prevMonthHandler={prevMonthHandler} nextMonthHandler={nextMonthHandler} todayHandler={todayHandler} />
      <MonthClendar {...props} value={curValue} curMonth={curMonth} selectHandler={selectHandler} />
    </div>
  </LocaleContext.Provider>
}
export default Calendar