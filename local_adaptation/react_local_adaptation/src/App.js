import React, { Component } from 'react'
import { Route, NavLink, Switch } from "react-router-dom";

import './App.css';

import routes from './routes'

class App extends Component {


  render() {
    // const routeComponents = routes.map(({path, subpath, component, refresh}, key) => <Route exact path={!subpath ? path : `${path}/${subpath}`} refresh={refresh} component={component} key={key} />);
    const routeComponents = routes.map(({path, component, refresh}, key) => <Route exact path={path} refresh={refresh} component={component} key={key} />);
    return (

        <div className="content">
        <header>
          <h1>Atlas of Population Genetics</h1>
          <div className="nav-links">
            <p><NavLink to="/">Home</NavLink></p>
            <p><NavLink to="/about">About</NavLink></p>
            <p><NavLink to="/resources">Resources</NavLink></p>
            <p><NavLink to="/collections">Collection</NavLink></p>
          </div>
        </header>
            <Switch>
              {routeComponents}
                {/* <Route exact path="/" component={Home}/>
                <Route path="/about" component={About}/>
                <Route path="/resources" component={Resources}/>
                <Route exact path="/collections" component={Collections}/>
                <Route refresh={true} path="/collections/:id" render={(props) => <LocalAdaptation {...props} />}/> */}
                {/* <Route refresh={true} path="/collections/:id" component={ LocalAdaptation }/> */}
            </Switch>
        </div>


    );
  }
}
 
export default App;
