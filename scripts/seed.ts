// Standalone seed script — run with:  npx tsx scripts/seed.ts
import db, { initSchema } from "../src/server/db";
import bcrypt from "bcryptjs";
import { cuid } from "../src/lib/utils";

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

initSchema();

type VillaSeed = {
  name: string;
  slug: string;
  tagline: string;
  region: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  sizeSqm?: number;
  baseEur: number;
  cleaningEur: number;
  bookingMode: "INSTANT" | "REQUEST";
  beachfront?: boolean;
  oceanView?: boolean;
  jungleView?: boolean;
  familyFriendly?: boolean;
  eventsAllowed?: boolean;
  overview: string;
  description: string[];
  images: { id: string; alt: string }[];
  amenitySlugs: string[];
  houseRules: string[];
  services: { name: string; category: string; price: number; model: "FIXED" | "PER_GUEST" | "PER_DAY" | "PER_TRIP" | "QUOTE"; description: string }[];
  cancellation: string;
};

const VILLAS: VillaSeed[] = [
  {
    name: "Tanjong Cliff House",
    slug: "tanjong-cliff-house",
    tagline: "Dramatic ocean-cliff estate above Uluwatu's temple coast.",
    region: "uluwatu", lat: -8.829, lng: 115.084,
    bedrooms: 5, bathrooms: 5, guests: 10, sizeSqm: 850,
    baseEur: 145000, cleaningEur: 35000, bookingMode: "REQUEST",
    beachfront: true, oceanView: true, familyFriendly: true, eventsAllowed: true,
    overview: "Carved into a hundred-metre cliff on Uluwatu's southern coast, Tanjong Cliff House is a contemporary architectural residence with sweeping Indian Ocean panoramas from every room.",
    description: [
      "The Residence — Designed around a cantilevered deck, the estate frames endless ocean horizons through floor-to-ceiling glass and travertine terraces.",
      "Bedrooms — Five en-suite bedrooms open to private terraces; the master pavilion includes a freestanding soaking tub suspended over the cliff.",
      "Outdoor Living — A 25-metre infinity pool appears to spill into the ocean, surrounded by sun decks, an outdoor lounge, fire pit and a cliff-edge bale.",
      "Services — A resident chef, butler, housekeeping team and villa manager are on hand throughout your stay.",
    ],
    images: [
      { id: "1564501049412-61c2a3083791", alt: "Infinity pool over the ocean at golden hour" },
      { id: "1540541338287-41700207dee6", alt: "Open-air living pavilion with ocean view" },
      { id: "1600585154340-be6161a56a0c", alt: "Cliffside master suite with freestanding bath" },
      { id: "1582719478250-c89cae4dc85b", alt: "Sunset terrace with fire pit" },
      { id: "1571896349842-33c89424de2d", alt: "Villa exterior at dusk" },
    ],
    amenitySlugs: ["private-pool","infinity-pool","ocean-view","ac","wifi","chef","butler","housekeeping","ensuite","bathtub","kitchen","bbq","gym","spa-services","parking","safe","workspace"],
    houseRules: ["No smoking inside the pavilions.","Events and weddings permitted with prior approval.","Quiet hours after 22:00.","Children welcome; pool fencing on request."],
    services: [
      { name:"Private airport transfer", category:"airport_transfer", price:6500, model:"PER_TRIP", description:"Chauffeured Mercedes from DPS with cold towels and refreshments." },
      { name:"In-villa chef experience", category:"chef", price:18000, model:"PER_DAY", description:"Full-time private chef preparing three meals daily." },
      { name:"Private driver + vehicle", category:"driver", price:9500, model:"PER_DAY", description:"English-speaking driver and SUV, 10 hours per day." },
      { name:"Sunset bale dinner setup", category:"celebration", price:25000, model:"FIXED", description:"Candle-lit cliff-edge dinner for two with florals." },
    ],
    cancellation: "moderate",
  },
  {
    name: "Canang Sari Retreat",
    slug: "canang-sari-retreat",
    tagline: "Wellness-oriented jungle sanctuary above the Ayung River gorge.",
    region: "ubud", lat: -8.4095, lng: 115.1889,
    bedrooms: 4, bathrooms: 4, guests: 8, sizeSqm: 620,
    baseEur: 89000, cleaningEur: 22000, bookingMode: "INSTANT",
    jungleView: true, familyFriendly: true,
    overview: "A hand-carved teak and stone estate set within the rainforest canopy above Ubud, designed around wellness, silence and river-valley views.",
    description: [
      "The Residence — Reclaimed joglo pavilions arranged around a landscaped lotus pond frame views of the Ayung River gorge.",
      "Bedrooms — Four garden pavilions each with outdoor rain shower, hand-crafted four-poster bed and private bale.",
      "Outdoor Living — A spring-fed infinity pool overlooks the jungle, with a riverside yoga deck, open-air massage sala and fire circle.",
      "Services — Daily yoga, a visiting wellness therapist, plant-based chef and guided temple walks can be arranged.",
    ],
    images: [
      { id:"1566073771259-6a8506099945", alt:"Jungle infinity pool overlooking the valley" },
      { id:"1542322896-33b9d2a1ed92", alt:"Traditional joglo living pavilion" },
      { id:"1512917774080-9991f1c4c750", alt:"Outdoor rain shower surrounded by foliage" },
      { id:"1580646769770-3a68bd035a91", alt:"Yoga deck above the river at sunrise" },
      { id:"1522771739844-6a9f6d5f14af", alt:"Plunge pool with jungle view" },
    ],
    amenitySlugs: ["private-pool","jungle-view","ac","wifi","chef","yoga-deck","spa-services","housekeeping","ensuite","bathtub","kitchen","garden","workspace"],
    houseRules: ["Silent hours 22:00–07:00 — this is a retreat environment.","No parties or amplified music.","Children welcome; supervised river access only."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:5500, model:"PER_TRIP", description:"Private car from DPS to Ubud." },
      { name:"Daily private yoga", category:"wellness", price:8000, model:"PER_DAY", description:"60-minute private session on the yoga deck." },
      { name:"Balinese massage (2 therapists)", category:"wellness", price:9000, model:"FIXED", description:"90-minute in-villa traditional Balinese massage." },
      { name:"Plant-based chef", category:"chef", price:15000, model:"PER_DAY", description:"Whole-food plant-based menus." },
    ],
    cancellation: "flexible",
  },
  {
    name: "Villa Sungai Canggu",
    slug: "villa-sungai-canggu",
    tagline: "Architectural concrete-and-rattan villa on the banks of the Canggu river.",
    region: "canggu", lat: -8.6476, lng: 115.1385,
    bedrooms: 4, bathrooms: 4, guests: 8, sizeSqm: 520,
    baseEur: 78000, cleaningEur: 20000, bookingMode: "INSTANT",
    familyFriendly: true,
    overview: "A modernist four-bedroom villa on the quiet edge of Canggu, blending off-form concrete, reclaimed teak and rattan with views over a small river and tiered gardens.",
    description: [
      "The Residence — Two intersecting concrete volumes enclose a central courtyard and a 22-metre lap pool.",
      "Bedrooms — Four generous suites, two with river-facing terraces, each with a custom terrazzo bathtub and king bed.",
      "Outdoor Living — Sun loungers, a rooftop sunset bar, outdoor cinema screen and fire pit are arranged around tropical gardens.",
      "Services — Daily breakfast, housekeeping and a concierge for reservations are included.",
    ],
    images: [
      { id:"1600596542815-ffad4c1539a9", alt:"Modernist concrete villa with lap pool" },
      { id:"1560448204-e02f11c3d0e2", alt:"Open-air living room with rattan furniture" },
      { id:"1560185007-cde436f6a4d0", alt:"Terrazzo bathtub in bathroom" },
      { id:"1600585154526-990dced4db0d", alt:"Rooftop lounge at sunset" },
      { id:"1600607687939-ce8a6c25118c", alt:"Courtyard garden" },
    ],
    amenitySlugs: ["private-pool","ac","wifi","housekeeping","breakfast","ensuite","bathtub","kitchen","bbq","rooftop","cinema","workspace","paddleboard"],
    houseRules: ["No large parties — 12 guests maximum on premises.","External visitors after 22:00 must be approved.","No smoking inside."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:4500, model:"PER_TRIP", description:"Comfortable SUV transfer from DPS." },
      { name:"Daily breakfast chef", category:"chef", price:6500, model:"PER_DAY", description:"Chef prepares breakfast each morning." },
      { name:"In-villa cinema night setup", category:"celebration", price:3500, model:"FIXED", description:"Projector, popcorn, cocktail service for 8." },
      { name:"Surfboard rental", category:"activities", price:2500, model:"PER_DAY", description:"Premium boards delivered to the villa." },
    ],
    cancellation: "moderate",
  },
  {
    name: "Puri Bulan Estate",
    slug: "puri-bulan-estate",
    tagline: "Expansive family estate with lotus ponds and staff of twelve.",
    region: "seminyak", lat: -8.6913, lng: 115.1645,
    bedrooms: 6, bathrooms: 7, guests: 12, sizeSqm: 1100,
    baseEur: 195000, cleaningEur: 50000, bookingMode: "REQUEST",
    familyFriendly: true, eventsAllowed: true,
    overview: "A palatial six-bedroom walled estate in the heart of Seminyak, designed for multi-generational family holidays and landmark celebrations.",
    description: [
      "The Residence — Traditional Balinese pavilions and a newer modern wing encircle an enormous free-form swimming pool crossed by a stone footbridge.",
      "Bedrooms — Six bedroom suites, each with private garden patio, two with children's annexes and two with private plunge pools.",
      "Outdoor Living — A tennis court, gym pavilion, children's pool, outdoor dining bale, spa room and barbecue terrace fill the walled gardens.",
      "Services — A staff of twelve including villa manager, chef, sous-chef, nannies, security and therapists attend to guests.",
    ],
    images: [
      { id:"1582719508461-905c673771fd", alt:"Grand estate pool with traditional balustrades" },
      { id:"1540541338287-41700207dee6", alt:"Open-air dining pavilion at dusk" },
      { id:"1571896349842-33c89424de2d", alt:"Walled tropical gardens" },
      { id:"1596891215458-1cb6f06a6dc6", alt:"Four-poster bedroom with silk drapery" },
      { id:"1560448204-e02f11c3d0e2", alt:"Outdoor lounge overlooking the pool" },
    ],
    amenitySlugs: ["private-pool","tennis","gym","spa-room","ac","wifi","chef","butler","nanny","security","housekeeping","ensuite","bathtub","kitchen","bbq","family","parking","events"],
    houseRules: ["Events and weddings welcome; venue buyout required for over 30 guests.","Children welcome; nanny service available.","Amplified music ends at 23:00."],
    services: [
      { name:"VIP airport fast-track + transfer", category:"airport_transfer", price:9500, model:"PER_TRIP", description:"VIP service and Mercedes V-Class for up to 6." },
      { name:"Full-time chef + sous-chef", category:"chef", price:28000, model:"PER_DAY", description:"Two chefs curating all meals and canapés." },
      { name:"Dedicated nannies (2)", category:"childcare", price:14000, model:"PER_DAY", description:"Two English-speaking nannies." },
      { name:"Floral celebration setup", category:"celebration", price:45000, model:"FIXED", description:"Tropical florals and welcome board." },
    ],
    cancellation: "strict",
  },
  {
    name: "Nusa Dua Pavilion",
    slug: "nusa-dua-pavilion",
    tagline: "Beachfront contemporary pavilion with private white-sand access.",
    region: "nusa-dua", lat: -8.795, lng: 115.233,
    bedrooms: 5, bathrooms: 5, guests: 10, sizeSqm: 720,
    baseEur: 128000, cleaningEur: 30000, bookingMode: "REQUEST",
    beachfront: true, oceanView: true, familyFriendly: true,
    overview: "Set on a quiet stretch of Nusa Dua's finest white sand, Nusa Dua Pavilion is a sophisticated beachfront retreat with 35 metres of ocean frontage.",
    description: [
      "The Residence — Clean horizontal lines, travertine floors and oversized sliding glass walls dissolve the boundary between inside and ocean.",
      "Bedrooms — Five sea-facing suites, each opening to a terrace; the master occupies an entire upper floor with a rooftop lounge.",
      "Outdoor Living — A 20-metre beachfront pool, outdoor bar, open-air kitchen, private beach loungers and direct sand access.",
      "Services — A dedicated beach attendant, watersports equipment, villa chef and evening turn-down are included.",
    ],
    images: [
      { id:"1519046904884-53103b34b206", alt:"Beachfront pool and ocean horizon" },
      { id:"1507525428034-b723cf961d3e", alt:"White-sand beach with sun loungers" },
      { id:"1571078133158-22a1c8b1d9d1", alt:"Travertine open living room" },
      { id:"1545517090-5ed1ffce7fd5", alt:"Rooftop master terrace" },
      { id:"1514282401047-d79a71a590e8", alt:"Aerial view of beachfront villa" },
    ],
    amenitySlugs: ["private-pool","beachfront","ocean-view","ac","wifi","chef","housekeeping","water-sports","ensuite","bathtub","kitchen","outdoor-bar","parking","workspace"],
    houseRules: ["Beachfront bonfires must be arranged in advance.","No glassware on the beach.","Quiet hours after 23:00."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:6000, model:"PER_TRIP", description:"Air-conditioned SUV from DPS." },
      { name:"Private chef", category:"chef", price:16000, model:"PER_DAY", description:"Seafood-focused chef for all meals." },
      { name:"Beach picnic setup", category:"activities", price:8500, model:"FIXED", description:"Shaded cabana and picnic basket on the sand." },
      { name:"Sunset yacht charter", category:"activities", price:85000, model:"PER_TRIP", description:"4-hour private catamaran cruise." },
    ],
    cancellation: "moderate",
  },
  {
    name: "Kembang Jade Villa",
    slug: "kembang-jade-villa",
    tagline: "Intimate jade-green ceramic and teak honeymoon hideaway.",
    region: "ubud", lat: -8.486, lng: 115.254,
    bedrooms: 1, bathrooms: 1, guests: 2, sizeSqm: 180,
    baseEur: 54000, cleaningEur: 12000, bookingMode: "INSTANT",
    jungleView: true,
    overview: "A one-bedroom jewel for couples, set within its own river-valley clearing near Ubud.",
    description: [
      "The Residence — A single open-plan living pavilion wrapped in jade-green ceramic tiles opens to a private pool overlooking a waterfall.",
      "Bedrooms — The romantic master suite is canopied with hand-dyed silk, leading to an oversized terrazzo bath for two.",
      "Outdoor Living — A private heart-shaped plunge pool, stone massage slab, outdoor bathtub and hanging daybeds line the valley edge.",
      "Services — A couple's spa, flower bath, candle-lit dinner and motorcycle can be arranged privately.",
    ],
    images: [
      { id:"1519455953427-8bd1c7f5d7cc", alt:"Intimate one-bedroom pool villa in the jungle" },
      { id:"1520250497591-112f2f40a3f4", alt:"Canopied four-poster bed" },
      { id:"1584622650111-993a426fbf0a", alt:"Terrazzo bath for two surrounded by frangipani" },
      { id:"1540541338287-41700207dee6", alt:"Private terrace over the valley" },
      { id:"1522771739844-6a9f6d5f14af", alt:"Plunge pool with jungle view" },
    ],
    amenitySlugs: ["private-pool","jungle-view","ac","wifi","housekeeping","breakfast","ensuite","bathtub","outdoor-bath","kitchenette","romance"],
    houseRules: ["Adults only — designed for couples.","No visitors beyond registered guests.","No parties."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:5500, model:"PER_TRIP", description:"Private car from DPS to Ubud." },
      { name:"Flower bath + rose petal turndown", category:"celebration", price:2200, model:"FIXED", description:"Petal-filled bath and bed turndown." },
      { name:"Private candle-lit dinner", category:"chef", price:7500, model:"PER_TRIP", description:"Five-course dinner for two." },
      { name:"Couple's Balinese massage", category:"wellness", price:6500, model:"FIXED", description:"90-minute side-by-side massage." },
    ],
    cancellation: "flexible",
  },
  {
    name: "Omah Cemara Beach House",
    slug: "omah-cemara-beach-house",
    tagline: "Barefoot-luxury beach house on the black sands of Canggu's quieter shore.",
    region: "canggu", lat: -8.632, lng: 115.121,
    bedrooms: 3, bathrooms: 3, guests: 6, sizeSqm: 380,
    baseEur: 66000, cleaningEur: 18000, bookingMode: "INSTANT",
    beachfront: true, oceanView: true, familyFriendly: true,
    overview: "A three-bedroom beach house set directly on the sand, designed for barefoot family living and long sunset suppers.",
    description: [
      "The Residence — A long, low-slung whitewashed house opens along its entire length to a sea-facing deck, pool and beach.",
      "Bedrooms — Three king-bed suites, each opening to a private garden patio with outdoor shower.",
      "Outdoor Living — A sea-facing pool, built-in bench dining, fire pit, surfboard storage and direct beach access.",
      "Services — Daily breakfast, housekeeping and on-call villa host are included; chef and masseuse on request.",
    ],
    images: [
      { id:"1520250497591-112f2f40a3f4", alt:"Whitewashed beach house deck at golden hour" },
      { id:"1507525428034-b723cf961d3e", alt:"Beach loungers on black sand" },
      { id:"1571078133158-22a1c8b1d9d1", alt:"Open-plan beach house interior" },
      { id:"1519455953427-8bd1c7f5d7cc", alt:"Outdoor dining facing the ocean" },
      { id:"1600607687939-ce8a6c25118c", alt:"Pool and tropical garden beside the beach" },
    ],
    amenitySlugs: ["private-pool","beachfront","ocean-view","ac","wifi","housekeeping","breakfast","ensuite","outdoor-shower","kitchen","bbq","surf-storage","family"],
    houseRules: ["Surfboards included with the villa.","Children welcome; no fence at the beach.","No amplified music after 22:00."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:4500, model:"PER_TRIP", description:"SUV from DPS." },
      { name:"Chef + seafood BBQ", category:"chef", price:6000, model:"PER_DAY", description:"Daily breakfast and one seafood barbecue." },
      { name:"In-villa massage (2)", category:"wellness", price:7500, model:"FIXED", description:"60-minute poolside massages." },
      { name:"Grocery pre-stocking", category:"groceries", price:3000, model:"QUOTE", description:"Pre-stock the kitchen with your preferences." },
    ],
    cancellation: "moderate",
  },
  {
    name: "Villa Mawar Cliffside",
    slug: "villa-mawar-cliffside",
    tagline: "Glass-walled cliff-edge villa with 180° ocean panorama.",
    region: "uluwatu", lat: -8.841, lng: 115.087,
    bedrooms: 3, bathrooms: 3, guests: 6, sizeSqm: 410,
    baseEur: 98000, cleaningEur: 24000, bookingMode: "REQUEST",
    oceanView: true,
    overview: "Suspended above Uluwatu's surf breaks, Villa Mawar is a glass-walled three-bedroom villa arranged to give every room a panoramic ocean view.",
    description: [
      "The Residence — Floor-to-ceiling retractable glass walls open the entire villa to a cliff-edge deck; interiors are calm and monochrome.",
      "Bedrooms — Three suites, all ocean-facing, two with private balconies and outdoor bathtubs.",
      "Outdoor Living — A glass-tiled infinity pool, cliff-edge daybed, sunset cabana and outdoor cinema.",
      "Services — A villa manager, chef and housekeeper attend daily; surf guides and day trips can be arranged.",
    ],
    images: [
      { id:"1615529328331-f8917597711f", alt:"Glass-walled cliffside pool at sunset" },
      { id:"1600566753190-17f0baa2a6c3", alt:"Minimalist monochrome living room" },
      { id:"1584622650111-993a426fbf0a", alt:"Outdoor cliff-edge bathtub" },
      { id:"1540541338287-41700207dee6", alt:"Sunset cabana over the ocean" },
      { id:"1582719478250-c89cae4dc85b", alt:"Pool deck at golden hour" },
    ],
    amenitySlugs: ["private-pool","infinity-pool","ocean-view","ac","wifi","chef","housekeeping","villa-manager","ensuite","bathtub","kitchen","bbq","cinema","workspace"],
    houseRules: ["No children under 12 due to unfenced cliff edges.","No parties.","Quiet hours after 22:00."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:6500, model:"PER_TRIP", description:"Private car from DPS." },
      { name:"Chef — daily", category:"chef", price:12000, model:"PER_DAY", description:"Modern European and Indonesian menus." },
      { name:"Sunset surf session with guide", category:"activities", price:6000, model:"PER_GUEST", description:"2-hour guided surf at Uluwatu." },
      { name:"In-villa wine pairing dinner", category:"chef", price:9500, model:"PER_GUEST", description:"5-course menu with curated wines." },
    ],
    cancellation: "strict",
  },
  {
    name: "Sawah Padi Villa",
    slug: "sawah-padi-villa",
    tagline: "Rice-terrace hideaway for families and small groups in Ubud's foothills.",
    region: "ubud", lat: -8.418, lng: 115.213,
    bedrooms: 5, bathrooms: 5, guests: 10, sizeSqm: 600,
    baseEur: 76000, cleaningEur: 22000, bookingMode: "INSTANT",
    jungleView: true, familyFriendly: true,
    overview: "A five-bedroom family villa set within working rice terraces in Ubud's foothills, built around a central infinity pool edged with frangipani.",
    description: [
      "The Residence — Connected pavilions blend contemporary concrete and alang-alang roofing, opening to tiered rice-terrace views.",
      "Bedrooms — Five bedrooms split between a family wing and a private couple's pavilion, each with outdoor rain shower.",
      "Outdoor Living — The 25-metre pool overlooks a working rice field; a bale, fire pit, organic garden and children's lawn fill the gardens.",
      "Services — A cook prepares daily breakfast and Indonesian classics; local guides lead walks, cycling tours and temple visits.",
    ],
    images: [
      { id:"1600566753190-17f0baa2a6c3", alt:"Infinity pool overlooking tiered rice terraces" },
      { id:"1566073771259-6a8506099945", alt:"Alang-alang thatched roof pavilion" },
      { id:"1580646769770-3a68bd035a91", alt:"Rice terraces at sunrise" },
      { id:"1560185007-cde436f6a4d0", alt:"Garden bathroom with outdoor shower" },
      { id:"1600585154340-be6161a56a0c", alt:"Frangipani-lined pool deck" },
    ],
    amenitySlugs: ["private-pool","jungle-view","rice-terrace-view","ac","wifi","cook","housekeeping","garden","ensuite","outdoor-shower","kitchen","bbq","bicycles","family","workspace"],
    houseRules: ["Family-friendly; pool fence on request.","Children should be accompanied near the rice terraces.","Small events welcome with prior notice."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:5500, model:"PER_TRIP", description:"Private transfer from DPS." },
      { name:"Daily cook — 3 meals", category:"chef", price:10000, model:"PER_DAY", description:"Family-style Indonesian and Western meals." },
      { name:"Guided rice-terrace walk", category:"activities", price:2500, model:"PER_GUEST", description:"Morning walk through working sawah." },
      { name:"Balinese cooking class", category:"activities", price:4500, model:"PER_GUEST", description:"Market visit and hands-on class." },
    ],
    cancellation: "flexible",
  },
  {
    name: "The Semeru Penthouse",
    slug: "the-semeru-penthouse",
    tagline: "Sky-high duplex penthouse with 270° views above Seminyak.",
    region: "seminyak", lat: -8.685, lng: 115.159,
    bedrooms: 3, bathrooms: 3, guests: 6, sizeSqm: 320,
    baseEur: 92000, cleaningEur: 22000, bookingMode: "INSTANT",
    oceanView: true,
    overview: "The Semeru Penthouse crowns a boutique residential building in central Seminyak: a three-bedroom duplex with wrap-around terraces and a private rooftop pool.",
    description: [
      "The Residence — Interiors feel like an editor's loft: travertine floors, linen sofas, contemporary Indonesian art and a wine wall.",
      "Bedrooms — Three king bedrooms on the lower level, each with en-suite marble bathroom; the master opens to a private terrace.",
      "Outdoor Living — A rooftop terrace with 270° sunset views, a private plunge pool, outdoor kitchen, dining table and daybed lounge.",
      "Services — Building concierge, daily housekeeping, in-residence breakfast and priority access to partner beach clubs.",
    ],
    images: [
      { id:"1600585154340-be6161a56a0c", alt:"Rooftop penthouse pool with sunset skyline" },
      { id:"1600607687939-ce8a6c25118c", alt:"Travertine-floored open-plan living room" },
      { id:"1560185007-cde436f6a4d0", alt:"Marble bathroom with city view" },
      { id:"1600585154526-990dced4db0d", alt:"Rooftop outdoor dining at dusk" },
      { id:"1560448204-e02f11c3d0e2", alt:"Linen-dressed bedroom with city view" },
    ],
    amenitySlugs: ["private-pool","rooftop","ocean-view","ac","wifi","concierge","housekeeping","breakfast","ensuite","bathtub","kitchen","wine-fridge","gym-building","parking","workspace"],
    houseRules: ["No smoking inside.","Rooftop gatherings must wind down by 23:00.","No external guests beyond the booking party after 22:00."],
    services: [
      { name:"Airport transfer", category:"airport_transfer", price:4500, model:"PER_TRIP", description:"Chauffeured car from DPS." },
      { name:"In-house breakfast service", category:"chef", price:3500, model:"PER_DAY", description:"Daily breakfast served in the penthouse." },
      { name:"Beach club reservations + daybed", category:"restaurant", price:2000, model:"FIXED", description:"Priority daybed reservation at partner beach clubs." },
      { name:"Rooftop private bartender", category:"celebration", price:8500, model:"PER_TRIP", description:"Mixologist for 4 hours with signature cocktails." },
    ],
    cancellation: "moderate",
  },
];

const AMENITIES = [
  { name: "Private pool", slug: "private-pool", category: "outdoor" },
  { name: "Infinity pool", slug: "infinity-pool", category: "outdoor" },
  { name: "Air conditioning", slug: "ac", category: "essentials" },
  { name: "High-speed Wi-Fi", slug: "wifi", category: "essentials" },
  { name: "En-suite bathrooms", slug: "ensuite", category: "essentials" },
  { name: "Bathtub", slug: "bathtub", category: "essentials" },
  { name: "Outdoor shower", slug: "outdoor-shower", category: "outdoor" },
  { name: "Outdoor bath", slug: "outdoor-bath", category: "outdoor" },
  { name: "Fully equipped kitchen", slug: "kitchen", category: "kitchen" },
  { name: "Kitchenette", slug: "kitchenette", category: "kitchen" },
  { name: "BBQ", slug: "bbq", category: "outdoor" },
  { name: "Breakfast included", slug: "breakfast", category: "staff" },
  { name: "Private chef", slug: "chef", category: "staff" },
  { name: "Private cook", slug: "cook", category: "staff" },
  { name: "Butler", slug: "butler", category: "staff" },
  { name: "Villa manager", slug: "villa-manager", category: "staff" },
  { name: "Housekeeping", slug: "housekeeping", category: "staff" },
  { name: "Nanny service", slug: "nanny", category: "staff" },
  { name: "24h security", slug: "security", category: "security" },
  { name: "On-site parking", slug: "parking", category: "essentials" },
  { name: "Workspace", slug: "workspace", category: "work" },
  { name: "Gym", slug: "gym", category: "wellness" },
  { name: "Spa / massage room", slug: "spa-room", category: "wellness" },
  { name: "In-villa spa services", slug: "spa-services", category: "wellness" },
  { name: "Yoga deck", slug: "yoga-deck", category: "wellness" },
  { name: "Tennis court", slug: "tennis", category: "entertainment" },
  { name: "Outdoor cinema", slug: "cinema", category: "entertainment" },
  { name: "Outdoor bar", slug: "outdoor-bar", category: "outdoor" },
  { name: "Water sports", slug: "water-sports", category: "entertainment" },
  { name: "Rooftop", slug: "rooftop", category: "outdoor" },
  { name: "Safe", slug: "safe", category: "security" },
  { name: "Garden", slug: "garden", category: "outdoor" },
  { name: "Wine fridge", slug: "wine-fridge", category: "kitchen" },
  { name: "Building gym", slug: "gym-building", category: "wellness" },
  { name: "Concierge", slug: "concierge", category: "staff" },
  { name: "Bicycles", slug: "bicycles", category: "entertainment" },
  { name: "Ocean view", slug: "ocean-view", category: "outdoor" },
  { name: "Jungle view", slug: "jungle-view", category: "outdoor" },
  { name: "Rice-terrace view", slug: "rice-terrace-view", category: "outdoor" },
  { name: "Beachfront", slug: "beachfront", category: "outdoor" },
  { name: "Family-friendly", slug: "family", category: "family" },
  { name: "Events permitted", slug: "events", category: "essentials" },
  { name: "Surf storage", slug: "surf-storage", category: "entertainment" },
  { name: "Paddleboards", slug: "paddleboard", category: "entertainment" },
  { name: "Romance setup", slug: "romance", category: "family" },
];

function upsertCountry(id: string, name: string, slug: string, iso: string) {
  const e = db.prepare(`SELECT id FROM countries WHERE slug=?`).get(slug) as { id: string } | undefined;
  if (e) return e.id;
  db.prepare(`INSERT INTO countries (id,name,slug,iso_code) VALUES (?,?,?,?)`).run(id, name, slug, iso);
  return id;
}
function upsertDestination(id: string, name: string, slug: string, description: string, img: string, lat: number, lng: number, countryId: string) {
  const e = db.prepare(`SELECT id FROM destinations WHERE slug=?`).get(slug) as { id: string } | undefined;
  if (e) return e.id;
  db.prepare(`INSERT INTO destinations (id,name,slug,description,image_url,latitude,longitude,country_id) VALUES (?,?,?,?,?,?,?,?)`).run(id, name, slug, description, img, lat, lng, countryId);
  return id;
}
function upsertRegion(id: string, name: string, slug: string, destId: string) {
  const e = db.prepare(`SELECT id FROM regions WHERE destination_id=? AND slug=?`).get(destId, slug) as { id: string } | undefined;
  if (e) return e.id;
  db.prepare(`INSERT INTO regions (id,name,slug,destination_id) VALUES (?,?,?,?)`).run(id, name, slug, destId);
  return id;
}
function upsertCollection(id: string, title: string, slug: string, subtitle: string, desc: string, hero: string, active: boolean, comingSoon: boolean, currency: string, destId: string) {
  const e = db.prepare(`SELECT id FROM collections WHERE slug=?`).get(slug) as { id: string } | undefined;
  if (e) return e.id;
  db.prepare(`INSERT INTO collections (id,title,slug,subtitle,description,hero_image_url,is_active,coming_soon,currency,destination_id) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(id, title, slug, subtitle, desc, hero, active ? 1 : 0, comingSoon ? 1 : 0, currency, destId);
  return id;
}
function upsertUser(id: string, email: string, first: string, last: string, role: "TRAVELLER"|"HOST"|"ADMIN"|"SUPPORT", pwHash: string) {
  const e = db.prepare(`SELECT id FROM users WHERE email=?`).get(email) as { id: string } | undefined;
  if (e) {
    db.prepare(`UPDATE users SET first_name=?, last_name=?, role=?, email_verified=COALESCE(email_verified, datetime('now')) WHERE id=?`).run(first, last, role, e.id);
    return e.id;
  }
  db.prepare(`INSERT INTO users (id,email,first_name,last_name,password_hash,role,email_verified) VALUES (?,?,?,?,?,?,datetime('now'))`).run(id, email, first, last, pwHash, role);
  return id;
}

// Run
const now = new Date().toISOString();

// Platform commission
db.prepare(`INSERT OR IGNORE INTO platform_fee_config (id,commission_pct,currency,active) VALUES (?,?,?,?)`).run("default-commission", 2, "EUR", 1);
// Feature flags
for (const [k, enabled] of [["crypto-payments",0],["nexcoin",0],["ai-concierge",0],["ar-vr",0]] as const) {
  db.prepare(`INSERT OR IGNORE INTO feature_flags (id,key,enabled) VALUES (?,?,?)`).run(cuid(), k, enabled);
}

// Countries + destinations
const indoId = upsertCountry(cuid(), "Indonesia", "indonesia", "ID");
const baliId = upsertDestination(cuid(), "Bali", "bali",
  "Volcanic rice terraces, ancient temples and thousand-year-old hospitality traditions meet world-class contemporary design on the Island of the Gods.",
  U("1564501049412-61c2a3083791",2000), -8.4095, 115.1889, indoId);

const regions: Record<string,string> = {};
for (const r of [{name:"Uluwatu",slug:"uluwatu"},{name:"Ubud",slug:"ubud"},{name:"Canggu",slug:"canggu"},{name:"Seminyak",slug:"seminyak"},{name:"Nusa Dua",slug:"nusa-dua"}]) {
  regions[r.slug] = upsertRegion(cuid(), r.name, r.slug, baliId);
}

const baliCol = upsertCollection(cuid(), "The Bali Collection", "bali", "Ten handpicked private villas",
  "Ten extraordinary homes set across Uluwatu, Ubud, Canggu, Seminyak and Nusa Dua — each personally reviewed by the NexMansion team.",
  U("1582719508461-905c673771fd",2000), true, false, "EUR", baliId);

// Future collections
const future = [
  { country:"UAE",iso:"AE",destination:"Dubai",slug:"dubai",lat:25.2048,lng:55.2708 },
  { country:"France",iso:"FR",destination:"French Riviera",slug:"french-riviera",lat:43.5513,lng:7.0128 },
  { country:"Greece",iso:"GR",destination:"Mykonos",slug:"mykonos",lat:37.4467,lng:25.3289 },
  { country:"Maldives",iso:"MV",destination:"Maldives",slug:"maldives",lat:3.2028,lng:73.2207 },
  { country:"Saint-Barthélemy",iso:"BL",destination:"Saint-Barth",slug:"saint-barth",lat:17.9,lng:-62.83 },
];
for (const f of future) {
  const cid = upsertCountry(cuid(), f.country, f.slug, f.iso);
  const did = upsertDestination(cuid(), f.destination, f.slug, "Coming soon.", U("1519046904884-53103b34b206",2000), f.lat, f.lng, cid);
  upsertCollection(cuid(), `The ${f.destination} Collection`, f.slug, "Coming soon",
    "We are curating exceptional homes in this destination.",
    U("1540541338287-41700207dee6",2000), false, true, "EUR", did);
}

// Amenities
const amenityIds: Record<string,string> = {};
for (const a of AMENITIES) {
  const e = db.prepare(`SELECT id FROM amenities WHERE slug=?`).get(a.slug) as {id:string}|undefined;
  if (e) { amenityIds[a.slug] = e.id; continue; }
  const id = cuid();
  db.prepare(`INSERT INTO amenities (id,name,slug,category) VALUES (?,?,?,?)`).run(id, a.name, a.slug, a.category);
  amenityIds[a.slug] = id;
}

// Demo users
const pwHash = bcrypt.hashSync("nexmansion123", 10);
const adminId = upsertUser(cuid(), "admin@nexmansion.com", "NexMansion", "Admin", "ADMIN", pwHash);
const hostUserId = upsertUser(cuid(), "host@nexmansion.com", "Made", "Surya", "HOST", pwHash);
const travellerId = upsertUser(cuid(), "traveller@nexmansion.com", "Elena", "Moreau", "TRAVELLER", pwHash);

// Host profile
const hostExisting = db.prepare(`SELECT id FROM host_profiles WHERE user_id=?`).get(hostUserId) as {id:string}|undefined;
let hostId: string;
if (hostExisting) { hostId = hostExisting.id; }
else {
  hostId = cuid();
  db.prepare(`INSERT INTO host_profiles (id,user_id,company_name,bio,verification_status,verified_at) VALUES (?,?,?,?,?,datetime('now'))`).run(hostId, hostUserId, "NexMansion Curated Villas", "Our Balinese-owned hospitality partner has managed private luxury villas across Bali for more than a decade.", "verified");
}

// Seed villas
for (const v of VILLAS) {
  const e = db.prepare(`SELECT id FROM properties WHERE slug=?`).get(v.slug) as {id:string}|undefined;
  const pid = e?.id || cuid();
  const fields = {
    name: v.name, slug: v.slug, tagline: v.tagline,
    description: v.description.join("\n\n"), overview: v.overview,
    bedrooms: v.bedrooms, bathrooms: v.bathrooms, max_guests: v.guests, size_sqm: v.sizeSqm ?? null,
    latitude: v.lat, longitude: v.lng,
    hero_image_url: U(v.images[0].id, 2400),
    base_price_minor: v.baseEur, currency: "EUR",
    cleaning_fee_minor: v.cleaningEur, service_fee_pct: 0, tax_pct: 10,
    security_deposit_minor: Math.round(v.baseEur * 2), min_stay_nights: 3, max_stay_nights: null,
    check_in_time: "15:00", check_out_time: "11:00", booking_mode: v.bookingMode,
    beachfront: v.beachfront?1:0, ocean_view: v.oceanView?1:0, jungle_view: v.jungleView?1:0,
    pool: 1, family_friendly: v.familyFriendly?1:0, events_allowed: v.eventsAllowed?1:0,
    status: "PUBLISHED", featured: 1, verified_at: now, last_verified_at: now,
    cancellation_policy: v.cancellation, host_id: hostId, collection_id: baliCol,
    destination_id: baliId, region_id: regions[v.region],
  };
  if (e) {
    db.prepare(`UPDATE properties SET name=@name,tagline=@tagline,description=@description,overview=@overview,bedrooms=@bedrooms,bathrooms=@bathrooms,max_guests=@max_guests,size_sqm=@size_sqm,latitude=@latitude,longitude=@longitude,hero_image_url=@hero_image_url,base_price_minor=@base_price_minor,currency=@currency,cleaning_fee_minor=@cleaning_fee_minor,service_fee_pct=@service_fee_pct,tax_pct=@tax_pct,security_deposit_minor=@security_deposit_minor,min_stay_nights=@min_stay_nights,check_in_time=@check_in_time,check_out_time=@check_out_time,booking_mode=@booking_mode,beachfront=@beachfront,ocean_view=@ocean_view,jungle_view=@jungle_view,pool=@pool,family_friendly=@family_friendly,events_allowed=@events_allowed,status=@status,featured=@featured,verified_at=@verified_at,last_verified_at=@last_verified_at,cancellation_policy=@cancellation_policy,host_id=@host_id,collection_id=@collection_id,destination_id=@destination_id,region_id=@region_id,updated_at=datetime('now') WHERE id=@id`).run({...fields, id: pid});
  } else {
    db.prepare(`INSERT INTO properties (id,name,slug,tagline,description,overview,bedrooms,bathrooms,max_guests,size_sqm,latitude,longitude,hero_image_url,base_price_minor,currency,cleaning_fee_minor,service_fee_pct,tax_pct,security_deposit_minor,min_stay_nights,max_stay_nights,check_in_time,check_out_time,booking_mode,beachfront,ocean_view,jungle_view,pool,family_friendly,events_allowed,status,featured,verified_at,last_verified_at,cancellation_policy,host_id,collection_id,destination_id,region_id) VALUES (@id,@name,@slug,@tagline,@description,@overview,@bedrooms,@bathrooms,@max_guests,@size_sqm,@latitude,@longitude,@hero_image_url,@base_price_minor,@currency,@cleaning_fee_minor,@service_fee_pct,@tax_pct,@security_deposit_minor,@min_stay_nights,@max_stay_nights,@check_in_time,@check_out_time,@booking_mode,@beachfront,@ocean_view,@jungle_view,@pool,@family_friendly,@events_allowed,@status,@featured,@verified_at,@last_verified_at,@cancellation_policy,@host_id,@collection_id,@destination_id,@region_id)`).run({id:pid,...fields});
  }

  // Images
  db.prepare(`DELETE FROM property_images WHERE property_id=?`).run(pid);
  v.images.forEach((img, i) => {
    db.prepare(`INSERT INTO property_images (id,property_id,url,alt,order_index) VALUES (?,?,?,?,?)`).run(cuid(), pid, U(img.id, i===0?2400:1600), img.alt, i);
  });

  // Amenities
  db.prepare(`DELETE FROM property_amenities WHERE property_id=?`).run(pid);
  for (const s of v.amenitySlugs) {
    db.prepare(`INSERT OR IGNORE INTO property_amenities (id,property_id,amenity_id) VALUES (?,?,?)`).run(cuid(), pid, amenityIds[s]);
  }

  // House rules
  db.prepare(`DELETE FROM house_rules WHERE property_id=?`).run(pid);
  v.houseRules.forEach((h, i) => {
    db.prepare(`INSERT INTO house_rules (id,property_id,title,description,order_index) VALUES (?,?,?,?,?)`).run(cuid(), pid, h, "", i);
  });

  // Services
  db.prepare(`DELETE FROM services WHERE property_id=?`).run(pid);
  for (const s of v.services) {
    db.prepare(`INSERT INTO services (id,property_id,category,name,description,price_model,price_minor,currency,active,requires_confirmation) VALUES (?,?,?,?,?,?,?,?,1,?)`).run(
      cuid(), pid, s.category, s.name, s.description, s.model, s.price, "EUR", s.model === "QUOTE" ? 1 : 0,
    );
  }

  // Verification
  const vx = db.prepare(`SELECT id FROM property_verifications WHERE property_id=?`).get(pid) as {id:string}|undefined;
  if (vx) {
    db.prepare(`UPDATE property_verifications SET host_identity=1,property_reviewed=1,listing_checked=1,imagery_reviewed=1,last_verified_at=datetime('now'),reviewer_id=? WHERE id=?`).run(adminId, vx.id);
  } else {
    db.prepare(`INSERT INTO property_verifications (id,property_id,host_identity,property_reviewed,listing_checked,imagery_reviewed,last_verified_at,reviewer_id) VALUES (?,?,1,1,1,1,datetime('now'),?)`).run(cuid(), pid, adminId);
  }
}

// Demo past booking for the traveller (can leave a review)
const firstVilla = db.prepare(`SELECT id,slug,base_price_minor,cleaning_fee_minor,cancellation_policy FROM properties WHERE slug=?`).get("canang-sari-retreat") as any;
if (firstVilla) {
  const ex = db.prepare(`SELECT id FROM bookings WHERE user_id=? AND property_id=?`).get(travellerId, firstVilla.id);
  if (!ex) {
    const checkIn = new Date(Date.now() - 20*24*3600*1000);
    const checkOut = new Date(checkIn.getTime() + 5*24*3600*1000);
    const nights = 5;
    const sub = firstVilla.base_price_minor * nights;
    const clean = firstVilla.cleaning_fee_minor;
    const tax = Math.round((sub + clean) * 0.1);
    const total = sub + clean + tax;
    const bid = cuid();
    const checkInStr = checkIn.toISOString().slice(0,19).replace("T"," ");
    const checkOutStr = checkOut.toISOString().slice(0,19).replace("T"," ");
    db.prepare(`INSERT INTO bookings (id,reference,property_id,user_id,check_in,check_out,guests,nights,nights_subtotal_minor,cleaning_fee_minor,tax_minor,total_minor,currency,status,instant_book,cancellation_policy,terms_accepted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))`).run(
      bid, "NX-DEMO-0001", firstVilla.id, travellerId, checkInStr, checkOutStr, 2, nights, sub, clean, tax, total, "EUR", "COMPLETED", 1, firstVilla.cancellation_policy
    );
    db.prepare(`INSERT INTO booking_status_history (id,booking_id,from_status,to_status,note) VALUES (?,?,?,?,?)`).run(cuid(), bid, null, "CONFIRMED", "Demo booking");
    db.prepare(`INSERT INTO booking_status_history (id,booking_id,from_status,to_status) VALUES (?,?,?,?)`).run(cuid(), bid, "CONFIRMED", "COMPLETED");
    db.prepare(`INSERT INTO payments (id,booking_id,amount_minor,currency,provider,status) VALUES (?,?,?,?,?,?)`).run(cuid(), bid, total, "EUR", "MANUAL", "SUCCEEDED");
  }
}

console.log("Seed complete.");
console.log("  admin@nexmansion.com / nexmansion123   (Admin)");
console.log("  host@nexmansion.com  / nexmansion123   (Host)");
console.log("  traveller@nexmansion.com / nexmansion123 (Traveller)");
db.close();
