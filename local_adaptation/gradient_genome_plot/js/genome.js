Array.prototype.unique = function() {
    return this.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
}

// PLOTTING VARIABLES
let chartWidth = 800,
    chartHeight = 800;

let margin = {top: 10, right: 20, bottom: 20, left: 20};

Promise.all([
    d3.json('data/mutations_bg.json'),
    d3.json('data/genome_template.json')
]).then(files => {
    let data = files[0];
    let dataGenomeTemplate = files[1];

    data.forEach( d => {
        d['positional_phen'] = d.freq * d.select_coef;
    })


    let dataFiltered = data.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-4" && d.output_gen == 50000 && d.pop == 0;
    }) 

    // TODO: I need to figure out how to handle mutations at the same
    //       location. Right now, it is just taking the first one, which is rather
    //       arbitrary.
    let dataCurrentGenome = [];
    dataGenomeTemplate.forEach(function(p){
        let result = dataFiltered.filter(function(d){
            return d.position == p.position;
        })
        p.positional_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
        dataCurrentGenome.push(p);
    });

    console.log(dataCurrentGenome);

    // ********************* |
    // PLOTTING HAPPENS HERE |
    // ********************* V

    let chromeSVG = d3.select("#genome-chart")
        .append('svg')
        .attr('viewBox', [0, 0, chartWidth, chartHeight]);

    // Scales
    let yScale = d3.scaleLinear()
        .domain([0, dataCurrentGenome.length])
        .range([0, 100]);

    // define gradients
    let gradients = chromeSVG.append('defs')
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse")
        .attr('id', 'grads')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', chartHeight - margin.bottom)
        .selectAll('stop')
        .data(dataCurrentGenome)
        .enter()
        .append('stop').attr('stop-color', d => {
            if( d.positional_phen > 0){
                return 'red'
            } else if(d.positional_phen < 0){
                return 'blue'
            } else {
                return 'white'
            }
        })
        .attr('offset', (d, i) => yScale(i) + "%");


    // Draw the chromosome
    chromeSVG.append('rect')
        .attr('class', 'chrome')
        .attr('x', chartWidth/2)
        .attr('y', 0)
        .attr('height', chartHeight - margin.bottom)
        .attr('width', 40)
        .attr('stroke', 'green')
        .style('fill', "url(#grads)");




})