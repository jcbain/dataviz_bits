import React, { Component } from 'react'
import './App.css'
import { sum } from 'd3-array'
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';


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
    const margin = {top: 10, right: 20, bottom: 20, left: 20};
    const chartDims = {width: 800, height: 100};

    const xScale = scaleLinear()
      .domain([
        min(dataPopPhen, d => d.output_gen),
        max(dataPopPhen, d => d.output_gen)
      ])
      .range([margin.left, chartDims.width - margin.right]);

    return (
      <div className="App">
        <div className="text-container">
          <h1>Local Adaptation</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
        </div>
        <div className="context-line-chart"> 
          <LineChart data={dataPopPhen} 
                     xScale={xScale} 
                     margin={margin} 
                     chartDims={chartDims}
                     classStopName={{start01: 'start-dull', start02: 'start-color', end01: 'end-color', end02: 'end-dull'}}
                     renderBrush={true} />
        </div>
      </div>
    )
  }
}



export default App
