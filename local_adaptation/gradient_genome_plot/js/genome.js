Array.prototype.unique = function() {
    return this.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
}

// PLOTTING VARIABLES
let chartWidth = 800,
    chartHeight = 300
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

    function makeUniqueArray(param){
        return data.map(d => d[param]).unique();
    }

    // still want to find a better solution for this
    let mOpts = makeUniqueArray('m');
    let muOpts = makeUniqueArray('mu');
    let rOpts = makeUniqueArray('r');
    let sigsqrOpts = makeUniqueArray('sigsqr');
    let outputGenOpts = makeUniqueArray('output_gen');
    let popOpts = makeUniqueArray('pop');

    // create parameter buttons
    makeButtons('migration', mOpts, 'm')
    makeButtons('sigsqr', sigsqrOpts, 'sigsqr')

    state = {mu: "1e-6", r: "1e-6", sigsqr: "5", m: "1e-3", output_gen: 50000, pop: 0}

    d3.select('#opt' + state.m).classed('active', true);
    d3.select('#opt' + state.sigsqr).classed('active', true)

    let mButtons = d3.selectAll('.migration-opts');
    let sigButtons = d3.selectAll('.sigsqr-opts');

    let dataFiltered = data.filter(d => filterOnParams(d, state.mu, state.r, state.sigsqr, state.m, state.output_gen, state.pop));

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
    let gradient = chromeSVG.append('defs')
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse")
        .attr('id', 'grads')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', chartHeight - margin.bottom);
    
    // stops witin the gradients
    let stops = gradient.selectAll('stop')
        .data(dataCurrentGenome)
        .enter()
        .append('stop')
        .attr('stop-color', d => {
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

    
    mButtons.on('click', makeSelection);
    sigButtons.on('click', makeSelection);

    // FUNCTIONS   

    function makeSelection(){
        // remove any active classes
        d3.selectAll(this.parentNode.childNodes).classed('active', false);

        // select the button
        let selection = d3.select(this);
        let opt = selection.property('value');
        let name = selection.attr('belongs-to');

        // updates
        selection.classed('active', true);
        state[name] = opt;
        
        updateFilter()
    };


    function updateFilter(){

        console.log(state)
        dataFiltered = data.filter(d => filterOnParams(d, state.mu, state.r, state.sigsqr, state.m, state.output_gen, state.pop));

        const dataNewGenome = [];
        dataGenomeTemplate.forEach(function(p){
            let result = dataFiltered.filter(function(d){
                return d.position == p.position;
            })
            p.positional_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
            dataNewGenome.push(p);
        });

        // console.log(dataNewGenome);

        stops
            .data(dataNewGenome)
            .transition()
            .duration(1000)
            .attr('stop-color', d => {
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
    };

    function makeButtons(name, options, ref){
        d3.select('#genome-chart')
        .append('div')
        .attr('id', name + '-selector')
        .attr('class', 'param-opts')
        .selectAll('.' + name + '-opts')
        .data(options)
        .enter()
        .append('button')
        .attr('id', d => 'opt' + d)
        .attr('class', name + '-opts')
        .attr('belongs-to', ref)
        .attr('value', d => d)
        .text(d => d);
    }

    


});

// create a function to filter data
function filterOnParams(row, mu, r, sigsqr, m, output_gen, pop) {
    return row.mu === mu && row.m === m && row.r === r && row.sigsqr === sigsqr && row.output_gen === output_gen && row.pop === pop;
};
