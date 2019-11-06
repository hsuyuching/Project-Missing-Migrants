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

        var mapData = window.worldData
        var migrantData =  window.migrant

        /* pre-processing migrantData */
        /* sum all dead based on incident region */
        const obj={}
        for (let i=0; i<migrantData.length; i++){
            if(!(migrantData[i].incident_region in obj)){
                obj[migrantData[i].incident_region] = 0
            }
            if(migrantData[i].incident_region in obj){
                // console.log("haha")
                obj[migrantData[i].incident_region] += migrantData[i].dead
            }
        }
        console.log("(obj) incident region: dead", obj)
        /* incident-region extend */
        const objCountryExtend= {}
        Object.assign(objCountryExtend, obj)
        objCountryExtend["Horn of Africa"] = ["Djibouti", "Eritrea", "Ethiopia", "Somalia"]
        objCountryExtend["Caribbean"] =["Dominican Republic", "The Bahamas", "Jamaica",
                                        "Trinidad and Tobago", "Guyana"]
        objCountryExtend["Central America incl. Mexico"] = ["Belize","Costa Rica", "El Salvador",
                                        "Guatemala", "Honduras", "Nicaragua", "Panama", "Mexico"]
        objCountryExtend["East Asia"] = ["Japan", "North Korea", "South Korea", "China",
                                        "Taiwan", "Mongolia"]
        objCountryExtend["Europe"] = ["Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria",
                                    "Czech Republic", "Denmark", "Estonia", "Finland",
                                    "France", "Georgia", "Germany",  "Hungary", "Iceland", "Ireland",
                                    "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia",
                                    "Malta", "Moldova", "Monaco", "The Netherlands", "Norway",
                                    "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
                                    "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"]
        objCountryExtend["Mediterranean"] = ["Gibraltar",	"Spain", "Monaco",	"Italy",	"Slovenia",	"Croatia",
                                    "Montenegro"	,"Albania",	"Greece",	"Turkey",
                                    "Lybia"	,"Malta",	"Tunisia", "Bosnia-Herzegovina"]
        objCountryExtend["Middle East"] = ["Cyprus",  "Syria", "Lebanon", "Israel", "West Bank","Gaza", "Jordan", "Iraq", "Iran",
                                     "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", "Qatar", "Bahrain", "Kuwait"]
        objCountryExtend["North Africa"] = ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Western Sahara"]
        objCountryExtend["North America"] = ["United States of America"]
        objCountryExtend["South America"] = ["Argentina", "Ecuador", "Suriname", "Bolivia", "Brazil",
                                             "Uruguay", "Chile","Colombia", "Paraguay", "Peru", "Venezuela"]
        objCountryExtend["Southeast Asia"] = ["Brunei","Burma","Cambodia","Timor-Leste","Indonesia",
                                            "Laos", "Malaysia","Philippines","Singapore","Thailand","Vietnam"]
        objCountryExtend["Sub-Saharan Africa"] = ["Angola", "Benin", "Botswana", "Burkina Faso",
                                            "Burundi", "Cameroon","Cape Verde","Central African Republic","Chad","Comoros",
                                            "Democratic Republic of the Congo","Republic of the Congo"]
        objCountryExtend["Middle East "] = []
        objCountryExtend["U.S./Mexico Border"] = []
        objCountryExtend[""]=[]

        console.log("incident region: list of countries", objCountryExtend)
        let countryData = mapData.features.map(d => {
            return new CountryData(d.type, d.id, d.properties != undefined? d.properties.name:"0", d.geometry);
        });
        console.log("countryData", countryData)

        countryData.forEach(function (contry) {
            // console.log(contry, Object.keys(objCountryExtend)[1])
            for (const region of Object.keys(objCountryExtend)){
                // console.log(contry.properties, region, objCountryExtend[region])
                if (objCountryExtend[region].indexOf(contry.properties)>-1){
                    console.log(contry.properties,"*",region, obj[region])
                }
            }
        })



        // Set tooltips
        // var tip = d3.tip()
        //     .attr('class', 'd3-tip')
        //     .offset([-10, 0])
        //     .html(function(d) {
        //         return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + d.population +"</span>";
        //     })
        //
        var margin = {top: 20, right: 20, bottom: 30, left: 30};
            // width = 1200 - margin.left - margin.right,
            // height = 800 - margin.top - margin.bottom;
        let width = 900, height = 900;
        var color = d3.scaleLinear()
            .domain([0,10,100,300,500,1000,2000,3000,4000,5000])
            .range(["rgb(0,0,209)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

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
                    for (const region of Object.keys(objCountryExtend)){
                        // console.log(contry.properties, region, objCountryExtend[region])
                        if (objCountryExtend[region].indexOf(d.properties)>-1){
                            console.log(d.properties,"*",region, obj[region])
                            return color(obj[region])
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

