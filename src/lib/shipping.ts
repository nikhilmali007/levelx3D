export type ShippingZone = 'local' | 'regional' | 'national' | 'remote';

export interface ShippingRate {
  zone: ShippingZone;
  zoneName: string;
  standardRate: number;     // in INR
  expressRate: number;      // in INR  
  standardDays: string;     // e.g. '3-5 business days'
  expressDays: string;      // e.g. '1-2 business days'
  freeThreshold: number;    // order value for free shipping in that zone
}

export function getShippingZone(pincode: string): ShippingZone {
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return 'national'; // Default to national if invalid or not yet complete
  }
  
  const num = parseInt(pincode, 10);
  const prefix2 = pincode.substring(0, 2);

  // Remote: J&K, Ladakh, NE states, Andaman/Nicobar
  if (
    pincode.startsWith('18') || 
    pincode.startsWith('19') || 
    pincode.startsWith('78') || 
    pincode.startsWith('79') || 
    pincode.startsWith('744') ||
    pincode.startsWith('79')
  ) {
    return 'remote';
  }

  // Local: Mumbai metro area (PIN 400xxx–410xxx)
  if (num >= 400000 && num <= 410999) {
    return 'local';
  }

  // Regional: Maharashtra + nearby states (Goa, Karnataka, Gujarat, MP)
  if (
    (num >= 411000 && num <= 449999) || // Rest of MH
    prefix2 === '40' ||                 // Goa (403xxx)
    (parseInt(prefix2, 10) >= 56 && parseInt(prefix2, 10) <= 59) || // Karnataka
    (parseInt(prefix2, 10) >= 36 && parseInt(prefix2, 10) <= 39) || // Gujarat
    (parseInt(prefix2, 10) >= 45 && parseInt(prefix2, 10) <= 48)    // MP
  ) {
    return 'regional';
  }

  // National: Rest of India mainland
  return 'national';
}

export function getShippingRate(pincode: string): ShippingRate {
  const zone = getShippingZone(pincode);
  
  switch (zone) {
    case 'local':
      return {
        zone: 'local',
        zoneName: 'Local',
        standardRate: 0,
        expressRate: 99,
        standardDays: '1-2 business days',
        expressDays: 'Same day',
        freeThreshold: 1000,
      };
    case 'regional':
      return {
        zone: 'regional',
        zoneName: 'Regional',
        standardRate: 99,
        expressRate: 199,
        standardDays: '3-5 business days',
        expressDays: '1-2 business days',
        freeThreshold: 3000,
      };
    case 'remote':
      return {
        zone: 'remote',
        zoneName: 'Remote',
        standardRate: 249,
        expressRate: 449,
        standardDays: '7-10 business days',
        expressDays: '3-5 business days',
        freeThreshold: 7000,
      };
    case 'national':
    default:
      return {
        zone: 'national',
        zoneName: 'National',
        standardRate: 149,
        expressRate: 299,
        standardDays: '5-7 business days',
        expressDays: '2-3 business days',
        freeThreshold: 5000,
      };
  }
}

export function calculateShipping(pincode: string, orderSubtotal: number, isExpress: boolean = false): { cost: number; isFree: boolean; deliveryEstimate: string; zone: ShippingZone; zoneName: string } {
  const rate = getShippingRate(pincode);
  
  let cost = isExpress ? rate.expressRate : rate.standardRate;
  
  // Apply free shipping logic for standard based on threshold
  if (!isExpress && orderSubtotal >= rate.freeThreshold) {
    cost = 0;
  }

  return {
    cost,
    isFree: cost === 0,
    deliveryEstimate: isExpress ? rate.expressDays : rate.standardDays,
    zone: rate.zone,
    zoneName: rate.zoneName
  };
}
