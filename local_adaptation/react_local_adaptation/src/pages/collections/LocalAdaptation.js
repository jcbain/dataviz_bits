import React, { Component } from 'react'
import { sum } from 'd3-array'
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import data from '../../data/mutations_bg.json';

import LineChart from '../../charts/LineChart';
import Genome from '../../charts/Genome';
import Graphic from '../../charts/ScrollingGraphic';

import './styles/local_adaptation_styles.css';

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

class LocalAdaptation extends Component {
  constructor(props){
    super(props);
    this.focusStartExent = {x0: 1000, x1: 5000};
    this.onBrush = this.onBrush.bind(this);
    
    this.state = { 
      focusBrushExtent: [this.focusStartExent.x0, this.focusStartExent.x1],
    }
    this.interval = closestFromArray(dataPopPhen.map(d => parseInt(d.output_gen)))
  }

  

  onBrush(d) {
    this.setState({ focusBrushExtent: d.map(this.interval)})
  }

  render() {
    console.log(this.props.match);

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
      <div className="local-adaptation">
        
        <div className="text-container">
          <p className="text-start">Many species live in spatially heterogeneous environments, where the conditions that challenge their productivity vary from one place to another. For example, the natural range of lodgepole pine spans from the temperate climates of northern California up to the Canadian subarctic in the Yukon territory. One evolutionary response to heterogeneous environments is “local adaptation”, where different populations will adapt to the conditions they commonly encounter in their home range. This specialization arises by the gradual evolution of genetically-based differences in the traits that help mediate the organism’s survival and fecundity in its environment. Lodgepole pine seeds collected in the Yukon territory will be more cold-tolerant, set bud earlier in the fall, and grow more slowly than seeds collected in California. Local adaptation tends to involve constraints and trade-offs between traits, where it isn’t possible to optimise all traits at once. In the context of lodgepole pine, the Yukon-adapted genotypes avoid autumn frost damage by setting bud early, but this shorter growing season limits how much they can grow and compete. By contrast, the California genotypes grow much faster, but are more susceptible to cold injury and would die in the harsh northern winters. In some cases, a species may remain a generalist and not evolve any local adaptations, even if the environment varies considerably from one place to another. </p>
        </div>
        <Graphic></Graphic>

        <section id="divergent-plots">
          <div className="divergent-top">
            <div className="genome-plot">
              <Genome  key={`genome_${0}_${0}`}
                        className={'genome1'}
                        data={data} 
                        outputGen={this.state.focusBrushExtent[0]}
                        pop={0}
                        id={0}/>
            </div>
        

            <div className={`focus-line-chart container`}> 
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
              <Genome key={`genome_${1}_${0}`}
                      className={'genome2'}
                      data={data}
                      outputGen={this.state.focusBrushExtent[1]}
                      pop={0}
                      id={1}/>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>

      </div>
    )
  }
}





export default LocalAdaptation