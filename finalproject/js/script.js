loadData().then(data => {
    let table = new Table(data);
    table.createTable();

    // console.log(data)
    this.activeRoute = "300"
    let that = this;

    function updateRoute(number) {
        that.activeRoute = number
        // world.numRounteBar(that.activeRoute)
    }

    let world = new worldmap(data, updateRoute, this.activeRoute, table)
    d3.json("data/world-countries.json").then(mapData => {
        world.createMap(mapData)
    })
    world.updateRoutePlot(this.activeRoute)
    world.numRounteBar()
})

async function loadFile(file) {
    let data = await d3.csv(file).then(matchCSV => {
        matchCSV.forEach((d, i) => {
            d["id"] = +d["id"]
            d["missing"] = +d["missing"]
            d["dead"] = +d["dead"]

        })
        return matchCSV
    });
    return data;
}
async function loadData() {
    let migrant = await loadFile('data/MissingMigrantsProjectV2.csv');
    return migrant;
}