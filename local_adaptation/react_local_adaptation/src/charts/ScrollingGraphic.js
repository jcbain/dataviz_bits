import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';

import { select, selectAll } from 'd3-selection';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import sort from 'fast-sort'

import individualData from '../data/individuals_small';
 
import './styles/scrolling_graphic_styles.css';

class Graphic extends Component {
    constructor(props){
        super(props);
        this.squareSize = 10;
        this.genCounts = individualData.map(d => d.pop).filter(unique).map(v => countIndividaulsPerGeneration(individualData, v))
        this.populations = individualData.map(d => d.pop).filter(unique)
        this.maxPopVal = maxPerPop(this.genCounts);

        this.state = {
            data: 0,
            steps: [10, 20, 30],
            progress: 0,
            outputGen: 1000,
          };
    }

      popRef = React.createRef();

      createData(){
        let filteredData = individualData.filter(d => d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "25" && d.output_gen === this.state.outputGen)
        let chosenData = [];
        this.populations.map(d => {
          let val = d;
          let popIndexes = new Array(this.maxPopVal[val]);
          [...popIndexes.keys()].map(function(v) {
            let x = {};
            x['pop'] = val;
            let result = filteredData.filter(d => d.pop == val)[v];
            x['ind_phen'] = (result !== undefined) ? result.ind_phen : 0;
            chosenData.push(x);
          })
        })

        sort(chosenData).by([
          { asc: u => u.pop },
          { asc: u => u.ind_phen }
        ]);
        return chosenData;

      }

      componentDidMount(){
          console.log(this.maxPopVal)
          console.log(this.createData())
          console.log(this.state)
          select(this.popRef.current)
            .selectAll('rect')  
            .data([1,2,3,4, 5, 6, 7, 8, 9])
            .enter()
            .append('rect')
            .attr('x', (d, i) => (i * this.squareSize )+ 2)
            .attr('y', 10)
            .attr('height', this.squareSize)
            .attr('width', this.squareSize)
            .attr('fill', '#fffff7')
          
      }
    
      onStepEnter = ({ element, data }) => {
        element.style.border = '1px solid goldenrod';
        this.setState({ data });
        selectAll('rect')
            .transition()
            .attr('fill', 'green')
      };
    
      onStepExit = ({ element }) => {
        element.style.border = '1px solid black';
        selectAll('rect')
        .transition()
        .attr('fill', '#fffff7')
      };
    
      onStepProgress = ({ element, progress }) => {
        this.setState({ progress });
      }
    
      render() {
        // console.log(individualData)

        const { data, steps, progress } = this.state;
        const { classes } = this.props;
    
        return (
          <div className="scroller-main">
            <svg className="scroller-graphic"
                 viewBox={[0, 0, 50, 200]}>
                <g ref={this.popRef}></g>
                <text x="20" y="35" className="small">{data}</text>
            </svg>
            <div className="scroller">
              <Scrollama
                onStepEnter={this.onStepEnter}
                onStepExit={this.onStepExit}
                progress
                onStepProgress={this.onStepProgress}
                offset={0.25}
                debug
              >
                {steps.map(value => (
                  <Step data={value} key={value}>
                    <div className="scroller-step">
                      <p>step value: {value}</p>
                      <p>{value === data && progress}</p>
                    </div>
                  </Step>
                ))}
              </Scrollama>
            </div>

          </div>
        );
      }
}

const countIndividaulsPerGeneration = (data, val) => nest()
  .key( d => [d.output_gen, d.pop, d.m, d.mu, d.r, d.sigsqr])
  .rollup( v => v.length)
  .entries(data.filter(r => r.pop === val))

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

const maxPerPop = (data) => {
  let maxPop = {};

  Object.keys(data).map((key, i) => {
    maxPop[key] = max(data[key], d => d.value);
  })
  return maxPop;
}



export default Graphic;