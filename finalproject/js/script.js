loadData().then(data=>{
    this.activeRoute = "1000"
    let that = this;

    function updateRoute(number) {
        that.activeRoute = number
        // world.numRounteBar(that.activeRoute)
    }

    let world = new worldmap(data, updateRoute, this.activeRoute)
    d3.json("data/world-countries.json").then(mapData=>{
        world.createMap(mapData)
    })
    world.updateRoutePlot(this.activeRoute)
    world.numRounteBar()
})
async function loadFile(file) {
    let data = await d3.csv(file).then( matchCSV => {
        matchCSV.forEach( (d, i) => {
            d.id = d.id
            d.cause_of_death = d.cause_of_death
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
