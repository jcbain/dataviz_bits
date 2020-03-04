import React, { Component } from 'react';
import './App.css';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { line } from 'd3-shape';
import ContextBrush from './ContextBrush'

class LineChart extends Component {
    render() {   
        
        let xScale = this.props.xScale;

        let yScale = scaleLinear()
            .domain([
                min(this.props.data, d => d.pop_phen),
                max(this.props.data, d => d.pop_phen)
            ])
            .range([this.props.chartDims.height - this.props.margin.bottom, this.props.margin.top]);
        

        let dataFiltered = this.props.data.filter(function(d){
            return d.mu === "1e-6" && d.m === "1e-4" && d.r === "2";
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
                id={`gradient_pop_${d}`}
                x1={this.props.margin.left}
                y1={0}
                x2={this.props.chartDims.width - this.props.margin.right}
                y2={0}>
                    <stop stopColor={outsideColor(d)} className={`left ${this.props.classStopName.start01}`}></stop>
                    <stop stopColor={focusColor(d)} className={`left ${this.props.classStopName.start02}`}></stop>
                    <stop stopColor={focusColor(d)} className={`right ${this.props.classStopName.end01}`}></stop>
                    <stop stopColor={outsideColor(d)} className={`right ${this.props.classStopName.end02}`}></stop>
            </linearGradient>);

        const drawLine = line()
            .x(d => xScale(d.output_gen))
            .y(d => yScale(d.pop_phen));

        const contextBackgroundLines = nest()
            .key(d => [ d.pop, d.m, d.mu, d.r, d.sigsqr])
            .entries(this.props.data)
            .map((d, i) => <path 
            key={`nonline_${i}`}
            fill='none'
            strokeWidth={2}
            stroke={nonColor(d.key)}
            d={drawLine(d.values)}>

            </path>)

        const contextLines = dataGrouped
            .map((d, i) => <path
                key={`line_${i}`}
                fill='none'
                strokeWidth={2.5}
                stroke={`url(#gradient_pop_${d.key})`}
                className='context-line'
                d={drawLine(d.values)}>

                    

        </path>


        )

        return <svg viewBox={[0, 0, this.props.chartDims.width, this.props.chartDims.height]}>
                    {lineGradients}
                    {contextBackgroundLines}
                    {contextLines}
                    <ContextBrush data={this.props.data} 
                                  xScale={this.props.xScale} 
                                  margin={this.props.margin}
                                  chartDims={this.props.chartDims} 
                                  classStopName={this.props.classStopName} />
                </svg>
    }
}

export default LineChart;