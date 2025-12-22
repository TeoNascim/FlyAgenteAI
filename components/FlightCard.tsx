
import React from 'react';
import { FlightDeal } from '../types';
import { Plane, CreditCard, Star, ExternalLink, Info } from 'lucide-react';

interface FlightCardProps {
  deal: FlightDeal;
}

export const FlightCard: React.FC<FlightCardProps> = ({ deal }) => {
  const getBadge = () => {
    switch (deal.type) {
      case 'cheapest_cash':
        return { label: 'Mais Barata (Dinheiro)', color: 'bg-green-100 text-green-700', icon: <CreditCard size={16} /> };
      case 'cheapest_miles':
        return { label: 'Mais Barata (Milhas)', color: 'bg-blue-100 text-blue-700', icon: <Star size={16} /> };
      case 'most_expensive':
        return { label: 'Tarifa Premium / Mais Cara', color: 'bg-amber-100 text-amber-700', icon: <Plane size={16} /> };
      default:
        return { label: 'Oferta', color: 'bg-slate-100 text-slate-700', icon: <Info size={16} /> };
    }
  };

  const badge = getBadge();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className={`px-4 py-2 flex items-center gap-2 font-semibold text-xs uppercase tracking-wider ${badge.color}`}>
        {badge.icon}
        {badge.label}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{deal.price}</h3>
            <p className="text-sm text-slate-500 font-medium">{deal.airline}</p>
          </div>
          <div className="text-right">
             {deal.isTotalWithTaxes && (
               <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-600 font-bold">TOTAL C/ TAXAS</span>
             )}
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 leading-relaxed italic">
          "{deal.description}"
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Como Comprar:</h4>
          <p className="text-sm text-slate-700">{deal.howToBuy}</p>
        </div>

        <a 
          href={deal.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors duration-200"
        >
          Ver Passagem no Site
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
};
