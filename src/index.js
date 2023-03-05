import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import './index.css'
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <div className='laura'>Laura de Araújo Alves Costa</div>
      <div className='titulo'>TIC-TAC-TOE</div>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
