
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

loadData().then(data => {


    tableData = d3.nest()
        .key(d => {
            return d.affected_nationality;
        })
        .rollup(leaves => {
            let totalDeath = d3.sum(leaves, d => {
                return d["dead"];
            });
            let totalMissing = d3.sum(leaves, d => {
                return d["missing"];
            });
            let regionMax = 0;
            let targetRegion = 'UNKNOWN';
            let targetCause = 'UNKNOWN';
            leaves.map((entry) => {
                if (regionMax < (entry.dead + entry.missing)) {
                    targetRegion = entry.incident_region;
                    targetCause = entry.cause_of_death;
                    regionMax = entry.dead;
                }

            });

            let entries = leaves.map(d => {
                let value = {
                    'death': d['dead'],
                    'missing': d['missing'],
                    'incident_region': d['incident_region'],
                    'cause_of_death': d['cause_of_death'],
                    'type': 'nation'
                };
                return { 'key': d['date'], 'value': value };
            });

            return {
                'death': totalDeath,
                'missing': totalMissing,
                'incident_region': targetRegion,
                'cause_of_death': targetCause,
                'type': 'aggregate',
                'entries': entries
            };
        })
        .entries(data);
    let table = new Table(tableData);
    table.createTable();

    fetchJSONFile('data/tag_frequency.json', f => {
        let cloudChart = new textCloudChart(f, table);
    });


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

