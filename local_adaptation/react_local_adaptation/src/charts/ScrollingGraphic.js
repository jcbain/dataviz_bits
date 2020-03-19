import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';
 
import './styles/scrolling_graphic_styles.css';

class Graphic extends Component {
    state = {
        data: 0,
        steps: [10, 20, 30],
        progress: 0,
      };
    
      onStepEnter = ({ element, data }) => {
        element.style.backgroundColor = 'lightgoldenrodyellow';
        this.setState({ data });
      };
    
      onStepExit = ({ element }) => {
        element.style.backgroundColor = '#fff';
      };
    
      onStepProgress = ({ element, progress }) => {
        this.setState({ progress });
      }
    
      render() {
        const { data, steps, progress } = this.state;
        const { classes } = this.props;
    
        return (
          <div className="scroller-main">
            <div className="scroller">
              <Scrollama
                onStepEnter={this.onStepEnter}
                onStepExit={this.onStepExit}
                progress
                onStepProgress={this.onStepProgress}
                offset={0.33}
                debug
              >
                {steps.map(value => (
                  <Step data={value} key={value}>
                    <div className="scroller-step">
                      <p className="text-container">step value: {value}</p>
                      <p>{value === data && progress}</p>
                    </div>
                  </Step>
                ))}
              </Scrollama>
            </div>
            <div className="scroller-graphic">
              <p>{data}</p>
            </div>
          </div>
        );
      }
}

export default Graphic;