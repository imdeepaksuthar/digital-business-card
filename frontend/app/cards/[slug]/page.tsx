import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CardLayoutClient from '@/components/CardLayoutClient';

async function getCard(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
        const res = await fetch(`${apiUrl}/cards/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function generateMetadata(props: any): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const card = await getCard(slug);
    if (!card) return { title: 'Card Not Found' };
    return {
        title: `${card.business_name} | Digital Business Card`,
        description: card.tagline || card.description || `Connect with ${card.business_name}`,
    };
}

export default async function PublicCard(props: any) {
    const params = await props.params;
    const { slug } = params;
    const card = await getCard(slug);

    if (!card) notFound();

    return <CardLayoutClient card={card} />;
}
