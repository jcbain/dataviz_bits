import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import template from './data/genome_template.json';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { min, max } from 'd3-array';
import { nest } from 'd3-collection';
import { select, selectAll } from 'd3-selection';

function uniqueFromArray(arr) {
    return arr.filter(function(value, index, self){
      return self.indexOf(value) === index;
    })
  }

function checkPhenVal(val){
    if(val > 0) {
        return "#ba3252";
    } else if(val < 0) {
        return '#3277a8';
    } else {
        return '#fffff7';
    }
}


class Genome extends Component {
    constructor(props){
        super(props);        
    }

    componentDidUpdate(){
        let node = ReactDOM.findDOMNode(this);
        console.log(node);
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


        let dataFiltered = this.props.data.filter(function(d){
            return d.mu === "1e-6" && d.m === "1e-4" && d.sigsqr === "2" && d.output_gen === outputGen && d.pop === pop;
        })


        let dataCurrentGenome = [];
        template.forEach(function(p){
            let result = dataFiltered.filter(function(d){
                return d.position == p.position;
            })
            p.position_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
            dataCurrentGenome.push(p);
        })

        let yScale = scaleLinear()
        .domain([0, dataCurrentGenome.length])
        .range([0, 100]);

        const alleleEffects = dataCurrentGenome
            .map((d, i) => <stop
                stopColor={checkPhenVal(d.position_phen)}
                stopOpacity={checkOpacityValue(d.position_phen)}
                offset={`${yScale(i)}%`}></stop>)



        return (
            <svg viewBox={[0, 0, 50, 200]}>
                <linearGradient gradientUnits="userSpaceOnUse"
                                id={`grads_pop_${this.props.pop}`}
                                x1={0}
                                y1={0}
                                x2={0}
                                y2={40}>
                    {alleleEffects}    

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

export default Genome;