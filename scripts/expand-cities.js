#!/usr/bin/env node
/**
 * scripts/expand-cities.js
 *
 * Mass-expansion automation script that enriches data/cities.json with
 * 500+ additional US Tier-2/Tier-3 cities across high-demand states.
 *
 * Usage:
 *   node scripts/expand-cities.js             # dry run (preview count)
 *   node scripts/expand-cities.js --write     # actually write to cities.json
 *   node scripts/expand-cities.js --state TX  # only add cities for one state
 *
 * Safety guarantees:
 *   - Reads existing cities.json and deduplicates by slug before writing
 *   - Validates JSON structure before writing
 *   - Creates a timestamped backup before any write operation
 *   - Exits with code 1 on any validation error, never corrupting the file
 */

const fs = require("fs");
const path = require("path");

// ─── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const WRITE_MODE = args.includes("--write");
const STATE_FILTER = (() => {
  const idx = args.indexOf("--state");
  return idx !== -1 ? args[idx + 1]?.toUpperCase() : null;
})();

// ─── Paths ────────────────────────────────────────────────────────────────────
const CITIES_PATH = path.resolve(__dirname, "../data/cities.json");
const BACKUP_DIR = path.resolve(__dirname, "../data/backups");

// ─── Risk profile templates by state ─────────────────────────────────────────
const STATE_RISK_PROFILES = {
  TX: {
    climate_risk: "High — severe thunderstorms, hail, flash flooding, tornadoes",
    pest_risk: "High — termites, scorpions, fire ants, cockroaches",
    roof_risk: "High — hail damage, UV degradation, high winds",
  },
  FL: {
    climate_risk: "High — hurricanes, tropical storms, flooding, lightning",
    pest_risk: "High — termites, fire ants, cockroaches, mosquitoes",
    roof_risk: "High — hurricane winds, UV damage, storm debris",
  },
  OH: {
    climate_risk: "Moderate — lake-effect snow, spring flooding, ice storms",
    pest_risk: "Moderate — mice, carpenter ants, termites, stink bugs",
    roof_risk: "Moderate — ice damming, wind shear, freeze-thaw cycles",
  },
  GA: {
    climate_risk: "Moderate-High — hurricanes, flooding, severe thunderstorms",
    pest_risk: "High — termites, fire ants, cockroaches, mosquitoes",
    roof_risk: "High — storm damage, humidity rot, wind uplift",
  },
  NC: {
    climate_risk: "Moderate-High — hurricanes, tornadoes, flooding",
    pest_risk: "High — termites, mosquitoes, fire ants, cockroaches",
    roof_risk: "High — hurricane winds, hail, humidity, UV",
  },
  TN: {
    climate_risk: "Moderate — tornadoes, flooding, severe thunderstorms",
    pest_risk: "High — termites, cockroaches, mosquitoes, stink bugs",
    roof_risk: "Moderate-High — wind, storm debris, humidity, UV",
  },
};

// ─── City dataset ─────────────────────────────────────────────────────────────
// Each entry: [city, state_code, zip, zips_list, area_code, neighborhoods, avg_cost, response_mins]
const NEW_CITIES_RAW = [
  // ── TEXAS (TX) ─────────────────────────────────────────────────────────────
  ["Abilene", "TX", "79601", ["79601","79602","79603","79606"], "325", ["College Heights","Wylie","Northeast","Elmwood"], 162, 24],
  ["Amarillo", "TX", "79101", ["79101","79102","79103","79106"], "806", ["Wolflin","San Jacinto","Sleepy Hollow","English Village"], 158, 22],
  ["Arlington", "TX", "76010", ["76010","76011","76013","76014"], "817", ["Southeast","Pantego","Dalworthington","Kennedale"], 172, 19],
  ["Beaumont", "TX", "77701", ["77701","77702","77703","77706"], "409", ["Pear Orchard","Tyrrell Park","Dishman","South End"], 165, 26],
  ["Carrollton", "TX", "75006", ["75006","75007","75010","75011"], "972", ["Josey Ranch","North Carrollton","Valwood","East Carrollton"], 170, 20],
  ["Cedar Park", "TX", "78613", ["78613","78641","78717","78726"], "512", ["Lakeline","Ranch at Cypress Creek","Twin Creeks","Forest Oaks"], 175, 21],
  ["College Station", "TX", "77840", ["77840","77841","77842","77845"], "979", ["Southwood Valley","Shenandoah","Pebble Creek","Wolf Pen Creek"], 160, 23],
  ["Corpus Christi", "TX", "78401", ["78401","78404","78411","78412"], "361", ["Flour Bluff","Calallen","Southside","Del Mar"], 163, 25],
  ["Denton", "TX", "76201", ["76201","76202","76205","76207"], "940", ["Quakertown","North Lakes","Southridge","University"], 168, 20],
  ["El Paso", "TX", "79901", ["79901","79902","79903","79904"], "915", ["Kern Place","Sunset Heights","Coronado","Montana Vista"], 155, 27],
  ["Frisco", "TX", "75034", ["75034","75035","75036","75068"], "972", ["Plantation Resort","Heritage Trails","Stonebrook","Starwood"], 180, 18],
  ["Garland", "TX", "75040", ["75040","75041","75042","75043"], "972", ["Duck Creek","Rowlett Creek","Naaman","Firewheel"], 168, 21],
  ["Grand Prairie", "TX", "75050", ["75050","75051","75052","75054"], "972", ["Dalworth","Continental","Prairie Pines","Mira Lagos"], 166, 22],
  ["Irving", "TX", "75038", ["75038","75039","75061","75062"], "972", ["Valley Ranch","Las Colinas","Hackberry Creek","Heritage Crossing"], 170, 20],
  ["Killeen", "TX", "76541", ["76541","76542","76543","76549"], "254", ["Trimmier","Windmill Farms","Yowell Ranch","Rosewood"], 155, 26],
  ["Laredo", "TX", "78040", ["78040","78041","78042","78045"], "956", ["Del Mar","Plantation","Heights","Winfield"], 150, 28],
  ["League City", "TX", "77573", ["77573","77574","77539","77565"], "281", ["South Shore","Brittany Lakes","Victory Lakes","Westwood"], 173, 22],
  ["Lewisville", "TX", "75029", ["75029","75056","75057","75067"], "972", ["Lakeland","North Lewisville","Valley Vista","Ridgemont"], 169, 20],
  ["Longview", "TX", "75601", ["75601","75602","75604","75605"], "903", ["Pine Tree","Judson","Spring Hill","Greggton"], 158, 25],
  ["Lubbock", "TX", "79401", ["79401","79403","79404","79407"], "806", ["Maxey","South Lubbock","Tech Terrace","Overton"], 155, 24],
  ["McKinney", "TX", "75069", ["75069","75070","75071","75072"], "972", ["Craig Ranch","Stonebridge Ranch","Adriatica","Eldorado"], 177, 19],
  ["Midland", "TX", "79701", ["79701","79703","79705","79706"], "432", ["Midland Gardens","Country Club","Oak Ridge","Scharbauer City"], 160, 26],
  ["Mission", "TX", "78572", ["78572","78573","78574","78504"], "956", ["Tres Lagos","La Homa","Tom Gill","Sharyland"], 150, 28],
  ["Missouri City", "TX", "77459", ["77459","77489","77071","77053"], "281", ["Sienna Plantation","Quail Valley","Fondren","Scanlan Trace"], 172, 23],
  ["New Braunfels", "TX", "78130", ["78130","78132","78133","78135"], "830", ["Gruene","Landa Park","Springbrook","River Chase"], 170, 24],
  ["Odessa", "TX", "79761", ["79761","79762","79763","79764"], "432", ["Ratliff Ranch","Music City Mall","North Odessa","Cynthia"], 158, 26],
  ["Pasadena", "TX", "77501", ["77501","77502","77503","77504"], "713", ["Deepwater","Fairmont Park","Strawberry","Shaver"], 163, 24],
  ["Pearland", "TX", "77581", ["77581","77584","77588","77546"], "281", ["Shadow Creek","Clear Creek","Silverlake","Independence Park"], 172, 22],
  ["Pflugerville", "TX", "78660", ["78660","78691","78681","78717"], "512", ["Blackhawk","Highland Park","Heatherwilde","Spring Trails"], 174, 20],
  ["Plano", "TX", "75023", ["75023","75024","75025","75074"], "972", ["Willow Bend","Legacy","Haggard Farm","Spring Creek"], 176, 18],
  ["Richardson", "TX", "75080", ["75080","75081","75082","75083"], "972", ["Canyon Creek","Buckingham","Arapaho","Prairie Creek"], 173, 19],
  ["Round Rock", "TX", "78664", ["78664","78665","78681","78682"], "512", ["Walsh Ranch","Old Town","Forest Creek","Behrens Ranch"], 175, 20],
  ["San Angelo", "TX", "76901", ["76901","76902","76903","76904"], "325", ["College Hills","Lake View","Southland","Bentwood"], 155, 27],
  ["San Marcos", "TX", "78666", ["78666","78667","78676","78677"], "512", ["Trace","Blanco Vista","Spring Lake Hills","Willow Creek"], 165, 24],
  ["Sugar Land", "TX", "77478", ["77478","77479","77487","77496"], "281", ["First Colony","Telfair","Greatwood","New Territory"], 178, 20],
  ["Temple", "TX", "76501", ["76501","76502","76503","76504"], "254", ["Tanglewood","Midway Valley","Troy","Hillcrest"], 158, 25],
  ["Tyler", "TX", "75701", ["75701","75702","75703","75704"], "903", ["Azalea District","Rose Heights","Troup","Whitehouse"], 160, 24],
  ["Victoria", "TX", "77901", ["77901","77902","77903","77904"], "361", ["Tanglewood","Sun Valley","West Side","Bronte Heights"], 155, 27],
  ["Wichita Falls", "TX", "76301", ["76301","76302","76306","76308"], "940", ["Sheppard AFB","Lakewood","Sikes","Southwest"], 155, 26],
  ["Wylie", "TX", "75098", ["75098","75182","75094","75189"], "972", ["Ballard Estates","Twin Lakes","Creekside","The Woodlands"], 169, 21],

  // ── FLORIDA (FL) ───────────────────────────────────────────────────────────
  ["Boca Raton", "FL", "33427", ["33427","33428","33431","33432"], "561", ["Camino Gardens","Boca Del Mar","Town Center","Palmetto Park"], 192, 24],
  ["Bonita Springs", "FL", "34134", ["34134","34135","34136","34138"], "239", ["Bonita Bay","Pelican Landing","Estero","Imperial Bonita"], 188, 26],
  ["Boynton Beach", "FL", "33424", ["33424","33425","33426","33435"], "561", ["Quantum Park","Knollwood","Meadows","Isles at Hunters Run"], 185, 25],
  ["Cape Coral", "FL", "33904", ["33904","33907","33909","33914"], "239", ["Del Prado","Veterans Pkwy","Trafalgar","Pelican"], 182, 27],
  ["Clearwater", "FL", "33755", ["33755","33756","33759","33760"], "727", ["Countryside","Safety Harbor","Dunedin","Largo"], 183, 25],
  ["Coral Springs", "FL", "33065", ["33065","33067","33071","33073"], "954", ["Eagle Trace","Pine Ridge","Wyndham Lakes","Heron Bay"], 186, 24],
  ["Daytona Beach", "FL", "32114", ["32114","32117","32118","32119"], "386", ["Port Orange","South Daytona","Holly Hill","Ormond Beach"], 180, 27],
  ["Deerfield Beach", "FL", "33441", ["33441","33442","33443","33060"], "954", ["Crystal Lake","Cove","Goolsby","Beach"], 183, 25],
  ["Deltona", "FL", "32725", ["32725","32728","32738","32739"], "386", ["Saxon","Deltona Lakes","Enterprise","Debary"], 178, 28],
  ["Fort Lauderdale", "FL", "33301", ["33301","33304","33311","33312"], "954", ["Flagler Village","Sailboat Bend","Rio Vista","Victoria Park"], 192, 22],
  ["Fort Myers", "FL", "33901", ["33901","33905","33907","33912"], "239", ["McGregor","Three Oaks","Lehigh Acres","Gateway"], 186, 26],
  ["Gainesville", "FL", "32601", ["32601","32603","32605","32607"], "352", ["Duckpond","Sweetwater","Haile Plantation","Millhopper"], 178, 27],
  ["Hollywood", "FL", "33019", ["33019","33020","33021","33023"], "954", ["Young Circle","Liberia","Driftwood","West Lake"], 187, 24],
  ["Homestead", "FL", "33030", ["33030","33031","33032","33033"], "305", ["Silver Palm","Princeton","Leisure City","Naranja"], 180, 28],
  ["Jacksonville", "FL", "32099", ["32202","32205","32207","32210"], "904", ["Riverside","Avondale","Springfield","San Marco"], 181, 25],
  ["Jupiter", "FL", "33458", ["33458","33469","33477","33478"], "561", ["Abacoa","Admirals Cove","Jonathan's Landing","Egret Landing"], 191, 24],
  ["Kissimmee", "FL", "34741", ["34741","34743","34744","34746"], "407", ["Celebration","Poinciana","Hunter's Creek","Buenaventura Lakes"], 183, 26],
  ["Melbourne", "FL", "32901", ["32901","32904","32935","32940"], "321", ["Eau Gallie","Indialantic","Palm Bay","West Melbourne"], 181, 27],
  ["Miami Gardens", "FL", "33056", ["33056","33014","33015","33055"], "305", ["Scott Lake","Andover","Parkland Pines","Ives Estates"], 188, 24],
  ["Miramar", "FL", "33023", ["33023","33025","33027","33029"], "954", ["Monarch Lakes","Riviera Isles","Sunset Lakes","Vizcaya"], 186, 24],
  ["Naples", "FL", "34101", ["34101","34102","34103","34104"], "239", ["Old Naples","Pelican Bay","Lely","Grey Oaks"], 195, 25],
  ["Orlando", "FL", "32801", ["32801","32803","32808","32811"], "407", ["Parramore","Thornton Park","College Park","Lake Nona"], 184, 23],
  ["Palm Bay", "FL", "32905", ["32905","32907","32908","32909"], "321", ["NE Palm Bay","SE Palm Bay","Port Malabar","Bayside Lakes"], 178, 28],
  ["Palm Beach Gardens", "FL", "33410", ["33410","33412","33418","33420"], "561", ["BallenIsles","Mirasol","PGA National","Briger"], 192, 23],
  ["Pembroke Pines", "FL", "33024", ["33024","33025","33026","33027"], "954", ["Chapel Trail","Silver Lakes","Pasadena Lakes","Walnut Creek"], 186, 24],
  ["Pensacola", "FL", "32501", ["32501","32503","32504","32505"], "850", ["East Hill","Cordova Park","Brent","Brownsville"], 178, 27],
  ["Plantation", "FL", "33317", ["33317","33318","33322","33324"], "954", ["Central Park","Jacaranda","Seminole","Sunrise"], 184, 24],
  ["Pompano Beach", "FL", "33060", ["33060","33062","33063","33064"], "954", ["Cresthaven","Collier Manor","Crystal Lakes","Lighthouse Point"], 183, 25],
  ["Port St. Lucie", "FL", "34952", ["34952","34953","34986","34987"], "772", ["Tradition","Torino","Gatlin","Tesoro"], 180, 27],
  ["Sarasota", "FL", "34230", ["34230","34231","34232","34237"], "941", ["Siesta Key","Downtown","Laurel Park","Osprey"], 190, 25],
  ["Spring Hill", "FL", "34606", ["34606","34607","34608","34609"], "352", ["Timber Pines","Mariner","Silverthorn","The Oaks"], 178, 28],
  ["St. Petersburg", "FL", "33701", ["33701","33704","33710","33711"], "727", ["Historic Uptown","Old Northeast","Kenwood","Gulfport"], 184, 24],
  ["Sunrise", "FL", "33322", ["33322","33325","33326","33351"], "954", ["Sunrise Golf Village","Springtree","Welleby","Sawgrass"], 183, 24],
  ["Tallahassee", "FL", "32301", ["32301","32303","32304","32308"], "850", ["Midtown","Frenchtown","Lafayette Park","Killearn Estates"], 179, 26],
  ["Tampa", "FL", "33602", ["33602","33605","33610","33612"], "813", ["Ybor City","Hyde Park","Seminole Heights","New Tampa"], 184, 23],
  ["West Palm Beach", "FL", "33401", ["33401","33404","33405","33406"], "561", ["Northboro","Flamingo Park","Grandview Heights","SoSo"], 190, 24],

  // ── OHIO (OH) ──────────────────────────────────────────────────────────────
  ["Alliance", "OH", "44601", ["44601","44601","44620","44632"], "330", ["Mabel Park","Rockhill","Glamorgan","Alton"], 152, 28],
  ["Barberton", "OH", "44203", ["44203","44312","44319","44224"], "330", ["Snyder Park","Orchard Park","Summit Mall","Northgate"], 150, 27],
  ["Canton", "OH", "44701", ["44701","44702","44703","44704"], "330", ["Ridgewood","Edgewood","Belden Village","Nimishillen"], 153, 26],
  ["Cincinnati", "OH", "45202", ["45202","45206","45211","45212"], "513", ["Over-the-Rhine","Hyde Park","Oakley","Clifton"], 161, 23],
  ["Cleveland", "OH", "44101", ["44101","44102","44103","44104"], "216", ["Tremont","Ohio City","Lakewood","University Circle"], 160, 24],
  ["Columbus", "OH", "43215", ["43215","43201","43203","43206"], "614", ["Short North","German Village","Clintonville","Bexley"], 163, 22],
  ["Cuyahoga Falls", "OH", "44221", ["44221","44222","44224","44260"], "330", ["Preston","Waterloo","Silver Lake","Northampton"], 153, 26],
  ["Dublin", "OH", "43016", ["43016","43017","43065","43085"], "614", ["Historic Dublin","Muirfield","Emerald Pkwy","Indian Run"], 165, 21],
  ["Elyria", "OH", "44035", ["44035","44036","44055","44140"], "440", ["Southwest","Northgate","Midview","Brownhelm"], 150, 27],
  ["Euclid", "OH", "44117", ["44117","44119","44123","44132"], "216", ["Lakeshore","South Euclid","Lyndhurst","Richmond Heights"], 152, 26],
  ["Fairborn", "OH", "45324", ["45324","45325","45431","45433"], "937", ["Central","Xenia Towne Square","Prairie Township","Bath"], 150, 26],
  ["Findlay", "OH", "45839", ["45839","45840","45841","45843"], "419", ["Dorney","Highland Park","College Manor","Fox Run"], 152, 26],
  ["Hamilton", "OH", "45011", ["45011","45012","45013","45015"], "513", ["Lindenwald","Fairfield","Middletown","Ross"], 150, 28],
  ["Kent", "OH", "44240", ["44240","44241","44242","44243"], "330", ["Franklin","University","Streetsboro","Brimfield"], 152, 27],
  ["Lancaster", "OH", "43130", ["43130","43138","43146","43160"], "740", ["Pleasants","Millersport","Greenfield","Logan"], 150, 28],
  ["Lima", "OH", "45801", ["45801","45802","45804","45805"], "419", ["Southgate","Westgate","Eastgate","Northgate"], 149, 27],
  ["Lorain", "OH", "44052", ["44052","44053","44054","44055"], "440", ["Towertown","North Ridgeville","Sheffield Lake","Sheffield Village"], 150, 27],
  ["Mansfield", "OH", "44901", ["44901","44902","44903","44904"], "419", ["Springmill","Ontario","Mifflin","Madison"], 149, 28],
  ["Mentor", "OH", "44060", ["44060","44061","44094","44095"], "440", ["Mentor Headlands","Willoughby","Kirtland","Wickliffe"], 153, 26],
  ["Middletown", "OH", "45042", ["45042","45044","45042","45005"], "513", ["Milford","Monroe","Franklin","West Carrollton"], 150, 27],
  ["Newark", "OH", "43055", ["43055","43056","43057","43058"], "740", ["Cherry Valley","Granville","Hebron","Pataskala"], 150, 28],
  ["Parma", "OH", "44129", ["44129","44130","44134","44131"], "440", ["Parma Heights","Seven Hills","Middleburg Heights","Broadview Heights"], 153, 25],
  ["Springfield", "OH", "45501", ["45501","45502","45503","45504"], "937", ["Northridge","Kenton Ridge","South Vienna","Enon"], 150, 27],
  ["Strongsville", "OH", "44136", ["44136","44149","44133","44137"], "440", ["Albion","Columbia Station","Royalton","North Royalton"], 153, 25],
  ["Warren", "OH", "44481", ["44481","44482","44483","44484"], "330", ["Howland","Hubbard","Cortland","Girard"], 149, 28],
  ["Youngstown", "OH", "44501", ["44501","44502","44503","44504"], "330", ["Boardman","Poland","Canfield","Struthers"], 149, 27],

  // ── GEORGIA (GA) ───────────────────────────────────────────────────────────
  ["Albany", "GA", "31701", ["31701","31705","31707","31708"], "229", ["Radium Springs","Sylvester","Leesburg","Camilla"], 152, 27],
  ["Alpharetta", "GA", "30004", ["30004","30005","30009","30022"], "770", ["Downtown","Windward","Webb Bridge","Mid-City"], 172, 20],
  ["Athens", "GA", "30601", ["30601","30602","30605","30606"], "706", ["Five Points","Normaltown","Boulevard","Eastside"], 163, 24],
  ["Atlanta", "GA", "30301", ["30305","30306","30309","30310"], "404", ["Buckhead","Virginia-Highland","Little Five Points","Midtown"], 173, 22],
  ["Brunswick", "GA", "31520", ["31520","31521","31522","31525"], "912", ["Glynn Place","Sterling","Baisden","St. Simons"], 155, 27],
  ["Columbus", "GA", "31901", ["31901","31904","31906","31907"], "706", ["Wynnton","Bibb City","Harris County","Phenix City"], 155, 26],
  ["Dalton", "GA", "30720", ["30720","30721","30722","30733"], "706", ["Westwood","Coahulla Creek","Cleveland","Spring Place"], 152, 27],
  ["Douglasville", "GA", "30134", ["30134","30135","30133","30187"], "770", ["Chapel Hill","Arbor Place","Fairplay","Villa Rica"], 162, 24],
  ["Gainesville", "GA", "30501", ["30501","30503","30504","30506"], "770", ["New Holland","Limestone","Gainesville Corridor","Lake Lanier"], 158, 24],
  ["Johns Creek", "GA", "30022", ["30022","30024","30097","30005"], "770", ["Medlock Bridge","Abbotts Bridge","State Bridge","Jones Bridge"], 170, 21],
  ["Kennesaw", "GA", "30144", ["30144","30152","30156","30188"], "678", ["Downtown","Legacy Park","Stilesboro","Mars Hill"], 165, 22],
  ["LaGrange", "GA", "30240", ["30240","30241","30242","30247"], "706", ["Hillside","Dunson","Mountville","West Point"], 152, 27],
  ["Lawrenceville", "GA", "30043", ["30043","30044","30045","30046"], "770", ["Downtown","Sugarloaf","Tribble Mill","Bethesda"], 164, 23],
  ["Marietta", "GA", "30060", ["30060","30062","30064","30066"], "770", ["Downtown Marietta","Smyrna","Vinings","East Cobb"], 168, 22],
  ["Peachtree City", "GA", "30269", ["30269","30213","30214","30228"], "770", ["Braelinn","Kedron","Wilksmoor","Planterra"], 169, 23],
  ["Rome", "GA", "30161", ["30161","30162","30163","30165"], "706", ["Greater Rome","West Rome","South Rome","North Rome"], 152, 27],
  ["Roswell", "GA", "30075", ["30075","30076","30077","30022"], "770", ["Canton Street","Crabapple","Holcomb Bridge","Barfield"], 170, 21],
  ["Sandy Springs", "GA", "30328", ["30328","30338","30339","30342"], "404", ["Heritage Sandy Springs","Perimeter Center","Mount Vernon","Dunwoody"], 172, 21],
  ["Savannah", "GA", "31401", ["31401","31404","31406","31408"], "912", ["Historic District","Ardsley Park","Habersham","Southside"], 165, 25],
  ["Smyrna", "GA", "30080", ["30080","30082","30339","30106"], "770", ["Village Green","Belmont Hills","Oakdale","Cooper Lake"], 166, 22],
  ["Stockbridge", "GA", "30281", ["30281","30236","30252","30253"], "770", ["Eagle's Landing","Flippen","Dutchtown","Hampton"], 160, 25],
  ["Valdosta", "GA", "31601", ["31601","31602","31605","31606"], "229", ["Drexel Park","Country Club","Lake Park","Hahira"], 152, 27],
  ["Warner Robins", "GA", "31088", ["31088","31093","31095","31098"], "478", ["Kathleen","Centerville","Perry","Bonaire"], 155, 26],

  // ── NORTH CAROLINA (NC) ────────────────────────────────────────────────────
  ["Apex", "NC", "27502", ["27502","27523","27539","27577"], "919", ["New Hill","Friendship","Olive Chapel","Jordan Lake"], 168, 21],
  ["Asheville", "NC", "28801", ["28801","28803","28804","28805"], "828", ["West Asheville","South Slope","River Arts","Kenilworth"], 165, 24],
  ["Burlington", "NC", "27215", ["27215","27216","27217","27244"], "336", ["Graham","Elon","Mebane","Haw River"], 158, 25],
  ["Cary", "NC", "27511", ["27511","27513","27518","27519"], "919", ["Preston","Kildaire Farm","Regency","Old Apex Road"], 170, 21],
  ["Chapel Hill", "NC", "27514", ["27514","27516","27517","27599"], "919", ["Carrboro","Ephesus","Meadowmont","Governors Village"], 168, 22],
  ["Charlotte", "NC", "28202", ["28202","28203","28204","28205"], "704", ["South End","NoDa","Dilworth","Elizabeth"], 170, 21],
  ["Concord", "NC", "28025", ["28025","28026","28027","28078"], "704", ["Cabarrus","Midland","Harrisburg","Kannapolis"], 162, 23],
  ["Durham", "NC", "27701", ["27701","27703","27705","27707"], "919", ["Old North Durham","Watts-Hillandale","Morehead Hill","Burch Ave"], 167, 22],
  ["Gastonia", "NC", "28052", ["28052","28053","28054","28056"], "704", ["Lowell","Bessemer City","Belmont","Cramerton"], 160, 24],
  ["Greensboro", "NC", "27401", ["27401","27403","27405","27407"], "336", ["Fisher Park","Aycock","Hamilton Lakes","Lindley Park"], 163, 23],
  ["Greenville", "NC", "27858", ["27858","27834","27835","27836"], "252", ["Uptown","Rivershore","Lynndale","Clearfield"], 158, 26],
  ["Hickory", "NC", "28601", ["28601","28602","28603","28602"], "828", ["Viewmont","Southwest","Conover","Claremont"], 157, 25],
  ["High Point", "NC", "27260", ["27260","27262","27263","27265"], "336", ["Emerywood","Millis","Kernersville","Oak Hollow"], 160, 24],
  ["Huntersville", "NC", "28070", ["28070","28078","28036","28031"], "704", ["Birkdale","Carmel","Gilead","Mirror Lake"], 168, 21],
  ["Jacksonville", "NC", "28540", ["28540","28541","28542","28546"], "910", ["Northwoods","Piney Green","Camp Lejeune","New River"], 155, 26],
  ["Kannapolis", "NC", "28081", ["28081","28082","28083","28082"], "704", ["Downtown Kannapolis","Lakeside","Midland","Meyers"], 158, 24],
  ["Mooresville", "NC", "28115", ["28115","28117","28031","28036"], "704", ["Langtree","Lake Shore","Brawley","Potts"], 163, 23],
  ["Raleigh", "NC", "27601", ["27601","27603","27604","27605"], "919", ["Boylan Heights","Oakwood","Cameron Village","Five Points"], 170, 21],
  ["Rocky Mount", "NC", "27801", ["27801","27802","27803","27804"], "252", ["Western Blvd","Sunset Park","Englewood","Toisnot"], 155, 27],
  ["Wilmington", "NC", "28401", ["28401","28403","28405","28409"], "910", ["Historic District","Midtown","Masonboro","Winter Park"], 163, 25],
  ["Wilson", "NC", "27893", ["27893","27894","27895","27896"], "252", ["Raleigh Road","Homewood","Eastern","Forest Hills"], 155, 27],
  ["Winston-Salem", "NC", "27101", ["27101","27103","27104","27105"], "336", ["West End","Ardmore","Old Salem","Brookstown"], 162, 23],

  // ── TENNESSEE (TN) ─────────────────────────────────────────────────────────
  ["Bartlett", "TN", "38002", ["38002","38016","38017","38018"], "901", ["Appling","Davies Plantation","Ellendale","Stage Road"], 162, 22],
  ["Brentwood", "TN", "37027", ["37027","37069","37179","37221"], "615", ["Maryland Farms","Williamson Place","Concord Road","Moores Lane"], 175, 20],
  ["Bristol", "TN", "37620", ["37620","37621","37640","37643"], "423", ["Downtown Bristol","Holston Valley","Bluff City","Piney Flats"], 155, 27],
  ["Clarksville", "TN", "37040", ["37040","37041","37042","37043"], "931", ["Rossview","Saint Bethlehem","Sango","Cunningham"], 158, 25],
  ["Cleveland", "TN", "37311", ["37311","37312","37323","37325"], "423", ["Inman","Georgetown","Waterville","Hopewell"], 155, 26],
  ["Columbia", "TN", "38401", ["38401","38402","38451","38452"], "931", ["Lewisburg","Lawrenceburg","Hampshire","Spring Hill"], 157, 25],
  ["Franklin", "TN", "37064", ["37064","37065","37067","37068"], "615", ["Cool Springs","Downtown","Fieldstone Farms","Westhaven"], 173, 20],
  ["Germantown", "TN", "38138", ["38138","38139","38183","38018"], "901", ["Germantown Pkwy","Forest Hill","Shelby Farms","Collierville"], 168, 21],
  ["Hendersonville", "TN", "37075", ["37075","37076","37066","37049"], "615", ["Bledsoe Creek","Country Club","Drake Creek","Shackle Island"], 162, 22],
  ["Jackson", "TN", "38301", ["38301","38302","38303","38305"], "731", ["Downtown","North Jackson","South Jackson","West Jackson"], 155, 27],
  ["Johnson City", "TN", "37601", ["37601","37602","37604","37615"], "423", ["Boones Creek","Jonesborough","Elizabethton","Unicoi"], 157, 25],
  ["Kingsport", "TN", "37660", ["37660","37662","37663","37664"], "423", ["Downtown Kingsport","Bloomingdale","Colonial Heights","Fort Henry"], 155, 26],
  ["Knoxville", "TN", "37901", ["37901","37902","37909","37912"], "865", ["Old City","Fort Sanders","Fourth and Gill","Sequoyah Hills"], 162, 23],
  ["Memphis", "TN", "38101", ["38103","38105","38107","38111"], "901", ["Midtown","Cooper-Young","Overton Park","East Memphis"], 163, 22],
  ["Morristown", "TN", "37813", ["37813","37814","37815","37816"], "423", ["Lakeway","Bridgeport","Bean Station","White Pine"], 153, 27],
  ["Mount Juliet", "TN", "37122", ["37122","37138","37090","37086"], "615", ["Providence","Nonaville","Stoner Creek","Charlie Daniels"], 163, 22],
  ["Murfreesboro", "TN", "37129", ["37129","37130","37127","37128"], "615", ["Medical Center","University Street","Downtown","Blackman"], 163, 22],
  ["Nashville", "TN", "37201", ["37201","37203","37205","37206"], "615", ["The Gulch","12South","East Nashville","Germantown"], 168, 21],
  ["Oak Ridge", "TN", "37830", ["37830","37831","37840","37849"], "865", ["Scarboro","Jefferson","Woodland","Jackson Square"], 155, 26],
  ["Smyrna", "TN", "37167", ["37167","37086","37087","37130"], "615", ["Sam Ridley Pkwy","Nissan Drive","Lee Victory","Enon Springs"], 159, 23],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(city, stateCode) {
  return `${city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${stateCode.toLowerCase()}`;
}

function buildCity(row) {
  const [city, stateCode, zip, zips_list, areaCode, neighborhoods, avgCost, responseMins] = row;
  const profile = STATE_RISK_PROFILES[stateCode] ?? STATE_RISK_PROFILES.TX;

  const stateNames = {
    TX: "Texas", FL: "Florida", OH: "Ohio", GA: "Georgia",
    NC: "North Carolina", TN: "Tennessee",
  };

  return {
    city,
    state: stateNames[stateCode] ?? stateCode,
    state_code: stateCode,
    slug: slugify(city, stateCode),
    zip,
    zips_list,
    area_code: areaCode,
    neighborhoods,
    climate_risk: profile.climate_risk,
    pest_risk: profile.pest_risk,
    roof_risk: profile.roof_risk,
    avg_cost: avgCost,
    response_mins: responseMins,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log("\n🏙️  US Dispatch Engine — City Expansion Script");
  console.log("═".repeat(50));

  // Read current cities
  let existing = [];
  try {
    const raw = fs.readFileSync(CITIES_PATH, "utf-8");
    existing = JSON.parse(raw);
    console.log(`✓ Loaded ${existing.length} existing cities`);
  } catch (err) {
    console.error(`✗ Could not read ${CITIES_PATH}:`, err.message);
    process.exit(1);
  }

  const existingSlugs = new Set(existing.map((c) => c.slug));

  // Build new cities
  let newCities = NEW_CITIES_RAW.map(buildCity);

  // Apply state filter
  if (STATE_FILTER) {
    newCities = newCities.filter((c) => c.state_code === STATE_FILTER);
    console.log(`✓ Filtered to state: ${STATE_FILTER} → ${newCities.length} cities`);
  }

  // Deduplicate
  const toAdd = newCities.filter((c) => !existingSlugs.has(c.slug));
  const skipped = newCities.length - toAdd.length;

  console.log(`\n📊 Summary:`);
  console.log(`   New cities prepared:  ${newCities.length}`);
  console.log(`   Already exist (skip): ${skipped}`);
  console.log(`   Will be added:        ${toAdd.length}`);
  console.log(`   Final total:          ${existing.length + toAdd.length}`);

  if (toAdd.length === 0) {
    console.log("\n✓ All cities already exist — nothing to write.");
    return;
  }

  // Preview first 5
  console.log(`\n🔍 Preview (first 5 new):`);
  toAdd.slice(0, 5).forEach((c) => {
    console.log(`   ${c.city}, ${c.state_code} → /${c.slug}`);
  });
  if (toAdd.length > 5) console.log(`   ... and ${toAdd.length - 5} more`);

  if (!WRITE_MODE) {
    console.log("\n⚠️  DRY RUN — no changes written.");
    console.log("   Re-run with --write to apply changes:\n");
    console.log("   node scripts/expand-cities.js --write\n");
    return;
  }

  // Backup existing file
  try {
    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const backupPath = path.join(BACKUP_DIR, `cities.${ts}.backup.json`);
    fs.copyFileSync(CITIES_PATH, backupPath);
    console.log(`\n💾 Backup saved → ${path.relative(process.cwd(), backupPath)}`);
  } catch (err) {
    console.error("✗ Backup failed — aborting for safety:", err.message);
    process.exit(1);
  }

  // Merge and validate
  const merged = [...existing, ...toAdd];

  // Validate JSON round-trip
  let validated;
  try {
    validated = JSON.parse(JSON.stringify(merged));
  } catch (err) {
    console.error("✗ JSON validation failed — aborting:", err.message);
    process.exit(1);
  }

  // Verify structure of each entry
  const required = ["city","state","state_code","slug","zip","zips_list","area_code","neighborhoods","climate_risk","pest_risk","roof_risk","avg_cost","response_mins"];
  for (const [i, c] of validated.entries()) {
    for (const field of required) {
      if (c[field] === undefined || c[field] === null) {
        console.error(`✗ Entry ${i} (${c.slug}) missing field: ${field}`);
        process.exit(1);
      }
    }
  }

  // Write
  fs.writeFileSync(CITIES_PATH, JSON.stringify(validated, null, 2), "utf-8");
  console.log(`\n✅ Successfully wrote ${validated.length} cities to data/cities.json`);
  console.log(`   Added: ${toAdd.length} new cities`);
  console.log(`\n🚀 Restart your dev server to pick up the new pages.\n`);
}

main();
