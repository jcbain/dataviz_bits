import React, { Component } from 'react';
import template from '../data/genome_template.json';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class Genome extends Component {
    constructor(props) {
        super(props);
        this.template = template;
        this.opacityScale = scaleLinear()
        .domain([0, max(this.props.data, d => Math.abs(d.positional_phen))])
        .range([0, 100]);
    }

    genomeRef = React.createRef();

    createData(){
        const outputGen = this.props.outputGen;
        const pop = this.props.pop;

        let dataFiltered = this.props.data.filter(function(d) {
            return d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "2" && d.output_gen === outputGen && d.pop === pop;
        })
        
        let dataCurrentGenome = []
        template.forEach((p)=>{
            let result = dataFiltered.filter(function(d){
                return d.position === p.position;
            })
            p.positional_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
            dataCurrentGenome.push(p);
        })

        return dataCurrentGenome;
        
    }

    componentDidMount(){

        let yScale = scaleLinear()
            .domain([0, this.createData().length])
            .range([0, 100]);
    
        select(this.genomeRef.current)
            .selectAll(`.stop_${this.props.id}_${this.props.pop}`)
            .data(this.createData())
            .enter()
            .append('stop')
            .attr('class', `stop_${this.props.id}_${this.props.pop}`)
            .attr('stop-color', d => {
                if( d.positional_phen > 0){
                    return '#ba3252'
                } else if(d.positional_phen < 0){
                    return '#3277a8'
                } else {
                    return '#fffff7'
                }
            })
            .attr('stop-opacity', d => {
                if (d.positional_phen == 0) {
                    return "100%"
                } else{
                    return this.opacityScale(Math.abs(d.positional_phen)) + "%"
                }
                } )
            .attr('offset', (d, i) => yScale(i) + "%");
    }

    componentDidUpdate() {

        select(this.genomeRef.current)
            .selectAll(`.stop_${this.props.id}_${this.props.pop}`)
            .data(this.createData())
            .transition()
            .duration(3000)
            .attr('stop-color', d => {
                if( d.positional_phen > 0){
                    return '#ba3252'
                } else if(d.positional_phen < 0){
                    return '#3277a8'
                } else {
                    return '#fffff7'
                }
            })
            .attr('stop-opacity', d => {
                if (d.positional_phen == 0) {
                    return "100%"
                } else{
                    return this.opacityScale(Math.abs(d.positional_phen)) + "%"
                }
                });
    }

    render() {
        return (
            <svg viewBox={[0, 0, 50, 200]}>
            <linearGradient ref={this.genomeRef} 
                            gradientUnits="userSpaceOnUse"
                            id={`grads_pop_${this.props.id}_${this.props.pop}`}
                            x1={0}
                            y1={25}
                            x2={0}
                            y2={95}>  

            </linearGradient>
            <rect className="chrome"
                  x={20}
                  y={20}
                  rx={5}
                  ry={5}
                  height={80}
                  width={10}
                  stroke={"#f2f2e6"}
                  strokeWidth={.5}
                  fill={`url(#grads_pop_${this.props.id}_${this.props.pop})`}>
            </rect>

        </svg>
        )
    }

}

export default Genome;