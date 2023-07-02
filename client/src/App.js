import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CPC Platform</h1>
          <h2>We are Cooking, just wait.</h2>
        </header>
      </div>
    );
  }
}

export default App;
