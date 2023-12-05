import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import store from './store';
// const theme = extendTheme({
//     fonts: {
//         ...chakraTheme.fonts,
//         body: `Single Day, Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
//         heading: `Single Day, Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
//     },
// })

// export default theme
const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
document.documentElement.style.backgroundColor = '#1a2a52';
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      {/*<ChakraProvider theme={theme}>*/}
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </QueryClientProvider>,
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
