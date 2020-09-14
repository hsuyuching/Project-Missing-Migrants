class CountryData {
    constructor(type, id, properties, geometry) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
    }
}
class worldmap {
    constructor(data, updateRoute, activeRoute, tableObject) {
        this.table = tableObject;
        window.migrant = data;
        this.activeRoute = activeRoute;
        this.updateRoute = updateRoute;
        this.width = 900;
        this.height = 900;
        this.projection = d3.geoEqualEarth()
            .scale(200)
            .translate([this.width / 2, this.height / 3]);
        window.projtmp = this.projection
        // console.log("haha", window.projtmp, this.projection)
        this.storyButton = renderButton(
            d3.select("#storyButton"),
            "Show Highest Death Region"
        );
    }
    createMap(world) {
        let that = this
        window.worldData = world
        let data = new preprocess()
        const IncidentRegionBasedData = data.IncidentRegionBased()
        window.RegionsInclude = data.DefineRegion()
        var countryData = data.WorldMapData()
        window.storyTellingCountry = countryData
        window.startData = data.OriginRegion()

        // Set tooltips
        let tooltipdiv = d3.select("body")
            .append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0);

        var color = d3.scaleLinear()
            // .domain([0, 10, 100, 500, 1000, 2000, 3000, 5000])
            // .range(["rgb(222,235,247)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(8,81,156)", "rgb(8,48,107)", "rgb(3,19,43)"]);
            .domain([1, 10, 100, 3000])
            .range(["#DAF7A6", "#EDE014", "#FFC300", "#C70039"]);

        var svg = d3.select("#map-chart")
            .append("svg")
            .attr("id", "svgmap")
            .attr("width", this.width)
            .attr("height", this.height)
            .append('g')
            .attr('class', 'map');

        var path = d3.geoPath().projection(this.projection);
        /* draw migrant incident point */
        let dataslice = window.migrant.filter(function (d) { return d.region_origin != "Mixed" && d.region_origin != "UNKNOWN" }).slice(0, this.activeRoute)

        let g = svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(countryData)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function (d) {
                for (const region of Object.keys(RegionsInclude)) {
                    if (RegionsInclude[region].indexOf(d.properties) > -1 ) {
                        // console.log(d.properties,"*",region, IncidentRegionBasedData[region])
                        return color(IncidentRegionBasedData[region])
                    }
                }
                return color(0)
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity", 0.8)
            // .on("click", clicked)
            // tooltips
            .style("stroke", "white")
            .style('stroke-width', 0.3)
            .on('mouseover', function (d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "white")
                    .style("stroke-width", 3);

                tooltipdiv.transition()
                    .duration("50")
                    .style("opacity", "1");

                // text to add
                // tooltipdiv.html(d.properties)
                    // .style("text-transform", "capitalize")
                    // .style("font-size", 50)
                    // .style("font-weight", "bold")
                    // .style("left", (d3.event.pageX + 10) + "px")
                    // .style("top", (d3.event.pageY - 15) + "px")
                let a = function (d) {
                    for (const region of Object.keys(RegionsInclude)) {
                        if (RegionsInclude[region].indexOf(d.properties) > -1 ) {
                            return IncidentRegionBasedData[region]
                        }
                    }
                    return 0
                }

                tooltipdiv.html(d.properties + " departed")
                    .style("text-transform", "capitalize")
                    .style("font-size", 50)
                    .style("font-weight", "bold")
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
                    .append("div")
                    .style("font-size", 13)
                    .style("font-weight", "normal")
                    .html("Missing & Death: "+ a(d))
                    // .append("div")
                    // .html(d.missing > 0 ? "Missing: " + d.missing : "Missing: 0")
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke", "white")
                    .style("stroke-width", 0.3);

                tooltipdiv.transition()
                    .duration('50')
                    .style("opacity", 0);
            });


        // let dicRegion_origin = []
        // window.migrant.forEach(function(d){
        //     if(dicRegion_origin.indexOf(d.region_origin)<=-1){
        //         dicRegion_origin.push(d.region_origin)
        //     }
        // })
        // console.log(dicRegion_origin)

        /* draw incidentPoint point */
        d3.select("#svgmap").append("g").attr("id", "incidentPoint")
            .selectAll("circle")
            .data(dataslice)
            .enter()
            .append("circle").attr("class", d => { return d.id })
            .attr("cx", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[0])
            .attr("cy", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[1])
            .attr("r", "3px")
            .attr("fill", "red")
            .on("mouseover", function (d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "#FFC300")
                    .style("stroke-width", 5)
                that.table.highlightRow(d);
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .style("stroke", "red")
                    .style("stroke-width", "1px");
                that.table.clearRow(d);
            });


        /* draw region_origin point */
        d3.select("#svgmap").append("g").attr("id", "regionOrigin")
            .selectAll("circle")
            .data(dataslice)
            .enter()
            .append("circle").attr("class", d => { return d.id })
            .attr("cx", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[0]
            })
            .attr("cy", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[1]
            })
            .attr("r", d => {
                let coord = getstartpoint(d.region_origin)
                return coord[0] === 0 ? "0px" : "3px"
            })
            .attr("fill", "black")

        /* draw path */
        d3.select("#svgmap").append("g").attr("id", "migratePath")
            .selectAll("line")
            .data(dataslice)
            .enter()
            .append("line").attr("class", d => { return d.id })
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[0]
            })
            .attr("y1", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[1]
            })
            .attr("x2", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[0])
            .attr("y2", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[1])
            .attr("stroke", "#22B8CA")
            .attr("stroke-width", "2px")
            // .on("click", function (d) {
            //     d3.select(this)
            //         .style("opacity", 1)
            //         .style("stroke","yellow")
            //         .style("stroke-width",5)
            //     console.log(this)
            // })
            .on('mouseover', function (d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "#FFC300")
                    .style("stroke-width", 4);

                tooltipdiv.transition()
                    .duration("50")
                    .style("opacity", "1");

                // text to add
                tooltipdiv.html(d.region_origin + "→" + d.incident_region)
                    .style("text-transform", "capitalize")
                    .style("font-size", 50)
                    .style("font-weight", "bold")
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
                    .append("div")
                    .style("font-size", 13)
                    .style("font-weight", "normal")
                    .html(d.dead > 0 ? "Dead: " + d.dead : "Dead: 0")
                    .append("div")
                    .html(d.missing > 0 ? "Missing: " + d.missing : "Missing: 0")
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    // .style("opacity", 0.8)
                    .style("stroke-dasharray", ("3, 3"))
                    .style("stroke", "#22B8CA")
                    .style("stroke-width", "3px");

                tooltipdiv.transition()
                    .duration('50')
                    .style("opacity", 0);
            });
    }
    updateRoutePlot(activeRoute) {
        this.storyButton.on("click", showExtreme)

        let data = window.migrant.filter(function (d) { return d.region_origin != "Mixed" && d.region_origin != "UNKNOWN" }).slice(0, activeRoute)

        /* update line */
        let lines = d3.select("#migratePath").selectAll("line").data(data)
        lines.enter().append("line")
            .style("stroke-dasharray", ("3, 3"))
            .merge(lines)
            .attr("class", d => { return d.id })
            .attr("x1", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[0]
            })
            .attr("y1", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[1]
            })
            .attr("x2", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[0])
            .attr("y2", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[1])
            .attr("stroke", "#22B8CA")
            .attr("stroke-width", "3px")
            .on("click", function (d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke", "yellow")
                    .style("stroke-width", 5)
                //console.log(this)
            })
        lines.exit().remove()

        /* update circles */
        /* draw migrant incident point */
        let incidentCircles = d3.select("#incidentPoint").selectAll("circle").data(data)
        incidentCircles.enter().append("circle")
            .merge(incidentCircles)
            .attr("class", d => { return d.id })
            .attr("cx", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[0])
            .attr("cy", d => this.projection([parseFloat(d.lon), parseFloat(d.lat)])[1])
            .attr("r", "3px")
            .attr("fill", "red")
        incidentCircles.exit().remove()

        /* draw region_origin point */
        let regionOriginCircles = d3.select("#regionOrigin").selectAll("circle").data(data)
        regionOriginCircles.enter().append("circle")
            .merge(regionOriginCircles)
            .attr("class", d => { return d.id })
            .attr("cx", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[0]
            })
            .attr("cy", d => {
                let coord = getstartpoint(d.region_origin)
                return this.projection([coord[0], coord[1]])[1]
            })
            .attr("r", d => {
                let coord = getstartpoint(d.region_origin)
                return coord[0] === 0 ? "0px" : "3px"
            })
            .attr("fill", "black")
        regionOriginCircles.exit().remove()


    }
    numRounteBar() {
        let that = this
        let yearScale = d3.scaleLinear().domain([0, 868]).range([30, 730]);

        let yearSlider = d3.select("#routeBar")
            .append("div").classed("slider-wrap", true)
            .append("input").classed("slider", true)
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", 868)
            .attr("value", that.activeRoute);

        let sliderLabel = d3.select(".slider-wrap")
            .append("div").classed("slider-label", true)
            .append("svg");

        let sliderText = sliderLabel.append('text').text("Show "+this.activeRoute+" routes");

        sliderText.attr('x', yearScale(this.activeRoute));
        sliderText.attr('y', 25);

        yearSlider.on('input', function () {
            sliderText.text("Show "+this.value+" routes");
            sliderText.attr('x', yearScale(this.value));
            // sliderText.text("Show number of routes")
            //     .attr("x", yearScale(this.value));

            that.updateRoutePlot(String(this.value));
            that.updateRoute(String(this.value));
        });

    }

}

function getstartpoint(region) {
    let coord = window.startData.filter(function (d) {
        return d.region == region
    })
    return [coord[0].lon, coord[0].lat]
}
function showExtreme(){
    document.getElementById("highlightdiv").style.display = "block";
    //
    let highlightDiv = d3.select("#highlightdiv")
    let width = highlightDiv.node().getBoundingClientRect().width
        ,height = highlightDiv.node().getBoundingClientRect().height;
    let svg = d3.select("#highlightdiv").append("svg").attr("id", "extremeSVG")
        .attr("width", width)
        .attr("height", height)
    let img = svg.selectAll("image").data([0])
    img.enter()
        .append("svg:image")
        .attr("xlink:href", "data/Mediterranean.PNG")
        .attr("x", width / 3)
        .attr("y", height / 2.3)
        .attr("width", width / 2)
        .attr("height", height / 2);


    d3.select("#storyA").attr("class", "tooltip-donut")
        .style("top", "400px")
        .style("left", "26.9px")
        .style("font-size", "14px")
        .text("The Mediterranean is a major body of water south of Europe, west of Asia and north of Africa. " +
            "It contains Gibraltar, Spain, Monaco, Italy, Slovenia, Croatia, " +
            "Montenegro, Albania, Greece, Turkey, " +
            "Lybia, Malta, Tunisia, Bosnia-Herzegovina." + " Here, it shows that Mediterranean has" +
            " the highest number of migrants death in the world.")


}