Array.prototype.unique = function() {
    return this.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
}

// PLOTTING VARIABLES
let chartWidth = 800,
    chartHeight = 200
    chromeRounding = 20;

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

    // still want to find a better solution for this
    let mOpts = sampleFunct(data, [], 'm');
    let muOpts = sampleFunct(data, [], 'mu');
    let rOpts = sampleFunct(data, [], 'r');
    let sigsqrOpts = sampleFunct(data, [], 'sigsqr');
    let outputGenOpts = sampleFunct(data, [], 'ouptput_gen');
    let popOpts = sampleFunct(data, [], 'pop');



    console.log(d3.min(data, d => Math.abs(d.positional_phen)));
    console.log(d3.max(data, d => Math.abs(d.positional_phen)));

    d3.select('#genome-chart')
        .append('div')
        .attr('id', 'migration-selector')
        .attr('class', 'param-opts')
        .selectAll('.migration-opts')
        .data(mOpts)
        .enter()
        .append('button')
        .attr('id', d => 'opt' + d)
        .attr('class', 'migration-opts')
        .attr('value', d => d)
        .text(d => d);

    initialParams = {mu: "1e-6", r: "1e-6", sigsqr: "5", m: "1e-3", output_gen: 50000, pop: 0}


    // let dataFiltered = data.filter(function(d){
    //     return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-3" && d.output_gen == 50000 && d.pop == 0;
    // }) 

    let dataFiltered = data.filter(d => filterOnParams(d, initialParams.mu, initialParams.r, initialParams.sigsqr, initialParams.m, initialParams.output_gen, initialParams.pop));

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

    let opacityScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.abs(d.positional_phen))])
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
                return '#ba3252'
            } else if(d.positional_phen < 0){
                return '#3277a8'
            } else {
                return '#fffff7'
            }
        })
        .attr('stop-opacity', d => {
            if (d.positional_phen == 0) {
                return "100%"
            } else{
                return opacityScale(Math.abs(d.positional_phen)) + "%"
            }
            })
        .attr('offset', (d, i) => yScale(i) + "%");


    // Draw the chromosome
    chromeSVG.append('rect')
        .attr('class', 'chrome')
        .attr('x', chartWidth/2)
        .attr('y', 0)
        .attr('rx', chromeRounding)
        .attr('ry', chromeRounding)
        .attr('height', chartHeight - margin.bottom)
        .attr('width', 40)
        .attr('stroke', '#c2c2ab')
        .style('fill', "url(#grads)");

})

// create a function to filter data
function filterOnParams(row, mu, r, sigsqr, m, output_gen, pop) {
    return row.mu === mu && row.m === m && row.r === r && row.sigsqr === sigsqr && row.output_gen === output_gen && row.pop === pop;
};

function sampleFunct(data, array, m){
    data.forEach(d => array.push(d[m]));
    return array.unique();
}