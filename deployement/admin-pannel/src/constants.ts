import { Address } from 'viem';

export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as Address;
export const INFURA_URL = import.meta.env.VITE_INFURA_URL;
export const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
export const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

export const MINT_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' }
    ],
    outputs: [],
  },
  {
    name: 'nextTokenId',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    name: 'setBaseURI',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'newBaseURI', type: 'string' }],
    outputs: [],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    outputs: [],
  },
  {
    name: 'getApproved',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'setApprovalForAll',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' }
    ],
    outputs: [],
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' }
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    outputs: [],
  },
] as const;

export const BACKGROUNDS = [
  { value: 'Light Blue', rarity: 'Common' },
  { value: 'Dark Gray', rarity: 'Uncommon' },
  { value: 'Soft Pastel Gradient (Pink and Orange)', rarity: 'Common' },
  { value: 'Matrix-Grid with neon green lines', rarity: 'Rare' },
  { value: 'Minimalist Tokyo Night (Deep Blue with blurred lights)', rarity: 'Uncommon' }
];

export const DECALS = [
  { value: 'Full Circuit Board geometric lines', rarity: 'Common' },
  { value: 'Splatter-Only paint effect', rarity: 'Uncommon' },
  { value: 'Combination of circuit lines and splatters', rarity: 'Common' },
  { value: 'Strict "42" geometric patterns', rarity: 'Rare' },
  { value: 'Racing Stripes (Double white lines over the hood)', rarity: 'Common' },
  { value: 'Geometric Hexagon honeycomb pattern', rarity: 'Uncommon' }
];

export const ACCESSORIES = [
  { value: 'Yellow Safety Belt around the mirror', rarity: 'Common' },
  { value: 'Monster Teeth Grill on the front bumper', rarity: 'Uncommon' },
  { value: 'Laser Headlights with glowing beams', rarity: 'Rare' },
  { value: 'Roof-mounted GPU Fan spinning', rarity: 'Rare' },
  { value: 'Carbon Fiber hood texture', rarity: 'Uncommon' },
  { value: 'Small paws printed on the wheels', rarity: 'Common' },
  { value: 'Cyberpunk antenna with data packets', rarity: 'Uncommon' },
  { value: 'Pixelated sunglasses on the headlights', rarity: 'Rare' },
  { value: 'Pizza delivery box on the roof', rarity: 'Common' },
  { value: 'Underglow Neon Kit (Pink)', rarity: 'Rare' }
];

export const EASTER_EGGS = [
  { value: 'Tiny Pixelated Duck on the dashboard', rarity: 'Legendary' },
  { value: 'Golden key hanging from the door handle', rarity: 'Legendary' },
  { value: '"ERROR 404" text on the license plate', rarity: 'Legendary' },
  { value: 'Astronaut theme with a gold-tinted space helmet on the roof and lunar dust weathering', rarity: 'Legendary' },
  { value: 'Wild West Cowboy theme with a giant sheriff hat on the roof and rustic wooden textures', rarity: 'Legendary' },
  { value: 'Deep Sea Explorer theme with a scuba tank on the side and bubble decals', rarity: 'Legendary' },
  { value: 'Firefighter emergency edition with a red & white flashing light bar and hazard stripes', rarity: 'Legendary' },
  { value: 'Cyber-Samurai edition with a katana mounted on the side and glowing neon kanji decals', rarity: 'Legendary' },
  { value: 'Floating holographic "42" logo hovering above the hood with digital glitch particles', rarity: 'Legendary' },
  { value: 'Retro Gaming kit with a giant joystick sticking out of the window and 8-bit pixel textures', rarity: 'Legendary' },
  { value: 'Time Machine prototype with glowing blue flux-capacitor cables around the body', rarity: 'Legendary' },
  { value: 'Giant mechanical cat paws replacing the side mirrors', rarity: 'Legendary' },
  { value: 'Steampunk machinery with brass pipes and steam vents coming out of the wheel arches', rarity: 'Legendary' }
];
