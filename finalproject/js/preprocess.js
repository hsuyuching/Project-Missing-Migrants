class preprocess{
    /*
    * Function: include world map
    * output: 0 … 99]
        0: CountryData
            geometry:
                coordinates: [Array(69)]
                type: "Polygon"
                __proto__: Object
            id: "AFG"
            properties: "Afghanistan"
            type: "Feature"
    * */
    WorldMapData(){
        var mapData = window.worldData
        let countryData = mapData.features.map(d => {
            return new CountryData(d.type, d.id, d.properties != undefined? d.properties.name:"0", d.geometry);
        });
        return countryData
    }

    /*
    function: sum all dead based on incident region
    output: {Mediterranean: 4826, Europe: 230, Sub-Saharan Africa: 426, …}
    */
    IncidentRegionBased(){
        var migrantData =  window.migrant

        /* pre-processing migrantData */
        /* sum all dead based on incident region */
        const IncidentRegionBased={}
        for (let i=0; i<migrantData.length; i++){
            if(!(migrantData[i].incident_region in IncidentRegionBased)){
                IncidentRegionBased[migrantData[i].incident_region] = 0
            }
            if(migrantData[i].incident_region in IncidentRegionBased){
                // console.log("haha")
                IncidentRegionBased[migrantData[i].incident_region] += migrantData[i].dead
            }
        }
        // console.log("(IncidenRegionData) incident region: dead", IncidentRegionBased)
        return IncidentRegionBased
    }

    /* Define the regions */
    DefineRegion(){
        const objCountryExtend= {}
        // Object.assign(objCountryExtend, obj)
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

        // console.log("incident region: list of countries", objCountryExtend)
        return objCountryExtend
    }

}