
import React from 'react';
import { SocialPost } from '../../types';
import { BadgeCheck, MoreHorizontal, MessageCircle, Repeat, Heart, BarChart2, Share } from 'lucide-react';
import { SocialAvatar } from './SocialAvatar';
import { SocialCard } from './SocialCard';

interface SocialPostItemProps {
    post: SocialPost;
    artistImage?: string | null;
    likedPosts: Set<string>;
    onToggleLike: (id: string) => void;
    currentYear: number;
    currentWeekFull: number; 
}

export const SocialPostItem: React.FC<SocialPostItemProps> = ({ post, artistImage, likedPosts, onToggleLike, currentYear, currentWeekFull }) => {
    const isLiked = likedPosts.has(post.id);
    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="p-4 border-b border-zinc-800 hover:bg-white/[0.03] transition-colors cursor-pointer border-l border-r border-zinc-800">
            <div className="flex gap-3">
                <SocialAvatar post={post} artistImage={artistImage} />
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1 min-w-0">
                            <span className="font-bold text-[15px] text-white truncate">{post.authorName}</span>
                            {post.isVerified && <BadgeCheck size={16} className="text-blue-400 fill-blue-400/10 shrink-0" />}
                            <span className="text-zinc-500 text-[15px] truncate ml-1">{post.handle}</span>
                            <span className="text-zinc-500 text-[15px] shrink-0">· {post.timestamp === currentWeekFull ? 'now' : '1d'}</span>
                        </div>
                        <MoreHorizontal size={16} className="text-zinc-500 hover:text-blue-400 cursor-pointer shrink-0"/>
                    </div>
                    
                    <div className="text-[15px] text-white mt-0.5 whitespace-pre-wrap leading-normal">
                        {post.content}
                    </div>

                    {post.cardData ? (
                        <SocialCard data={post.cardData} year={currentYear} />
                    ) : post.image ? (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800 max-h-[500px]">
                            <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                        </div>
                    ) : null}

                    <div className="flex justify-between items-center mt-3 max-w-[425px] text-zinc-500">
                        <div className="group flex items-center gap-2 cursor-pointer hover:text-blue-400">
                            <div className="p-2 group-hover:bg-blue-500/10 rounded-full transition-colors"><MessageCircle size={18} /></div>
                            <span className="text-xs group-hover:text-blue-400">24</span>
                        </div>
                        <div className="group flex items-center gap-2 cursor-pointer hover:text-green-400">
                            <div className="p-2 group-hover:bg-green-500/10 rounded-full transition-colors"><Repeat size={18} /></div>
                            <span className="text-xs group-hover:text-green-400">{formatNumber(post.retweets)}</span>
                        </div>
                        <div 
                            className={`group flex items-center gap-2 cursor-pointer ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
                            onClick={(e) => { e.stopPropagation(); onToggleLike(post.id); }}
                        >
                            <div className="p-2 group-hover:bg-pink-500/10 rounded-full transition-colors">
                                <Heart size={18} className={isLiked ? "fill-current" : ""} />
                            </div>
                            <span className={`text-xs ${isLiked ? 'text-pink-600' : 'group-hover:text-pink-600'}`}>
                                {formatNumber(post.likes + (isLiked ? 1 : 0))}
                            </span>
                        </div>
                        <div className="group flex items-center gap-2 cursor-pointer hover:text-blue-400">
                            <div className="p-2 group-hover:bg-blue-500/10 rounded-full transition-colors"><BarChart2 size={18} /></div>
                            <span className="text-xs group-hover:text-blue-400">{formatNumber((post.likes + post.retweets) * 20)}</span>
                        </div>
                        <div className="group flex items-center gap-2 cursor-pointer hover:text-blue-400">
                            <div className="p-2 group-hover:bg-blue-500/10 rounded-full transition-colors"><Share size={18} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
