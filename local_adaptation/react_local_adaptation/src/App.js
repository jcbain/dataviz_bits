import React, { Component } from 'react'
import { Route, NavLink, Switch } from "react-router-dom";

import './App.css';

import  Home  from './pages/Home';
import About from './pages/About';
import Resources from './pages/Resources';
import Collections from './pages/Collections';

import LocalAdaptation from './pages/collections/LocalAdaptation';


class App extends Component {
  render() {
    return (
      <div class="main-wrapper">
        <header>
          <h1>Atlas of Population Genetics</h1>
          <div className="nav-links">
            <p><NavLink to="/">Home</NavLink></p>
            <p><NavLink to="/about">About</NavLink></p>
            <p><NavLink to="/resources">Resources</NavLink></p>
            <p><NavLink to="/collections">Collection</NavLink></p>
          </div>
        </header>
        <div className="content">
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/resources" component={Resources}/>
                <Route exact path="/collections" component={Collections}/>
                <Route refresh={true} path="/collections/localadaptation" component={ LocalAdaptation }/>
            </Switch>
        </div>
        </div>

    );
  }
}
 
export default App;
