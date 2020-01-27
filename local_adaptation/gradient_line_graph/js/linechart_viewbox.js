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
    chartHeightMain = 300,
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

    let focusSVG = d3.select("#line-chart-focus")
        .append('svg')
        .attr('viewBox', [0, 0, chartWidth, chartHeightMain]);

    let contextSVG = d3.select('#line-chart-context')
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
    
    let xScaleMain = d3.scaleLinear()
        .range([margin.left, chartWidth - margin.right]);

    let yScaleMain = d3.scaleLinear()
        .domain([
            d3.min(dataPopPhen, d => d.pop_phen),
            d3.max(dataPopPhen, d => d.pop_phen)
        ])
        .range([chartHeightMain - margin.bottom, margin.top]);

    // the scale to determine the brush context percentage range
    let brushContextScale = d3.scaleLinear()
        .domain([d3.min(dataPopPhen, d => d.output_gen), 
            d3.max(dataPopPhen, d => d.output_gen)])
        .range([0, 100]);

    let focusScale = d3.scaleLinear()
            .domain([0, chartWidth])
            .range([0, 100]);


    // update data
    let dataFiltered = dataPopPhen.filter(function(d){
        return d.mu == "1e-6" && d.r == "1e-6" && d.sigsqr == "5" && d.m == "1e-4";
    })

    let dataGrouped = d3.nest()
        .key( d => d.pop )
        .entries(dataFiltered);

    let dataParamGroups = d3.nest()
        .key(d => [ d.pop, d.m, d.mu, d.r, d.sigsqr])
        .entries(dataPopPhen);


    let paramKeys = dataParamGroups.map( d => d.key );

    let popKeys = dataGrouped.map( d => d.key );
    let focusColor = d3.scaleOrdinal()
        .domain(popKeys)
        .range(['#ba3252','#3277a8','#4daf4a']);

    let outsideColor = d3.scaleOrdinal()
        .domain(popKeys)
        .range(['#dbafba', '#b4cbdb', '#89b388'])

    function nonColor(k) {
        return "#dcddde";
    }

    let gradients = contextSVG.selectAll('.context-gradient')
        .append('defs')
        .data(popKeys)
        .enter()
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse") 
        .attr('id', d => 'gradient_pop_' + d)
        .attr('x1', margin.left)
        .attr('y1', 0)
        .attr('x2', chartWidth - margin.right)
        .attr('y2', 0);

    let focusGradients = focusSVG.selectAll('.focus-gradient')
        .append('defs')
        .data(popKeys)
        .enter()
        .append('linearGradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('id', d => 'focus_gradient_pop_' + d)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', chartWidth)
        .attr('y2', 0);

    let grayGradients = focusSVG.selectAll('.gray-gradient')
        .append('defs')
        .data(paramKeys)
        .enter()
        .append('linearGradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('id', d => 'gray_gradient_pop_' + d)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', chartWidth)
        .attr('y2', 0);

    

    // define start and stop colors for gradient
    let startDull = gradients.append('stop').attr('stop-color', d => outsideColor(d)).attr("class", "left");
    let startColor = gradients.append('stop').attr('stop-color', d => focusColor(d)).attr("class", "left");
    let endColor = gradients.append('stop').attr('stop-color', d => focusColor(d)).attr("class", "right");
    let endDull = gradients.append('stop').attr('stop-color', d => outsideColor(d)).attr("class", "right");

    let startZoomNoColor = focusGradients.append('stop').attr('stop-color', '#fff').attr('class', 'left')
        .attr('offset', focusScale(margin.left) + "%");
    let startZoomColor = focusGradients.append('stop').attr('stop-color', d => focusColor(d)).attr('class', 'left')
        .attr('offset', focusScale(margin.left) + "%");
    let endZoomColor = focusGradients.append('stop').attr('stop-color', d => focusColor(d)).attr('class', 'right')
        .attr('offset', focusScale(chartWidth - margin.right) + "%");
    let endZoomNoColor = focusGradients.append('stop').attr('stop-color', '#fff').attr('class', 'right')
        .attr('offset', focusScale(chartWidth - margin.right) + "%");

    let startGrayNoColor = grayGradients.append('stop').attr('stop-color', '#fff').attr('class', 'left')
        .attr('offset', focusScale(margin.left) + "%");
    let startGrayColor = grayGradients.append('stop').attr('stop-color', d => nonColor(d)).attr('class', 'left')
        .attr('offset', focusScale(margin.left) + "%");
    let endGrayColor = grayGradients.append('stop').attr('stop-color', d => nonColor(d)).attr('class', 'right')
        .attr('offset', focusScale(chartWidth - margin.right) + "%");
    let endGrayNoColor = grayGradients.append('stop').attr('stop-color', '#fff').attr('class', 'right')
        .attr('offset', focusScale(chartWidth - margin.right) + "%");


    // define axes
    let xAxis = g => g
        .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));


    let nonFocusLines = contextSVG.selectAll('.non-focus-line')
        .data(d3.nest()
            .key(d => [ d.pop, d.m, d.mu, d.r, d.sigsqr]).entries(dataPopPhen))
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', d => nonColor(d.key))
        .attr('class', 'non-focus-line')
        .attr('d', function(d){
            return d3.line()
                .x(d => xScale(d.output_gen))
                .y(d => yScale(d.pop_phen))
                (d.values)
        });

    let contextLines = contextSVG.selectAll('.context-line')
        .data(dataGrouped)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 2.5)
        .attr('stroke', d => 'url(#gradient_pop_' + d.key +')')
        .attr('class', 'context-line')
        .attr('d', function(d){
            return d3.line()
                .x( d => xScale(d.output_gen))
                .y( d => yScale(d.pop_phen))
                (d.values)
        });

    let mainNonFocusLines = focusSVG.selectAll('.main-non-focus-line')
        .data(d3.nest()
            .key(d => [ d.pop, d.m, d.mu, d.r, d.sigsqr])
            .entries(dataPopPhen))
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke', d => 'url(#gray_gradient_pop_' + d.key +')')
        .attr('class', 'main-non-focus-line')
        .attr('d', function(d){
            return d3.line()
                .y(d => yScaleMain(d.pop_phen))
                (d.values)
        });

    let mainFocusLines = focusSVG.selectAll('.main-focus-line')
        .data(dataGrouped)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 5)
        .attr('stroke', d => 'url(#focus_gradient_pop_' + d.key +')')
        .attr('class', 'main-focus-line')
        .attr('d', function(d){
            return d3.line()
                .y( d => yScaleMain(d.pop_phen))
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
            .on("mousedown touchstart", centerAroundTouch));

    function centerAroundTouch() {
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
        // console.log(d3.event);
        let selection = d3.event.selection;
        if (selection === null) {
            d3.selectAll('.left').attr('offset', "0%");
            d3.selectAll('.right').attr('offset', "0%");
        } else {
            let [x0, x1] = selection.map(xScale.invert);
            startDull.attr('offset', brushContextScale(x0) + "%");
            startColor.attr('offset', brushContextScale(x0) + "%");
            endColor.attr('offset', brushContextScale(x1) + "%");
            endDull.attr('offset', brushContextScale(x1) + "%");

            console.log(x0 + "," + x1);
            xScaleMain
                .domain([x0, x1]);


            mainFocusLines
                .transition()
                .attr('d', function(d){
                    return d3.line()
                        .x( d => xScaleMain(d.output_gen))
                        .y( d => yScaleMain(d.pop_phen))
                        (d.values)
                });

            mainNonFocusLines
                .transition()
                .attr('d', function(d){
                    return d3.line()
                        .x( d => xScaleMain(d.output_gen))
                        .y( d => yScaleMain(d.pop_phen))
                        (d.values)
                });
            

        }
      }


});