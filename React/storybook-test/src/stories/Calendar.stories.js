import { fn } from '@storybook/test';
import  Calendar  from '../Calendar/index.jsx';
import dayjs from "dayjs"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Example/Calendar日历组件',
  component: Calendar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    value: { control: 'date' },
  },
};

const renderCalendar = (args) => {
  if(typeof args.value === 'number') {
      return <Calendar {...args} value={dayjs(new Date(args.value))}/>
  }

  return <Calendar {...args}/>
}

export const Value = {
  args: {
      value: dayjs('2023-11-08')
  },
  render: renderCalendar
}

export const DateRender = {
  args: {
      value: dayjs('2023-11-08'),
      dateRender(currentDate) {
          return <div>
              日期{currentDate.date()}
          </div>
      }
  },
  render: renderCalendar
};

export const DateInnerContent = {
  args: {
      value: dayjs('2023-11-08'),
      dateInnerContent(currentDate) {
          return <div>
              日期{currentDate.date()}
          </div>
      }
  },
};

export const Locale = {
  args: {
      value: dayjs('2023-11-08'),
      locale: 'en-US'
  },
};