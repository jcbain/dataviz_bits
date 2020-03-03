import React, { Component } from 'react';
import './App.css';
import { scaleLinear } from 'd3-scale';
import { brushX } from 'd3-brush';

class ContextBrush extends Component {
    constructor(props) {
        super(props);
        this.creatBrush = this.createBursh.bind(this);
    }

    componentDidMount() {
        this.createBrush();
    }

    componentDidUpdate() {
        this.createBrush();
    }
    
    createBrush() {
        const node = this.node;
    }
}


const margin = {top: 10, right: 20, bottom: 20, left: 20};
const chartDims = {width: 800, height: 100};
