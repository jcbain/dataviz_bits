import React, { Component } from 'react'
import './App.css'
import { range, sum } from 'd3-array'

import { nest } from 'd3-collection';
import data from './data/mutations_bg.json';
import LineChart from './LineChart';


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


class App extends Component {
  render() {
   return (
     <div className="App">
       <div>
         <LineChart data={dataPopPhen} />
       </div>
     </div>
   )
   }
}

export default App
