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

        console.log(IncidentRegionBasedData)
        console.log(RegionsInclude)
        console.log(countryData)


        // Set tooltips
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + d.population +"</span>";
            })

        var margin = {top: 20, right: 20, bottom: 30, left: 30};
            // width = 1200 - margin.left - margin.right,
            // height = 800 - margin.top - margin.bottom;
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
            .translate( [width / 2, height / 2]);

        var path = d3.geoPath().projection(projection);

        // // svg.call(tip);
        //
        // // queue()
        // //     .defer(d3.json, "data/world-countries.json")
        // //     // .defer(d3.tsv, "world_population.tsv")
        // //     .await(ready);
        //
        // function ready(error, world) {
        //     // var populationById = {};
        //
        //     // population.forEach(function(d) { populationById[d.id] = +d.population; });
        //

        //
        // Object.keys(objCountryExtend).forEach(function(key){
        //     console.log(key,objCountryExtend[key], objCountryExtend[key].indexOf("Colombia") > -1? key:0)
        //     console.log(obj[key])
        // })
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
                // // tooltips
                // .style("stroke","white")
                // .style('stroke-width', 0.3)
                // .on('mouseover',function(d){
                //     tip.show(d);
                //
                //     d3.select(this)
                //         .style("opacity", 1)
                //         .style("stroke","white")
                //         .style("stroke-width",3);
                // })
                // .on('mouseout', function(d){
                //     tip.hide(d);
                //
                //     d3.select(this)
                //         .style("opacity", 0.8)
                //         .style("stroke","white")
                //         .style("stroke-width",0.3);
                // });

        //     svg.append("path")
        //         .datum(topojson.mesh(world.features, function(a, b) { return a.id !== b.id; }))
        //         // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        //         .attr("class", "names")
        //         .attr("d", path);
        // }

    }

}

