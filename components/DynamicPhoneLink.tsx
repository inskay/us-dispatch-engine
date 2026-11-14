'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
    isWaterDamage: pathname.startsWith('/water-damage'),
    isRoofRepair: pathname.startsWith('/roof-repair'),
    isPestControl: pathname.startsWith('/pest-control'),
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

export function DynamicHeaderNav() {
  const { isWaterDamage, isRoofRepair, isPestControl } = useCurrentDispatchPhone();

  if (isWaterDamage) {
    return (
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link href="/water-damage" className="hover:text-blue-700 transition">Water Damage Mitigation</Link>
      </nav>
    );
  }

  if (isRoofRepair) {
    return (
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link href="/roof-repair" className="hover:text-blue-700 transition">Roof Replacement</Link>
      </nav>
    );
  }

  if (isPestControl) {
    return (
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <Link href="/pest-control" className="hover:text-blue-700 transition">Pest Control</Link>
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
      <Link href="/water-damage" className="hover:text-blue-700 transition">Water Damage</Link>
      <Link href="/pest-control" className="hover:text-blue-700 transition">Pest Control</Link>
      <Link href="/roof-repair" className="hover:text-blue-700 transition">Roof Replacement</Link>
    </nav>
  );
}

export function DynamicFooterServices() {
  const { isWaterDamage, isRoofRepair, isPestControl } = useCurrentDispatchPhone();

  return (
    <div>
      <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Emergency Services</h4>
      <ul className="space-y-2.5 text-xs">
        {isWaterDamage ? (
          <li><Link href="/water-damage" className="hover:text-blue-700 transition text-slate-600">Water Extraction &amp; Structural Drying</Link></li>
        ) : isRoofRepair ? (
          <li><Link href="/roof-repair" className="hover:text-blue-700 transition text-slate-600">Residential Roof Replacement &amp; Installation</Link></li>
        ) : isPestControl ? (
          <li><Link href="/pest-control" className="hover:text-blue-700 transition text-slate-600">Emergency Pest Extermination</Link></li>
        ) : (
          <>
            <li><Link href="/water-damage" className="hover:text-blue-700 transition text-slate-600">Water Extraction &amp; Flood Cleanup</Link></li>
            <li><Link href="/pest-control" className="hover:text-blue-700 transition text-slate-600">Emergency Pest Extermination</Link></li>
            <li><Link href="/roof-repair" className="hover:text-blue-700 transition text-slate-600">Residential Roof Replacement &amp; Installation</Link></li>
          </>
        )}
      </ul>
    </div>
  );
}
