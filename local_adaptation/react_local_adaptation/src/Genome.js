import React, { Component } from 'react';
import './App.css';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';


class Genome extends Component {

    render() {
        return (
            <svg viewBox={[0, 0, 50, 200]}>
                <rect className="chrome"
                      x={20}
                      y={20}
                      rx={5}
                      ry={5}
                      height={40}
                      width={10}
                      stroke={'#000'}>
                </rect>

            </svg>
        )
    }

}

export default Genome;