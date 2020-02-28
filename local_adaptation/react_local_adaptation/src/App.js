import React, { Component } from 'react'
import './App.css'
import WorldMap from './WorldMap'

class App extends Component {
   render() {
   return (
      <div className='App'>
      <header className='App-header'>
      <h2>dashboard</h2>
      </header>
      <div>
      <WorldMap />
      </div>
      </div>
   )
   }
}

export default App
