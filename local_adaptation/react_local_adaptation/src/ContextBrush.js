import React, { Component } from 'react';
import './App.css';
import './style.css';
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

    createBrush() {
        const node = this.node;
        const interval = closestFromArray(this.props.data.map(d => parseInt(d.output_gen)))

        let xScale = this.props.xScale;
        let classStopName = this.props.classStopName;
        let brushFn = this.props.changeBrush;


        const brushScale = scaleLinear()
            .domain([
                min(this.props.data, d => d.output_gen),
                max(this.props.data, d => d.output_gen)
            ])
            .range([0, 100]);


        const contextBrush = brushX()
            .extent([
                [this.props.margin.left, this.props.margin.top], 
                [this.props.chartDims.width - this.props.margin.right, this.props.chartDims.height - this.props.margin.bottom]
            ])
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
            .call(contextBrush.move, [this.props.startExtent.x0, this.props.startExtent.x1].map(xScale))
            .call(g => g.select('.overlay')
            .datum({type: 'selection'})
            .on("mousedown touchstart", centerAroundTouch));

        selectAll(`.${classStopName.start01}`).attr('offset', brushScale(this.props.startExtent.x0) + '%');
        selectAll(`.${classStopName.start02}`).attr('offset', brushScale(this.props.startExtent.x0) + '%');
        selectAll(`.${classStopName.end01}`).attr('offset', brushScale(this.props.startExtent.x1) + '%');
        selectAll(`.${classStopName.end02}`).attr('offset', brushScale(this.props.startExtent.x1) + '%');

        function brushed() {
            const selection = event.selection;
            if (!event.sourceEvent || !selection) return;
            if (selection === null){
                selectAll('.left').attr('offset', '0%');
                selectAll('.right').attr('offset', '0%')
            } else{
                let [x0, x1] = selection.map(d => interval(xScale.invert(d)));
                select(this).transition().duration(1).call(contextBrush.move, x1 > x0 ? [x0, x1].map(xScale) : null);
                selectAll(`.${classStopName.start01}`).transition().duration(1).attr('offset', brushScale(x0) + '%');
                selectAll(`.${classStopName.start02}`).transition().duration(1).attr('offset', brushScale(x0) + '%');
                selectAll(`.${classStopName.end01}`).transition().duration(1).attr('offset', brushScale(x1) + '%');
                selectAll(`.${classStopName.end02}`).transition().duration(1).attr('offset', brushScale(x1) + '%');
                brushFn(selection.map(d => xScale.invert(d)))
            }

          }

        function centerAroundTouch() {
            let dx = xScale(5000);
            let [cx] = mouse(this);
            let [x0, x1] = [cx - dx / 2, cx + dx / 2].map(d => interval(xScale.invert(d)));
            let [X0, X1] = xScale.domain();
            select(this.parentNode)
                .call(contextBrush.move, x1 > X1 ? [X1 - dx, X1].map(xScale) 
                    : x0 < X0 ? [X0, X0 + dx].map(xScale) 
                    : [x0, x1].map(xScale));
        }

        function closestFromArray (arr){
            return (target) => arr.reduce(function(prev, curr){
                return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
            })
        }
        
    }

    render() {
        return <svg ref={node => this.node = node}
                width={this.props.chartDims.width} height={this.props.chartDims.height} >
        </svg>
    }
}




export default ContextBrush;