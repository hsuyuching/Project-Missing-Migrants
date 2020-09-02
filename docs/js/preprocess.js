class preprocess{
    constructor(){
    }
    /*
    0: "Middle East : 402.57421888, 25.9580601"
    1: "Central America & Mexico : 264.12890397, 16.77088981" (lon, lat)
    2: "MENA( Middle East and North Africa) 43.03124785, 28.64431799"
    3: "South East Asia: 466.87500335, 13.54775471"
    4: "": 0,0
    5: "South Asia: 438.01171996, 22.95031305"
    6: "Middle East/ South Asia: 24.774265, 46.738586"
    7: "Sub-Saharan Africa: 383.73046674, 3.65378603"
    8: "Horn of Africa: 403.7695346, 6.42013471"
    9: "Caribbean: 283.64062071, 20.33638895"
    10: "South America: 300.9375, -11.62641141"
    11: "East Asia: 469.26561534, 35.17380481"
    12: "Central America:  274.32421982, 13.27417061"
    13: "North Africa: 377.2265625, 24.59108635"
    14: "Southern Europe: 13.53515625, 41.56120985"
    15: "Mixed: 0,0"
    16: "Horn of Africa (P): 403.7695346, 6.42013471"
     */
    OriginRegion(){
        // let migrantData =  window.migrant
        // let OriginRegionBased ={}
        // var map = d3.map(migrantData, function (d) {
        //     return d.region_origin
        // })
        // console.log(map.keys())
        let OriginRegionBased =[
        {region: "Middle East", lon: 402.57421888, lat: 25.9580601},
        {region: "Central America & Mexico",lon: 264.12890397, lat:16.77088981},
        {region: "MENA", lon: 43.03124785,lat: 28.64431799},
        {region: "South East Asia", lon:  466.87500335,  lat:13.54775471},
        {region: "UNKNOWN", lon:  -1, lat:-1},
        {region: "South Asia", lon:  438.01171996, lat: 22.95031305},
        {region: "Middle East/ South Asia", lon:  24.774265, lat: 46.738586},
        {region: "Sub-Saharan Africa", lon:  383.73046674, lat: 3.65378603},
        {region: "Horn of Africa", lon:  403.7695346,  lat:6.42013471},
        {region: "Caribbean", lon:  283.64062071,  lat:20.33638895},
        {region: "South America", lon:  300.9375,  lat:-11.62641141},
        {region: "East Asia", lon:  469.26561534,  lat:35.17380481},
        {region: "Central America", lon:   274.32421982,  lat:13.27417061},
        {region: "North Africa", lon:  377.2265625,  lat:24.59108635},
        {region: "Southern Europe", lon:  13.53515625, lat: 41.56120985},
        {region: "Mixed", lon:  -1, lat:-1},
        {region: "Horn of Africa (P)", lon:  403.7695346,  lat:6.42013471}
        ]
        return OriginRegionBased
    }


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
        /* pre-processing migrantData: sum all dead based on incident region */
        const IncidentRegionBased={}
        for (let i=0; i<migrantData.length; i++){
            if(!(migrantData[i].incident_region in IncidentRegionBased)){
                IncidentRegionBased[migrantData[i].incident_region] = 0
            }
            if(migrantData[i].incident_region in IncidentRegionBased){
                IncidentRegionBased[migrantData[i].incident_region] += migrantData[i].dead
            }
        }
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

        return objCountryExtend
    }


}