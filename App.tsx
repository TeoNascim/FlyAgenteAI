
import React, { useState } from 'react';
import { Search, MapPin, Calendar, PlaneTakeoff, Loader2, Sparkles, Globe2, AlertCircle, CreditCard, Star, Link as LinkIcon, Users, Minus, Plus, ShieldCheck, Zap, HeartHandshake, HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Layers, X } from 'lucide-react';
import { FlightSearchQuery, SearchResponse } from './types';
import { searchFlightsWithAI } from './geminiService';
import { FlightCard } from './components/FlightCard';
import { AdUnit } from './components/AdUnit';

const App: React.FC = () => {
  const [query, setQuery] = useState<FlightSearchQuery>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const updatePassager = (type: 'adults' | 'children' | 'infants', delta: number) => {
    setQuery(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.origin || !query.destination || !query.departureDate) {
      setError("Por favor, informe a Origem, o Destino e a Data de Ida.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await searchFlightsWithAI(query);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Erro de varredura global. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVipPro = () => {
    alert("🚀 O acesso VIP PRO está em fase final de desenvolvimento! Em breve você terá alertas em tempo real e busca ilimitada.");
  };

  const faqs = [
    { q: "O FlyAgente AI realmente encontra o menor preço?", a: "Sim. Nosso agente utiliza inteligência artificial para comparar dados em tempo real de buscadores globais, companhias low-cost e bases de dados de milhas que buscadores convencionais muitas vezes não acessam simultaneamente." },
    { q: "Como funciona o preço para bebês e crianças?", a: "Nossa IA aplica automaticamente as regras tarifárias: bebês menores de 2 anos (lap child) costumam pagar apenas taxas ou 10% da tarifa, enquanto crianças de 2 a 11 anos podem ter descontos variados dependendo da companhia aérea." },
    { q: "O site é seguro para reservas?", a: "O FlyAgente AI é uma ferramenta de busca e inteligência. Nós direcionamos você para os sites oficiais e OTAs seguras onde o preço foi encontrado, garantindo total segurança na sua compra final." },
    { q: "Posso buscar passagens com milhas?", a: "Com certeza. Além do menor preço em dinheiro, nossa IA varre os principais programas de fidelidade (Smiles, TudoAzul, Latam Pass, etc) para sugerir a melhor forma de emissão." }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe]">
      {/* Modal Legal */}
      {legalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                {legalModal === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso'}
              </h2>
              <button onClick={() => setLegalModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto text-slate-600 space-y-6 font-medium leading-relaxed">
              {legalModal === 'privacy' ? (
                <>
                  <p className="font-bold text-slate-900">Sua privacidade é importante para nós no FlyAgente AI.</p>
                  <p>Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações ao utilizar nosso buscador de passagens aéreas.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">1. Coleta de Dados</h3>
                  <p>Coletamos informações básicas de busca (origem, destino, datas) para fornecer os melhores resultados de voos. Não armazenamos dados de cartões de crédito, pois todas as transações ocorrem nos sites das companhias aéreas ou agências parceiras.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">2. Google AdSense e Cookies</h3>
                  <p>Utilizamos cookies para personalizar anúncios via Google AdSense. O Google utiliza o cookie DART para veicular anúncios baseados em suas visitas a este e outros sites na internet.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">3. Links de Terceiros</h3>
                  <p>Nosso site contém links para sites externos. Não somos responsáveis pelo conteúdo ou práticas de privacidade desses sites.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">4. Segurança</h3>
                  <p>Implementamos medidas de segurança padrão da indústria para proteger as informações processadas em nossa plataforma.</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-900">Ao acessar o FlyAgente AI, você concorda com os seguintes Termos de Uso.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">1. Natureza do Serviço</h3>
                  <p>O FlyAgente AI é uma ferramenta de busca e comparação baseada em Inteligência Artificial. Não somos uma agência de viagens ou companhia aérea. Não vendemos passagens diretamente.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">2. Precisão dos Preços</h3>
                  <p>Os preços de passagens aéreas são dinâmicos e podem mudar em segundos. Embora nossa IA busque dados em tempo real, o preço final deve ser sempre conferido no site do fornecedor antes da compra.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">3. Isenção de Responsabilidade</h3>
                  <p>Não nos responsabilizamos por cancelamentos de voos, alterações de horários ou problemas ocorridos na reserva final feita em sites de terceiros.</p>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">4. Uso Permitido</h3>
                  <p>Este site deve ser usado apenas para fins pessoais e não comerciais. O uso de bots para raspagem de dados é estritamente proibido.</p>
                </>
              )}
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50 text-right">
              <button onClick={() => setLegalModal(null)} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest">Entendido</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <PlaneTakeoff className="text-white" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">FlyAgente <span className="text-indigo-600 italic">AI</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            <button onClick={() => scrollToSection('search')} className="hover:text-indigo-600 transition-colors uppercase">Buscar Passagens</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-indigo-600 transition-colors uppercase">Como Funciona</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-indigo-600 transition-colors uppercase">Dúvidas</button>
            <button 
              onClick={handleVipPro}
              className="bg-slate-900 text-white px-7 py-3 rounded-2xl hover:bg-indigo-600 transition-all font-bold shadow-xl active:scale-95 text-[10px] uppercase tracking-widest"
            >
              VIP PRO
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow hero-gradient">
        <section id="search" className="pt-16 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              A <span className="text-indigo-600">IA Especialista</span> em Passagens Aéreas Baratas
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Varredura profunda em tempo real para encontrar o menor preço absoluto da internet em qualquer companhia aérea do mundo.
            </p>
          </div>

          <div className="max-w-[1300px] mx-auto bg-white p-8 md:p-12 rounded-[48px] shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] border border-slate-50">
            <form onSubmit={handleSearch} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Origem <MapPin size={12} /></label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white transition-all">
                    <input type="text" placeholder="Qualquer lugar" className="bg-transparent border-none outline-none w-full text-slate-900 font-bold placeholder:text-slate-300" value={query.origin} onChange={(e) => setQuery({...query, origin: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Destino <Globe2 size={12} /></label>
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white transition-all">
                    <input type="text" placeholder="Para onde você vai?" className="bg-transparent border-none outline-none w-full text-slate-900 font-bold placeholder:text-slate-300" value={query.destination} onChange={(e) => setQuery({...query, destination: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Ida <Calendar size={12} /></label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5">
                    <input type="date" className="bg-transparent border-none outline-none w-full text-slate-900 font-bold cursor-pointer" value={query.departureDate} onChange={(e) => setQuery({...query, departureDate: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Volta <Calendar size={12} /></label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5">
                    <input type="date" className="bg-transparent border-none outline-none w-full text-slate-900 font-bold cursor-pointer" value={query.returnDate} onChange={(e) => setQuery({...query, returnDate: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Passageiros <Users size={12} /></label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex flex-col justify-center min-h-[80px]">
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-center justify-center border-r border-slate-200 pr-4 shrink-0">
                          <span className="text-[9px] font-black text-indigo-500 uppercase leading-none mb-1">Total</span>
                          <span className="text-xl font-black text-slate-900">{query.adults + query.children + query.infants}</span>
                       </div>
                       <div className="flex-grow space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-black text-slate-400 uppercase tracking-tighter">Adultos</span>
                            <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-100">
                              <button type="button" onClick={() => updatePassager('adults', -1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Minus size={12}/></button>
                              <span className="font-black text-slate-900 min-w-[12px] text-center">{query.adults}</span>
                              <button type="button" onClick={() => updatePassager('adults', 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Plus size={12}/></button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-black text-slate-400 uppercase tracking-tighter">2-11 anos</span>
                            <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-100">
                              <button type="button" onClick={() => updatePassager('children', -1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Minus size={12}/></button>
                              <span className="font-black text-slate-900 min-w-[12px] text-center">{query.children}</span>
                              <button type="button" onClick={() => updatePassager('children', 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Plus size={12}/></button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-black text-rose-500 uppercase tracking-tighter">Bebê (-2)</span>
                            <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-slate-100">
                              <button type="button" onClick={() => updatePassager('infants', -1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Minus size={12}/></button>
                              <span className="font-black text-slate-900 min-w-[12px] text-center">{query.infants}</span>
                              <button type="button" onClick={() => updatePassager('infants', 1)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Plus size={12}/></button>
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-4 py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black rounded-[32px] shadow-2xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.2em] text-sm">
                {loading ? <><Loader2 className="animate-spin" /> Varrendo Bases de Dados Globais...</> : <><Search size={24} /> Buscar Passagens Aéreas Baratas</>}
              </button>
            </form>
          </div>
        </section>

        {/* Resultados */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {error && (
            <div className="bg-red-50 border-2 border-red-100 rounded-[32px] p-10 flex items-start gap-6 mb-12">
              <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg"><AlertCircle size={24} /></div>
              <div><h3 className="text-red-900 font-black text-2xl mb-1">Atenção ao buscar passagens</h3><p className="text-red-700 font-medium text-lg">{error}</p></div>
            </div>
          )}

          {loading && !results && (
            <div className="text-center py-32">
              <div className="relative inline-block mb-12">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                <div className="relative bg-white p-14 rounded-[50px] shadow-inner border border-indigo-50">
                  <Sparkles className="text-indigo-600 animate-bounce" size={72} />
                </div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Localizando Preço Real...</h2>
              <p className="text-slate-400 max-w-md mx-auto font-bold text-xs uppercase tracking-[0.3em]">Analisando OTAs, voos low-cost e bases de milhas em tempo real.</p>
            </div>
          )}

          {results && (
            <div className="space-y-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter italic">
                    <Zap className="text-indigo-600 fill-indigo-600" size={28} /> Ofertas Encontradas
                  </h2>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 ml-10">Varredura profunda concluída</p>
                </div>
                <div className="hidden lg:flex gap-4">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-green-100"><CheckCircle2 size={14}/> Preços Finais</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {results.deals.map((deal, idx) => <FlightCard key={idx} deal={deal} />)}
              </div>

              <div className="bg-slate-900 text-white rounded-[56px] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 scale-150"><PlaneTakeoff size={300} /></div>
                <div className="relative z-10 max-w-4xl">
                  <h3 className="text-3xl font-black mb-10 flex items-center gap-4 uppercase tracking-tighter">
                    <div className="bg-white/10 p-3 rounded-2xl"><Sparkles size={32} className="text-indigo-400" /></div>
                    Análise Estratégica do FlyAgente
                  </h3>
                  <div className="text-slate-300 text-xl leading-relaxed font-medium whitespace-pre-wrap">{results.summary}</div>
                </div>
              </div>
              <AdUnit slot="ad-after-results-footer" />
            </div>
          )}
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-4 bg-white border-t border-slate-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Central de Conhecimento</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase tracking-tighter italic">Dúvidas Frequentes</h2>
            </div>
            <div className="space-y-5">
              {faqs.map((faq, i) => (
                <div key={i} className="group border border-slate-100 rounded-[32px] overflow-hidden bg-slate-50/50 hover:bg-white transition-all hover:shadow-xl hover:shadow-indigo-50/50">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left outline-none">
                    <span className="font-black text-slate-800 text-sm md:text-base uppercase tracking-tight">{faq.q}</span>
                    <div className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-indigo-600' : 'text-slate-300'}`}>
                      <ChevronDown size={24} />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-8 pb-8 text-slate-500 text-base leading-relaxed font-medium bg-white/50 border-t border-slate-50 pt-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sobre Nós */}
        <section id="about" className="py-32 px-4 bg-slate-50/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <span className="bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full inline-block">Missão FlyAgente</span>
              <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter"> Democratizando o acesso às melhores <span className="text-indigo-600 italic">passagens aéreas</span></h2>
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                Nós não apenas listamos preços; nós analisamos o mercado global para você. O FlyAgente AI foi desenvolvido para processar milhões de dados tarifários, garantindo que usuários comuns tenham acesso às mesmas ferramentas que agentes de elite utilizam para encontrar o menor preço mundial.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-5 items-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><ShieldCheck className="text-indigo-600" size={28}/></div>
                  <div><h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Total Segurança</h4><p className="text-sm text-slate-500 font-medium leading-snug">Indicações apenas para canais oficiais e seguros.</p></div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><HeartHandshake className="text-indigo-600" size={28}/></div>
                  <div><h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Transparência</h4><p className="text-sm text-slate-500 font-medium leading-snug">Preços finais para todo o seu grupo familiar.</p></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 rotate-3">
               <div className="bg-indigo-600 p-12 rounded-[56px] shadow-2xl flex flex-col justify-center items-center text-center text-white aspect-square">
                  <span className="text-5xl font-black mb-2 leading-none tracking-tighter">0%</span>
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] leading-tight">Taxas Ocultas</span>
               </div>
               <div className="bg-white p-12 rounded-[56px] shadow-2xl shadow-indigo-100/50 border border-slate-100 flex flex-col justify-center items-center text-center aspect-square mt-16">
                  <span className="text-5xl font-black text-indigo-600 mb-2 leading-none tracking-tighter">IA</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">Análise Global</span>
               </div>
            </div>
          </div>
        </section>

        <section className="py-24 max-w-5xl mx-auto px-4"><AdUnit slot="ad-final-section" /></section>
      </main>

      <footer className="bg-slate-900 text-slate-500 py-24 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 mb-24 border-b border-slate-800 pb-24">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <PlaneTakeoff className="text-indigo-400" size={40} />
              <span className="font-black text-4xl tracking-tighter text-white uppercase italic">FlyAgente AI</span>
            </div>
            <p className="max-w-sm leading-relaxed font-medium text-lg text-slate-400">
              O buscador definitivo para quem busca economizar de verdade em suas viagens aéreas, seja em dinheiro ou milhas.
            </p>
            {/* Créditos Desenvolvedor 17web */}
            <div className="pt-4">
              <a 
                href="https://17web.com.br" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 group bg-white/5 hover:bg-white/10 p-4 rounded-3xl transition-all border border-white/5"
              >
                <div className="flex flex-col">
                  <div className="bg-gradient-to-br from-cyan-400 to-emerald-400 p-2 rounded-lg shadow-lg">
                    <Layers size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 leading-none mb-1">Desenvolvido pela Agência</span>
                  <span className="text-white font-black text-2xl tracking-tighter leading-none group-hover:text-cyan-400 transition-colors">17web</span>
                </div>
              </a>
            </div>
          </div>
          <div className="space-y-10">
            <h5 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-2 underline decoration-indigo-600 decoration-4 underline-offset-8 uppercase">Navegação</h5>
            <ul className="space-y-6 font-bold uppercase tracking-widest text-[11px]">
              <li><button onClick={() => scrollToSection('search')} className="hover:text-white transition-colors uppercase">Buscar Voos</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors uppercase">Quem Somos</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors uppercase">Dúvidas Frequentes</button></li>
            </ul>
          </div>
          <div className="space-y-10">
            <h5 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-2 underline decoration-indigo-600 decoration-4 underline-offset-8 uppercase">Políticas Legais</h5>
            <ul className="space-y-6 font-bold uppercase tracking-widest text-[11px]">
              <li><button onClick={() => setLegalModal('privacy')} className="hover:text-white transition-colors uppercase">Privacidade</button></li>
              <li><button onClick={() => setLegalModal('terms')} className="hover:text-white transition-colors uppercase">Termos de Uso</button></li>
              <li><a href="https://17web.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase">Desenvolvimento Web</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.5em] text-center">
          <p>© 2025 FlyAgente AI - Inteligência Artificial para Turismo. Todos os direitos reservados.</p>
          <div className="flex gap-10 items-center opacity-30 grayscale hover:grayscale-0 transition-all">
            <ShieldCheck size={24} />
            <Globe2 size={24} />
            <HeartHandshake size={24} />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
