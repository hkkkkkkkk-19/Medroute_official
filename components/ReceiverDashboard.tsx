
import React from 'react';

const ReceiverDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Request Center</h2>
          <p className="text-slate-500 text-lg font-medium">Verified pharmaceutical surplus available for those in need.</p>
        </div>
        <button 
          className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center gap-4 group uppercase tracking-widest text-xs"
        >
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          </div>
          New Medicine Request
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Your Health Log</h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">Live Network Sync</span>
            </div>
            
            <div className="space-y-6">
                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:bg-white hover:shadow-lg duration-300">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-50">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Metformin 500mg</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Allocated from NGO Hub #4 • Pickup Ready</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="px-5 py-2 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-xl uppercase tracking-widest">Available</span>
                        <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Directions</button>
                    </div>
                </div>

                <div className="p-16 text-center bg-indigo-50/30 border-3 border-dashed border-indigo-100 rounded-[3rem]">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-xl">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Network Support Active</h4>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mb-10 font-medium leading-relaxed">Need help finding a specific medicine or understanding the process? Our dedicated partner NGOs are available across the city hubs.</p>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-2xl font-black mb-6 tracking-tight uppercase">Network Logistics</h3>
            <p className="text-indigo-100 font-medium mb-10 leading-relaxed">The MedRoute system ensures clinical verification of every batch before it reaches you.</p>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <div className="text-[10px] uppercase font-black tracking-widest text-indigo-200 mb-2">System Status</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="font-bold text-xs">Operational</span>
                </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-widest text-xs flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Safety Assurance
            </h4>
            <div className="space-y-6">
                {[
                  { title: "AI Verification", desc: "Scanned via MedRoute Lens for authenticity." },
                  { title: "Physical Check", desc: "Inspected by licensed pharmacists at hubs." },
                  { title: "Secure Logistics", desc: "Distributed via climate-controlled network." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <div>
                          <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{item.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.desc}</p>
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
