import React, { Component } from 'react';
import './App.css';
import './style.css';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { brushX } from 'd3-brush';
import { select, selectAll, event, mouse } from 'd3-selection';

class SimpleBrush extends Component {
    constructor(props) {
        super(props)

        this.state = {};
    }



    createBrush() {
        return (
            <g className="brush"
                pointerEvents="all">
                <rect className="overlay"
                      fill="none"
                      pointerEvents="all"
                      cursor="crosshair"
                      x="20"
                      y="10"
                      width="760"
                      height="70"></rect>
                <rect className="selection" 
                      cursor="move"
                      fill = "#777"
                      fillOpacity={0.3}
                      stroke="#fff"
                      shapeRendering="crispEdges"
                      x="20"
                      y="10"
                      width="62"
                      height="70">
                </rect>
                <rect className="handle handle--w"
                      cursor="ew-resize"
                      x="17"
                      y="7"
                      width="6"
                      height="76"
                >
                </rect>
                <rect className="handle handle--e"
                      cursor="ew-resize"
                      x="79"
                      y="7"
                      width="6"
                      height="76"
                >   
                </rect>
            </g>

        );
    }



    render(){
        return <svg width={800} height={100}>
            {this.createBrush()}
        </svg>
    }

}

export default SimpleBrush;