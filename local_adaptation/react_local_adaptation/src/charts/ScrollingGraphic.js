import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';
 
class Graphic extends Component {
  state = {
    data: 0,
  };
 
  onStepEnter = ({ element, data, direction }) => this.setState({ data });
 
  render() {
    const { data } = this.state;
 
    return (
      <div>
        <p>data: {data}</p>
        <Scrollama onStepEnter={this.onStepEnter}>
          <Step data={1}>
          <p>STEP 1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>

          </Step>
          <Step data={2}>
          <p>STEP 2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. Sit amet aliquam id diam maecenas ultricies mi eget. In hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Nibh venenatis cras sed felis. Viverra adipiscing at in tellus integer feugiat scelerisque. Velit ut tortor pretium viverra suspendisse potenti. Lorem ipsum dolor sit amet consectetur adipiscing elit ut aliquam. Vitae elementum curabitur vitae nunc. Elementum facilisis leo vel fringilla est ullamcorper. Ullamcorper eget nulla facilisi etiam dignissim diam quis.</p>
          </Step>
        </Scrollama>
      </div>
    );
  }
}

export default Graphic;