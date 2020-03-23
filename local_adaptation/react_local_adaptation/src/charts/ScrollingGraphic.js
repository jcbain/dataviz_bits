import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';

import { select, selectAll } from 'd3-selection';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';

import individualData from '../data/individuals_small';
 
import './styles/scrolling_graphic_styles.css';

class Graphic extends Component {
    constructor(props){
        super(props);
        this.squareSize = 10;
        this.genCounts = individualData.map(d => d.pop).filter(unique).map(v => countIndividaulsPerGeneration(individualData, v))
        this.maxPopVal = maxPerPop(this.genCounts);
        
        this.state = {
            data: 0,
            steps: [10, 20, 30],
            progress: 0,
            output_gen: 1000,
          };
    }


      popRef = React.createRef();

      componentDidMount(){
          console.log(this.maxPopVal)
          select(this.popRef.current)
            .selectAll('rect')  
            .data([1,2,3,4])
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * this.squareSize)
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