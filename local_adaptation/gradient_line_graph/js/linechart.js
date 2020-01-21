// unique method for Array prototype
Array.prototype.unique = function() {
    return this.filter(function(value, index, self){
        return self.indexOf(value) === index;
    });
}

// SIMULATION VARIABLES
const popSize = 1000;

// PLOTTING VARIABLES
let chartWidth = 80,
    chartHeight = 20,
    padding = 10;

d3.json("data/mutations_bg.json").then( data => {

    let dataPopPhen = [];
    // find the chromosome positional phenotype
    data.forEach( d => {
        d['positional_phen'] = d.freq * d.select_coef;
    });


    // find the population pehontype value
    // TODO: clean up how the new values are named in the array
    //       Perhaps a loop or something will make this a bit cleaner
    // TODO: remove the 'key' and 'value' items from eadch array in
    //       the dataPopPhenotype data array.
    d3.nest()
        .key( d => [d.output_gen, d.pop, d.m, d.mu, d.r, d.sigsqr])
        .rollup( v => d3.sum(v, d => d.positional_phen))
        .entries(data)
        .forEach( d => {
            let vals = d.key.split(",");
            d['output_gen'] = parseInt(vals[0]);
            d['pop']        = vals[1];
            d['m']          = vals[2];
            d['mu']         = vals[3];
            d['r']          = vals[4];
            d['sigsqr']     = vals[5];
            d['pop_phen']   = d.value;
            dataPopPhen.push(d);
        });
    
    // ********************* |
    // PLOTTING HAPPENS HERE |
    // ********************* V

    let svg = d3.select('#line-chart')
        .append('svg')
        .attr('width', chartWidth + "vw")
        .attr('height', chartHeight + "vh");
    
    // define the scales
    let xScale = d3.scaleLinear()
        .domain([d3.min(dataPopPhen, d => d.output_gen),
                 d3.max(dataPopPhen, d => d.output_gen)])
        
    let yScale = d3.scaleLinear()
        .domain([
            d3.min(dataPopPhen, d => d.pop_phen),
            d3.max(dataPopPhen, d => d.pop_phen)
        ]);

    // update data
    let dataFiltered = dataPopPhen.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-4";
    })

    console.log(dataFiltered);
    let dataGrouped = d3.nest()
        .key( d => d.pop )
        .entries(dataFiltered);

    console.log(dataGrouped);

    let popKeys = dataGrouped.map( d => d.key );
    let color = d3.scaleOrdinal()
        .domain(popKeys)
        .range(['#e41a1c','#377eb8','#4daf4a']);

    let line = svg.selectAll('.line')
        .data(dataGrouped)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => color(d.key))
        .attr('stroke-width', 1.5);

    let linearGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("gradientUnits", "userSpaceOnUse");


        //First stop to fill the region between 0% and 40%
    linearGradient.append("stop")
        .attr("class", "left") //useful later when we want to update the offset
        .attr("offset", "40%")
        .attr("stop-color", "#D6D6D6"); //grey

    //Second stop to fill the region between 40% and 100%
    linearGradient.append("stop")
        .attr("class", "left") //useful later when we want to update the offset
        .attr("offset", "40%")
        .attr("stop-color", "#BD2E86"); //purple-pink



    // function to find current width and height of chart container.
    function drawResponsiveChart(){
        currentWidth = parseInt(d3.select('#line-chart').style('width'), 10);
        currentHeigth = parseInt(d3.select('#line-chart').style('height'), 10);
        xScale.range([padding, currentWidth - padding]);
        yScale.range([currentHeigth - padding, padding]);


        console.log(xScale(0));
        line.attr('d', function(d){
            return d3.line()
                .x( d => xScale(d.output_gen))
                .y( d => yScale(d.pop_phen))
                (d.values)
        });

        linearGradient
        .attr("x1", xScale(0))
        .attr("y1", yScale(0))
        .attr("x2", xScale(currentWidth))
        .attr("y2", yScale(currentHeight));

    };

    // initialize the chart
    drawResponsiveChart()

    // adjust the chart on resize
    window.addEventListener('resize', drawResponsiveChar );


});