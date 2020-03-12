import React, { Component } from 'react'
import './App.css'
import { sum } from 'd3-array'
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';


import { nest } from 'd3-collection';
import data from './data/mutations_bg.json';
import LineChart from './LineChart';
import Genome from './Genome';
import GenomeD from './GenomeD';


data.forEach( d => 
  d['positional_phen'] = d.freq * d.select_coef);

let dataPopPhen = [];
nest()
  .key( d => [d.output_gen, d.pop, d.m, d.mu, d.r, d.sigsqr])
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

  function closestFromArray (arr){
    return (target) => arr.reduce(function(prev, curr){
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
    })
}

class App extends Component {
  constructor(props){
    super(props);
    this.focusStartExent = {x0: 1000, x1: 5000};
    this.onBrush = this.onBrush.bind(this);

    this.state = { focusBrushExtent: [this.focusStartExent.x0, this.focusStartExent.x1]}
  }

  interval = closestFromArray(dataPopPhen.map(d => parseInt(d.output_gen)))

  onBrush(d) {
    this.setState({ focusBrushExtent: d.map(this.interval)})
  }

  render() {
    const margin = {top: 10, right: 0, bottom: 20, left: 0};
    const chartDims = {width: 800, height: 150};

    let xScale = scaleLinear()
      .range([margin.left, chartDims.width - margin.right])
      .domain([min(dataPopPhen, d => d.output_gen),
        max(dataPopPhen, d => d.output_gen)]);

    let xScale2 = scaleLinear()
      .range([margin.left, chartDims.width - margin.right])
      .domain([this.state.focusBrushExtent[0], this.state.focusBrushExtent[1]]);

    return (
      <div className="App">
        <div className="text-container">
          <h1>Local Adaptation</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
        </div>
        <section id="divergent-plots">
          <div className="divergent-top">
            <div className="genome-plot">
              <Genome data={data} 
                      outputGen={this.state.focusBrushExtent[0]}
                      pop={0}/>
            </div>
            <div className="focus-line-chart"> 
            <LineChart chartId = 'non-context'
                        data={dataPopPhen} 
                        xScale={xScale2} 
                        margin={margin} 
                        chartDims={{width: chartDims.width, height: 400}}
                        classStopName={{start01: 'start-dull-poo', start02: 'start-color-poo', end01: 'end-color-poo', end02: 'end-dull-poo'}}
                        renderBrush={false} 
                        renderAxis={false}/>

            </div>
            <div className="genome-plot">
              <GenomeD data={data}
                      outputGen={this.state.focusBrushExtent[1]}
                      pop={1}/>
            </div>
          </div>
          <div className="divergent-bottom">
            <div className="context-line-chart"> 
              <LineChart chartId = 'context'
                        data={dataPopPhen} 
                        xScale={xScale} 
                        changeBrush={this.onBrush}
                        margin={margin} 
                        chartDims={chartDims}
                        classStopName={{start01: 'start-dull', start02: 'start-color', end01: 'end-color', end02: 'end-dull'}}
                        renderBrush={true} 
                        renderAxis={true}/>
            </div>
          </div>
        </section>
      </div>
    )
  }
}





export default App
