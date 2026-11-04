export const SERVICE_DISPATCH_NUMBERS: Record<string, { display: string; raw: string }> = {
  // 1. مسار أضرار المياه والعفن (الحملة الحالية 359978)
  'water-damage': {
    display: '(888) 217-8367',
    raw: 'tel:+18882178367',
  },
  'mold-remediation': {
    display: '(888) 217-8367',
    raw: 'tel:+18882178367',
  },

  // 2. مسار إصلاح الأسقف (نربطه فور تفعيل حملة Roofing)
  'roof-repair': {
    display: '(800) 555-0199', // مؤقت حتى استخراج رقم الـ Roofing المخصص
    raw: 'tel:+18005550199',
  },

  // 3. مسار مكافحة الحشرات
  'pest-control': {
    display: '(800) 555-0199', // مؤقت حتى استخراج رقم الـ Pest Control
    raw: 'tel:+18005550199',
  },

  // الرقم الافتراضي للصفحة الرئيسية وباقي الأقسام
  'default': {
    display: '(888) 217-8367',
    raw: 'tel:+18882178367',
  }
};

export function getDispatchPhone(service?: string): { display: string; raw: string } {
  if (!service) return SERVICE_DISPATCH_NUMBERS['default'];
  return SERVICE_DISPATCH_NUMBERS[service] || SERVICE_DISPATCH_NUMBERS['default'];
}
