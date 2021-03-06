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

// let chartWidth = 800,
//     chartHeight = 40,
//     padding = 10;

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
        .range([padding, chartWidth - padding]);
        
    let yScale = d3.scaleLinear()
        .domain([
            d3.min(dataPopPhen, d => d.pop_phen),
            d3.max(dataPopPhen, d => d.pop_phen)
        ])
        .range([chartHeight - padding, padding]);

    // update data
    let dataFiltered = dataPopPhen.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-4";
    })

    let dataGrouped = d3.nest()
        .key( d => d.pop )
        .entries(dataFiltered);

    let popKeys = dataGrouped.map( d => d.key );
    let color = d3.scaleOrdinal()
        .domain(popKeys)
        .range(['#e41a1c','#377eb8','#4daf4a']);

    // set up gradients with ids for each population in the popKeys array
    // so that each population gets its own color associated with it
    let gradients = svg.selectAll('defs')
        .data(popKeys)
        .enter()
        .append('linearGradient')
        .attr('id', d => 'gradient_pop_' + d);

    // define start and stop colors for gradient
    let startGrey = gradients.append('stop').attr('stop-color', '#D6D6D6');
    let startColor = gradients.append('stop').attr('stop-color', d => color(d));
    let endColor = gradients.append('stop').attr('stop-color', d => color(d));
    let endGrey = gradients.append('stop').attr('stop-color', '#D6D6D6');

    // create paths
    let line = svg.selectAll('.line')
        .data(dataGrouped)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5);



    // function to find current width and height of chart container.
    function drawResponsiveChart(){
        let currentWidth = parseInt(svg.style('width'), 10);
        let currentHeight = parseInt(svg.style('height'), 10);


        xScale.range([padding, currentWidth - padding]);
        yScale.range([currentHeight - padding, padding]);

        // linearGradient.attr("gradientUnits", "userSpaceOnUse")
        gradients.attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', currentWidth)
            .attr('y2', 0);

        startGrey.attr("class", "left").attr("offset", "40%");
        startColor.attr("class", "left").attr("offset", "40%");
        endColor.attr("class", "right").attr("offset", "60%");
        endGrey.attr("class", "right").attr("offset", "60%");

        line
        .attr('stroke', d => 'url(#gradient_pop_' + d.key +')')
        .attr('d', function(d){
            return d3.line()
                .x( d => xScale(d.output_gen))
                .y( d => yScale(d.pop_phen))
                (d.values)
        });

	
    };

    // initialize the chart
    drawResponsiveChart()

    // adjust the chart on resize
    window.addEventListener('resize', drawResponsiveChart );

});