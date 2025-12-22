
import React from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid';
}

export const AdUnit: React.FC<AdUnitProps> = ({ slot, format = 'auto' }) => {
  return (
    <div className="my-10 w-full overflow-hidden flex flex-col items-center">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Publicidade</span>
      <div className="w-full bg-slate-50 border border-slate-100 rounded-[32px] flex items-center justify-center min-h-[250px] relative">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client="ca-pub-0000000000000000"
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-slate-300 animate-spin mb-4"></div>
          <span className="text-[10px] font-bold text-slate-300">Google AdSense Placeholder</span>
        </div>
      </div>
    </div>
  );
};
