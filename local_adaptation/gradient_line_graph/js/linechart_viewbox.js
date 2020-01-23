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


    let svg = d3.select('#line-chart')
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

    let gradients = svg.selectAll('defs')
        .data(popKeys)
        .enter()
        .append('linearGradient')
        .attr("gradientUnits", "userSpaceOnUse") 
        .attr('id', d => 'gradient_pop_' + d)
        .attr('x1', margin.left)
        .attr('y1', 0)
        .attr('x2', chartWidth - margin.right)
        .attr('y2', 0);
    
    console.log((xScale.range()[1]) * .01);
    console.log(xScale.invert(7.8))
    console.log(xScale(20000)/7.8)


    console.log((xScale(20000) - 20)/7.8);
    // 1000 + (x * 213) = 20000
    console.log((20000 - 1000)/xScale.invert(7.8));
    console.log(1000 + (xScale.invert(7.8)*2));
    console.log((xScale(1000) + (7.8*2)));
    console.log(xScale.invert(35.6))
    console.log(((xScale(20000) - xScale(1000))/7.8))
    console.log(312.1297749869179/800)
    console.log((xScale(20000)/7.8))

    console.log(xScale(390));
    console.log(xScale.invert(780 * .50));
    console.log(7.8 * 50);
    console.log(xScale.invert(3*7.8));
    console.log(xScale.invert(8));

    console.log(1000 + (2*213.42105263157896))
    // 5000 = 1000 + (x * 213.42105263157896)
    let secondScale = d3.scaleLinear()
        .domain([d3.min(dataPopPhen, d => d.output_gen), 
            d3.max(dataPopPhen, d => d.output_gen)])
        .range([0, 100]);

    console.log(secondScale(20000));


    svg.append('rect')
        .attr('x', 27.8)
        .attr('height', chartHeight)
        .attr('width', 7.8 * 38)
        .attr('stroke', 'green')
        .attr('opacity', .1);

    let startPerc = "8.16326530612245%" 
    let endPerc = "38.775510204081634%";

    // define start and stop colors for gradient
    let startGrey = gradients.append('stop').attr('stop-color', '#D6D6D6').attr("class", "left").attr("offset", startPerc);
    let startColor = gradients.append('stop').attr('stop-color', d => color(d)).attr("class", "left").attr("offset", startPerc);
    let endColor = gradients.append('stop').attr('stop-color', d => color(d)).attr("class", "right").attr("offset", endPerc);
    let endGrey = gradients.append('stop').attr('stop-color', '#D6D6D6').attr("class", "right").attr("offset", endPerc);

    // define axes
    let xAxis = g => g
        .attr("transform", `translate(0,${chartHeight - margin.bottom})`)
        .call(d3.axisBottom(xScale));
    svg.append("g")
        .call(xAxis);

    let line = svg.selectAll('.line')
        .data(dataGrouped)
        .enter()
        .append('path')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke', d => 'url(#gradient_pop_' + d.key +')')
        .attr('d', function(d){
            return d3.line()
                .x( d => xScale(d.output_gen))
                .y( d => yScale(d.pop_phen))
                (d.values)
        });

    let brush = d3.brushX()
        .extent([[margin.left, margin.top], [chartWidth - margin.right, chartHeight - margin.bottom]])
        .on('start brush end', brushed)

    console.log(brush.extent()[0])

    let contextStart = (chartWidth * .4);
    let contextEnd = (chartWidth * .6) - margin.left + margin.right;
    let maxVal = d3.max(dataPopPhen, d => d.output_gen);
    
    let initStart = (d3.max(dataPopPhen, d => d.output_gen) * .4) + 1000 * .6;
    let initEnd = padding + (d3.max(dataPopPhen, d => d.output_gen) * .6) + 1000 * .4;

    // console.log(xScale(initStart))
    // console.log(xScale.invert(contextStart))
    // console.log((xScale(20000) + margin.left)/chartWidth);

    svg.append('g')
        .call(brush)
        .call(brush.move, [1000, 5000].map(xScale))
        .call(g => g.select('.overlay'))
        .datum({type: 'selection'})
        .on('mousedown touchstart', beforebrushstarted)

    function beforebrushstarted() {
        const dx = xScale(1000) - xScale(1000); // Use a fixed width when recentering.
        console.log(dx);
        const [cx] = d3.mouse(this);
        const [x0, x1] = [cx - dx / 2, cx + dx / 2];
        const [X0, X1] = x.range();
        d3.select(this.parentNode)
            .call(brush.move, x1 > X1 ? [X1 - dx, X1] 
                : x0 < X0 ? [X0, X0 + dx] 
                : [x0, x1]);
        }


    let gradStart = ((xScale(20000) - margin.left)/chartWidth) * 100;
    // console.log(gradStart);

    function brushed() {
        let selection = d3.event.selection;
        if (selection === null) {

        } else {
          let [x0, x1] = selection.map(xScale.invert);
          console.log(x0 + "," + x1);
          console.log((xScale(x0) + margin.left)/chartWidth);
          d3.selectAll('.left').attr('offset', secondScale(x0) + "%");
          d3.selectAll('.right').attr('offset', secondScale(x1) + "%");

        }
      }


});