import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';

import { select } from 'd3-selection';

import individualData from '../data/individuals';
 
import './styles/scrolling_graphic_styles.css';

class Graphic extends Component {
    state = {
        data: 0,
        steps: [10, 20, 30],
        progress: 0,
      };

      popRef = React.createRef();

      componentDidMount(){
          select(this.popRef.current)
            .selectAll('rect')
            .data([1,2,3,4])
            .enter()
            .append('rect')
            .attr('x', (d, i) => i *10)
            .attr('y', 10)
            .attr('height', 10)
            .attr('width', 10)
            .attr('fill', 'black')
          
      }
    
      onStepEnter = ({ element, data }) => {
        element.style.border = '1px solid goldenrod';
        this.setState({ data });
      };
    
      onStepExit = ({ element }) => {
        element.style.border = '1px solid black';
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
                <text x="20" y="35" class="small">{data}</text>
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

export default Graphic;