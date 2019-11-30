class Table {
    constructor(data) {
        this.data = data;
        this.width = 900;
        this.height = 900;
        this.toggle = null;
        this.aggregated = d3.nest()
            .key(d => {
                return d.affected_nationality;
            })
            .rollup(v => {
                return {
                    death: d3.sum(v, d => {
                        return d.dead;
                    }),
                    missing: d3.sum(v, d => {
                        return d.missing;
                    }),
                }
            })
            .entries(this.data);
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

            if (that.toggle == null || that.toggle == asc)
                that.toggle = desc;
            else
                that.toggle = asc;

            let sorted;
            switch (col) {
                case "Nationality":
                    sorted = that.aggregated.sort(function (a, b) {
                        return d3.ascending(a.key, b.key);
                    });
                    break;
                case "Death":
                    sorted = that.aggregated.sort(function (a, b) {
                        return d3.ascending(a.value.death, b.value.death);
                    });
                    break;
                case "Missing":
                    sorted = that.aggregated.sort(function (a, b) {
                        return d3.ascending(a.value.missing, b.value.missing);
                    });
                    break;
                default:
                    break;
            }

            if (sorted != undefined) {
                that.data = that.toggle > 0 ? sorted : sorted.reverse();

                that.updateTable(that.aggregated);
            }
        }
        window.tableData = this.aggregated

        this.updateTable(this.aggregated);
    }

    updateTable(updatedData) {
        console.log("haha")

        d3.select("#matchTable").select("tbody").selectAll("tr").remove();
        var table = d3.select("#matchTable");

        var tbody = table.select("tbody");

        var tbodytr = tbody.selectAll("tr").data(updatedData)
            .enter()
            .append("tr");
        tbodytr.selectAll("th")
            .data(trdata => {
                return [{
                    "key": trdata.key
                }]
            })
            .enter()
            .append("th")
            .attr("class", "nationality")
            .text(d => {
                if (d.key.length > 0) {
                    return d.key;
                } else {
                    return "not known";
                }
            });

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
                        "vis": "cause",
                        "key": "cause of death",
                        "value": d.cause
                    }
                ]
            })
            .enter()
            .append("td");

        let deathCount = rowtd.filter(d => {
            return d.vis == "death count";
        });

        deathCount
            .style("text-align", "center")
            .text(d => {
                return d.value;
            });

        let missCount = rowtd.filter(d => {
            return d.vis == "miss count";
        });

        missCount
            .style("text-align", "center")
            .text(d => {
                return d.value;
            });

        /*let incidentRegion = rowtd.filter(d => {
            return d.vis == "incident region";
        });

        incidentRegion
            .style("text-align", "center")
            .text(d => {
                return d.value;
            });*/

        let deathCause = rowtd.filter(d => {
            return d.vis == "cause";
        });

        deathCause
            .style("text-align", "center")
            .text(d => {
                //console.log(d);
                return d.value;
            });

    }
}