import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { line } from 'd3-shape';
import ContextBrush from './ContextBrush';
import { select, selectAll } from 'd3';

class FocusLineChart extends Component {

    componentDidMount() {
        console.log(this.props);
    }

    componentDidUpdate() {
        console.log(this.props);
    }

    yScale = scaleLinear()
    .domain([
        min(this.props.data, d => d.pop_phen),
        max(this.props.data, d => d.pop_phen)
    ])
    .range([this.props.height - this.props.margin.bottom, this.props.margin.top]);



    drawLine = line()
        .x(d => this.props.xScale(d.output_gen))
        .y(d => this.yScale(d.pop_phen));


    render(){
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

        let focusBackgroundLines = nest()
            .key(d => [ d.pop, d.m, d.mu, d.r, d.sigsqr])
            .entries(this.props.data)
            .map((d, i) => <path 
            key={`line_${i}`}
            fill='none'
            strokeWidth={2}
            stroke={'#000'}
            className='focus-background-lines'
            d={this.drawLine(d.values)}>
            </path>);

    
            


        return <svg viewBox={[0, 0, this.props.width, this.props.height]}>
            {focusBackgroundLines}

        </svg>
    }


}

export default FocusLineChart;