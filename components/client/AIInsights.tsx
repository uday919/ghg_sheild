'use client';

import { useState, useEffect } from 'react';
import { Card, Badge, Skeleton } from '@/components/ui';
import { Sparkles, ArrowRight, Lightbulb, Zap, ShieldAlert } from 'lucide-react';

interface Suggestion {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    difficulty: 'Easy' | 'Moderate' | 'Hard';
}

export function AIInsights({ clientId }: { clientId?: string }) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchSuggestions() {
            if (!clientId) return;
            try {
                setIsLoading(true);
                const res = await fetch('/api/ai/suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ clientId }),
                });

                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setSuggestions(data.suggestions);
            } catch (err) {
                console.error('AI Insights Error:', err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSuggestions();
    }, [clientId]);

    if (error) return null;

    return (
        <Card className="relative overflow-hidden border-[#4CAF80]/20 bg-gradient-to-br from-[#0d1a0d] to-[#050a05]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-[#4CAF80]" />
            </div>

            <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-[#4CAF80]/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-[#4CAF80]" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold font-[family-name:var(--font-syne)]">AI Carbon Insights</h3>
                        <p className="text-xs text-gray-400">Personalized reduction strategies</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-12 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            </div>
                        ))
                    ) : (
                        suggestions.map((s, i) => (
                            <div
                                key={i}
                                className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#4CAF80]/30 hover:bg-[#4CAF80]/5 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-white text-sm font-semibold pr-2">{s.title}</h4>
                                    <div className={`p-1.5 rounded-md ${s.impact === 'High' ? 'bg-red-500/10' :
                                            s.impact === 'Medium' ? 'bg-amber-500/10' : 'bg-[#4CAF80]/10'
                                        }`}>
                                        {s.impact === 'High' ? <Zap className="w-3 h-3 text-red-400" /> :
                                            s.impact === 'Medium' ? <Lightbulb className="w-3 h-3 text-amber-400" /> :
                                                <ArrowRight className="w-3 h-3 text-[#4CAF80]" />}
                                    </div>
                                </div>

                                <p className="text-gray-400 text-xs leading-relaxed mb-4 group-hover:text-gray-300 transition-colors">
                                    {s.description}
                                </p>

                                <div className="flex gap-2">
                                    <Badge variant={s.impact === 'High' ? 'danger' : s.impact === 'Medium' ? 'warning' : 'success'} size="sm">
                                        {s.impact} Impact
                                    </Badge>
                                    <Badge variant="default" size="sm" className="bg-white/5 !text-gray-400 border-white/10">
                                        {s.difficulty}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Card>
    );
}
