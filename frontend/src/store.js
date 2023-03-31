import { configureStore, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

let today = moment(new Date()).format('YYYYMMDD');
let currentDate = createSlice({
  name: 'date',
  initialState: today,
  reducers: {
    tomorrow: state => {
      const nextDate = moment(state).add(1, 'day');
      return nextDate.toDate();
    },
    yesterday: state => {
      const prevDate = moment(state).subtract(1, 'day');
      return prevDate.toDate();
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

export default configureStore({
  reducer: { currentDate: currentDate.reducer }
});
