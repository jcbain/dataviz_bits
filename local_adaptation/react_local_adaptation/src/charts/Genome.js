import React, { Component } from 'react';
import template from '../data/genome_template.json';
import { scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { select } from 'd3-selection';
import { interpolateHcl } from 'd3-interpolate';

class Genome extends Component {
    constructor(props) {
        super(props);
        this.template = template;
        this.opacityScale = scaleLinear()
        .domain([0, max(this.props.data, d => Math.abs(d.positional_phen))])
        .range([0, 100]);
        this.colorScale = scaleLinear()
        .domain([min(this.props.data, d => d.positional_phen), 0, max(this.props.data, d => d.positional_phen)])
        .range(['#C38D9E', '#fffff7', '#E27D60'])
        .interpolate(interpolateHcl);
    }

    genomeRef = React.createRef();

    createData(){
        const outputGen = this.props.outputGen;
        const pop = this.props.pop;

        let dataFiltered = this.props.data.filter(function(d) {
            return d.mu === "1e-6" && d.m === "1e-5" && d.sigsqr === "25" && d.output_gen === outputGen && d.pop === pop;
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
            .attr('stop-color', d => this.colorScale(d.positional_phen))
            // .attr('stop-color', d => {
            //     if( d.positional_phen > 0){
            //         return '#ba3252'
            //     } else if(d.positional_phen < 0){
            //         return '#3277a8'
            //     } else {
            //         return '#fffff7'
            //     }
            // })
            // .attr('stop-opacity', d => {
            //     if (d.positional_phen == 0) {
            //         return "100%"
            //     } else{
            //         return this.opacityScale(Math.abs(d.positional_phen)) + "%"
            //     }
            //     } )
            .attr('offset', (d, i) => yScale(i) + "%");
    }

    componentDidUpdate() {

        select(this.genomeRef.current)
            .selectAll(`.stop_${this.props.id}_${this.props.pop}`)
            .data(this.createData())
            .transition()
            .duration(3000)
            .attr('stop-color', d => this.colorScale(d.positional_phen))
            // .attr('stop-color', d => {
            //     if( d.positional_phen > 0){
            //         return '#E27D60'
            //     } else if(d.positional_phen < 0){
            //         return '#C38D9E'
            //     } else {
            //         return '#fffff7'
            //     }
            // })
            // .attr('stop-opacity', d => {
            //     if (d.positional_phen == 0) {
            //         return "100%"
            //     } else{
            //         return this.opacityScale(Math.abs(d.positional_phen)) + "%"
            //     }
            //     });
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
                  stroke={"black"}
                  strokeWidth={.5}
                  fill={`url(#grads_pop_${this.props.id}_${this.props.pop})`}>
            </rect>

        </svg>
        )
    }

}

export default Genome;