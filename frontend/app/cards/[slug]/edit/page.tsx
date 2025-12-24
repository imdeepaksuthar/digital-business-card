"use client";
import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import api from '@/lib/axios';
import CardEditor from '@/components/editor/CardEditor';

export default function EditCard() {
    const params = useParams();
    const [card, setCard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                if (params.slug) {
                    // Fetch by slug using the public endpoint which returns full details
                    const response = await api.get(`/cards/${params.slug}`);
                    setCard(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [params.slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading editor...</div>;
    if (!card) return <div className="min-h-screen flex items-center justify-center text-slate-500">Card not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 lg:p-8">
            <CardEditor initialData={card} isEditing={true} />
        </div>
    );
}
