// remember to uncomment this script in index.html

d3.json('data/sample_genome.json').then(function(dataset){
 let data = dataset.filter(function(d){return d.pop == 0 && d.ind_id == 0 && d.output_gen == 50000});

let chromeCount = d3.nest()
    .key(function(d) { return d.genome; })
    .rollup(function (v) { return v.length; })
    .entries(data);

// chart parameters
let chartWidth = 1000;
let chartHeight = 800;
let padding = 50;

// svg
let svg = d3.select('#chart')
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight);

// console.log(JSON.stringify(data));
let chromeOneData = data.filter(function(d){return d.genome == "genome1"});
let chromeTwoData = data.filter(function(d){return d.genome == "genome2"});

// colors
let positiveColor     = '#ebc634'; // yellow alt(#ebc634)
let negativeColor     = '#fdadb6'; // pink
let wildTypeColor     = '#f7f7f7';
let baseStrokeColor   = '#ffffff';
let chromeStrokeColor = '#000000';

let minAbsoluteEffect = 0;
let maxAbsoluteEffect = d3.max(data, function(d){ return Math.abs( d.select_coef );});
// console.log(JSON.stringify(maxAbsoluteEffect));

let genomeLength = chromeOneData.length;
let xPosition = 65;

let chromeHeight = 580;
let chromeWidth = 50; 
let chromeStrokeWidth = 0.5;
let chromeRounding = 20;
let chromeYPosition = 10; 
let baseStrokeWidth = 0.2;
let baseHeight = (chromeHeight / genomeLength) - baseStrokeWidth;
let baseWidth = chromeWidth - baseStrokeWidth - chromeStrokeWidth;

console.log(baseHeight);
let yScale = d3.scaleLinear()
    .domain([genomeLength, 0])
    .range([chromeHeight - chromeRounding - (baseStrokeWidth/2), 
            chromeYPosition + chromeRounding + (baseStrokeWidth/2)]);

// svg elements
let chromes = svg.append("g")
    .attr("class", "chromes");

let bases = svg.append("g")
    .attr("class", "genome1");

bases = svg.append("g")
    .attr("class", "genome2");


bases.selectAll('genome1')
    .data(chromeOneData)
    .enter()
    .append('rect')
    .attr('width', baseWidth)
    .attr('height', baseHeight)
    .attr('x', xPosition + (baseStrokeWidth/2) + (chromeStrokeWidth/2))
    .attr('y', function(d, i){return yScale(i)})
    .attr('fill', function(d){
        if (d.select_coef < 0){
            return positiveColor;
        } else if (d.select_coef > 0){
            return negativeColor;
        } else {
            return wildTypeColor;
        }
    })
    .attr('stroke', baseStrokeColor)
    .attr('stroke-opacity', 1)
    .attr('fill-opacity', function(d){
        if (d.select_coef === 0){
            return 1;
        } else {
            return (Math.abs(d.select_coef) - minAbsoluteEffect)/ (maxAbsoluteEffect - minAbsoluteEffect);
        }
    })
    .attr('stroke-width', baseStrokeWidth);

bases.selectAll('genome2')
    .data(chromeTwoData)
    .enter()
    .append('rect')
    .attr('width', baseWidth)
    .attr('height', baseHeight)
    .attr('x', (xPosition * 2) + (baseStrokeWidth/2) + (chromeStrokeWidth/2))
    .attr('y', function(d, i){return yScale(i)})
    .attr('fill', function(d){
        if (d.select_coef < 0){
            return positiveColor;
        } else if (d.select_coef > 0){
            return negativeColor;
        } else {
            return wildTypeColor;
        }
    })
    .attr('stroke', baseStrokeColor)
    .attr('stroke-opacity', 1)
    .attr('fill-opacity', function(d){
        if (d.select_coef === 0){
            return 1;
        } else {
            return (Math.abs(d.select_coef) - minAbsoluteEffect)/ (maxAbsoluteEffect - minAbsoluteEffect);
        }
    })
    .attr('stroke-width', baseStrokeWidth);

chromes.selectAll('chromes')
    .data(chromeCount)
    .enter()
    .append('rect')
    .attr('width', chromeWidth)
    .attr('height', chromeHeight)
    .attr('x', function(d, i){return (i + 1) * xPosition})
    .attr('y', chromeYPosition)
    .attr('rx', chromeRounding)
    .attr('ry', chromeRounding)
    .attr('fill', wildTypeColor)
    .attr('stroke', chromeStrokeColor)
    .attr('stroke-opacity', 1)
    .attr('fill-opacity', 1)
    .attr('stroke-width', chromeStrokeWidth);
})