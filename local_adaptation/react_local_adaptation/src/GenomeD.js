import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import template from './data/genome_template.json';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { select, selectAll } from 'd3-selection';

class GenomeD extends Component {
    constructor(props) {
        super(props);
    

        this.dataFiltered = this.props.data.filter(d => {
            return d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "2" && d.output_gen === this.props.outputGen && d.pop === this.props.pop;
        })
        
        this.dataCurrentGenome = []
        template.forEach((p)=>{
            let result = this.dataFiltered.filter(function(d){
                return d.position == p.position;
            })
            p.positional_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
            this.dataCurrentGenome.push(p);
        })

        this.yScale = scaleLinear()
            .domain([0, this.dataCurrentGenome.length])
            .range([0, 100]);

        this.opacityScale = scaleLinear()
            .domain([0, max(this.props.data, d => Math.abs(d.positional_phen))])
            .range([0, 100]);
    }


    genomeRef = React.createRef();




    componentDidMount(){
        console.log(this.dataCurrentGenome)
        select(this.genomeRef.current)
            .selectAll('stop')
            .data(this.dataCurrentGenome)
            .enter()
            .append('stop')
            .attr('stop-color', d => {
                if( d.positional_phen > 0){
                    return '#ba3252'
                } else if(d.positional_phen < 0){
                    return '#3277a8'
                } else {
                    return '#fffff7'
                }
            })
            .attr('stop-opacity', '100%')
            .attr('offset', (d, i) => this.yScale(i) + "%");
    }

    componentDidUpdate() {
        // this.setState({outputGen: this.props.outputGen});
        console.log(this.dataCurrentGenome);
        // select(this.genomeRef.current)
            // .transition()
            // .duration(3000)
            // .attr('fill', '#000');

            select(this.genomeRef.current)
            .selectAll('stop')
            .data(this.dataCurrentGenome)
            .transition()
            .attr('stop-color', d => {
                if( d.positional_phen > 0){
                    return '#ba3252'
                } else if(d.positional_phen < 0){
                    return '#3277a8'
                } else {
                    return '#fffff7'
                }
            })
            .attr('stop-opacity', '100%')
            .attr('offset', (d, i) => this.yScale(i) + "%");
    }

    render() {
        return (
            <svg viewBox={[0, 0, 50, 200]}>
            <linearGradient ref={this.genomeRef} 
                            gradientUnits="userSpaceOnUse"
                            id={`grads_pop_${this.props.pop}`}
                            x1={0}
                            y1={0}
                            x2={0}
                            y2={40}>  

            </linearGradient>
            <rect className="chrome"
                  x={20}
                  y={20}
                  rx={5}
                  ry={5}
                  height={40}
                  width={10}
                  stroke={'#000'}
                  fill={`url(#grads_pop_${this.props.pop})`}>
            </rect>

        </svg>
        )
    }

}

export default GenomeD;