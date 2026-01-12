
import React from 'react';
import { SocialPost } from '../../types';
import { BRANDS } from '../../constants';
import { BarChart2, Play, Disc, Briefcase, User, TrendingUp, Globe2 } from 'lucide-react';

interface SocialAvatarProps {
    post: SocialPost;
    artistImage?: string | null;
}

export const SocialAvatar: React.FC<SocialAvatarProps> = ({ post, artistImage }) => {
    // 1. Player
    if (post.authorId === 'player') {
        return (
            <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0 overflow-hidden border border-zinc-800">
                {artistImage ? <img src={artistImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-purple-600">{post.authorName[0]}</div>}
            </div>
        );
    }

    // 2. System Accounts
    if (post.authorId === 'sys_chartdata') {
        return <div className="w-10 h-10 rounded-full bg-black shrink-0 border border-zinc-700 flex items-center justify-center"><BarChart2 className="text-white" size={20}/></div>;
    }
    if (post.authorId === 'sys_popbase') {
        return (
            <div className="w-10 h-10 rounded-full bg-white shrink-0 border border-zinc-200 flex flex-col items-center justify-center leading-none overflow-hidden">
                <div className="bg-[#d93f77] w-full h-1/2 flex items-end justify-center pb-[2px]"><span className="text-[9px] font-black text-white tracking-tighter">POP</span></div>
                <div className="bg-white w-full h-1/2 flex items-start justify-center pt-[2px]"><span className="text-[9px] font-black text-black tracking-tighter">BASE</span></div>
            </div>
        );
    }
    if (post.authorId === 'sys_popcrave') {
        return (
            <div className="w-10 h-10 rounded-full bg-[#27aae1] shrink-0 border border-blue-400 flex items-center justify-center font-black text-[8px] text-white tracking-tighter leading-none shadow-sm">
                POP<br/>CRAVE
            </div>
        );
    }
    if (post.authorId === 'sys_billboard') {
        return <div className="w-10 h-10 rounded-full bg-white shrink-0 border border-zinc-300 flex items-center justify-center font-black text-sm text-black italic">b</div>;
    }
    if (post.authorId === 'sys_spotify') {
        return (
            <div className="w-10 h-10 rounded-full bg-[#1ed760] shrink-0 flex items-center justify-center border border-green-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
            </div>
        ); 
    }
    if (post.authorId === 'sys_youtube') {
        return (
            <div className="w-10 h-10 rounded-full bg-[#FF0000] shrink-0 flex items-center justify-center border border-red-500">
                <Play fill="white" size={16} />
            </div>
        ); 
    }
    if (post.authorId === 'sys_tth') {
        return <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 shrink-0 flex items-center justify-center font-bold text-[8px] text-white">TTH</div>;
    }
    if (post.authorId === 'sys_riaa') {
        return <div className="w-10 h-10 rounded-full bg-[#c5a059] shrink-0 flex items-center justify-center border border-yellow-200"><Disc className="text-black" size={20} /></div>; 
    }
    if (post.authorId === 'sys_hdd') {
        return <div className="w-10 h-10 rounded-full bg-[#cc0000] shrink-0 flex items-center justify-center font-black text-[10px] text-white border border-red-800 tracking-tighter">HDD</div>; 
    }
    
    // 3. BRAND ACCOUNTS
    if (post.authorId?.startsWith('brand_')) {
        const brand = BRANDS.find(b => b.id === post.authorId.replace('brand_', ''));
        return (
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border border-white/20 ${brand?.logoColor || 'bg-zinc-700'}`}>
                <Briefcase size={18} className="text-white"/>
            </div>
        );
    }

    // 4. Fan Accounts
    if (post.authorId?.startsWith('fan_')) {
        let bg = 'bg-zinc-600';
        let icon = <User size={20} className="text-zinc-400" />;
        
        if (post.authorId.includes('stats')) { bg = 'bg-blue-900'; icon = <BarChart2 size={18} className="text-blue-300"/>; }
        if (post.authorId.includes('chart')) { bg = 'bg-emerald-900'; icon = <TrendingUp size={18} className="text-emerald-300"/>; }
        if (post.authorId.includes('spotify')) { bg = 'bg-[#191414]'; icon = <Disc size={18} className="text-green-500"/>; }
        if (post.authorId.includes('access')) { bg = 'bg-black'; icon = <Globe2 size={18} className="text-white"/>; }
        
        if (post.authorId.includes('stan')) { 
            return (
                <div className="w-10 h-10 rounded-full bg-pink-900 shrink-0 overflow-hidden border-2 border-pink-500 relative">
                    {artistImage ? (
                        <>
                            <img src={artistImage} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-pink-500/20 mix-blend-overlay"></div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-pink-200">STAN</div>
                    )}
                </div>
            )
        }

        return (
            <div className={`w-10 h-10 rounded-full ${bg} shrink-0 flex items-center justify-center border border-white/10`}>
                {icon}
            </div>
        );
    }

    // 5. Default / NPC
    return (
        <div className="w-10 h-10 rounded-full bg-zinc-700 shrink-0 overflow-hidden border border-zinc-800">
            {post.avatar ? <img src={post.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-zinc-600">{post.authorName[0]}</div>}
        </div>
    );
};
