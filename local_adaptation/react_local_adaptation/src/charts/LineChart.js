import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { line } from 'd3-shape';
import ContextBrush from './ContextBrush';
import { select } from 'd3-selection';
import { axisBottom } from 'd3-axis';

class LineChart extends Component {
    constructor(props){
        super(props);
        this.onBrush = this.onBrush.bind(this);
        this.startExtent = {x0: 1000, x1: 5000};
        
        this.state = { brushExtent: [this.startExtent.x0, this.startExtent.x1]}
    }
    
    yScale = scaleLinear()
        .domain([
            min(this.props.data, d => d.pop_phen),
            max(this.props.data, d => d.pop_phen)
        ])
        .range([this.props.chartDims.height - this.props.margin.bottom, this.props.margin.top]);



    drawLine = line()
        .x(d => this.props.xScale(d.output_gen))
        .y(d => this.yScale(d.pop_phen));

    

    brushFn = this.props.changeBrush;
    onBrush(d) {
        this.setState({ brushExtent: d });
        this.brushFn(d);
    }

    xAxis = g => g
        .attr("transform", `translate(0,${this.props.chartDims.height - this.props.margin.bottom})`)
        .call(axisBottom(this.props.xScale));

    componentDidMount() {
        if(this.props.renderAxis){
            let node = select(ReactDOM.findDOMNode(this))
            node.append('g').call(this.xAxis);
        }
    }
      

    render() {   
    
        let dataFiltered = this.props.data.filter(function(d){
            return d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "2";
        })

        let dataGrouped = nest()
            .key( d => d.pop )
            .entries(dataFiltered);

        let popKeys = dataGrouped.map( d => d.key );

        let focusColor = scaleOrdinal()
            .domain(popKeys)
            .range(['#ba3252','#3277a8','#4daf4a']);

        let outsideColor = scaleOrdinal()
            .domain(popKeys)
            .range(['#dbafba', '#b4cbdb', '#89b388'])

        function nonColor(k) {
            return "#dcddde";
        }
        

        const lineGradients = popKeys
            .map((d, i) => <linearGradient
                key={`pop_${i}`}
                gradientUnits='userSpaceOnUse'
                id={`gradient_pop_${d}_${this.props.chartId}`}
                x1={this.props.margin.left}
                y1={0}
                x2={this.props.chartDims.width - this.props.margin.right}
                y2={0}>
                    <stop stopColor={outsideColor(d)} className={`left ${this.props.classStopName.start01}`} offset='0%'></stop>
                    <stop stopColor={focusColor(d)} className={`left ${this.props.classStopName.start02}`} offset='0%'></stop>
                    <stop stopColor={focusColor(d)} className={`right ${this.props.classStopName.end01}`} offset='100%'></stop>
                    <stop stopColor={outsideColor(d)} className={`right ${this.props.classStopName.end02}`} offset='100%'></stop>
            </linearGradient>);

        let contextBackgroundLines = nest()
            .key(d => [ d.pop, d.m, d.mu, d.r, d.sigsqr])
            .entries(this.props.data)
            .map((d, i) => <path 
            key={`nonline_${i}_${this.props.chartId}`}
            fill='none'
            strokeWidth={2}
            stroke={nonColor(d.key)}
            className='context-background-lines'
            d={this.drawLine(d.values)}>
            </path>);

        let contextLines = dataGrouped
            .map((d, i) => <path
                key={`line_${i}_${this.props.chartId}`}
                fill='none'
                strokeWidth={2.5}
                stroke={`url(#gradient_pop_${d.key}_${this.props.chartId})`}
                className='context-line'
                d={this.drawLine(d.values)}>
            </path>);


        let brush;
        if (this.props.renderBrush){
            brush = <ContextBrush data={this.props.data} 
            xScale={this.props.xScale} 
            changeBrush={this.onBrush}
            margin={this.props.margin}
            chartDims={this.props.chartDims} 
            classStopName={this.props.classStopName} 
            startExtent = {this.startExtent} />;
        }





        return <svg viewBox={[0, 0, this.props.chartDims.width, this.props.chartDims.height]}>
                    {lineGradients}
                    {contextBackgroundLines}
                    {contextLines}
                    {brush}

                </svg>
    }
}

export default LineChart;