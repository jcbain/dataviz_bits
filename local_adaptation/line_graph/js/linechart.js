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
    
    
    let tickVals = [];
    let tickLabs = [];
    let currentTickVals = xScale.ticks();
    let maxXVal = d3.max(xScale.ticks());
    for (let i = 0; i <= maxXVal; i += 1000){
        tickVals.push(i);
    }
    tickVals.forEach(v => {
        if(currentTickVals.includes(v)){
            if(v == 0){
                tickLabs.push("")
            } else{
                tickLabs.push(v/1000 + "K");
            }
        } else {
            tickLabs.push("");
        }
    })
    
    // create axes
    let xAxis = d3.axisBottom( xScale )
        .tickValues(tickVals)
        .tickFormat(function(d,i){
        return tickLabs[i];
    });
    let yAxis = d3.axisLeft( yScale );

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform',
              'translate(0,' + (chartHeight - padding) + ')'
             )
        .call( xAxis )
        .call(g => g.select('.domain').remove()); // remove axis line

    d3.selectAll('g.x-axis g.tick line')
        .attr('y2', function(d){
            if(currentTickVals.includes(d)){
                return 10;
            } else {
                return 2;
            }
        })

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
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-5";
    })

    let dataPartTwo = data.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-4";
    })

    let d1 = dataPartOne.filter(function(d){
        return d.pop == "0";
    })

    let d2 = dataPartOne.filter(function(d){
        return d.pop == "1";
    })

    let d12 = dataPartTwo.filter(function(d){
        return d.pop == "0";
    })

    let d22 = dataPartTwo.filter(function(d){
        return d.pop == "1";
    })



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
    

    // TODO: Create paths with grouping instead of all of this repeat code.
    //       In other words, I really need to clean this up.

    let path1 = svg.append('path')
        .datum(d1)
        .attr('stroke', '#fc6742')
        .attr('fill', 'none')
        .attr('stroke-width', 4)
        .attr('d', line);

    let path2 = svg.append('path')
        .datum(d2)
        .attr('stroke', '#4287f5')
        .attr('fill', 'none')
        .attr('stroke-width', 4)
        .attr('d', line);

    // svg.append('line')
    //     .attr('x1', padding)
    //     .attr('x2', chartWidth - padding)
    //     .attr('y1', chartHeight - (padding/2))
    //     .attr('y2', chartHeight - (padding/2))
    //     .attr('stroke', 'gray')
    //     .attr('stroke-width', 3);

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

    let totalLength1 = path1.node().getTotalLength();
    let totalLength2 = path2.node().getTotalLength();

    path1
        .attr('stroke-dasharray', totalLength1 + " " + totalLength1)
        .attr('stroke-dashoffset', totalLength1)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    path2
        .attr('stroke-dasharray', totalLength2 + " " + totalLength2)
        .attr('stroke-dashoffset', totalLength2)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    function updateData(dataset) {
        let updatePath1 = path1
            .datum(dataset)
            .attr('stroke-dasharray', '0 0');

        let updatePath2 = path2
            .datum(dataset)
            .attr('stroke-dasharray', '0 0');

        // Updata the line
        updatePath1
            .merge(updatePath1)
            .transition()
            .duration(3000)
            .attr("d", line);

        updatePath2
            .merge(updatePath2)
            .transition()
            .duration(3000)
            .attr("d", line);
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

})