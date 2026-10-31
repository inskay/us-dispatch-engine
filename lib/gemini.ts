/**
 * lib/gemini.ts
 * Gemini Live Intelligence Module
 *
 * Generates localised emergency advisory data via Google Gemini REST API
 * (gemini-2.5-flash). Falls back to a bundled state-level static cache when:
 *  - GEMINI_API_KEY is absent/empty
 *  - The API call fails or times out
 *  - The response cannot be parsed
 *
 * The file-based cache at data/dynamic-alerts.json is pre-populated with
 * high-quality state-level alerts covering all 50 US states + seasonal logic.
 */

import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DemandIndex = "CRITICAL" | "HIGH" | "ELEVATED";

export type AdvisoryPayload = {
  liveAlert: string;
  demandIndex: DemandIndex;
  localTip: string;
};

type CacheStore = Record<string, AdvisoryPayload>;

// ─── Static Fallback Cache ────────────────────────────────────────────────────

/**
 * Returns a season string ("winter"|"spring"|"summer"|"fall") for a given month (0-indexed).
 */
function getSeason(month: number): "winter" | "spring" | "summer" | "fall" {
  if (month <= 1 || month === 11) return "winter";
  if (month <= 4) return "spring";
  if (month <= 7) return "summer";
  return "fall";
}

// Comprehensive state-level static alerts — keyed by "state_code:niche:season"
const STATIC_ALERTS: Record<string, AdvisoryPayload> = {
  // ── Florida ────────────────────────────────────────────────────────────────
  "FL:water-damage:summer": {
    liveAlert:
      "Florida's peak hurricane season (June–November) is driving a surge in water intrusion and structural flooding across the state. Standing water in crawl spaces and basements creates ideal mold conditions within 24–48 hours of exposure.",
    demandIndex: "CRITICAL",
    localTip:
      "Clear your gutters and downspout extensions before every storm event — blocked drainage is the #1 cause of preventable water intrusion in Florida homes.",
  },
  "FL:water-damage:fall": {
    liveAlert:
      "Late hurricane season combined with heavy autumn rainfall is keeping water damage demand at peak levels across Florida. Roof-to-wall junctions and window seals are the most common entry points this season.",
    demandIndex: "CRITICAL",
    localTip:
      "Inspect exterior caulking around windows and doors every October — Florida's UV exposure degrades sealant 3× faster than northern states.",
  },
  "FL:water-damage:winter": {
    liveAlert:
      "Winter cold fronts colliding with Florida's warm Gulf moisture trigger rapid, intense rain events that overwhelm residential drainage systems. Demand for water extraction remains elevated through February.",
    demandIndex: "HIGH",
    localTip:
      "Test your sump pump monthly — winter storms can arrive with little warning and Florida's sandy soils don't absorb water quickly enough to protect foundations.",
  },
  "FL:water-damage:spring": {
    liveAlert:
      "Spring thunderstorm season is ramping up across Florida, with afternoon storms regularly dropping 2–4 inches per hour. Pre-season inspections of roof membranes and flashing are critical.",
    demandIndex: "HIGH",
    localTip:
      "Have your roof flashing inspected every spring before the rainy season — Florida's expansion/contraction cycles loosen flashing faster than any other state.",
  },
  "FL:pest-control:summer": {
    liveAlert:
      "Florida's summer heat and humidity create optimal breeding conditions for termites, cockroaches, and fire ants. Subterranean termite swarms peak between May and September, putting untreated homes at serious risk.",
    demandIndex: "CRITICAL",
    localTip:
      "Keep mulch at least 6 inches away from your foundation — moist mulch is a termite highway and Florida's warm soil keeps colonies active year-round.",
  },
  "FL:pest-control:fall": {
    liveAlert:
      "As temperatures begin to moderate, Florida pest populations remain high and begin seeking indoor harborage for the winter months. German cockroach and rodent intrusion calls spike significantly in October.",
    demandIndex: "HIGH",
    localTip:
      "Seal all exterior gaps larger than a quarter inch before fall — mice can compress their bodies to fit through openings the size of a dime.",
  },
  "FL:pest-control:winter": {
    liveAlert:
      "Florida's mild winters mean pest activity never truly ceases — termite colonies remain active below 50°F and cockroaches stay mobile year-round in the state's climate.",
    demandIndex: "ELEVATED",
    localTip:
      "Schedule a termite inspection every January — winter is the best time to spot mud tubes before spring swarm season begins.",
  },
  "FL:pest-control:spring": {
    liveAlert:
      "Spring marks the peak of Florida's termite swarming season. Millions of winged reproductives are actively seeking new colony sites, and unprotected wood in homes is their primary target.",
    demandIndex: "CRITICAL",
    localTip:
      "Turn off exterior lights during spring evenings — termite swarmers are strongly attracted to light and will congregate around any illuminated entry point.",
  },
  "FL:roof-repair:summer": {
    liveAlert:
      "Hurricane-season winds and tropical storm systems are generating unusually high demand for emergency roof tarping and shingle replacement across Florida. Category 1 winds alone can lift improperly fastened shingles.",
    demandIndex: "CRITICAL",
    localTip:
      "Photograph your roof from the ground every August — having pre-storm documentation dramatically speeds up insurance claim processing after a hurricane.",
  },
  "FL:roof-repair:fall": {
    liveAlert:
      "Post-storm roof assessments are spiking across Florida as late-season hurricanes and tropical storms continue through November. UV-aged shingles are failing at disproportionately high rates this season.",
    demandIndex: "CRITICAL",
    localTip:
      "Inspect attic insulation for moisture intrusion after every major storm — water migrates through micro-tears in roofing felt that aren't visible from outside.",
  },
  "FL:roof-repair:winter": {
    liveAlert:
      "Winter wind events and cold fronts are exposing pre-existing roof vulnerabilities across Florida. Post-storm inspections are recommended within 48 hours of any named event.",
    demandIndex: "HIGH",
    localTip:
      "Check your soffit vents every winter — blocked vents cause moisture buildup in attic spaces that accelerates sheathing rot in Florida's humid climate.",
  },
  "FL:roof-repair:spring": {
    liveAlert:
      "Pre-hurricane season roof inspections are at peak demand across Florida. Roofers are booking 2–4 weeks out — call now to lock in your spot before summer storm season begins.",
    demandIndex: "HIGH",
    localTip:
      "Replace any missing or lifted shingles before June 1 — Florida's building code requires roofs to withstand 140+ mph wind loads and loose shingles void insurance coverage.",
  },

  // ── Texas ──────────────────────────────────────────────────────────────────
  "TX:water-damage:winter": {
    liveAlert:
      "A severe winter storm system is generating widespread pipe burst and water intrusion claims across Texas. The 2021 freeze event demonstrated how quickly Texas infrastructure can be overwhelmed by sustained sub-freezing temperatures.",
    demandIndex: "CRITICAL",
    localTip:
      "Insulate exposed pipes in attics, crawl spaces, and garages before any freeze warning — Texas homes were not designed for sustained temperatures below 20°F.",
  },
  "TX:water-damage:spring": {
    liveAlert:
      "Texas's spring storm season is producing flash flood emergencies across the Hill Country and urban corridors. Homes in low-lying areas and near creek drainages are at highest risk for structural water intrusion.",
    demandIndex: "CRITICAL",
    localTip:
      "Know your FEMA flood zone — over 40% of Texas flood insurance claims come from properties outside designated high-risk zones, so standard homeowner policies leave many Texans unprotected.",
  },
  "TX:water-damage:summer": {
    liveAlert:
      "Severe summer thunderstorms with 70+ mph straight-line winds are generating hail-punctured roof incidents and subsequent water intrusion across the Dallas-Fort Worth and Houston metro areas.",
    demandIndex: "HIGH",
    localTip:
      "Install a secondary water barrier (ice-and-water shield) under shingles — Texas hail punches through standard shingles and the underlying felt in minutes.",
  },
  "TX:water-damage:fall": {
    liveAlert:
      "Fall storm systems are tracking across Texas, producing prolonged rain events that saturate clay soils and generate foundation seepage. Demand for moisture mitigation remains elevated.",
    demandIndex: "HIGH",
    localTip:
      "Grade soil away from your foundation at a 1-inch-per-foot slope — Texas's expansive clay soils shift when wet and push water directly toward foundation walls.",
  },
  "TX:pest-control:summer": {
    liveAlert:
      "Texas summer heat is driving scorpions, fire ants, and subterranean termites to seek moisture and shelter inside homes. Fire ant mound activity is at annual peak across the state's southern regions.",
    demandIndex: "CRITICAL",
    localTip:
      "Treat fire ant mounds within 24 hours of appearance — Texas fire ants can build a new mound overnight and each colony can contain up to 500,000 individuals.",
  },
  "TX:pest-control:fall": {
    liveAlert:
      "Cooling temperatures are triggering stink bug, spider, and rodent infiltration in Texas homes as insects seek winter shelter. German cockroach populations that built up over summer are now moving indoors.",
    demandIndex: "HIGH",
    localTip:
      "Apply exterior perimeter treatment every September — fall is when Texas pest pressures are highest at the home's foundation line.",
  },
  "TX:pest-control:winter": {
    liveAlert:
      "Texas's mild winters keep termite colonies active at depths below 12 inches, making winter the ideal time for Formosan termite colony expansion. Subterranean activity is often only detectable by trained inspectors.",
    demandIndex: "ELEVATED",
    localTip:
      "Have your home inspected for mud tube activity at pier-and-beam foundations every winter — Texas's older housing stock is disproportionately vulnerable to hidden termite damage.",
  },
  "TX:pest-control:spring": {
    liveAlert:
      "Texas spring rains are producing explosive mosquito breeding conditions and triggering termite swarming events across the state. Formosan termites in Houston and East Texas are at peak reproductive activity.",
    demandIndex: "CRITICAL",
    localTip:
      "Eliminate standing water in any container over 1 cup in volume — Texas mosquitoes need only a bottle cap of water to complete their breeding cycle.",
  },
  "TX:roof-repair:spring": {
    liveAlert:
      "Texas's peak hail season is underway — large hail cells tracking across Tornado Alley are producing baseball-sized hailstones that cause immediate, severe shingle damage across northern and central Texas.",
    demandIndex: "CRITICAL",
    localTip:
      "File your hail damage claim within 12 months of the storm event — Texas law requires insurers to respond within 15 business days of claim submission.",
  },
  "TX:roof-repair:summer": {
    liveAlert:
      "Texas summer temperatures reaching 105–115°F are accelerating asphalt shingle degradation, causing blistering and granule loss that exposes the underlying felt layer to UV radiation.",
    demandIndex: "HIGH",
    localTip:
      "Choose 30-year architectural shingles rated for high-wind zones when replacing your Texas roof — standard 3-tab shingles fail at wind speeds common in Texas spring storms.",
  },
  "TX:roof-repair:fall": {
    liveAlert:
      "Post-summer thermal shock is causing premature cracking in roofing materials across Texas as daytime highs drop rapidly overnight. Fall is the most cost-effective time to address deferred roof maintenance.",
    demandIndex: "HIGH",
    localTip:
      "Have your flashings inspected every fall — thermal cycling in Texas expands and contracts metal flashing up to ¼ inch per year, eventually breaking the waterproof seal.",
  },
  "TX:roof-repair:winter": {
    liveAlert:
      "Winter ice events across North Texas are creating ice dam conditions that back water under shingles. Combined with existing hail damage, winter storms are accelerating roof failure timelines significantly.",
    demandIndex: "ELEVATED",
    localTip:
      "Ensure your attic has at least R-38 insulation — proper insulation prevents the heat differential that causes ice dams on North Texas roofs during freeze events.",
  },

  // ── Ohio ───────────────────────────────────────────────────────────────────
  "OH:water-damage:winter": {
    liveAlert:
      "Ohio's winter freeze-thaw cycles are generating ice dam events and burst pipe claims across the state. Lake-effect snow accumulation in northern Ohio is adding significant roof load stress.",
    demandIndex: "CRITICAL",
    localTip:
      "Keep your thermostat at minimum 55°F even when away — Ohio's winter temperature swings cause rapid pipe freeze when interior temps drop below 40°F in exterior walls.",
  },
  "OH:water-damage:spring": {
    liveAlert:
      "Ohio's spring snowmelt combined with heavy rain is saturating water tables and generating basement flooding emergencies across the state. Sump pump failures are the leading cause of spring water damage claims.",
    demandIndex: "CRITICAL",
    localTip:
      "Test your sump pump every March by pouring water into the pit — Ohio's spring flooding arrives quickly and a failed sump pump can flood a basement in under an hour.",
  },
  "OH:water-damage:summer": {
    liveAlert:
      "Severe summer thunderstorms are generating flash flooding events across Ohio's river valleys. Storm sewer backflow into basement drains is a growing problem in older Ohio municipalities.",
    demandIndex: "HIGH",
    localTip:
      "Install a backwater valve on your floor drain — Ohio's aging municipal sewer systems frequently overflow during heavy rain events, pushing sewage into connected basements.",
  },
  "OH:water-damage:fall": {
    liveAlert:
      "Ohio's fall rain season is sustaining elevated water table levels, prolonging basement moisture intrusion events into November. Foundation crack seepage is a common and preventable source of fall water damage.",
    demandIndex: "HIGH",
    localTip:
      "Apply hydraulic cement to any visible foundation cracks every fall — Ohio's clay-heavy soils exert tremendous hydrostatic pressure against basement walls during the rainy season.",
  },
  "OH:pest-control:fall": {
    liveAlert:
      "Ohio's cooling temperatures are triggering the annual stink bug, box elder bug, and Asian lady beetle invasion. These insects congregate by the thousands on south-facing walls and enter homes through micro-gaps in window frames.",
    demandIndex: "CRITICAL",
    localTip:
      "Apply exclusion caulk to all window frames and utility penetrations in September — stink bugs find entry points as small as 1/16 inch and congregate once one scout enters.",
  },
  "OH:pest-control:winter": {
    liveAlert:
      "Ohio's winter is driving mouse and rat populations into residential structures. A single breeding pair of mice can produce 60+ offspring during one Ohio winter season.",
    demandIndex: "HIGH",
    localTip:
      "Steel wool pack every pipe penetration, dryer vent, and exterior utility opening before the first hard freeze — mice follow heat signatures from inside to exterior gaps.",
  },
  "OH:pest-control:spring": {
    liveAlert:
      "Ohio's spring thaw is activating carpenter ant colonies that overwintered in wall voids and structural wood. Damp wood from winter ice damming is the preferred nesting site.",
    demandIndex: "HIGH",
    localTip:
      "Inspect basement rim joists every spring for carpenter ant frass — Ohio's wet winters create the moisture conditions that trigger rapid colony expansion in structural wood.",
  },
  "OH:pest-control:summer": {
    liveAlert:
      "Ohio summer humidity is creating optimal conditions for cockroach and termite activity. German cockroach populations in urban Ohio metros are developing pesticide resistance, requiring professional-grade treatments.",
    demandIndex: "HIGH",
    localTip:
      "Fix any leaking pipes under sinks immediately — cockroaches need only a small water source to sustain a large colony and will not leave without professional elimination.",
  },
  "OH:roof-repair:winter": {
    liveAlert:
      "Ohio's lake-effect snow events are generating severe ice dam conditions across northern counties. Ice dam water intrusion can cause $10,000+ in interior damage before the leak is visible from inside.",
    demandIndex: "CRITICAL",
    localTip:
      "Use a roof rake to remove the bottom 4 feet of snow after every major storm — preventing ice dam formation is far less expensive than repairing the water damage they cause.",
  },
  "OH:roof-repair:spring": {
    liveAlert:
      "Post-winter roof assessments are revealing widespread shingle damage across Ohio from this season's freeze-thaw cycling. Spring hail events are compounding damage on already-stressed roofing systems.",
    demandIndex: "HIGH",
    localTip:
      "Schedule a post-winter roof inspection every April — Ohio's freeze-thaw cycles crack sealant strips and loosen fasteners in ways that aren't visible without a close inspection.",
  },
  "OH:roof-repair:summer": {
    liveAlert:
      "Summer thunderstorm systems with golf-ball-sized hail are tracking across Ohio, generating immediate demand for emergency tarping and shingle replacement. Dispatch queues are running 24–48 hours behind.",
    demandIndex: "HIGH",
    localTip:
      "Document any visible hail impact within 24 hours of a storm — Ohio insurance adjusters require proof of storm-date correlation for full claim coverage.",
  },
  "OH:roof-repair:fall": {
    liveAlert:
      "Ohio fall wind events are lifting damaged shingles left vulnerable by summer hail. Pre-winter roof sealing is the most cost-effective way to prevent the interior damage that accelerates dramatically once snow arrives.",
    demandIndex: "HIGH",
    localTip:
      "Re-seal all roof penetrations (vents, pipes, skylights) every October — Ohio's winter temperature extremes will open any gap left unsealed before the first hard freeze.",
  },

  // ── Georgia ────────────────────────────────────────────────────────────────
  "GA:water-damage:summer": {
    liveAlert:
      "Georgia's high-humidity summer storms are generating widespread water intrusion events across Atlanta metro and coastal Georgia. Afternoon thunderstorms are producing 3+ inches of rain in under an hour.",
    demandIndex: "HIGH",
    localTip:
      "Install gutter guards before summer — Georgia's pine trees drop needles year-round, and clogged gutters overflow onto foundations during every thunderstorm event.",
  },
  "GA:water-damage:fall": {
    liveAlert:
      "Remnant tropical systems tracking inland from the Gulf and Atlantic are generating prolonged rainfall events across Georgia this fall. Humidity levels are sustaining mold growth risk well into October.",
    demandIndex: "HIGH",
    localTip:
      "Run a dehumidifier in your crawl space year-round — Georgia's humidity rarely drops below 60% even in fall, maintaining ideal mold incubation conditions under floors.",
  },
  "GA:water-damage:winter": {
    liveAlert:
      "Georgia's occasional winter ice storms create pipe burst emergencies in a housing stock not designed for sustained freezing. Demand spikes dramatically during any overnight freeze event.",
    demandIndex: "HIGH",
    localTip:
      "Let faucets drip during any freeze warning — Georgia homes frequently have pipes routed through uninsulated exterior walls that freeze at temperatures just below 32°F.",
  },
  "GA:water-damage:spring": {
    liveAlert:
      "Georgia's spring storm season is producing heavy rainfall events that overwhelm municipal drainage systems across metro Atlanta. Basement and crawl space flooding reports are elevated statewide.",
    demandIndex: "HIGH",
    localTip:
      "Waterproof your crawl space with a vapor barrier every spring — Georgia's red clay soil holds water for weeks after heavy rain, maintaining constant moisture pressure against foundation walls.",
  },
  "GA:pest-control:summer": {
    liveAlert:
      "Georgia's extreme summer heat and humidity are driving termite and cockroach activity to peak levels. Eastern subterranean termites are actively tunneling and feeding 24 hours a day during July and August.",
    demandIndex: "CRITICAL",
    localTip:
      "Keep firewood stored at least 20 feet from your home — Georgia termites use firewood piles as a bridge colony to reach structural wood in adjacent foundations.",
  },
  "GA:pest-control:spring": {
    liveAlert:
      "Georgia's warm spring temperatures are triggering termite swarm season weeks earlier than the national average. Homeowners across the state are reporting winged termite swarms emerging from walls and window sills.",
    demandIndex: "CRITICAL",
    localTip:
      "If you see winged insects swarming near windows or light fixtures in spring, assume they are termites until proven otherwise — calling within 24 hours prevents colony establishment.",
  },
  "GA:pest-control:fall": {
    liveAlert:
      "Georgia fall pest pressures remain high as cooling temperatures push cockroaches, spiders, and rodents indoors. Mosquito populations are elevated following a wet summer season.",
    demandIndex: "HIGH",
    localTip:
      "Treat your yard perimeter with pyrethroid insecticide every October — fall is when Georgia pest populations consolidate at foundation lines before seeking indoor winter harborage.",
  },
  "GA:pest-control:winter": {
    liveAlert:
      "Georgia's mild winters mean termite colonies remain active year-round at shallow soil depths. Winter is the most underestimated termite risk period for Georgia homeowners.",
    demandIndex: "ELEVATED",
    localTip:
      "Schedule your annual termite inspection in winter — Georgia's mild winters allow year-round colony activity and winter inspections often catch colonies before swarm season reveals damage.",
  },
  "GA:roof-repair:summer": {
    liveAlert:
      "Georgia summer thunderstorms are producing damaging hail and straight-line winds across the northern counties. Asphalt shingles degraded by summer UV exposure are failing at elevated rates.",
    demandIndex: "HIGH",
    localTip:
      "Install ridge ventilation if your Georgia home lacks it — adequate attic airflow reduces summer roof deck temperatures by up to 30°F, extending shingle life by 5+ years.",
  },
  "GA:roof-repair:fall": {
    liveAlert:
      "Post-storm roof assessments following Georgia's active fall storm season are revealing widespread undiscovered damage from summer events. Insurance claims must be filed within 12 months of the damage date.",
    demandIndex: "HIGH",
    localTip:
      "Have your roof inspected every October before winter — Georgia's fall freeze-thaw cycles worsen any pre-existing cracks or lifted shingles that went unaddressed after summer storms.",
  },
  "GA:roof-repair:winter": {
    liveAlert:
      "Georgia's occasional winter ice events are generating emergency roofing calls as ice accumulation overloads aged roofing systems not designed for ice loads. Demand spikes immediately after any freeze event.",
    demandIndex: "ELEVATED",
    localTip:
      "Clear any ice accumulation at the roof edge within 24 hours of formation — Georgia homes have minimal insulation at the eave line, making ice dam formation rapid during freeze events.",
  },
  "GA:roof-repair:spring": {
    liveAlert:
      "Spring hail season is producing widespread shingle damage across North Georgia. Insurance adjusters are backlogged — early inspection and filing gives homeowners priority scheduling.",
    demandIndex: "HIGH",
    localTip:
      "Inspect your roof within 72 hours of any hail event — Georgia spring storms pass quickly and delayed inspections make storm-date correlation harder to prove to insurers.",
  },

  // ── North Carolina ─────────────────────────────────────────────────────────
  "NC:water-damage:summer": {
    liveAlert:
      "North Carolina's summer tropical activity is generating significant flooding events across coastal and piedmont counties. Hurricane and tropical storm threats remain elevated through the entire summer season.",
    demandIndex: "HIGH",
    localTip:
      "Elevate water heaters and HVAC equipment at least 12 inches off crawl space floors — this single step prevents total equipment loss during even minor flooding events.",
  },
  "NC:water-damage:fall": {
    liveAlert:
      "Hurricane remnants and fall nor'easters are producing multi-day rainfall events across North Carolina. Storm surge and river flooding continue to affect low-lying communities weeks after named storms.",
    demandIndex: "CRITICAL",
    localTip:
      "Purchase a portable water extraction unit — NC's remote mountain and coastal communities often wait 48–72 hours for professional services, and rapid extraction prevents secondary mold damage.",
  },
  "NC:water-damage:winter": {
    liveAlert:
      "North Carolina's winter weather pattern is producing rapid freeze-thaw cycles that are cracking older water main connections and causing pipe burst emergencies across the Piedmont and mountain regions.",
    demandIndex: "HIGH",
    localTip:
      "Know your main water shutoff valve location — NC freeze events arrive quickly and being able to cut water supply in under 60 seconds can prevent tens of thousands in pipe burst damage.",
  },
  "NC:water-damage:spring": {
    liveAlert:
      "Spring storm systems tracking through North Carolina are producing significant rainfall that is overwhelming stormwater infrastructure in rapidly-developing suburban communities across the state.",
    demandIndex: "HIGH",
    localTip:
      "Install a french drain along your foundation if your lot slopes toward the house — NC's spring rainfall frequently exceeds 4 inches per week and poor grading is the primary cause of basement intrusion.",
  },
  "NC:pest-control:summer": {
    liveAlert:
      "North Carolina's humid summer climate is sustaining peak termite, mosquito, and cockroach activity. Eastern subterranean termites are especially active in the Piedmont region this season.",
    demandIndex: "CRITICAL",
    localTip:
      "Treat your home's perimeter with liquid termiticide every summer — NC's termite pressure is among the highest in the mid-Atlantic region and barrier treatments require annual renewal.",
  },
  "NC:pest-control:fall": {
    liveAlert:
      "Cooling temperatures are driving stink bugs, rodents, and cockroaches to seek indoor shelter across North Carolina. Brown marmorated stink bugs are congregating in wall voids in large numbers.",
    demandIndex: "HIGH",
    localTip:
      "Apply door sweep seals to all exterior doors before October — NC's stink bug invasion typically begins when overnight temperatures first drop below 55°F.",
  },
  "NC:pest-control:winter": {
    liveAlert:
      "North Carolina's winter pest pressure is focused on rodents and overwintering insects. Norway rats and house mice are actively entering structures seeking food and thermal shelter.",
    demandIndex: "HIGH",
    localTip:
      "Place bait stations at every exterior corner of your home every December — NC's moderate winters allow rodent populations to remain active and reproductive throughout the season.",
  },
  "NC:pest-control:spring": {
    liveAlert:
      "North Carolina's spring swarming season for termites and flying ants is underway. Homeowners in the Piedmont and coastal regions are reporting swarm events at elevated rates.",
    demandIndex: "HIGH",
    localTip:
      "Inspect your foundation for termite mud tubes every spring — NC's subterranean termites prefer to build in the damp soil zone between your foundation and the first 6 inches of exposed concrete.",
  },
  "NC:roof-repair:summer": {
    liveAlert:
      "Tropical storm bands moving inland from the Carolina coast are generating sustained 60+ mph winds and significant water intrusion from roof damage across eastern and central North Carolina.",
    demandIndex: "HIGH",
    localTip:
      "Hurricane clips (metal straps connecting rafters to wall plates) can prevent roof blow-off in storms — NC's coastal counties require them in new construction but older homes frequently lack them.",
  },
  "NC:roof-repair:fall": {
    liveAlert:
      "Post-hurricane season roof assessment demand is at its highest level across North Carolina. Insurance adjusters are prioritizing claims with professional inspection reports.",
    demandIndex: "CRITICAL",
    localTip:
      "File insurance claims immediately after any storm event — NC insurance law gives adjusters 15 business days to respond and early filing ensures adjuster availability before backlogs develop.",
  },
  "NC:roof-repair:winter": {
    liveAlert:
      "Winter ice storms across North Carolina's mountain and piedmont regions are generating ice dam conditions and emergency tarping requests. Older wood shingle roofs are especially vulnerable.",
    demandIndex: "HIGH",
    localTip:
      "Install heat cable along your gutters before winter if your NC home has had ice dams before — this targeted approach costs less than 2% of the water damage a single ice dam event typically causes.",
  },
  "NC:roof-repair:spring": {
    liveAlert:
      "North Carolina's spring hail season is generating widespread shingle damage across the Piedmont corridor. Combined with winter storm damage, many NC homes need comprehensive roof assessments this spring.",
    demandIndex: "HIGH",
    localTip:
      "Look for shingle granules in gutters and downspout splash blocks — granule loss visible in gutters is a reliable indicator of hail impact requiring professional assessment.",
  },

  // ── Tennessee ──────────────────────────────────────────────────────────────
  "TN:water-damage:spring": {
    liveAlert:
      "Tennessee's spring storm season is generating severe flooding across Middle Tennessee river systems. Nashville's watershed experiences significant flooding risk when multiple storm systems arrive in succession.",
    demandIndex: "CRITICAL",
    localTip:
      "Elevate all electrical panel components and appliances at least 12 inches above your known flood line — Tennessee's spring floods frequently exceed historical benchmarks.",
  },
  "TN:water-damage:winter": {
    liveAlert:
      "Tennessee's winter ice storm events are generating pipe burst emergencies across the state. The state's older housing stock in Memphis and Nashville has pipe infrastructure vulnerable to sustained sub-freezing temperatures.",
    demandIndex: "HIGH",
    localTip:
      "Open cabinet doors under sinks during any freeze warning — exposing pipe runs to interior heat is the most effective passive freeze prevention strategy for Tennessee homes.",
  },
  "TN:water-damage:summer": {
    liveAlert:
      "Tennessee summer thunderstorms are producing severe localized flooding events across the Cumberland Plateau. Basement wall seepage is at peak levels as summer water tables remain elevated.",
    demandIndex: "HIGH",
    localTip:
      "Seal your basement walls with crystalline waterproofing compound every summer — Tennessee's water table fluctuates dramatically seasonally and standard paint-on sealers fail under hydrostatic pressure.",
  },
  "TN:water-damage:fall": {
    liveAlert:
      "Tennessee's fall rainfall is maintaining saturated soil conditions that sustain basement and crawl space moisture intrusion through October and November. Post-summer mold remediation demand is elevated.",
    demandIndex: "HIGH",
    localTip:
      "Run a crawl space dehumidifier year-round set to 50% relative humidity — Tennessee's clay soils retain summer moisture deep into fall, keeping crawl space humidity above mold-growth threshold.",
  },
  "TN:pest-control:summer": {
    liveAlert:
      "Tennessee's summer heat and humidity are sustaining peak termite and cockroach activity across the state. Formosan termites are an increasing problem in West Tennessee where climate conditions favor their expansion.",
    demandIndex: "CRITICAL",
    localTip:
      "Eliminate wood-to-soil contact at any structure on your property — Tennessee's termite pressure means any untreated wood in contact with soil will show evidence of termite activity within 3–5 years.",
  },
  "TN:pest-control:fall": {
    liveAlert:
      "Tennessee's fall pest season is bringing stink bugs, spiders, and rodents into residential structures. Orb weaver spiders are particularly prevalent this fall as their population peaks before the first frost.",
    demandIndex: "HIGH",
    localTip:
      "Apply exterior perimeter spray before October 1 — treating before pests begin their fall migration into homes is significantly more effective than reactive treatment after entry.",
  },
  "TN:pest-control:winter": {
    liveAlert:
      "Tennessee's winter pest focus shifts to mice, rats, and overwintering cockroaches. Nashville and Memphis's urban cores have seen a 25% increase in rodent service calls over the past two years.",
    demandIndex: "HIGH",
    localTip:
      "Pack steel wool into any gap larger than a pencil eraser at your foundation — Tennessee's Norway rats can chew through foam sealant and plastic but cannot chew through tightly packed steel wool.",
  },
  "TN:pest-control:spring": {
    liveAlert:
      "Tennessee's spring termite swarm season is underway with calls increasing week over week. East Tennessee's older wood-frame housing stock is at elevated risk for undetected colony damage.",
    demandIndex: "HIGH",
    localTip:
      "If you find winged insects in your home in spring, save a few in a sealed bag for identification — Tennessee has two primary termite species and treatment protocols differ between them.",
  },
  "TN:roof-repair:spring": {
    liveAlert:
      "Tennessee's active spring severe weather season is producing tornado-path roof damage and widespread hail impact across Middle and West Tennessee. Emergency response crews are operating at capacity.",
    demandIndex: "CRITICAL",
    localTip:
      "File your roof claim and get a licensed contractor's damage assessment before accepting any insurance settlement — Tennessee's fast-moving storm season means adjusters work quickly and may undervalue complex damage.",
  },
  "TN:roof-repair:summer": {
    liveAlert:
      "Tennessee summer storms are generating localized but severe roof damage events across all three Grand Divisions. Heat-softened shingles are especially vulnerable to wind uplift during high-temperature storm events.",
    demandIndex: "HIGH",
    localTip:
      "Never walk on your roof in summer afternoon heat — Tennessee asphalt shingles reach 160°F surface temperatures and walking on them permanently distorts granule adhesion.",
  },
  "TN:roof-repair:fall": {
    liveAlert:
      "Tennessee's fall wind events are lifting marginal shingles that survived summer storms. Pre-winter roof inspection and sealing is strongly recommended before the first ice event.",
    demandIndex: "HIGH",
    localTip:
      "Check your attic for daylight visible through the roof deck every fall — any visible daylight indicates a gap that will become a major water intrusion point during Tennessee's winter ice events.",
  },
  "TN:roof-repair:winter": {
    liveAlert:
      "Tennessee winter ice storms are generating emergency roof tarping requests across all regions. Ice accumulation on low-slope roofs is causing membrane failure and ceiling collapse in extreme cases.",
    demandIndex: "HIGH",
    localTip:
      "Clear gutters completely before the first freeze — Tennessee ice events are brief but intense and ice in clogged gutters backs up under shingles faster than in any other scenario.",
  },

  // ── Oklahoma ───────────────────────────────────────────────────────────────
  "OK:water-damage:spring": {
    liveAlert:
      "Oklahoma's spring tornado season generates significant structural water intrusion events beyond direct tornado impact. Severe hail pierces roofing systems and heavy rain enters within minutes of damage.",
    demandIndex: "CRITICAL",
    localTip:
      "Keep a 30-minute emergency roof tarp kit in your garage — Oklahoma homeowners in tornado-risk zones who can cover their roof immediately after damage prevent tens of thousands in water intrusion.",
  },
  "OK:water-damage:winter": {
    liveAlert:
      "Oklahoma's winter ice storms are creating pipe burst emergencies across the state. The state regularly experiences some of the most rapid temperature drops in the continental US.",
    demandIndex: "HIGH",
    localTip:
      "Install pipe insulation on all exterior wall runs before November — Oklahoma's arctic air intrusions can drop temperatures 40°F in under two hours, leaving no time for reactive measures.",
  },
  "OK:water-damage:summer": {
    liveAlert:
      "Oklahoma's summer flash flood events are generating water intrusion emergencies in low-lying residential areas. The state averages more flash flood events per square mile than most US states.",
    demandIndex: "HIGH",
    localTip:
      "Install a water alarm sensor in your basement or crawl space — Oklahoma's flash floods arrive with minimal warning and early detection prevents total loss scenarios.",
  },
  "OK:water-damage:fall": {
    liveAlert:
      "Oklahoma's fall storm season remains active with severe weather systems producing heavy rain events across the state. Water table levels elevated from summer storms are sustaining basement seepage risk.",
    demandIndex: "HIGH",
    localTip:
      "Inspect your foundation drainage every fall — Oklahoma's clay-heavy soils hold water against foundation walls for extended periods after heavy rainfall.",
  },
  "OK:pest-control:summer": {
    liveAlert:
      "Oklahoma summer heat is driving scorpions, black widow spiders, and termites to seek cooler interior environments. Scorpion activity is at annual peak across the state's southern and western regions.",
    demandIndex: "CRITICAL",
    localTip:
      "Shake out shoes before wearing them every morning during Oklahoma's summer months — scorpions are attracted to dark, enclosed spaces and shoe interiors are a common entry point.",
  },
  "OK:pest-control:spring": {
    liveAlert:
      "Oklahoma's spring brings peak termite swarming events alongside fire ant mound explosions across the state. Residential pest control demand typically triples during March and April.",
    demandIndex: "HIGH",
    localTip:
      "Apply a complete perimeter termiticide treatment every spring — Oklahoma's termite pressure is amplified by the state's abundant clay soils that retain termite-sustaining moisture.",
  },
  "OK:pest-control:fall": {
    liveAlert:
      "Oklahoma's cooling fall temperatures are driving brown recluse spiders, mice, and stink bugs indoors. Brown recluse populations in Oklahoma are among the densest in the US.",
    demandIndex: "HIGH",
    localTip:
      "Install sticky monitors in every closet and under-sink cabinet in fall — brown recluse spiders follow mouse entry routes and early detection prevents potentially serious encounters.",
  },
  "OK:pest-control:winter": {
    liveAlert:
      "Oklahoma's winter pest focus is primarily on rodent intrusion and subterranean termite activity. Despite cold surface temperatures, termite colony activity continues at depth year-round.",
    demandIndex: "ELEVATED",
    localTip:
      "Keep clutter minimized in garages and storage areas through winter — Oklahoma mice establish indoor harborage in any undisturbed material and breed rapidly in warm, protected spaces.",
  },
  "OK:roof-repair:spring": {
    liveAlert:
      "Oklahoma's peak hail and tornado season is generating the highest volume of emergency roofing calls in the state. Contractors are booked 3–5 weeks out — early calls secure priority scheduling.",
    demandIndex: "CRITICAL",
    localTip:
      "Choose impact-resistant Class 4 shingles for any Oklahoma roof replacement — they qualify for insurance discounts and withstand the state's frequent large-hail events significantly better than standard shingles.",
  },
  "OK:roof-repair:summer": {
    liveAlert:
      "Oklahoma's summer heat combined with frequent storm systems is accelerating shingle aging and producing new damage events faster than crews can complete repairs. Service timelines are extended.",
    demandIndex: "HIGH",
    localTip:
      "Document your roof condition with photographs every June — Oklahoma's summer storm frequency makes before/after documentation essential for insurance claims filed later in the season.",
  },
  "OK:roof-repair:fall": {
    liveAlert:
      "Oklahoma's fall wind events are revealing storm damage that went undetected during summer. Pre-winter roof inspection and repair is critical before ice storms create additional vulnerability.",
    demandIndex: "HIGH",
    localTip:
      "Inspect attic ventilation every fall — Oklahoma's extreme temperature range (from 110°F summers to -20°F winters) requires adequate ventilation to prevent moisture buildup and accelerated shingle aging.",
  },
  "OK:roof-repair:winter": {
    liveAlert:
      "Oklahoma winter ice storms are generating emergency roof events as ice accumulation stresses damaged or aging roofing systems. Dispatch queues extend 24–48 hours during active freeze events.",
    demandIndex: "HIGH",
    localTip:
      "Never attempt to remove ice from your roof yourself during an Oklahoma ice storm — roof surfaces are extremely hazardous and structural stability may be compromised by ice load.",
  },

  // ── Louisiana ──────────────────────────────────────────────────────────────
  "LA:water-damage:summer": {
    liveAlert:
      "Louisiana's peak hurricane and tropical storm season is sustaining critical water damage demand across the state. Flooding events from Gulf tropical systems can arrive with minimal advance notice.",
    demandIndex: "CRITICAL",
    localTip:
      "Waterproof your electrical panel and appliances before hurricane season by elevating them above your historical high-water mark — FEMA data shows elevation prevents over 90% of flood-related appliance loss.",
  },
  "LA:water-damage:fall": {
    liveAlert:
      "Post-hurricane flooding recovery efforts remain active across Louisiana as fall storm systems continue to produce additional rainfall on already-saturated ground.",
    demandIndex: "CRITICAL",
    localTip:
      "Run industrial dehumidifiers continuously for 72 hours after any flooding event — Louisiana's humidity prevents natural drying and sustained moisture in walls causes mold colonization within 48 hours.",
  },
  "LA:water-damage:winter": {
    liveAlert:
      "Louisiana's winter rain season produces sustained heavy rainfall events that maintain flooded soil conditions. Sump pump demand for residential crawl space dewatering remains high through February.",
    demandIndex: "HIGH",
    localTip:
      "Install a battery backup sump pump as a redundant system — Louisiana's winter power outages during storm events are common and a failed sump pump causes complete basement flooding within hours.",
  },
  "LA:water-damage:spring": {
    liveAlert:
      "Louisiana's spring flood season is producing Mississippi River tributary flooding across rural and suburban parishes. Pre-season flood barrier installation and property elevation are strongly recommended.",
    demandIndex: "HIGH",
    localTip:
      "Purchase NFIP flood insurance with 30 days advance notice required — standard Louisiana homeowner policies exclude flood events and spring flood season arrives faster than coverage waiting periods.",
  },
  "LA:pest-control:summer": {
    liveAlert:
      "Louisiana's Formosan termite population — the most destructive termite species in North America — is at peak activity. Annual colony damage in Louisiana exceeds $500 million in structural repairs.",
    demandIndex: "CRITICAL",
    localTip:
      "Baiting systems designed specifically for Formosan termites are essential for Louisiana homes — standard treatment protocols for eastern subterranean termites are significantly less effective against Formosans.",
  },
  "LA:pest-control:fall": {
    liveAlert:
      "Louisiana's fall pest season includes elevated mosquito, cockroach, and rodent activity. Post-hurricane flooding creates ideal breeding conditions for several vector pest species that persist through fall.",
    demandIndex: "HIGH",
    localTip:
      "Treat all standing water on your property with mosquito dunks every 30 days — Louisiana's subtropical climate sustains year-round mosquito populations and standing water is the single most controllable risk factor.",
  },
  "LA:pest-control:winter": {
    liveAlert:
      "Louisiana's mild winters sustain year-round termite colony activity. Formosan termites in particular do not experience seasonal dormancy in Louisiana's climate and continue feeding and expanding throughout winter.",
    demandIndex: "HIGH",
    localTip:
      "Schedule your annual termite inspection in January — Louisiana's winter inspections often reveal Formosan mud tubes that became accessible as plants died back from the fall season.",
  },
  "LA:pest-control:spring": {
    liveAlert:
      "Louisiana's spring marks peak Formosan termite swarming season, typically occurring on warm, humid evenings after rain events from late April through June.",
    demandIndex: "CRITICAL",
    localTip:
      "Turn off exterior lights on warm spring evenings when rain is expected — Formosan termites swarm in enormous numbers and are intensely attracted to light sources near potential entry points.",
  },
  "LA:roof-repair:summer": {
    liveAlert:
      "Louisiana's hurricane season is generating emergency roof damage events across all parishes. Category 1 and 2 hurricane wind fields extend 50+ miles from track center, affecting areas not in the direct path.",
    demandIndex: "CRITICAL",
    localTip:
      "Install hurricane straps on your roof-to-wall connection before hurricane season — properly installed straps increase wind resistance from 90 mph to 130+ mph for under $500 in materials.",
  },
  "LA:roof-repair:fall": {
    liveAlert:
      "Post-hurricane roof repair demand across Louisiana has extended booking queues to 6+ weeks. Temporary tarping is the most critical immediate action after roof damage to prevent ongoing interior water intrusion.",
    demandIndex: "CRITICAL",
    localTip:
      "Use 6-mil poly tarps secured with 2×4 battens screwed through the tarp into the roof deck — Louisiana wind events will shred standard tarps stapled or taped to damaged roofing.",
  },
  "LA:roof-repair:winter": {
    liveAlert:
      "Louisiana's winter wind and rain events are generating significant demand for leak detection and sealing services. Warm temperatures mean repairs can proceed year-round, but scheduling backlogs from fall hurricane season persist.",
    demandIndex: "HIGH",
    localTip:
      "Re-caulk all roof penetrations every winter — Louisiana's thermal cycling between summer heat and winter rain-cooling causes sealant to fail at accelerated rates compared to cooler climates.",
  },
  "LA:roof-repair:spring": {
    liveAlert:
      "Louisiana's spring pre-hurricane season is the ideal window for roof maintenance and replacement before summer storm activity begins. Contractor availability is highest during this period.",
    demandIndex: "HIGH",
    localTip:
      "Consider a metal roof for any Louisiana replacement — metal roofing's 40+ year lifespan, wind resistance, and insurance discount qualifications make it the most cost-effective long-term option for Louisiana climate.",
  },

  // ── Arkansas ───────────────────────────────────────────────────────────────
  "AR:water-damage:spring": {
    liveAlert:
      "Arkansas's spring severe weather season produces significant water damage events from tornadoes, hail storms, and flash flooding across river valleys statewide.",
    demandIndex: "CRITICAL",
    localTip:
      "Have your sump pump inspected every March — Arkansas's spring flooding is among the most severe in the mid-South and sump pump failure during a flood event is catastrophic.",
  },
  "AR:water-damage:winter": {
    liveAlert:
      "Arkansas's winter ice storms and freeze events generate widespread pipe burst emergencies. The state's older rural housing stock is particularly vulnerable to sustained sub-freezing temperatures.",
    demandIndex: "HIGH",
    localTip:
      "Identify and insulate your most vulnerable pipe runs before the first freeze warning — Arkansas's winter events can drop temperatures 50°F in under 12 hours, leaving no preparation time.",
  },
  "AR:water-damage:summer": {
    liveAlert:
      "Arkansas summer thunderstorms are producing flash flooding events across the Arkansas River watershed. Urban drainage systems in Little Rock and Fort Smith are frequently overwhelmed by intense rainfall.",
    demandIndex: "HIGH",
    localTip:
      "Avoid driving through any flooded roadway — Arkansas's swift-moving flood waters frequently undercut roadbeds and vehicles are swept away in depths as shallow as 18 inches.",
  },
  "AR:water-damage:fall": {
    liveAlert:
      "Arkansas fall rainfall is maintaining elevated water tables and sustaining basement and crawl space moisture intrusion through November. Mold remediation demand remains elevated from summer flood events.",
    demandIndex: "HIGH",
    localTip:
      "Install a crawl space encapsulation system before winter — Arkansas's fall moisture levels sustain ideal mold conditions under floors that persist through the entire heating season.",
  },
  "AR:pest-control:summer": {
    liveAlert:
      "Arkansas summer heat and humidity are sustaining peak termite, mosquito, and cockroach activity. The state's warm, moist soil conditions are ideal for subterranean termite colony expansion.",
    demandIndex: "CRITICAL",
    localTip:
      "Have your home baited for subterranean termites every summer — Arkansas's termite pressure is highest in the southern counties where soil temperatures sustain year-round colony activity.",
  },
  "AR:pest-control:fall": {
    liveAlert:
      "Arkansas's fall pest transition is bringing brown recluse spiders and rodents indoors as temperatures drop. Arkansas has one of the highest brown recluse encounter rates in the US.",
    demandIndex: "HIGH",
    localTip:
      "Seal all utility penetrations and foundation vents before October — Arkansas brown recluses follow rodent entry routes and closing those pathways eliminates the primary spider entry vector.",
  },
  "AR:pest-control:winter": {
    liveAlert:
      "Arkansas winter pest pressure is concentrated on rodent intrusion and termite activity at depth. Deer mice, which can carry hantavirus, are an increasingly common winter pest in rural Arkansas.",
    demandIndex: "ELEVATED",
    localTip:
      "Wear N95 mask when cleaning any rodent-impacted area in Arkansas — hantavirus cases in the state are increasing and inhalation of dried rodent droppings is the primary infection vector.",
  },
  "AR:pest-control:spring": {
    liveAlert:
      "Arkansas spring brings peak termite swarm season alongside fire ant mound activation across the state's southern tier. Residential pest control demand spikes 200% above baseline in March and April.",
    demandIndex: "CRITICAL",
    localTip:
      "Apply a full perimeter termiticide treatment every spring before soil temperatures exceed 65°F — Arkansas's termites begin foraging within 24 hours of soil warming and pre-treatment stops entry before it begins.",
  },
  "AR:roof-repair:spring": {
    liveAlert:
      "Arkansas's spring tornado and severe storm season is generating the highest roof damage call volume of the year. Tornado-adjacent wind events cause structural roof damage at distances over 10 miles from the tornado path.",
    demandIndex: "CRITICAL",
    localTip:
      "Photograph your roof before storm season and again immediately after any major event — before/after documentation gives Arkansas insurance adjusters clear evidence for full claim approval.",
  },
  "AR:roof-repair:summer": {
    liveAlert:
      "Arkansas summer heat and UV exposure is accelerating shingle granule loss on roofs older than 10 years. Combined with active storm season, aging roofs are experiencing significant failure acceleration.",
    demandIndex: "HIGH",
    localTip:
      "Check attic ventilation every summer — inadequate ventilation in Arkansas's extreme summer heat accelerates shingle lifespan reduction by up to 50% on south-facing roof slopes.",
  },
  "AR:roof-repair:fall": {
    liveAlert:
      "Arkansas fall wind events and post-summer thermal shock are exposing pre-existing roof vulnerabilities across the state. Pre-winter sealing is the most cost-effective intervention before ice season.",
    demandIndex: "HIGH",
    localTip:
      "Inspect and re-fasten any lifted drip edge before winter — Arkansas's freeze-thaw cycles quickly exploit any gap at the roof perimeter to drive water into the fascia and soffit system.",
  },
  "AR:roof-repair:winter": {
    liveAlert:
      "Arkansas's winter ice events are generating emergency roof calls as ice accumulation stresses aged roofing materials. Ice dam formation is particularly common in the state's mountain communities.",
    demandIndex: "HIGH",
    localTip:
      "Add ice-and-water shield membrane at the eave line before any Arkansas roof replacement — this single layer prevents ice dam water from reaching the decking even when shingles are compromised.",
  },

  // ── Alabama ────────────────────────────────────────────────────────────────
  "AL:water-damage:spring": {
    liveAlert:
      "Alabama's spring tornado and severe thunderstorm season produces significant water intrusion events as storm-damaged structures are exposed to heavy rainfall before emergency repairs can be made.",
    demandIndex: "CRITICAL",
    localTip:
      "Keep heavy-duty poly tarps and roofing nails in your emergency kit — Alabama's spring storm sequence means roof damage from one storm can be worsened dramatically by the next day's rainfall.",
  },
  "AL:water-damage:summer": {
    liveAlert:
      "Alabama's summer tropical moisture is producing intense afternoon thunderstorm events across the state. Mobile Bay area homes are experiencing coastal flooding at elevated frequency due to sea level trends.",
    demandIndex: "HIGH",
    localTip:
      "Install gutter diverters away from your foundation every summer — Alabama's afternoon thunderstorms routinely exceed 3 inches per hour, overwhelming standard downspout capacity within minutes.",
  },
  "AL:water-damage:fall": {
    liveAlert:
      "Alabama's fall hurricane remnants are generating rainfall totals that saturate soil and sustain basement seepage well into November. Mold remediation demand remains elevated after summer storm activity.",
    demandIndex: "HIGH",
    localTip:
      "Run a dehumidifier in your crawl space set to 50% relative humidity year-round — Alabama's humidity rarely allows natural drying of enclosed spaces without active moisture management.",
  },
  "AL:water-damage:winter": {
    liveAlert:
      "Alabama's winter freeze events generate pipe burst emergencies in a housing stock largely uninsulated for sustained sub-freezing temperatures. Demand spikes immediately after any overnight freeze warning.",
    demandIndex: "HIGH",
    localTip:
      "Insulate any pipes running through unheated garage spaces before winter — Alabama homes frequently have water lines in garages that freeze at temperatures below 28°F for 6+ hours.",
  },
  "AL:pest-control:summer": {
    liveAlert:
      "Alabama's summer climate drives termites, cockroaches, and fire ants to peak activity. The state has some of the highest termite pressure in the nation with multiple species active simultaneously.",
    demandIndex: "CRITICAL",
    localTip:
      "Maintain at least 18 inches of clearance between mulch and your foundation — Alabama termites use mulch as a moisture bridge to cross treated soil barriers and reach foundation wood.",
  },
  "AL:pest-control:fall": {
    liveAlert:
      "Alabama fall pest pressure remains elevated as cockroaches, rodents, and stink bugs migrate indoors. Southern Alabama's mild fall temperatures mean pest season extends well into November.",
    demandIndex: "HIGH",
    localTip:
      "Treat your home's perimeter with residual insecticide every September before pests begin their migration to interior walls — prevention costs far less than elimination of established indoor colonies.",
  },
  "AL:pest-control:winter": {
    liveAlert:
      "Alabama's mild winters sustain year-round termite colony activity across all regions of the state. Winter inspection is critical for detecting colonies that expanded during the summer season.",
    demandIndex: "ELEVATED",
    localTip:
      "Schedule your Alabama termite inspection in February — winter inspections catch colonies that emerged the previous spring before they enter their second swarm season with doubled colony size.",
  },
  "AL:pest-control:spring": {
    liveAlert:
      "Alabama's spring termite swarm season is underway with swarms reported statewide. Eastern subterranean termites are the primary species, but Formosan termites are increasingly active in the Mobile metro area.",
    demandIndex: "CRITICAL",
    localTip:
      "Maintain a zone-of-protection termiticide barrier around your entire foundation every spring — Alabama's termite pressure is highest at soil contact points and barrier treatment prevents all species from crossing.",
  },
  "AL:roof-repair:spring": {
    liveAlert:
      "Alabama's tornado-season storm events are generating widespread roof damage across the state. North Alabama and the Shoals area are at highest risk during the peak tornado season of March through May.",
    demandIndex: "CRITICAL",
    localTip:
      "Know the difference between wind uplift damage and hail impact — Alabama's spring storms frequently cause both, and distinguishing the damage types ensures your insurance claim covers all repair costs.",
  },
  "AL:roof-repair:summer": {
    liveAlert:
      "Alabama summer UV intensity and heat are accelerating shingle granule loss, particularly on south- and west-facing slopes. Homes with roofs older than 15 years are at elevated risk of failure.",
    demandIndex: "HIGH",
    localTip:
      "Install ridge vent and soffit vents if your Alabama home lacks them — proper ventilation reduces attic temperatures by 20–30°F in summer, significantly extending shingle life.",
  },
  "AL:roof-repair:fall": {
    liveAlert:
      "Alabama fall storm remnants and wind events are revealing pre-existing roof damage from summer storms. Pre-winter repair of marginal roofing components prevents cost-multiplying ice and wind damage.",
    demandIndex: "HIGH",
    localTip:
      "Have all roof penetrations re-caulked every fall — Alabama's thermal cycling causes sealant to crack and separate at a rate that makes annual re-application the most economical maintenance strategy.",
  },
  "AL:roof-repair:winter": {
    liveAlert:
      "Alabama winter freeze events are creating ice dam conditions on roofs that have inadequate attic insulation — a common condition in the state's older housing stock.",
    demandIndex: "ELEVATED",
    localTip:
      "Upgrade attic insulation to minimum R-38 before winter — Alabama building code allows lower R-values than most states, but modern energy efficiency and ice-dam prevention require higher insulation levels.",
  },
};

// ─── Cache Loader ─────────────────────────────────────────────────────────────

const ALERTS_CACHE_PATH = path.resolve(process.cwd(), "data/dynamic-alerts.json");

function loadFileCache(): CacheStore {
  try {
    if (fs.existsSync(ALERTS_CACHE_PATH)) {
      const raw = fs.readFileSync(ALERTS_CACHE_PATH, "utf-8");
      return JSON.parse(raw) as CacheStore;
    }
  } catch {
    // cache unreadable — will be rebuilt on next successful API call
  }
  return {};
}

function saveFileCache(store: CacheStore): void {
  try {
    fs.writeFileSync(ALERTS_CACHE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // non-fatal — page will still render via in-memory fallback
  }
}

function cacheKey(
  city: string,
  state: string,
  niche: string,
  month: number
): string {
  const season = getSeason(month);
  return `${city}:${state}:${niche}:${season}`;
}

function staticKey(stateCode: string, niche: string, month: number): string {
  const season = getSeason(month);
  return `${stateCode}:${niche}:${season}`;
}

// ─── Generic fallback for uncovered state/niche/season combinations ────────────

function genericFallback(
  city: string,
  state: string,
  niche: string,
  month: number
): AdvisoryPayload {
  const monthName = new Date(2000, month).toLocaleString("en-US", {
    month: "long",
  });
  const season = getSeason(month);

  const nicheMessages: Record<string, AdvisoryPayload> = {
    "water-damage": {
      liveAlert: `${city}, ${state} is currently experiencing elevated demand for water damage restoration services this ${season}. Seasonal weather patterns in the region create conditions where prompt response is critical to preventing secondary mold damage.`,
      demandIndex: "HIGH",
      localTip: `In ${monthName}, inspect your roof and gutters for debris buildup — clogged drainage is the leading preventable cause of residential water intrusion in ${state}.`,
    },
    "pest-control": {
      liveAlert: `${city}, ${state}'s ${season} climate conditions are sustaining elevated pest activity across the region. Local pest pressures in ${state} require professional-grade treatment protocols for effective elimination.`,
      demandIndex: "HIGH",
      localTip: `${monthName} is an important month to inspect your ${city} home's perimeter seals — pests follow structural gaps and sealing entry points stops infestations before they establish.`,
    },
    "roof-repair": {
      liveAlert: `Seasonal weather in ${city}, ${state} is driving elevated demand for roof inspection and repair services this ${season}. Storm-damaged roofing requires prompt attention to prevent water intrusion from compounding repair costs.`,
      demandIndex: "HIGH",
      localTip: `In ${monthName}, have your ${city} home's roof flashing and sealant inspected — ${state}'s seasonal weather transitions are the most common trigger for flashing failure and subsequent leaks.`,
    },
  };

  return (
    nicheMessages[niche] ?? {
      liveAlert: `Emergency service demand in ${city}, ${state} is elevated this ${season}. Local conditions require prompt professional attention for best outcomes.`,
      demandIndex: "ELEVATED",
      localTip: `Contact our ${city} dispatch team for a site-specific assessment — local expertise ensures the right solution for your specific conditions.`,
    }
  );
}

// ─── Gemini API Caller ────────────────────────────────────────────────────────

const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-3.8-flash";

async function callGeminiAPI(
  city: string,
  state: string,
  niche: string,
  currentMonth: number
): Promise<AdvisoryPayload> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const monthName = new Date(2000, currentMonth).toLocaleString("en-US", {
    month: "long",
  });
  const nicheLabel =
    niche === "water-damage"
      ? "water damage restoration"
      : niche === "pest-control"
      ? "pest control"
      : "roof repair";

  const prompt = `You are a hyper-local US home emergency services expert. Generate a JSON advisory payload for:
- City: ${city}, ${state}
- Service niche: ${nicheLabel}  
- Current month: ${monthName}

Return ONLY valid JSON (no markdown, no explanation) with exactly these fields:
{
  "liveAlert": "2-sentence localized emergency advisory tailored to real seasonal weather, pest, or roof conditions specific to ${state} in ${monthName}. Be specific to actual regional conditions.",
  "demandIndex": "CRITICAL" or "HIGH" or "ELEVATED",
  "localTip": "One actionable homeowner prevention tip specific to ${city}, ${state} conditions in ${monthName}. Start with a verb."
}`;

  // Try primary model (gemini-2.5-flash) and fallback model (gemini-3.8-flash)
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastError: Error | null = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 512,
              responseMimeType: "application/json",
            },
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error on ${model}: ${response.status}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const parsed = JSON.parse(text) as Partial<AdvisoryPayload>;

      // Validate shape
      if (
        typeof parsed.liveAlert !== "string" ||
        typeof parsed.localTip !== "string" ||
        !["CRITICAL", "HIGH", "ELEVATED"].includes(parsed.demandIndex ?? "")
      ) {
        throw new Error(`Invalid Gemini response shape from ${model}`);
      }

      return parsed as AdvisoryPayload;
    } catch (err) {
      lastError = err as Error;
      // Continue to next model if available
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Failed to generate advisory from Gemini");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main entry point. Returns an AdvisoryPayload via:
 * 1. In-memory file cache (fresh within same ISR cycle)
 * 2. Gemini API (if key present)
 * 3. State-level static alerts (bundled fallback)
 * 4. Generic fallback (always works)
 */
export async function getAdvisory(
  city: string,
  stateCode: string,
  niche: string,
  currentMonth: number
): Promise<AdvisoryPayload> {
  const key = cacheKey(city, stateCode, niche, currentMonth);

  // 1. Check file cache first
  const fileCache = loadFileCache();
  if (fileCache[key]) {
    return fileCache[key];
  }

  // 2. Try Gemini API
  if (process.env.GEMINI_API_KEY) {
    try {
      const advisory = await callGeminiAPI(city, stateCode, niche, currentMonth);
      // Persist to file cache for future ISR cycles
      fileCache[key] = advisory;
      saveFileCache(fileCache);
      return advisory;
    } catch {
      // Fall through to static fallback — do not surface API errors to users
    }
  }

  // 3. State-level static fallback
  const sKey = staticKey(stateCode, niche, currentMonth);
  const fallback = STATIC_ALERTS[sKey] ?? genericFallback(city, stateCode, niche, currentMonth);

  // Cache fallback to avoid redundant external network attempts
  fileCache[key] = fallback;
  saveFileCache(fileCache);

  return fallback;
}
