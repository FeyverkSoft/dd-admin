import React from 'react';
import ReactDOM from 'react-dom';
import { MyApp } from './App';
import { Provider } from 'react-redux';
import { store } from './_helpers';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render(
  <Provider
    store={store} >
      <BrowserRouter><MyApp/></BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
