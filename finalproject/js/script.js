// d3.csv("data/MissingMigrantsProject.csv").then( matchCSV =>
//     {
//         matchCSV.forEach( (d, i) => {
//             d.id = d.id
//             d.cause_of_death = d.cause_of_death
//             d["missing"] = +d["missing"]
//             d["dead"] = +d["dead"]
//         })
//         window.migrant = matchCSV
//         // console.log(window.migrant)
//     }
// )
//
// // Creates an async request for a resource from the server using d3.json
// async function loadData() {
//     try {
//         let data = await d3.json("data/world-countries.json");
//         // This is where you insert d3 code to process and plot the data
//         // console.log(data); // Prints when the request finishes
//         window.worldData = data
//         let world = new worldmap(window.migrant, window.worldData);
//         world.numRounteBar()
//         world.createMap()
//     } catch (error) {
//         console.error(error); // Logs error if encountered
//     }
// }
// loadData();

loadData().then(data=>{
    let world = new worldmap(data);
    let table = new Table(data);
    table.createTable();
    table.updateTable(data);
    d3.json("data/world-countries.json").then(mapData=>{
        world.createMap(mapData)
    })
    world.numRounteBar()
})
async function loadFile(file) {
    let data = await d3.csv(file).then( matchCSV => {
        matchCSV.forEach( (d, i) => {
            d["id"] = +d["id"]
            d["missing"] = +d["missing"]
            d["dead"] = +d["dead"]
            
        })
        return matchCSV
    });
    return data;
}
async function loadData() {
    let migrant = await loadFile('data/MissingMigrantsProject.csv');
    return migrant;
}
