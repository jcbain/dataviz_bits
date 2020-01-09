// add unique method to Array prototype
Array.prototype.unique = function(){
    return this.filter(function(value, index, self){
        return self.indexOf(value) === index;
    });
}

// simulation variables
const popSize     = 1000;

// plotting variables
const chartWidth  = 800;
const chartHeight = 400;
const padding     = 50; 

d3.json("DATA/mutations_bg.json").then( dataset => {
    let dataPopPhenotype = [];

    // find the chromosome positional phenotype
    dataset.forEach(d => {
        d['positional_phen'] = d.freq * d.select_coef; 
    });

    // find the population phenotype
    // TODO: clean up how the new values are named in the array
    //       Perhaps a loop or something will make this a bit cleaner
    // TODO: remove the 'key' and 'value' items from each array in 
    //       the dataPopPhenotype data array.
    d3.nest()
        .key(d => [d.output_gen, d.pop, d.m, d.mu, d.r, d.sigsqr])
        .rollup(v => d3.sum(v, d => d.positional_phen))
        .entries(dataset)
        .forEach(d => {
            let vals = d.key.split(",");
            d['output_gen'] = parseInt(vals[0]);
            d['pop']        = vals[1];
            d['m']          = vals[2];
            d['mu']         = vals[3];
            d['r']          = vals[4];
            d['sigsqr']     = vals[5];
            d['pop_phen']   = d.value;
            dataPopPhenotype.push(d);
        })
    
    return dataPopPhenotype;

    // // draw svg box
    // let svg = d3.select('#line-chart')
    //     .append('svg')
    //     .attr('width', chartWidth)
    //     .attr('height', chartHeight);

    // let xScale = d3.scaleLinear()
    //     .domain([0, d3.max(dataPopPhenotype, d => d.output_gen)])
    //     .range(padding, chartWidth - padding);

    // console.log(d3.max(dataPopPhenotype, d => d.output_gen));
    // console.log(padding);
    // console.log(chartWidth - padding);
    
    // let yScale = d3.scaleLinear()
    //     .domain([-2, 2])
    //     .range(chartHeight - padding, padding);

    // let xAxis = d3.axisBottom( xScale );

    // svg.append('g')
    //     .attr('class', 'x-axis')
    //     .attr('transform',
    //           'translate(0, 400)'
    //          )
    //     .call( xAxis );

    // console.log(dataPopPhenotype);
}).then(data => {
    // draw svg box
    let svg = d3.select('#line-chart')
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', chartHeight);

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.output_gen)])
        .range([padding, chartWidth - padding]);

    let yScale = d3.scaleLinear()
        .domain([-.6, .6])
        .range([chartHeight - padding, padding]);
    
    // create axes
    let xAxis = d3.axisBottom( xScale );
    let yAxis = d3.axisLeft( yScale );

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform',
              'translate(0,' + (chartHeight - padding) + ')'
             )
        .call( xAxis );

    svg.append('g')
        .attr('class', 'y-axis')
        .attr("transform", 
              "translate(" + padding + ",0)")
        .call(yAxis);
    
    let showcaseDataPop1 = data.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "25" && d.m == "1e-5" && d.pop == "0";
    })   
    let showcaseDataPop2 = data.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "25" && d.m == "1e-5" && d.pop == "1";
    })   
    let showcaseDataM1en6 = data.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "25" && d.m == "1e-4" && d.pop == "0";
    })  

    let dataPartOne = data.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-4" ;
    })

    let d1 = d3.nest()
                .key(d => d.pop)
                .entries(dataPartOne);
    
    console.log(d1);

    let numPops = d1.map(d => d.key);
    let color = d3.scaleOrdinal()
        .domain(numPops)
        .range(['#e41a1c','#377eb8']);
    


    let line = d3.line()
    // This defined function will check if a condition is true
    // and if it is not then it will exclude that part of the path.
        // .defined(function(d){
        //     return d.value >= 0;
        // })
        .x(function(d){
            return xScale(d.output_gen);
        })
        .y(function(d){
            return yScale(d.pop_phen);
        });
    
    // svg.append('path')
    //     .datum( showcaseDataPop1 )
    //     .attr('stroke', '#73ff36')
    //     .attr('fill', 'none')
    //     .attr('stroke-width', 2)
    //     .attr('d', line);
    
    // TODO: Create paths with grouping instead of all of this repeat code.
    //       In other words, I really need to clean this up.
    // svg.append('path')
    //     .datum(d1)
    //     .attr('stroke', function(d){return color(d.key)})
    //     .attr('fill', 'none')
    //     .attr('stroke-width', 4)
    //     .attr('d', line);    


    svg.append('path')
        .datum( showcaseDataPop2 )
        .attr('stroke', 'red')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('d', line);

    svg.append('line')
        .attr('x1', padding)
        .attr('x2', chartWidth - padding)
        .attr('y1', chartHeight - (padding/2))
        .attr('y2', chartHeight - (padding/2))
        .attr('stroke', 'gray')
        .attr('stroke-width', 3);

    let pathPop1 = svg.append("path")
        .datum(showcaseDataPop1)
        .attr("d", line)
        .attr("stroke", "darkgrey")
        .attr("stroke-width", "2")
        .attr("fill", "none");

    let pathPop2 = svg.append("path")
        .datum(showcaseDataPop2)
        .attr("d", line)
        .attr("stroke", "darkgrey")
        .attr("stroke-width", "2")
        .attr("fill", "none");

    let totalLengthPop1 = pathPop1.node().getTotalLength();
    let totalLengthPop2 = pathPop2.node().getTotalLength();

    pathPop1
        .attr("stroke-dasharray", totalLengthPop1 + " " + totalLengthPop1)
        .attr("stroke-dashoffset", totalLengthPop1)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    pathPop2
        .attr("stroke-dasharray", totalLengthPop2 + " " + totalLengthPop2)
        .attr("stroke-dashoffset", totalLengthPop2)
        .transition()
        .duration(4000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);


    function updateData(dataset) {
  // Create a update selection: bind to the new data
//   var u = svg.selectAll(".lineTest")
    //  var u = svg.selectAll('.lineTest')
    var u = pathPop1
        .datum(dataset)
        .attr("stroke-dasharray", 0 + " " + 0);

    let totalLengthPopNew = u.node().getTotalLength();

    console.log(totalLengthPopNew);
     

  // Updata the line
  u
    // .enter()
    // .append("path")
    .merge(u)
    // .attr('class', 'lineTest')
    .transition()
    .duration(3000)
    .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 5)
    }

    // updateData(showcaseDataM1en6);
    d3.select('#option-one')
        .on('click', () => {
            updateData(showcaseDataPop1);
        })

    d3.select('#option-two')
        .on('click', () => {
            updateData(showcaseDataM1en6);
        })

    // let curtain = svg.append('rect')
    //     .attr('x', -1 * chartWidth)
    //     .attr('y', -1 * chartHeight)
    //     .attr('height', chartHeight)
    //     .attr('width', chartWidth)
    //     .attr('class', 'curtain')
    //     .attr('transform', 'rotate(180)')
    //     .style('fill', '#ffffff')
    //     .style('opacity', .7)


    // d3.select('.m-big')
    //     .on('click', () => {
    //         let newData = filteredData.filter(function(d) {
    //             return d.m == "1e-4";
    //         })
    //         console.log(newData);
    //     })

})