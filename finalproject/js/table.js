class Table {
    constructor(data) {
        this.data = data;
        this.width = 900;
        this.height = 900;
        this.aggregate = null;
        this.toggle = null;
        this.tableElements = data.slice(0, data.length);
        this.countryData = data;

    }

    createTable() {
        let tr = d3.select("#matchTable").select("thead").select("tr");
        let that = this;
        tr.selectAll('th')
            .on('click', function () {
                sort(this.textContent, that)
            });

        function sort(col, that) {
            let asc = 1,
                desc = -1;

            let toSortlist = that.collapseList();
            if (that.toggle == null || that.toggle == asc)
                that.toggle = desc;
            else
                that.toggle = asc;

            let sorted;
            switch (col) {
                case "Nationality":
                    sorted = toSortlist.sort(function (a, b) {
                        return d3.ascending(a.key, b.key);
                    });
                    break;
                case "Death":
                    sorted = toSortlist.sort(function (a, b) {
                        return d3.ascending(a.value.death, b.value.death);
                    });
                    break;
                case "Missing":
                    sorted = toSortlist.sort(function (a, b) {
                        return d3.ascending(a.value.missing, b.value.missing);
                    });
                    break;
                default:
                    break;
            }

            if (sorted != undefined) {
                that.tableElements = that.toggle > 0 ? sorted : sorted.reverse();
                d3.select('#matchTable').select('tbody').selectAll('tr').remove();
                that.updateTable();
            }
        }
        window.tableData = this.aggregated

        this.updateTable();
    }

    updateTable() {
        var self = this;
        d3.select("#matchTable").select("tbody").selectAll("tr").remove();
        var table = d3.select("#matchTable");

        var tbody = table.select("tbody");

        var tbodytr = tbody.selectAll("tr").data(this.tableElements)
            .enter()
            .append("tr")
            .attr('class', d => { return d.value.type; })
            .on('click', (d, i) => {
                self.updateList(i);
            });

        tbodytr.selectAll("th")
            .data(trdata => {
                return [{
                    "key": trdata.key,
                    "type": trdata.value.type
                }]
            })
            .enter()
            .append("th")
            .text(d => {
                if (d.type === "aggregate")
                    return d.key;
                else {

                    return (d.key == null) ? 'N/A' : d.key;
                }
            })


        var rowtd = tbodytr.selectAll("td")
            .data(d => {
                return [{
                    "vis": "death count",
                    "key": "death",
                    "value": d.value.death
                },
                {
                    "vis": "miss count",
                    "key": "missing",
                    "value": d.value.missing
                },

                {
                    "vis": "incident region",
                    "key": "incident region",
                    "value": d.value.incident_region
                },
                {
                    "vis": "cause",
                    "key": "cause of death",
                    "value": d.value.cause_of_death
                }
                ]
            })
            .enter()
            .append("td");

        let formatDecimal = d3.format(".1f");
        let deathCount = rowtd.filter(d => {
            return d.vis == "death count";
        });

        deathCount
            .style("text-align", "center")
            .text(d => {
                return formatDecimal(d.value);
            });

        let missCount = rowtd.filter(d => {
            return d.vis == "miss count";
        });

        missCount
            .style("text-align", "center")
            .text(d => {
                return formatDecimal(d.value);
            });

        let incidentRegion = rowtd.filter(d => {
            return d.vis == "incident region";
        });

        incidentRegion
            .style("text-align", "center")
            .text(d => {
                return d.value;
            });

        let deathCause = rowtd.filter(d => {
            return d.vis == "cause";
        });

        deathCause
            .style("text-align", "center")
            .text(d => {
                return d.value;
            });

    }

    updateList(i) {
        if (i == undefined || this.tableElements[i].value.type != 'aggregate') return;

        //expand
        if (this.tableElements[i + 1] == undefined || this.tableElements[i + 1].value.type == 'aggregate') {
            let nationsList = this.tableElements[i].value.entries;
            this.tableElements = this.tableElements.slice(0, i + 1).concat(nationsList).concat(this.tableElements.slice(i + 1));
        } else {
            this.tableElements = this.tableElements.slice(0, i + 1).concat(this.tableElements.slice(i + 1 + this.tableElements[i].value.entries.length));
        }
        d3.select('#matchTable').select('tbody').selectAll('tr').remove();
        this.updateTable();
    }

    collapseList() {

        // ******* TODO: PART IV *******
        return this.tableElements.filter(function (d) { return d.value.type == 'aggregate'; });
    }

}