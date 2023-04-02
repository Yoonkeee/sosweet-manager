import { configureStore, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

let today = moment(new Date()).format('YYYY-MM-DD');
let currentDate = createSlice({
  name: 'date',
  initialState: today,
  reducers: {
    tomorrow: state => {
      console.log('before tomorrow' + state);
      const nextDate = moment(state).add(1, 'day').format("YYYY-MM-DD");
      console.log('after tomorrow' + nextDate);
      return nextDate;
    },
    yesterday: state => {
      console.log('before yesterday' + state);
      const prevDate = moment(state).subtract(1, 'day').format("YYYY-MM-DD");
      console.log('after yesterday' + prevDate);
      return prevDate;
    },
    setDate: (state, action) => {
      const dateObject = moment(action.payload, 'YYYYMMDD').toDate();
      if (isNaN(dateObject.getTime())) {
        // invalid date string
        return state;
      } else {
        return dateObject;
      }
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        (state, action) => {
          const dateObject = new Date(action.payload);
          const dateString = moment(dateObject).format('YYYYMMDD');
          return dateObject.getTime() ? dateObject : state;
        }
      );
  }
});

const selectedDog = createSlice({
  name: 'name',
  initialState: '',
  reducers: {
    setDog: (state, action) => {
      console.log(state);
      console.log('setDog ' + action.payload.name);
      return action.payload.name;
    }
  }
});

export default configureStore({
  reducer: { currentDate: currentDate.reducer,
       selectedDog: selectedDog.reducer}
});

export let { yesterday, tomorrow, setDate } = currentDate.actions;
export let { setDog } = selectedDog.actions;