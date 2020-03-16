import React, { Component } from 'react'
import { Route, NavLink, Switch } from "react-router-dom";

import  Home  from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Collections from './pages/Collections';

import LocalAdaptation from './pages/collections/LocalAdaptation';


class App extends Component {
  render() {
    return (
        <header>
          <h1>Atlas of Population Genetics</h1>
            <p><NavLink to="/">Home</NavLink></p>
            <p><NavLink to="/about">About</NavLink></p>
            <p><NavLink to="/contact">Contact</NavLink></p>
            <p><NavLink to="/collections">Collection</NavLink></p>
          <div className="content">
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/contact" component={Contact}/>
                <Route exact path="/collections" component={Collections}/>
                <Route path="/collections/localadaptation" component={ LocalAdaptation }/>
            </Switch>
          </div>
        </header>
    );
  }
}
 
export default App;
