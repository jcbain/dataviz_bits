// helpers.js
// common helper functions 

const createGenomeFromTemplate = (template, data) => {
    let genomeData = [];
    template.forEach((p) => {
        let result = data.filter(function(d){
            return d.position === p.position;
        })
        p.positional_phen = (result[0] !== undefined) ? result[0].positional_phen : 0;
        genomeData.push(p)
    })
    return genomeData;
}

const sayHello = () => {
    return "hello"
};

export default sayHello;