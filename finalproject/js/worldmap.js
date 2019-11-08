class CountryData {
    constructor(type, id, properties, geometry) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
    }
}
class worldmap{
    constructor(data){
        console.log("construct migrant", data)
        window.migrant = data;
    }
    createMap(world){
        console.log("createMap world map", world)
        window.worldData = world
        let data = new preprocess()
        const IncidentRegionBasedData = data.IncidentRegionBased()
        window.RegionsInclude = data.DefineRegion()
        const countryData = data.WorldMapData()
        window.startData = data.OriginRegion()

        // Set tooltips
        let tooltipdiv = d3.select("body")
            .append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0);


        // var margin = {top: 20, right: 20, bottom: 30, left: 30};
        let width = 900, height = 900;
        var color = d3.scaleLinear()
            .domain([0,10,100,300,500,1000,2000,3000,4000,5000])
            .range(["rgb(222,235,247)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)", "rgb(240,89,130)", "rgb(229,33,85)"]);

        var svg = d3.select("#map-chart")
            .append("svg")
            .attr("id", "svgmap")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

        var projection = d3.geoEqualEarth()
            .scale(200)
            .translate( [width / 2, height /3]);

        var path = d3.geoPath().projection(projection);

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(countryData)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                for (const region of Object.keys(RegionsInclude)){
                    if (RegionsInclude[region].indexOf(d.properties)>-1){
                        // console.log(d.properties,"*",region, IncidentRegionBasedData[region])
                        return color(IncidentRegionBasedData[region])
                    }
                }
                return color(0)
            })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity",0.8)

            // tooltips
            .style("stroke","white")
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width",3);

                tooltipdiv.transition()
                    .duration("50")
                    .style("opacity", "1");

                // text to add
                tooltipdiv.html(d.properties)
                    .style("text-transform", "capitalize")
                    .style("font-size", 50)
                    .style("font-weight", "bold")
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
            })
            .on('mouseout', function(d){
                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke","white")
                    .style("stroke-width",0.3);

                tooltipdiv.transition()
                    .duration('50')
                    .style("opacity", 0);
            });

        /* draw migrant incident point */
        d3.select("#svgmap").append("g")
            .selectAll("circle")
            .data(window.migrant.filter(function(d){return d.lon != ""})).enter()
            .append("circle").attr("class", d=>{return d.id})
            .attr("cx", d=> projection([parseFloat(d.lon),parseFloat(d.lat)])[0])
            .attr("cy", d=> projection([parseFloat(d.lon),parseFloat(d.lat)])[1])
            .attr("r", "3px")
            .attr("fill", "red")


        /* draw path from region_origin */
        console.log("migrant", window.migrant)
        d3.select("#svgmap").append("g")
            .selectAll("circle")
            .data(window.migrant.filter(function(d){return d.lon != "" && d.region_origin!=""}))
            .enter()
            .append("circle").attr("class", d=>{return d.id})
            .attr("cx", d=> {
                let coord = getstartpoint(d.region_origin)
                return projection([coord[0],coord[1]])[0]
            })
            .attr("cy", d=> {
                let coord = getstartpoint(d.region_origin)
                return projection([coord[0],coord[1]])[1]
            })
            .attr("r", d=> {
                let coord = getstartpoint(d.region_origin)
                return coord[0] === 0? "0px": "3px"
            })
            .attr("fill", "black")

        d3.select("#svgmap").append("g")
            .selectAll("line")
            .data(window.migrant.filter(function(d){return d.lon != "" && d.region_origin!=""}))
            .enter()
            .append("line").attr("class", d=>{return d.id})
            .attr("x1", d=> {
                let coord = getstartpoint(d.region_origin)
                return projection([coord[0],coord[1]])[0]
            })
            .attr("y1", d=>{
                let coord = getstartpoint(d.region_origin)
                return projection([coord[0],coord[1]])[1]
            })
            .attr("x2", d=> projection([parseFloat(d.lon),parseFloat(d.lat)])[0])
            .attr("y2", d=> projection([parseFloat(d.lon),parseFloat(d.lat)])[1])
            .attr("stroke", "black")
            .attr("stroke-width", "3px")
            .on("click", function (d) {
                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","yellow")
                    .style("stroke-width",5)
                console.log(this)
            })
        d3.select("#buttons").append("div").attr("id", "NrountBar")
    }

    numRounteBar(){
        let that = this;
        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([0, 2420]).range([30, 730]);

        console.log("numRounteBar")
        let yearSlider = d3.select("#NrountBar")
            .append("div").classed(".slider-wrap", true)
            .append("input").classed(".slider", true)
            .attr("type", "range")
            .attr("min", 1800)
            .attr("max", 2020)
            .attr("value", 2000);

        let sliderLabel = d3.select(".slider-wrap")
            .append("div").classed(".slider-label", true)
            .append("svg");

        let sliderText = sliderLabel.append('text').text("ddd");

        sliderText.attr('x', yearScale(2000));
        sliderText.attr('y', 25);
    }
}
function getstartpoint(region) {
    let coord = window.startData.filter(function (d) {
        return d.region == region
    })
    return [coord[0].lon, coord[0].lat]
}
