import { CardItem } from '../types/card';

export interface PresetCardTemplate {
  name: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  attributes: { trait_type: string; value: string | number }[];
  svgArt: string;
}

// Crisp, stylized, optimized automotive vector card artworks
export const PRESET_CARDS: PresetCardTemplate[] = [
  {
    name: 'Apex Vulcan Hyper-GT',
    description: 'A quad-turbocharged hybrid hypercar engineered for ultimate downforce, delivering 1,450 HP with carbon-fiber active aerodynamics.',
    rarity: 'Mythic',
    attributes: [
      { trait_type: 'Class', value: 'Hypercar' },
      { trait_type: 'Top Speed', value: '420 km/h' },
      { trait_type: 'Horsepower', value: 1450 },
      { trait_type: '0-100 km/h', value: '2.1s' },
      { trait_type: 'Aero Rating', value: 99 },
      { trait_type: 'Rarity', value: 'Mythic' },
    ],
    svgArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="mythicGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%23FFF5EB"/>
          <stop offset="50%" stop-color="%23FED7AA"/>
          <stop offset="100%" stop-color="%23EA580C" stop-opacity="0.15"/>
        </radialGradient>
        <linearGradient id="vulcanBody" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="%23EA580C"/>
          <stop offset="50%" stop-color="%23DC2626"/>
          <stop offset="100%" stop-color="%23991B1B"/>
        </linearGradient>
        <linearGradient id="carbonRoof" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="%23334155"/>
          <stop offset="100%" stop-color="%230F172A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23mythicGlow)"/>
      <!-- Speed streaks & grid -->
      <g stroke="%23EA580C" stroke-width="1" opacity="0.25">
        <line x1="20" y1="280" x2="380" y2="280"/>
        <line x1="40" y1="300" x2="360" y2="300"/>
        <line x1="80" y1="315" x2="320" y2="315"/>
      </g>
      <!-- Aura ring -->
      <circle cx="200" cy="190" r="130" stroke="%23EA580C" stroke-width="1.5" stroke-dasharray="8 6" fill="none" opacity="0.35"/>
      <!-- Car Silhouette (Apex Vulcan) -->
      <!-- Rear Wing -->
      <path d="M70 160 L115 160 L120 180 L80 180 Z" fill="%230F172A"/>
      <path d="M75 160 L78 195 L88 195 L85 160 Z" fill="%23DC2626"/>
      <!-- Main Aerodynamic Body -->
      <path d="M60 230 L80 190 L130 180 L180 150 L270 150 L320 190 L350 215 L360 235 L330 235 L310 210 L270 210 L250 235 L150 235 L130 210 L90 210 L70 235 Z" fill="url(%23vulcanBody)"/>
      <!-- Cockpit & Windshield -->
      <path d="M185 155 L260 155 L295 190 L160 190 Z" fill="url(%23carbonRoof)"/>
      <path d="M195 160 L255 160 L285 185 L180 185 Z" fill="%2338BDF8" opacity="0.85"/>
      <!-- Headlights & Neon LED Strip -->
      <polygon points="330,205 350,215 335,220" fill="%2338BDF8"/>
      <path d="M340 215 L390 220" stroke="%2338BDF8" stroke-width="2" opacity="0.6"/>
      <!-- Wheels & Rims -->
      <!-- Rear Wheel -->
      <circle cx="110" cy="235" r="30" fill="%230F172A" stroke="%23E2E8F0" stroke-width="2"/>
      <circle cx="110" cy="235" r="18" fill="%23F97316"/>
      <circle cx="110" cy="235" r="8" fill="%230F172A"/>
      <!-- Front Wheel -->
      <circle cx="290" cy="235" r="30" fill="%230F172A" stroke="%23E2E8F0" stroke-width="2"/>
      <circle cx="290" cy="235" r="18" fill="%23F97316"/>
      <circle cx="290" cy="235" r="8" fill="%230F172A"/>
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="270" rx="150" ry="12" fill="%2394A3B8" opacity="0.4"/>
      <!-- Mythic Badge Icon -->
      <g transform="translate(180, 75)">
        <polygon points="20,0 26,14 40,16 29,26 32,40 20,32 8,40 11,26 0,16 14,14" fill="%23EA580C"/>
      </g>
    </svg>`,
  },
  {
    name: 'Monza Stradale V12',
    description: 'A purebred naturally-aspirated V12 Italian supercar tuned for the track, featuring race-derived suspension and aerodynamic vents.',
    rarity: 'Legendary',
    attributes: [
      { trait_type: 'Class', value: 'Supercar' },
      { trait_type: 'Top Speed', value: '385 km/h' },
      { trait_type: 'Horsepower', value: 1120 },
      { trait_type: '0-100 km/h', value: '2.5s' },
      { trait_type: 'Handling', value: 96 },
      { trait_type: 'Rarity', value: 'Legendary' },
    ],
    svgArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="legGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%23FEF3C7"/>
          <stop offset="60%" stop-color="%23FDE68A"/>
          <stop offset="100%" stop-color="%23D97706" stop-opacity="0.15"/>
        </radialGradient>
        <linearGradient id="monzaYellow" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="%23F59E0B"/>
          <stop offset="60%" stop-color="%23D97706"/>
          <stop offset="100%" stop-color="%23B45309"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23legGlow)"/>
      <circle cx="200" cy="190" r="125" stroke="%23D97706" stroke-width="1.5" stroke-dasharray="10 6" fill="none" opacity="0.35"/>
      <!-- Track speed arcs -->
      <path d="M30 290 Q200 320 370 290" stroke="%23D97706" stroke-width="2" fill="none" opacity="0.3"/>
      <!-- Car Body: Sleek Italian Wedge Profile -->
      <!-- Rear Ducktail Spoiler -->
      <path d="M75 190 Q90 175 110 185 L95 200 Z" fill="%23B45309"/>
      <!-- Main Chassis -->
      <path d="M70 230 L85 195 L140 185 L200 155 L275 160 L330 200 L355 225 L350 235 L320 235 L300 215 L265 215 L245 235 L155 235 L135 215 L100 215 L80 235 Z" fill="url(%23monzaYellow)"/>
      <!-- Tinted Glass Canopy -->
      <path d="M195 160 L268 165 L298 198 L165 198 Z" fill="%230F172A"/>
      <path d="M205 165 L260 170 L285 193 L180 193 Z" fill="%2360A5FA" opacity="0.8"/>
      <!-- Side Air Intake Scoop -->
      <polygon points="160,205 210,202 205,215 155,215" fill="%2378350F"/>
      <!-- High Intensity Headlight -->
      <polygon points="330,210 348,222 334,226" fill="%23FEF08A"/>
      <!-- Wheels (Forged Gold Multi-Spoke) -->
      <!-- Rear Wheel -->
      <circle cx="118" cy="235" r="28" fill="%231E293B" stroke="%23FDE68A" stroke-width="2.5"/>
      <circle cx="118" cy="235" r="16" fill="%23F59E0B"/>
      <circle cx="118" cy="235" r="7" fill="%231E293B"/>
      <!-- Front Wheel -->
      <circle cx="282" cy="235" r="28" fill="%231E293B" stroke="%23FDE68A" stroke-width="2.5"/>
      <circle cx="282" cy="235" r="16" fill="%23F59E0B"/>
      <circle cx="282" cy="235" r="7" fill="%231E293B"/>
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="268" rx="145" ry="11" fill="%2394A3B8" opacity="0.4"/>
      <!-- Legendary Crown Icon -->
      <g transform="translate(182, 80)">
        <polygon points="0,25 6,5 16,18 26,5 32,25" fill="%23D97706"/>
      </g>
    </svg>`,
  },
  {
    name: 'Kyoto Midnight R-Spec',
    description: 'A legendary twin-turbocharged Japanese sports coupe built for mountain drift passes with high-revving all-wheel-drive precision.',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Class', value: 'JDM Tuner' },
      { trait_type: 'Top Speed', value: '335 km/h' },
      { trait_type: 'Horsepower', value: 880 },
      { trait_type: 'Drift Rating', value: 95 },
      { trait_type: 'Turbo Stage', value: 'Stage 3 Twin' },
      { trait_type: 'Rarity', value: 'Epic' },
    ],
    svgArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="epicGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%23F5F3FF"/>
          <stop offset="60%" stop-color="%23EDE9FE"/>
          <stop offset="100%" stop-color="%237C3AED" stop-opacity="0.15"/>
        </radialGradient>
        <linearGradient id="jdmViolet" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="%238B5CF6"/>
          <stop offset="50%" stop-color="%236D28D9"/>
          <stop offset="100%" stop-color="%234C1D95"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23epicGlow)"/>
      <!-- Drift smoke trails & grid -->
      <path d="M40 280 Q160 260 360 280" stroke="%238B5CF6" stroke-width="1.5" stroke-dasharray="6 4" fill="none" opacity="0.4"/>
      <!-- High GT Rear Spoiler -->
      <path d="M70 170 L115 170 L118 185 L85 185 Z" fill="%234C1D95"/>
      <line x1="80" y1="170" x2="80" y2="200" stroke="%234C1D95" stroke-width="3"/>
      <!-- Car Body: Classic JDM Coupe Silhouette -->
      <path d="M65 230 L80 200 L140 195 L180 160 L275 160 L315 200 L355 210 L355 235 L325 235 L305 215 L265 215 L245 235 L155 235 L135 215 L95 215 L75 235 Z" fill="url(%23jdmViolet)"/>
      <!-- Windows & Pillars -->
      <path d="M185 165 L268 165 L300 198 L155 198 Z" fill="%231E1B4B"/>
      <path d="M195 170 L260 170 L288 193 L170 193 Z" fill="%23C084FC" opacity="0.8"/>
      <!-- Neon Underglow Accent -->
      <ellipse cx="200" cy="245" rx="120" ry="4" fill="%23A855F7" opacity="0.6"/>
      <!-- Wheels (Deep Dish Bronze Rims) -->
      <!-- Rear Wheel -->
      <circle cx="115" cy="235" r="28" fill="%230F172A" stroke="%23D97706" stroke-width="2"/>
      <circle cx="115" cy="235" r="16" fill="%2392400E"/>
      <circle cx="115" cy="235" r="6" fill="%23FEF3C7"/>
      <!-- Front Wheel -->
      <circle cx="285" cy="235" r="28" fill="%230F172A" stroke="%23D97706" stroke-width="2"/>
      <circle cx="285" cy="235" r="16" fill="%2392400E"/>
      <circle cx="285" cy="235" r="6" fill="%23FEF3C7"/>
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="268" rx="145" ry="11" fill="%2394A3B8" opacity="0.4"/>
      <!-- Diamond Epic Glyph -->
      <g transform="translate(185, 80)">
        <polygon points="15,0 30,15 15,30 0,15" fill="%237C3AED"/>
      </g>
    </svg>`,
  },
  {
    name: 'Spectre Cyber GT EV',
    description: 'A revolutionary all-electric grand tourer boasting instant torque vectoring, solid-state battery architecture, and active aero fins.',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Class', value: 'Electric GT' },
      { trait_type: 'Top Speed', value: '350 km/h' },
      { trait_type: '0-100 km/h', value: '1.9s' },
      { trait_type: 'Torque', value: '1600 Nm' },
      { trait_type: 'Range', value: '620 km' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
    svgArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="rareGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%23F0F9FF"/>
          <stop offset="60%" stop-color="%23E0F2FE"/>
          <stop offset="100%" stop-color="%230284C7" stop-opacity="0.15"/>
        </radialGradient>
        <linearGradient id="cyberCyan" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="%2338BDF8"/>
          <stop offset="60%" stop-color="%230284C7"/>
          <stop offset="100%" stop-color="%230369A1"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23rareGlow)"/>
      <circle cx="200" cy="190" r="125" stroke="%230284C7" stroke-width="1.5" stroke-dasharray="8 6" fill="none" opacity="0.35"/>
      <!-- Cyber Circuit Lines -->
      <path d="M50 140 L120 140 L150 170" stroke="%2338BDF8" stroke-width="1.5" fill="none" opacity="0.5"/>
      <path d="M350 140 L280 140 L250 170" stroke="%2338BDF8" stroke-width="1.5" fill="none" opacity="0.5"/>
      <!-- Futuristic Smooth Aero Body -->
      <path d="M70 230 L85 195 L145 185 L210 155 L285 158 L335 195 L360 220 L350 235 L320 235 L300 215 L260 215 L240 235 L160 235 L140 215 L100 215 L80 235 Z" fill="url(%23cyberCyan)"/>
      <!-- Panoramic Full Glass Dome -->
      <path d="M190 158 L275 162 L305 195 L150 195 Z" fill="%230C4A6E"/>
      <path d="M200 162 L268 166 L295 190 L165 190 Z" fill="%237DD3FC" opacity="0.85"/>
      <!-- Laser Lightbar Across Front -->
      <line x1="330" y1="210" x2="358" y2="220" stroke="%23E0F2FE" stroke-width="3"/>
      <!-- Aero Turbine Wheels -->
      <!-- Rear Wheel -->
      <circle cx="120" cy="235" r="28" fill="%230F172A" stroke="%2338BDF8" stroke-width="2.5"/>
      <circle cx="120" cy="235" r="16" fill="%230284C7"/>
      <circle cx="120" cy="235" r="7" fill="%23E0F2FE"/>
      <!-- Front Wheel -->
      <circle cx="280" cy="235" r="28" fill="%230F172A" stroke="%2338BDF8" stroke-width="2.5"/>
      <circle cx="280" cy="235" r="16" fill="%230284C7"/>
      <circle cx="280" cy="235" r="7" fill="%23E0F2FE"/>
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="268" rx="145" ry="11" fill="%2394A3B8" opacity="0.4"/>
      <!-- Rare Electric Bolt Glyph -->
      <g transform="translate(188, 80)">
        <polygon points="12,0 0,16 10,16 6,28 20,12 10,12" fill="%230284C7"/>
      </g>
    </svg>`,
  },
  {
    name: 'Baja Dune Predator 4x4',
    description: 'A purpose-built off-road desert trophy truck equipped with long-travel shock reservoirs, beadlock rims, and reinforced roll cage.',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Class', value: 'Off-Road' },
      { trait_type: 'Horsepower', value: 750 },
      { trait_type: 'Torque', value: '980 Nm' },
      { trait_type: 'Suspension', value: '32-inch Fox Racing' },
      { trait_type: 'Durability', value: 98 },
      { trait_type: 'Rarity', value: 'Uncommon' },
    ],
    svgArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="uncomGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%23ECFDF5"/>
          <stop offset="60%" stop-color="%23D1FAE5"/>
          <stop offset="100%" stop-color="%23059669" stop-opacity="0.15"/>
        </radialGradient>
        <linearGradient id="bajaGreen" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="%2310B981"/>
          <stop offset="60%" stop-color="%23059669"/>
          <stop offset="100%" stop-color="%23047857"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23uncomGlow)"/>
      <!-- Top Roof Lightbar -->
      <rect x="180" y="140" width="70" height="6" rx="2" fill="%23FBBF24"/>
      <!-- Roll Cage & Heavy Trophy Chassis -->
      <path d="M100 170 L170 148 L260 148 L310 180 L350 200 L345 220 L315 220 L295 195 L255 195 L235 220 L165 220 L145 195 L105 195 L85 220 L75 220 L75 195 Z" fill="url(%23bajaGreen)"/>
      <!-- Cockpit Window -->
      <polygon points="180,154 250,154 285,185 170,185" fill="%23064E3B"/>
      <!-- Heavy Exposed Suspension Coilovers -->
      <line x1="125" y1="195" x2="125" y2="235" stroke="%23F59E0B" stroke-width="4"/>
      <line x1="275" y1="195" x2="275" y2="235" stroke="%23F59E0B" stroke-width="4"/>
      <!-- Huge Knobby Off-Road Tires -->
      <!-- Rear Tire -->
      <circle cx="125" cy="235" r="34" fill="%231F2937" stroke="%234B5563" stroke-width="3"/>
      <circle cx="125" cy="235" r="18" fill="%2310B981"/>
      <circle cx="125" cy="235" r="8" fill="%231F2937"/>
      <!-- Front Tire -->
      <circle cx="275" cy="235" r="34" fill="%231F2937" stroke="%234B5563" stroke-width="3"/>
      <circle cx="275" cy="235" r="18" fill="%2310B981"/>
      <circle cx="275" cy="235" r="8" fill="%231F2937"/>
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="275" rx="150" ry="12" fill="%2394A3B8" opacity="0.4"/>
      <!-- Shield Glyph -->
      <g transform="translate(186, 80)">
        <polygon points="14,0 28,6 28,18 14,28 0,18 0,6" fill="%23059669"/>
      </g>
    </svg>`,
  },
  {
    name: 'Velocity Sprint RS',
    description: 'An agile, featherweight hot-hatch track day contender engineered with quick-ratio steering and turbocharged punch.',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Class', value: 'Hot Hatch' },
      { trait_type: 'Horsepower', value: 340 },
      { trait_type: '0-100 km/h', value: '4.2s' },
      { trait_type: 'Weight', value: '1,120 kg' },
      { trait_type: 'Agility', value: 86 },
      { trait_type: 'Rarity', value: 'Common' },
    ],
    svgArt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="comGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="%23F8FAFC"/>
          <stop offset="60%" stop-color="%23F1F5F9"/>
          <stop offset="100%" stop-color="%2364748B" stop-opacity="0.15"/>
        </radialGradient>
        <linearGradient id="hatchSilver" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="%2364748B"/>
          <stop offset="60%" stop-color="%23475569"/>
          <stop offset="100%" stop-color="%23334155"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(%23comGlow)"/>
      <!-- Hatchback Body Profile -->
      <!-- Small Roof Spoiler -->
      <path d="M85 168 L115 168 L110 178 L90 178 Z" fill="%231E293B"/>
      <!-- Body -->
      <path d="M85 230 L95 190 L140 185 L180 160 L260 160 L305 190 L345 205 L345 230 L315 230 L295 210 L255 210 L235 230 L160 230 L140 210 L105 210 L85 230 Z" fill="url(%23hatchSilver)"/>
      <!-- Windows -->
      <path d="M185 166 L255 166 L288 190 L135 190 Z" fill="%230F172A"/>
      <path d="M192 170 L248 170 L275 188 L145 188 Z" fill="%2394A3B8" opacity="0.8"/>
      <!-- Wheels -->
      <!-- Rear Wheel -->
      <circle cx="122" cy="230" r="26" fill="%230F172A" stroke="%23CBD5E1" stroke-width="2"/>
      <circle cx="122" cy="230" r="14" fill="%2364748B"/>
      <circle cx="122" cy="230" r="6" fill="%23F8FAFC"/>
      <!-- Front Wheel -->
      <circle cx="275" cy="230" r="26" fill="%230F172A" stroke="%23CBD5E1" stroke-width="2"/>
      <circle cx="275" cy="230" r="14" fill="%2364748B"/>
      <circle cx="275" cy="230" r="6" fill="%23F8FAFC"/>
      <!-- Ground Shadow -->
      <ellipse cx="200" cy="262" rx="140" ry="10" fill="%2394A3B8" opacity="0.4"/>
      <!-- Common Circle Glyph -->
      <g transform="translate(188, 80)">
        <circle cx="12" cy="12" r="12" fill="%2364748B"/>
      </g>
    </svg>`,
  },
];

// Initial demo collectible car cards for marketplace gallery
export const INITIAL_DEMO_CARDS: CardItem[] = [
  {
    tokenId: 1,
    tokenURI: 'ipfs://bafkreiapxgtvulcan10001/metadata.json',
    name: 'Apex Vulcan Hyper-GT',
    description: PRESET_CARDS[0].description,
    image: PRESET_CARDS[0].svgArt,
    rarity: 'Mythic',
    attributes: PRESET_CARDS[0].attributes,
    owner: '0x7A3c8E24D9841C52bF1264B3dC97A671e360491F',
    seller: '0x7A3c8E24D9841C52bF1264B3dC97A671e360491F',
    price: '0.25',
    isListed: true,
    history: [
      {
        id: 'act-1-1',
        type: 'Mint',
        from: '0x0000000000000000000000000000000000000000',
        to: '0x7A3c8E24D9841C52bF1264B3dC97A671e360491F',
        timestamp: Date.now() - 86400000 * 3,
        txHash: '0x8f23c91d4e1258a64119da988972b901fc45b3a1a9e887d12f30b911c471a41c',
      },
      {
        id: 'act-1-2',
        type: 'List',
        from: '0x7A3c8E24D9841C52bF1264B3dC97A671e360491F',
        price: '0.25',
        timestamp: Date.now() - 86400000 * 1,
        txHash: '0x12c478a83b4c919d77f09801452da61bb0e2920fba02239d5e3381a17f99b241',
      },
    ],
  },
  {
    tokenId: 2,
    tokenURI: 'ipfs://bafkreimonstradav120002/metadata.json',
    name: 'Monza Stradale V12',
    description: PRESET_CARDS[1].description,
    image: PRESET_CARDS[1].svgArt,
    rarity: 'Legendary',
    attributes: PRESET_CARDS[1].attributes,
    owner: '0x32A44B3654E7b8B390098F3920a4b7B99214E902',
    seller: '0x32A44B3654E7b8B390098F3920a4b7B99214E902',
    price: '0.15',
    isListed: true,
    history: [
      {
        id: 'act-2-1',
        type: 'Mint',
        from: '0x0000000000000000000000000000000000000000',
        to: '0x32A44B3654E7b8B390098F3920a4b7B99214E902',
        timestamp: Date.now() - 86400000 * 4,
      },
      {
        id: 'act-2-2',
        type: 'List',
        from: '0x32A44B3654E7b8B390098F3920a4b7B99214E902',
        price: '0.15',
        timestamp: Date.now() - 86400000 * 1,
      },
    ],
  },
  {
    tokenId: 3,
    tokenURI: 'ipfs://bafkreikyotomidnight0003/metadata.json',
    name: 'Kyoto Midnight R-Spec',
    description: PRESET_CARDS[2].description,
    image: PRESET_CARDS[2].svgArt,
    rarity: 'Epic',
    attributes: PRESET_CARDS[2].attributes,
    owner: '0xA4F88123985B129c78D0b5B8E29910C35B913219',
    seller: '0xA4F88123985B129c78D0b5B8E29910C35B913219',
    price: '0.08',
    isListed: true,
  },
  {
    tokenId: 4,
    tokenURI: 'ipfs://bafkreispectrecybergt0004/metadata.json',
    name: 'Spectre Cyber GT EV',
    description: PRESET_CARDS[3].description,
    image: PRESET_CARDS[3].svgArt,
    rarity: 'Rare',
    attributes: PRESET_CARDS[3].attributes,
    owner: '0x88D39210B8C895743bF564F7E21c17e088D55C1',
    seller: '0x88D39210B8C895743bF564F7E21c17e088D55C1',
    price: '0.045',
    isListed: true,
  },
  {
    tokenId: 5,
    tokenURI: 'ipfs://bafkreibajadunepred0005/metadata.json',
    name: 'Baja Dune Predator 4x4',
    description: PRESET_CARDS[4].description,
    image: PRESET_CARDS[4].svgArt,
    rarity: 'Uncommon',
    attributes: PRESET_CARDS[4].attributes,
    owner: '0xF09281938b8C09eF14674BcB52744B9E090F11AA',
    seller: '0xF09281938b8C09eF14674BcB52744B9E090F11AA',
    price: '0.02',
    isListed: true,
  },
  {
    tokenId: 6,
    tokenURI: 'ipfs://bafkreivelocitysprint0006/metadata.json',
    name: 'Velocity Sprint RS',
    description: PRESET_CARDS[5].description,
    image: PRESET_CARDS[5].svgArt,
    rarity: 'Common',
    attributes: PRESET_CARDS[5].attributes,
    owner: '0x99B3219488eB321798319D8F19028a6f698444EF',
    seller: '0x99B3219488eB321798319D8F19028a6f698444EF',
    price: '0.008',
    isListed: true,
  },
];

