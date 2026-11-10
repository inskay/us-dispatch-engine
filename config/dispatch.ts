export const SERVICE_DISPATCH_NUMBERS: Record<string, { display: string; raw: string }> = {
  // 1. Water Damage & Mold Remediation (Dedicated MarketCall Campaign)
  'water-damage': {
    display: '(855) 365-0257',
    raw: 'tel:8553650257',
  },
  'mold-remediation': {
    display: '(855) 365-0257',
    raw: 'tel:8553650257',
  },

  // 2. Emergency Roof Repair (Dedicated MarketCall Campaign)
  'roof-repair': {
    display: '(855) 365-0334',
    raw: 'tel:8553650334',
  },

  // 3. Emergency Pest Control (Fallback until dedicated line assigned)
  'pest-control': {
    display: '(800) 555-0199',
    raw: 'tel:+18005550199',
  },

  // Default number for Root/Home page ('/') and fallback (MarketCall Water Damage)
  'default': {
    display: '(855) 365-0257',
    raw: 'tel:8553650257',
  }
};

export function getServiceFromPath(pathOrService?: string): string | undefined {
  if (!pathOrService) return undefined;
  if (pathOrService.includes('roof-repair')) return 'roof-repair';
  if (pathOrService.includes('pest-control')) return 'pest-control';
  if (pathOrService.includes('water-damage') || pathOrService.includes('mold-remediation')) return 'water-damage';
  return undefined;
}

export function getDispatchPhone(service?: string): { display: string; raw: string } {
  if (!service) return SERVICE_DISPATCH_NUMBERS['default'];
  const detected = getServiceFromPath(service) || service;
  return SERVICE_DISPATCH_NUMBERS[detected] || SERVICE_DISPATCH_NUMBERS['default'];
}
