'use client';

import { usePathname } from 'next/navigation';
import { PhoneCall } from 'lucide-react';
import { getDispatchPhone } from '@/config/dispatch';

function useCurrentDispatchPhone() {
  const pathname = usePathname() || '';
  let service: string | undefined = undefined;
  if (pathname.startsWith('/roof-repair')) {
    service = 'roof-repair';
  } else if (pathname.startsWith('/pest-control')) {
    service = 'pest-control';
  } else if (pathname.startsWith('/water-damage')) {
    service = 'water-damage';
  }
  return {
    phone: getDispatchPhone(service),
    service: service || 'water-damage',
  };
}

export function HeaderCallButton() {
  const { phone, service } = useCurrentDispatchPhone();

  return (
    <a 
      href={phone.raw}
      data-tracking="call-btn"
      data-niche={service}
      className="flex items-center gap-2.5 bg-[#009b55] hover:bg-[#00874a] text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-700/15 transition transform active:scale-95"
    >
      <PhoneCall className="w-4 h-4 animate-bounce" />
      <div className="text-left">
        <span className="block text-[10px] uppercase tracking-wider text-emerald-100 font-medium">24/7 Dispatch*</span>
        <span className="text-sm font-black tracking-wide">{phone.display}</span>
      </div>
    </a>
  );
}

export function FooterCallLink() {
  const { phone, service } = useCurrentDispatchPhone();

  return (
    <a 
      href={phone.raw} 
      data-tracking="call-btn" 
      data-niche={service}
      className="inline-block text-slate-900 font-mono font-bold text-lg hover:text-blue-700 transition"
    >
      {phone.display}
    </a>
  );
}
