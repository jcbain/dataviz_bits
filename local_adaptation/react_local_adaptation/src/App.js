import React, { Component } from 'react'
import './App.css'
import WorldMap from './WorldMap'
import worlddata from './world'
import BarChart from './BarChart'
import StreamGraph from './StreamGraph'
import { range, sum } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid } from 'd3-geo'

import { nest } from 'd3-collection';
import data from './data/mutations_bg.json';
import LineChart from './LineChart';

const appdata = worlddata.features
  .filter(d => geoCentroid(d)[0] < -20);

data.forEach( d => 
  d['positional_phen'] = d.freq * d.select_coef);

let dataPopPhen = [];
nest()
  .key( d => [d.output_gen, d.pop, d.m, d.r, d.sigsqr])
  .rollup( v => sum(v, d => d.positional_phen))
  .entries(data)
  .forEach( d => {
    let vals = d.key.split(",");
    d['output_gen'] = parseInt(vals[0]);
    d['pop']        = vals[1];
    d['m']          = vals[2];
    d['mu']         = vals[3];
    d['r']          = vals[4];
    d['sigsqr']     = vals[5];
    d['pop_phen']   = d.value;
    dataPopPhen.push(d)
  });
console.log(dataPopPhen);


appdata
  .forEach((d,i) => {
    const offset = Math.random()
    d.launchday = i
    d.data = range(30).map((p,q) => q < i ? 0 : Math.random() * 2 + offset)
  }
);

const colorScale = scaleThreshold().domain([5,10,20,30]).range(["#75739F", "#5EAFC6", "#41A368", "#93C464"])

class App extends Component {
  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
    this.state = { screenWidth: 1000, screenHeight: 500};
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, 
                    screenHeight: window.innerHeight - 70})
  }

   render() {
   return (
     <div className="App">
       <div className="App-header">
         <h2>Dashboard</h2>
       </div>
       <div>
          <StreamGraph colorScale={colorScale} data={appdata} size={[this.state.screenWidth, this.state.screenHeight / 2]} />
          {/* <WorldMap colorScale={colorScale} data={appdata} size={[this.state.screenWidth / 2, this.state.screenHeight / 2]}/>
          <BarChart colorScale={colorScale} data={appdata} size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} /> */}
       </div>
       <div>
         <LineChart data={dataPopPhen} />
       </div>
     </div>
   )
   }
}

export default App
