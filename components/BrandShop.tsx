
import React, { useState } from 'react';
import { GameState, BrandOffer, BrandProduct } from '../types';
import { BRANDS } from '../constants';
import { ShoppingBag, TrendingUp, DollarSign, Package, Star, ArrowRight, X, BarChart3, Tag, Briefcase, Award, Zap, Layers } from 'lucide-react';

interface BrandShopProps {
  gameState: GameState;
}

const BrandShop: React.FC<BrandShopProps> = ({ gameState }) => {
  const [selectedDeal, setSelectedDeal] = useState<BrandOffer | null>(null);

  const activeDeals = gameState.activeDeals || [];
  
  // --- AGGREGATE STATS ---
  const totalRevenueGenerated = activeDeals.reduce((acc, deal) => 
      acc + (deal.products?.reduce((pAcc, p) => pAcc + p.revenueGenerated, 0) || 0), 0
  );
  
  const totalUnitsSold = activeDeals.reduce((acc, deal) => 
      acc + (deal.products?.reduce((pAcc, p) => pAcc + p.sales, 0) || 0), 0
  );

  const bestSellingProduct = activeDeals
      .flatMap(d => d.products.map(p => ({ ...p, brandName: d.brandName })))
      .sort((a, b) => b.revenueGenerated - a.revenueGenerated)[0];

  const sortedDeals = [...activeDeals].sort((a, b) => {
      const revA = a.products.reduce((acc, p) => acc + p.revenueGenerated, 0);
      const revB = b.products.reduce((acc, p) => acc + p.revenueGenerated, 0);
      return revB - revA;
  });

  const formatMoney = (num: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', { notation: "compact" }).format(num);

  // Helper for progress bars
  const maxRevenue = sortedDeals.length > 0 ? sortedDeals[0].products.reduce((acc, p) => acc + p.revenueGenerated, 0) : 1;

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col font-sans overflow-hidden relative">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="shrink-0 z-20 px-8 py-8 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white text-black p-2 rounded-lg">
                            <Briefcase size={20} />
                        </div>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Business Empire</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                        Merch & <span className="text-zinc-600">Partnerships</span>
                    </h1>
                </div>
                <div className="hidden md:block text-right">
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Revenue</div>
                    <div className="text-3xl font-mono font-bold text-emerald-400">{formatMoney(totalRevenueGenerated)}</div>
                </div>
            </div>
        </div>

        {/* --- MAIN SCROLL CONTENT --- */}
        <div className="flex-1 overflow-y-auto relative z-10 p-8 scrollbar-thin scrollbar-thumb-zinc-800">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* 1. KEY METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                        <div className="absolute right-4 top-4 p-3 bg-zinc-900 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
                            <Package size={20} />
                        </div>
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Volume</div>
                        <div className="text-4xl font-black text-white mb-1">{formatNumber(totalUnitsSold)}</div>
                        <div className="text-sm text-zinc-400">Total units sold worldwide</div>
                    </div>

                    <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                        <div className="absolute right-4 top-4 p-3 bg-zinc-900 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
                            <Layers size={20} />
                        </div>
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Portfolio</div>
                        <div className="text-4xl font-black text-white mb-1">{activeDeals.length}</div>
                        <div className="text-sm text-zinc-400">Active brand partnerships</div>
                    </div>

                    <div className="bg-[#111] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                        <div className="absolute right-4 top-4 p-3 bg-zinc-900 rounded-full text-yellow-400 group-hover:scale-110 transition-transform">
                            <Award size={20} />
                        </div>
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Best Seller</div>
                        {bestSellingProduct ? (
                            <>
                                <div className="text-2xl font-black text-white mb-1 truncate">{bestSellingProduct.name}</div>
                                <div className="text-sm text-zinc-400">{formatMoney(bestSellingProduct.revenueGenerated)} generated</div>
                            </>
                        ) : (
                            <div className="text-2xl font-black text-zinc-600">---</div>
                        )}
                    </div>
                </div>

                {/* 2. REVENUE DISTRIBUTION (Visual Chart) */}
                {sortedDeals.length > 0 && (
                    <div className="bg-[#0f0f0f] border border-zinc-800 rounded-3xl p-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-2">
                            <BarChart3 size={20} className="text-zinc-500" /> Revenue Distribution
                        </h3>
                        <div className="space-y-4">
                            {sortedDeals.map((deal) => {
                                const rev = deal.products.reduce((acc, p) => acc + p.revenueGenerated, 0);
                                const percent = (rev / maxRevenue) * 100;
                                const brand = BRANDS.find(b => b.id === deal.brandId);
                                
                                return (
                                    <div key={deal.id} className="group cursor-pointer" onClick={() => setSelectedDeal(deal)}>
                                        <div className="flex justify-between text-sm mb-2 font-medium">
                                            <span className="text-white group-hover:underline decoration-zinc-500 underline-offset-4">{deal.brandName}</span>
                                            <span className="font-mono text-zinc-400">{formatMoney(rev)}</span>
                                        </div>
                                        <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${brand?.logoColor?.replace('bg-', 'bg-') || 'bg-white'} opacity-80 group-hover:opacity-100 transition-all duration-500 rounded-full`} 
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* 3. PARTNERSHIP CARDS */}
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-2">
                        <Tag size={20} className="text-zinc-500" /> Active Collections
                    </h3>
                    
                    {activeDeals.length === 0 ? (
                        <div className="p-16 border-2 border-dashed border-zinc-900 rounded-3xl text-center">
                            <ShoppingBag size={48} className="mx-auto text-zinc-700 mb-4" />
                            <h3 className="text-xl font-bold text-zinc-500">No Active Deals</h3>
                            <p className="text-zinc-600 mt-2">Check your messages for partnership offers.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeDeals.map(deal => {
                                const brand = BRANDS.find(b => b.id === deal.brandId);
                                const productsCount = deal.products.length;
                                
                                return (
                                    <div 
                                        key={deal.id} 
                                        onClick={() => setSelectedDeal(deal)}
                                        className="bg-[#111] hover:bg-[#161616] border border-zinc-800 hover:border-zinc-600 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group relative"
                                    >
                                        {/* Status Light */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                                        </div>

                                        <div className="p-6 h-full flex flex-col">
                                            {/* Brand Header */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-12 h-12 rounded-full ${brand?.logoColor || 'bg-zinc-800'} flex items-center justify-center font-bold text-xl shadow-lg`}>
                                                    {deal.brandName[0]}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-white leading-none">{deal.brandName}</h3>
                                                    <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-wider">{deal.industry} • {deal.tier}</div>
                                                </div>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                                                <div>
                                                    <div className="text-[10px] text-zinc-600 uppercase font-bold">Campaign</div>
                                                    <div className="text-sm font-medium text-zinc-300">{deal.campaignResult?.style || 'Standard'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-zinc-600 uppercase font-bold">Duration</div>
                                                    <div className="text-sm font-medium text-zinc-300">{deal.weeksRemaining} wks left</div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-[10px] text-zinc-600 uppercase font-bold">Collection</div>
                                                    <div className="text-sm font-medium text-white flex items-center gap-2">
                                                        {productsCount} Products Available <ArrowRight size={12} className="text-zinc-500 group-hover:translate-x-1 transition-transform"/>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Metric */}
                                            <div className="mt-auto pt-4 border-t border-zinc-900 flex justify-between items-center">
                                                <span className="text-xs font-bold text-zinc-500">Relationship Score</span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className={deal.relationshipScore > 80 ? "fill-yellow-500 text-yellow-500" : "fill-zinc-700 text-zinc-700"} />
                                                    <span className="text-sm font-mono font-bold text-white">{deal.relationshipScore}/100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- DETAIL MODAL (LUXURY STYLE) --- */}
        {selectedDeal && (
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8" onClick={() => setSelectedDeal(null)}>
                <div className="bg-[#0a0a0a] w-full max-w-5xl h-full max-h-[85vh] rounded-3xl border border-zinc-800 overflow-hidden flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
                    
                    {/* Close Button */}
                    <button onClick={() => setSelectedDeal(null)} className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-colors border border-white/10">
                        <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row h-full">
                        
                        {/* LEFT: BRAND INFO & CAMPAIGN REPORT */}
                        <div className="w-full md:w-1/3 bg-[#111] border-r border-zinc-800 p-8 overflow-y-auto">
                            <div className="mb-10 text-center">
                                <div className={`w-24 h-24 mx-auto rounded-full ${BRANDS.find(b => b.id === selectedDeal.brandId)?.logoColor || 'bg-zinc-800'} flex items-center justify-center font-black text-4xl shadow-2xl mb-6 ring-4 ring-black`}>
                                    {selectedDeal.brandName[0]}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase leading-none mb-2">{selectedDeal.brandName}</h2>
                                <div className="inline-block bg-zinc-900 px-3 py-1 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] border border-zinc-800">
                                    {selectedDeal.tier} Partner
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Contract Details</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Type</span>
                                            <span className="text-sm font-bold text-white">{selectedDeal.type.replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Base Payout</span>
                                            <span className="text-sm font-bold text-green-400 font-mono">{formatMoney(selectedDeal.payout)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400">Renewal In</span>
                                            <span className="text-sm font-bold text-white">{selectedDeal.weeksRemaining} Weeks</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedDeal.campaignResult && (
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Campaign Report</h4>
                                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs text-zinc-400 uppercase font-bold">Strategy</span>
                                                <span className="text-xs bg-white text-black px-2 py-0.5 rounded font-bold">{selectedDeal.campaignResult.style}</span>
                                            </div>
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-zinc-400">Quality Score</span>
                                                    <span className="font-bold text-white">{selectedDeal.campaignResult.quality}/100</span>
                                                </div>
                                                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${selectedDeal.campaignResult.quality > 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${selectedDeal.campaignResult.quality}%`}}></div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-zinc-300 italic leading-relaxed">
                                                "{selectedDeal.campaignResult.feedback}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: INVENTORY / PRODUCTS */}
                        <div className="flex-1 bg-[#0a0a0a] flex flex-col">
                            <div className="p-8 border-b border-zinc-800 flex justify-between items-end">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Collection Inventory</h3>
                                    <p className="text-zinc-500 text-sm mt-1">Real-time sales tracking</p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-xs font-bold text-zinc-500 uppercase">Total Revenue</div>
                                    <div className="text-2xl font-mono font-bold text-white">
                                        {formatMoney(selectedDeal.products.reduce((acc, p) => acc + p.revenueGenerated, 0))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                {selectedDeal.products.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                                        <p>No products in this collection yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedDeal.products.slice().reverse().map((product) => (
                                            <div key={product.id} className="bg-[#111] hover:bg-[#161616] p-4 rounded-xl border border-zinc-800 flex gap-6 items-center transition-colors group">
                                                <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0 shadow-lg relative">
                                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    {product.type === 'Signature' && <div className="absolute top-0 left-0 bg-purple-600 text-white text-[8px] font-bold px-1.5 py-0.5">SIGNATURE</div>}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-white text-lg truncate pr-4">{product.name}</h4>
                                                        <div className="text-right shrink-0">
                                                            <div className="font-mono font-bold text-white">{formatMoney(product.revenueGenerated)}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-6 text-sm text-zinc-500">
                                                        <div className="flex items-center gap-2">
                                                            <Tag size={14} /> 
                                                            <span className="font-mono text-zinc-300">{formatMoney(product.price)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Package size={14} />
                                                            <span className="font-mono text-zinc-300">{formatNumber(product.sales)} sold</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2 h-2 rounded-full ${product.type === 'Sample' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                                            <span className="uppercase text-[10px] font-bold tracking-wider">{product.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default BrandShop;
