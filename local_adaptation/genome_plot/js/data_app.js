Array.prototype.unique = function(){
    return this.filter(function(value, index, self){
        return self.indexOf(value) === index;
    });
}

Promise.all([
    d3.json('data/genome_individual.json'),
    d3.json('data/genome_template.json')
]).then(function(files){
    let indivGenome = files[0],
        templateGenome = files[1];
    
    const genomeLabels = [];
    indivGenome.forEach(g => genomeLabels.push(g.genome));
    console.log(genomeLabels.unique());
    
    indivFullGenome = {};
    for(let genome of genomeLabels.unique()){
        let genomeSegment = indivGenome.filter(d => d.genome === genome);
        let newGenome = [];
        templateGenome.forEach(function(templatePosition){
            let result = genomeSegment.filter(function(mutation){
                return mutation.position === templatePosition.position;
            });
            // console.log(result);
            templatePosition.select_coef = (result[0] !== undefined) ? result[0].select_coef : 0;
            newGenome.push(templatePosition);
        });
        indivFullGenome[genome] = newGenome;
    }
    console.log(indivFullGenome);

    console.log(indivGenome);
    console.log(templateGenome);
});

function loadData(files){
    console.log(files);
    return files;
}

console.log(Promise.all([
    d3.json('data/genome_individual.json'),
    d3.json('data/genome_template.json')
]).then(loadData).then(function(files){
    let indivGenome = files[0],
        templateGenome = files[1]
    console.log(indivGenome);
}


))

// Promise.all([
//     d3.json('data/genome_individual.json'),
//     d3.json('data/genome_template.json'),
// ]).then(function(files){
//     let genomeg = files[0];
//     let genomet = files[1];

//     genomet.forEach(function(position){
//         var result = genomeg.filter(function(g){
//             return g.position === position.position;
//         });
//         position.select_coef = (result[0] !== undefined) ? result[0].select_coef : 0;
//     })
//     console.log(genomet);
    
//     const uniqueGenomes = (value, index, self) => {
//         return self.indexOf(value) === index;
//     }
    
//     Array.prototype.unique = function() {
//         return this.filter(function (value, index, self){
//             return self.indexOf(value) === index;
//         });
//     }
    
//     const sampleArray = [];
//     genomeg.forEach(function(d){ sampleArray.push(d.genome); });
//     console.log(sampleArray.unique());
    
    // sampleArray.unique().forEach(function(d){
    //     var newResult = genomeg.filter(function(g){
    //         return g.genome === d;
    //     });
    //     genomet.forEach(function(position){
    //         var newNewResult = newResult.filter(function(n){
    //             return n.position === position.position;
    //         });
    //         position.select_coef = (newNewResult[0] !== undefined) ? newNewResult[0].select_coef : 0;
    //     })
    // })
    // console.log(genomet);
    
    // let newTemplate = []
    // sampleArray.unique().forEach(function(d){
    //     newTemplate = [...genomet]
    //     var newResult = genomeg.filter(function(g){
    //         return g.genome === d;
    //     });
    //     newTemplate.forEach(function(position){
    //         var newNewResult = newResult.filter(function(n){
    //             return n.position === position.position;
    //         });
    //         position.select_coef = (newNewResult[0] !== undefined) ? newNewResult[0].select_coef : 0;
    //     });
    //     console.log(newTemplate);
    // })


    


//     console.log(genomeg.filter(function(d){return d.genome === "genome1";}))
// })

