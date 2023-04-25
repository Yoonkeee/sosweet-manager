import { configureStore, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { Temporal } from '@js-temporal/polyfill';

let today = Temporal.Now.plainDateISO().toString()
export let makeTemporal = function (date) {
  return Temporal.PlainDate.from(date);
}
// debugger;
let currentDate = createSlice({
  name: 'date',
  initialState: today,
  // initialState: makeTemporal(today),
  reducers: {
    setToday: () => {
      today = Temporal.Now.plainDateISO().toString()
      return today;
    },
    getTemporal: state => {
        return Temporal.PlainDate.from(state);
    },
    tomorrow: state => {
      let nextDate = Temporal.PlainDate.from(state).add({days: 1}).toString()
      return nextDate;
    },
    yesterday: state => {
      let prevDate = Temporal.PlainDate.from(state).subtract({days: 1}).toString()
      return prevDate;
    },
    // setDate: (state, action) => {
    //   const dateObject = moment(action.payload, 'YYYYMMDD').toDate();
    //   if (isNaN(dateObject.getTime())) {
    //     // invalid date string
    //     return state;
    //   } else {
    //     return dateObject;
    //   }
    // }
  },
});

const selectedDog = createSlice({
  name: 'name',
  initialState: '',
  reducers: {
    setDog: (state, action) => {
      // console.log('setDog ' + action.payload.name);
      return action.payload.name;
    }
  }
});

export default configureStore({
  reducer: { currentDate: currentDate.reducer,
       selectedDog: selectedDog.reducer}
});

export let { yesterday, getTemporal, tomorrow, setToday } = currentDate.actions;
export let { setDog } = selectedDog.actions;
