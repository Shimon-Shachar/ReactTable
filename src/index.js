// import ReactDOM from 'react-dom/client';

// import './index.css';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import store from './store/index';

console.log("index.js");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}><App /></Provider>);
//root.render(<App />);