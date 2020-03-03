import React, { Component } from 'react';
import './App.css';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { line } from 'd3-shape';
import ContextBrush from './ContextBrush'

class LineChart extends Component {
    render() {   
        
        let xScale = scaleLinear()
            .domain([min(this.props.data, d => d.output_gen),
                     max(this.props.data, d => d.output_gen)])
            .range([margin.left, chartDims.width - margin.right]);

        let yScale = scaleLinear()
            .domain([
                min(this.props.data, d => d.pop_phen),
                max(this.props.data, d => d.pop_phen)
            ])
            .range([chartDims.height - margin.bottom, margin.top]);
        

        let dataFiltered = this.props.data.filter(function(d){
            return d.mu == "1e-6" && d.m == "1e-4" && d.r == "2";
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
        

        const lineGradients = popKeys
            .map((d, i) => <linearGradient
                key={`pop_${i}`}
                gradientUnits='userSpaceOnUse'
                id={`gradient_pop_${d}`}
                x1={margin.left}
                y1={0}
                x2={chartDims.width - margin.right}
                y2={0}>
                    <stop stopColor={outsideColor(d)} className='left start-dull' offset="25%"></stop>
                    <stop stopColor={focusColor(d)} className='left start-color' offset="25%"></stop>
                    <stop stopColor={focusColor(d)} className='right end-color' offset="45%"></stop>
                    <stop stopColor={outsideColor(d)} className='right end-dull' offset="45%"></stop>
            </linearGradient>);

        const drawLine = line()
            .x(d => xScale(d.output_gen))
            .y(d => yScale(d.pop_phen));

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

        return <svg viewBox={[0, 0, chartDims.width, chartDims.height]}>
                    {lineGradients}
                    {contextLines}
                    <ContextBrush data={this.props.data}/>
                </svg>
    }
}

const margin = {top: 10, right: 20, bottom: 20, left: 20};
const chartDims = {width: 800, height: 100};

export default LineChart;