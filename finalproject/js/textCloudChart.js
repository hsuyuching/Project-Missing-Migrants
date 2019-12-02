class textCloudChart {

    constructor(data, table) {
        this.freqData = data;
        this.table = table;

        this.svg = d3.select("#text-cloud-chart")
            .append("svg")
            .attr("width", 800)
            .attr("height", 425)
            .attr("class", "wordcloud")

        this.gtext = this.svg.append('g')
            .attr("transform", "translate(320, 200)");

        this.cloud = d3.layout.cloud().size([800, 425]);

        this.update();

    }

    update() {
        let sizeScale = d3.scaleLinear()
            .domain([10, 3369])
            .range([10, 60]);
        let colorScale = d3.scaleLinear()
            .domain([1, 3369])
            .range(["#EE82EE", "#FF00FF"]);
        this.cloud
            .words(this.freqData)
            .rotate(0)
            .padding(2)
            .spiral('archimedean')
            .text((d) => { return d.tag; })
            .fontSize((d) => { return sizeScale(d.frequency) + 10 });

        let that = this;
        this.cloud.on('end', words => {
            let alltext = this.gtext.selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style("font-size", function (d) { return sizeScale(d.frequency) + "px"; })
                .style("fill", function (d, i) { return colorScale(i); })
                .style("font-family", "Comic Sans MS")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.cause_of_death; })
                .on('click', (d) => {
                    console.log("TCL: textCloudChart -> draw -> d", d)
                    that.table.updateTable(d.cause_of_death);
                });
        })
        this.cloud.start();
    }


}