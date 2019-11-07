class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
    }
}
class worldmap{
    constructor(){
    }
    createMap(){
        let data = new preprocess()
        const IncidentRegionBasedData = data.IncidentRegionBased()
        const RegionsInclude = data.DefineRegion()
        const countryData = data.WorldMapData()

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


    }

}

