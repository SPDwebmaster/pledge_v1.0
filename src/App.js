import React from 'react';
import bg from './bg.jpg';
import pic from './spdpic.jpg'
import './App.css';
import datastore from './datastore';
import DashBoard from './components/dashboard';

function App() {
  return (
    <div className="App">
      <img className="bg" src={bg} alt="pic"/>
      <header className="App-header">
        <div className="frame">
          <img className="pic" src={pic} alt="pic"/>
          <h2>Lambda Pledge Class</h2>
          <DashBoard/>
        </div>
      </header>
    </div>
  );
}

export default App;
