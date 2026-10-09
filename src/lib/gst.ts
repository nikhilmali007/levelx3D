export interface GSTBreakdown {
  gstRate: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  isInterState: boolean;
  subtotalBeforeGst: number;
  hsnCode: string;
}

/**
 * Calculates GST breakdown for an MRP-inclusive price.
 * 
 * @param subtotalInr The MRP total including GST
 * @param state The buyer's state
 * @param sellerState The seller's state (default: 'Maharashtra')
 * @returns GSTBreakdown object
 */
export function calculateGST(subtotalInr: number, state: string, sellerState: string = 'Maharashtra'): GSTBreakdown {
  const gstRate = 0.18; // 18% standard rate for 3D printed objects
  const hsnCode = '3926'; // Plastic articles / 3D prints
  
  // Reverse calculate: MRP = BasePrice + GST
  // MRP = BasePrice * (1 + 0.18)
  // BasePrice = MRP / 1.18
  const subtotalBeforeGst = subtotalInr / (1 + gstRate);
  const gstAmount = subtotalInr - subtotalBeforeGst;
  
  // Normalize states for comparison
  const normalize = (s: string) => s.trim().toLowerCase();
  const isInterState = normalize(state) !== normalize(sellerState);
  
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  
  if (isInterState) {
    igst = gstAmount;
  } else {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  }
  
  return {
    gstRate,
    gstAmount,
    cgst,
    sgst,
    igst,
    isInterState,
    subtotalBeforeGst,
    hsnCode
  };
}
