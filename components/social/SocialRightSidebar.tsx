
import React from 'react';
import { NPCArtist } from '../../types';
import { Search, MoreHorizontal, User, BadgeCheck } from 'lucide-react';

interface TrendItem {
    category: string;
    topic: string;
    stat: string;
    image?: string;
    context?: string;
    isLive?: boolean;
}

interface SocialRightSidebarProps {
    trends: TrendItem[];
    whoToFollow: NPCArtist[];
}

export const SocialRightSidebar: React.FC<SocialRightSidebarProps> = ({ trends, whoToFollow }) => {
    return (
        <div className="hidden lg:block w-[350px] pl-8 py-4 shrink-0 mr-4 space-y-4">
            {/* Search */}
            <div className="bg-[#202327] rounded-full flex items-center px-4 py-2.5 group focus-within:bg-black focus-within:ring-1 focus-within:ring-blue-500 border border-transparent sticky top-2 z-10">
                <Search size={18} className="text-[#71767b] group-focus-within:text-blue-500" />
                <input type="text" placeholder="Search" className="bg-transparent outline-none text-[#e7e9ea] ml-3 w-full placeholder-[#71767b] text-[15px]" />
            </div>

            {/* What's Happening */}
            <div className="bg-[#16181c] rounded-2xl overflow-hidden pt-3 border border-zinc-800">
                <h3 className="font-black text-xl px-4 mb-3 text-[#e7e9ea]">What's happening</h3>
                {trends.map((trend, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors relative flex justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-[13px] text-[#71767b] items-center mb-0.5">
                                <div className="flex items-center gap-1">
                                    <span>{trend.category}</span>
                                    {trend.isLive && <span className="bg-red-600 text-white text-[9px] font-black px-1 rounded animate-pulse">LIVE</span>}
                                </div>
                                <MoreHorizontal size={16} className="hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-[#71767b]"/>
                            </div>
                            <div className="font-bold text-[15px] text-[#e7e9ea] leading-5">{trend.topic}</div>
                            <div className="text-[13px] text-[#71767b] mt-0.5">
                                {trend.stat && <span>{trend.stat}</span>}
                            </div>
                            {trend.context && <div className="text-[13px] text-[#71767b] mt-0.5">{trend.context}</div>}
                        </div>
                        {trend.image && (
                            <div className="w-[70px] h-[70px] rounded-xl bg-zinc-800 shrink-0 overflow-hidden border border-zinc-700 ml-2">
                                <img src={trend.image} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                ))}
                <div className="p-4 text-blue-400 text-[15px] hover:bg-white/[0.03] cursor-pointer rounded-b-xl transition-colors">Show more</div>
            </div>

            {/* Who to Follow */}
            <div className="bg-[#16181c] rounded-2xl overflow-hidden pt-3 border border-zinc-800">
                <h3 className="font-black text-xl px-4 mb-3 text-[#e7e9ea]">Who to follow</h3>
                {whoToFollow.map((npc, idx) => (
                    <div key={npc.id} className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors flex justify-between items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 overflow-hidden border border-zinc-600 shrink-0">
                            <div className="w-full h-full flex items-center justify-center font-bold bg-purple-900 text-sm text-white">{npc.name[0]}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-[15px] text-[#e7e9ea] truncate flex items-center gap-1">
                                {npc.name}
                                <BadgeCheck size={16} className="text-blue-400 fill-blue-400/10" />
                            </div>
                            <div className="text-[#71767b] text-[14px] truncate">@{npc.name.replace(/\s/g,'').toLowerCase()}</div>
                            {idx === 0 && <div className="text-[11px] text-[#71767b] mt-0.5 flex items-center gap-1"><User size={10} fill="currentColor"/> Promoted</div>}
                        </div>
                        <button className="bg-[#eff3f4] text-black font-bold text-sm px-4 py-1.5 rounded-full hover:bg-[#d7dbdc] transition-colors">
                            Follow
                        </button>
                    </div>
                ))}
                <div className="p-4 text-blue-400 text-[15px] hover:bg-white/[0.03] cursor-pointer rounded-b-xl transition-colors">Show more</div>
            </div>

            <div className="px-4 text-[13px] text-[#71767b] leading-normal flex flex-wrap gap-x-3 gap-y-1">
                <span className="hover:underline cursor-pointer">Terms of Service</span>
                <span className="hover:underline cursor-pointer">Privacy Policy</span>
                <span className="hover:underline cursor-pointer">Cookie Policy</span>
                <span className="hover:underline cursor-pointer">Accessibility</span>
                <span className="hover:underline cursor-pointer">Ads info</span>
                <span className="hover:underline cursor-pointer">More ...</span>
                <span>© 2025 X Corp.</span>
            </div>
        </div>
    );
};
