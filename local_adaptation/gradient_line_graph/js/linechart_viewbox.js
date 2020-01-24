// unique method for Array prototype
Array.prototype.unique = function() {
    return this.filter(function(value, index, self){
        return self.indexOf(value) === index;
    });
}

// SIMULATION VARIABLES
const popSize = 1000;

// PLOTTING VARIABLES
let chartWidth = 800,
    chartHeight = 100,
    chartHeightMain = 800,
    padding = 10;

let margin = {top: 10, right: 20, bottom: 20, left: 20};

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

    let mainSVG = d3.select("#line-chart-main")
        .append('svg')
        .attr('viewbox', [0, 0, chartWidth, chartHeightMain]);

    let contextSVG = d3.select('#line-chart')
        .append('svg')
        .attr("viewBox", [0, 0, chartWidth, chartHeight]);

    // define the scales
    let xScale = d3.scaleLinear()
        .domain([d3.min(dataPopPhen, d => d.output_gen), 
                 d3.max(dataPopPhen, d => d.output_gen)])
        .range([margin.left, chartWidth - margin.right]);
        
    let yScale = d3.scaleLinear()
        .domain([
            d3.min(dataPopPhen, d => d.pop_phen),
            d3.max(dataPopPhen, d => d.pop_phen)
        ])
        .range([chartHeight - margin.bottom, margin.top]);
    
    let xScaleMain = d3.scaleLinear();
    let yScaleMain = d3.scaleLinear();

    let brushContextScale = d3.scaleLinear()
        .domain([d3.min(dataPopPhen, d => d.output_gen), 
            d3.max(dataPopPhen, d => d.output_gen)])
        .range([0, 100]);

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

    let gradients = contextSVG.selectAll('defs')
        .data(popKeys)
        .enter()
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse") 
        .attr('id', d => 'gradient_pop_' + d)
        .attr('x1', margin.left)
        .attr('y1', 0)
        .attr('x2', chartWidth - margin.right)
        .attr('y2', 0);
    


    // define start and stop colors for gradient
    let startGrey = gradients.append('stop').attr('stop-color', '#D6D6D6').attr("class", "left");
    let startColor = gradients.append('stop').attr('stop-color', d => color(d)).attr("class", "left");
    let endColor = gradients.append('stop').attr('stop-color', d => color(d)).attr("class", "right");
    let endGrey = gradients.append('stop').attr('stop-color', '#D6D6D6').attr("class", "right");

    // define axes
    let xAxis = g => g
        .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));


    // let line = contextSVG.selectAll('.line')
    //     .data(dataGrouped)
    //     .enter()
    //     .append('path')
    //     .attr('fill', 'none')
    //     .attr('stroke-width', 1.5)
    //     .attr('stroke', d => 'url(#gradient_pop_' + d.key +')')
    //     .attr('class', 'line')
    //     .attr('d', function(d){
    //         return d3.line()
    //             .x( d => xScale(d.output_gen))
    //             .y( d => yScale(d.pop_phen))
    //             (d.values)
    //     });

    let line = contextSVG.append('g')
        .selectAll('.line')
        .data(dataGrouped)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke', d => 'url(#gradient_pop_' + d.key +')')
        .attr('class', 'line')
        .attr('d', function(d){
            return d3.line()
                .x( d => xScale(d.output_gen))
                .y( d => yScale(d.pop_phen))
                (d.values)
        });


    contextSVG.append("g")
        .call(xAxis);

    let brush = d3.brushX()
        .extent([[margin.left, margin.top], [chartWidth - margin.right, chartHeight - margin.bottom]])
        .on('start brush end', brushed);

    contextSVG.append('g')
        .call(brush)
        .call(brush.move, [1000, 5000].map(xScale))
        .call(g => g.select('.overlay')
            .datum({type: 'selection'})
            .on("mousedown touchstart", beforebrushstarted));

    function beforebrushstarted() {
        let dx = xScale(4000) - xScale(1000); // Use a fixed width when recentering.
        let [cx] = d3.mouse(this);
        let [x0, x1] = [cx - dx / 2, cx + dx / 2];
        let [X0, X1] = xScale.range();
        d3.select(this.parentNode)
            .call(brush.move, x1 > X1 ? [X1 - dx, X1] 
                : x0 < X0 ? [X0, X0 + dx] 
                : [x0, x1]);

        }

    function brushed() {
        console.log(d3.event);
        let selection = d3.event.selection;
        if (selection === null) {
            d3.selectAll('.left').attr('offset', "0%");
            d3.selectAll('.right').attr('offset', "0%");
        } else {
          let [x0, x1] = selection.map(xScale.invert);
          d3.selectAll('.left').attr('offset', brushContextScale(x0) + "%");
          d3.selectAll('.right').attr('offset', brushContextScale(x1) + "%");

        }
      }


});