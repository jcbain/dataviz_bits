import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';

import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import { easeBounce, easeSinInOut } from 'd3-ease';
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
        this.numCols = 25;
        this.individualPadding = 1.5
        this.genCounts = individualData.map(d => d.pop).filter(unique).map(v => countIndividaulsPerGeneration(individualData, v))
        this.populations = individualData.map(d => d.pop).filter(unique)
        this.maxPopVal = maxPerPop(this.genCounts);
        this.colorScale = scaleLinear()
                            .domain([-1, 0, 1])
                            .range(['#C38D9E', '#fffff7', '#E27D60'])
                            .interpolate(interpolateHcl);

        this.state = {
            data: 1000,
            steps: [10000, 20000, 50000],
            progress: 0,
            outputGen: 1000,
          };
    }

      popRef = React.createRef();

      createData(){
        const numCols = this.numCols;
        let filteredData = individualData.filter(d => d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "25" && d.output_gen == this.state.data)
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

        

        this.populations.map(d => {
          let shifter = d * numCols;
          let currentYIndex = 1;
          let currentXIndex = 0;
          chosenData.filter(v => v.pop == d).forEach(function(r, i){
            if((i + 1)/(numCols) >= currentYIndex) {
              r['y'] = currentYIndex - 1;
              currentYIndex++
            } else {
              r['y'] = currentYIndex - 1;
            }
            if((i + 1) % (numCols) === 0){
              r['x'] = currentXIndex + shifter;
              currentXIndex = 0
            } else {
              r['x'] = currentXIndex + shifter;
              currentXIndex++;
            }
          })
        })


        return chosenData;

      }

      componentDidMount(){
          // console.log(this.maxPopVal)
          // console.log(this.createData())
          console.log(this.state)
          select(this.popRef.current)
            .selectAll('.pop_rects')  
            .data(this.createData())
            .enter()
            .append('rect')
            .attr('class', 'pop_rects')
            .attr('x', (d, i) => (((d.x) * this.squareSize ) ))
            .attr('y', d => d.y * this.squareSize)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('height', this.squareSize)
            .attr('width', this.squareSize)
            .attr('fill', d => this.colorScale(d.ind_phen))
          
      }
    
      onStepEnter = ({ element, data}) => {
        element.style.border = '1px solid goldenrod';
        this.setState({ data });
        select(this.popRef.current)
          .selectAll('.pop_rects')  
          .data(this.createData())
          .enter()
          .append('rect')
          .attr('class', 'pop_rects')
          .attr('x', (d, i) => {
            return ((d.x * 1.5)* this.squareSize) + d.pop * 0;
          })
          .attr('y', d => (d.y * 1.5) * this.squareSize)
          .attr('rx', 2)
          .attr('ry', 2)
          .transition()
          .attr('height', this.squareSize)
          .attr('width', this.squareSize)
          
          .attr('fill', d => this.colorScale(d.ind_phen))
          .duration(1000)
          .ease(easeSinInOut)
      };
    
      onStepExit = ({ element }) => {
        element.style.border = '1px solid black';
        selectAll('.pop_rects')
          .transition()
          .attr('width', 0)
          .attr('height', 0)
          .duration(1000)
        .remove()
      };
    
      onStepProgress = ({ element, progress }) => {
        this.setState({ progress });
      }
    
      render() {
        // console.log(individualData)

        const { data, steps, progress} = this.state;
        const { classes } = this.props;
    
        return (
          <div className="scroller-main">
            <svg className="scroller-graphic"
                 viewBox={[0, 0, (this.squareSize * this.numCols * this.individualPadding * 2)  - this.individualPadding, 100]}
                 >  
                <svg x="0" 
                     y="0" 
                     viewBox={[0, 0, (this.squareSize * this.numCols * this.individualPadding * 2) - this.individualPadding, 100]} 
                     preserveAspectRatio="xMinYMid meet" 
                     ref={this.popRef}
                     className="pop-graphic"></svg>
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
                <Step data={10000}>
                  <div className="scroller-step">
                    <p>And at 10,000th generation</p>
                  </div>
                </Step>

                <Step data={20000}>
                  <div className="scroller-step">
                    <p>And at 20,000th generation</p>
                  </div>
                </Step>

                <Step data={50000}>
                  <div className="scroller-step">
                    <p>And at 50,000th generation</p>
                  </div>
                </Step>
                {/* {steps.map(value => (
                  <Step data={value} key={value}>
                    <div className="scroller-step">
                      <p>step value: {value}</p>
                      <p>{value === data && progress}</p>
                    </div>
                  </Step>
                ))} */}
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