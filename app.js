import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import route from './Router/'; 
import store from './Store/Store';
import reducer from './Reducer/';
import {createStore, combineReducers} from 'redux';

ReactDOM.render(
    <Provider store={store}>
        {route}
    </Provider>
  , document.getElementById('root'));