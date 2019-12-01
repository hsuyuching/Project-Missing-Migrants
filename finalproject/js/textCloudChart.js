class textCloudChart {

    constructor(data) {
        this.freqData = data;


        let sizeScale = d3.scaleLinear()
            .domain([1, 3369])
            .range([9, 60]);
        d3.layout.cloud().size([800, 425])
            .words(this.freqData)
            .rotate(0)
            .padding(1)
            .spiral('archimedean')
            .fontSize(function (d) { return sizeScale(d.frequency) + 10; })
            .on("end", this.draw)
            .start();

    }

    draw(words) {
        let colorScale = d3.scaleLinear()
            .domain([1, 3369])
            .range(['#1f77b4', '#e9272a']);
        let sizeScale = d3.scaleLinear()
            .domain([100, 3369])
            .range([1, 80]);

        d3.select("#text-cloud-chart").append("svg")
            .attr("width", 800)
            .attr("height", 600)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(320,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return sizeScale(d.frequency) + "px"; })
            .style("fill", function (d, i) { return colorScale(i); })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.cause_of_death; });
    }


}