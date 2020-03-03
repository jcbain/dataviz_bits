import React, { Component } from 'react';
import './App.css';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { brushX } from 'd3-brush';
import { select, selectAll, event, mouse } from 'd3-selection';

class ContextBrush extends Component {
    constructor(props) {
        super(props);
        this.createBrush = this.createBrush.bind(this);
    }

    componentDidMount() {
        this.createBrush();
    }

    componentDidUpdate() {
        this.createBrush();
    }
    
    createBrush() {
        const node = this.node;

        let xScale = scaleLinear()
        .domain([min(this.props.data, d => d.output_gen),
                 max(this.props.data, d => d.output_gen)])
        .range([margin.left, chartDims.width - margin.right]);

        const brushScale = scaleLinear()
            .domain([
                min(this.props.data, d => d.output_gen),
                max(this.props.data, d => d.output_gen)
            ])
            .range([0, 100]);

        const contextBrush = brushX()
            .extent([[margin.left, margin.top], [chartDims.width - margin.right, chartDims.height - margin.bottom]])
            .on("brush", brushed);

        select(node)
            .selectAll('g.brush')
            .data([0])
            .enter()
            .append('g')
            .attr('class', 'brush');

        select(node)
            .select('g.brush')
            .call(contextBrush)
            .call(contextBrush.move, [1000, 5000].map(xScale))
            .call(g => g.select('.overlay')
            .datum({type: 'selection'})
            .on("mousedown touchstart", centerAroundTouch));

        function brushed() {
            let selection = event.selection;
            if (selection === null) {
                selectAll('.left').attr('offset', '0%');
                selectAll('.right').attr('offset', '0%')
            } else {
                let [x0, x1] = selection.map(xScale.invert);
                selectAll('.start-dull').attr('offset', brushScale(x0) + '%');
                selectAll('.start-color').attr('offset', brushScale(x0) + '%');
                selectAll('.end-color').attr('offset', brushScale(x1) + '%');
                selectAll('.end-dull').attr('offset', brushScale(x1) + '%');
            }
        }

        function centerAroundTouch() {
            let dx = xScale(3000);
            let [cx] = mouse(this);
            let [x0, x1] = [cx - dx / 2, cx + dx / 2];
            let [X0, X1] = xScale.range();
            select(this.parentNode)
                .call(contextBrush.move, x1 > X1 ? [X1 - dx, X1] 
                    : x0 < X0 ? [X0, X0 + dx] 
                    : [x0, x1]);
        }

        
    }

    render() {
        return <svg ref={node => this.node = node}
                width={chartDims.width} height={chartDims.height}>
        </svg>
    }
}


const margin = {top: 10, right: 20, bottom: 20, left: 20};
const chartDims = {width: 800, height: 100};


export default ContextBrush;