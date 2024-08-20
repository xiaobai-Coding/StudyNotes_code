import { useContext } from 'react';
import LocaleContext from './LocaleContext.jsx';
import allLocales from './locale/index.js';
import classNames from 'classnames';
function getAllDays(date) {
  const daysInMonth = date.daysInMonth()
  const startDate = date.startOf('month')
  const day = startDate.day()    
  
  const daysInfo = new Array(6 * 7)
  
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false
    }
  }

  for(let i = 0; i<daysInfo.length; i++){
    const calcDate = startDate.add(i - day, 'day');

    daysInfo[i] = {
        date: calcDate,
        currentMonth: calcDate.month() === date.month()
    }
  }
  return daysInfo
}

function renderDays(days, dateRender, dateInnerContent, value, selectHandler) {
  const rows = [];
  for(let i = 0; i < 6; i++ ) {
      const row = [];
      for(let j = 0; j < 7; j++) {
          const item = days[i * 7 + j];
          row[j] = <div className={
            "calendar-month-body-cell " + (item.currentMonth ? 'calendar-month-body-cell-current' : '')
        } onClick={()=>selectHandler(item.date)}>
          {
          dateRender ? dateRender(item.date) :  (
            <div className="calendar-month-body-cell-date">
                <div className={classNames("calendar-month-body-cell-date-value", 
                  value.format("YYYY-MM-DD") === item.date.format("YYYY-MM-DD") ? "calendar-month-body-cell-date-selected" : ""
                )}>{item.date.date()}</div>
                <div className="calendar-month-body-cell-date-content">{dateInnerContent?.(item.date)}</div>
            </div>
        )
          }
        </div>
      }
      rows.push(row)
  }
  return rows.map(row => <div className="calendar-month-body-row">{row}</div>)
}

function MonthClendar(props){
const localeContest = useContext(LocaleContext)
 const { 
  value,
  curMonth,
  dateRender,
  dateInnerContent,
  selectHandler
} = props 
const CalendarLocale = allLocales[localeContest.locale]
 const allDays = getAllDays(curMonth)
  const weekList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return <div className="calendar-month">
    <div className="calendar-month-week-list">
     {weekList.map(week=>(
      <div className="calendar-month-week-list-item" key={week}>{CalendarLocale.week[week]}</div>
     ))}
    </div>
    <div className="calendar-month-body">
        {
            renderDays(allDays, dateRender, dateInnerContent, value, selectHandler)
        }
    </div>
  </div>
}
export default MonthClendar