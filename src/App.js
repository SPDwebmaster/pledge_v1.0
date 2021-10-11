import React, { useState } from 'react';
import bg from './bg.jpg';
import pic from './spdpic.jpg'
import './App.css';
import DashBoard from './components/dashboard';

function App() {

  const [pledgeClassName, setPledgeClassName] = useState("Pledge Class");

  return (
    <div className="App">
      <img className="bg" src={bg} alt="pic"/>
      <header className="App-header">
        <div className="frame">
          <img className="pic" src={pic} alt="pic"/>
          <h2>{pledgeClassName}</h2>
          <DashBoard setPledgeClassName={setPledgeClassName}/>
        </div>
      </header>
    </div>
  );
}

export default App;
