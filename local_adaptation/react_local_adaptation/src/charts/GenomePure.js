import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import template from '../data/genome_template.json';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { select, selectAll } from 'd3-selection';


function checkPhenVal(val){
    if(val > 0) {
        return "#ba3252";
    } else if(val < 0) {
        return '#3277a8';
    } else {
        return '#fffff7';
    }
}


class GenomePure extends Component {
    constructor(props){
        super(props);  
        this.template = template;      
    }

    componentDidUpdate(){
        // let node = ReactDOM.findDOMNode(this);
        // console.log(node);
    }


    render() {
        let outputGen = this.props.outputGen;
        let pop = this.props.pop;

        let opacityScale = scaleLinear()
            .domain([0, max(this.props.data, d => Math.abs(d.position_phen))])
            .range([0, 100]);

        function checkOpacityValue(val){
            if(val === 0){
                return '100%';
            } else {
                return opacityScale(Math.abs(val)) + '%';
            }
        }


        let dataFiltered2 = this.props.data.filter(function(d){
            return d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "2" && d.output_gen === outputGen && d.pop === pop;
        })


        let dataCurrentGenome2 = [];
        this.template.forEach(function(p){
            let result = dataFiltered2.filter(function(d){
                return d.position == p.position;
            })
            p.positional_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
            dataCurrentGenome2.push(p);
        })

        let yScale = scaleLinear()
        .domain([0, dataCurrentGenome2.length])
        .range([0, 100]);

        const alleleEffects = dataCurrentGenome2
            .map((d, i) => <stop
                stopColor={checkPhenVal(d.positional_phen)}
                stopOpacity={checkOpacityValue(d.positional_phen)}
                offset={`${yScale(i)}%`}></stop>)



        return (
            <svg viewBox={[0, 0, 50, 200]}>
                <linearGradient gradientUnits="userSpaceOnUse"
                                id={`grads_pop_${this.props.pop}`}
                                x1={0}
                                y1={25}
                                x2={0}
                                y2={55}>
                    {alleleEffects}    

                </linearGradient>
                <rect className="chrome6"
                      x={20}
                      y={20}
                      rx={5}
                      ry={5}
                      height={40}
                      width={10}
                      strokeWidth={.5}
                      stroke={"#f2f2e6"}
                      fill={`url(#grads_pop_${this.props.pop})`}>
                </rect>

            </svg>
        )
    }

}

export default GenomePure;