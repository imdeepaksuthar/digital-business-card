"use client";

import { Container } from "@/components/ui/container";

const stats = [
    { label: "Active Users", value: "100K+" },
    { label: "Countries Served", value: "50+" },
    { label: "Uptime Guaranteed", value: "99.9%" },
    { label: "Team Members", value: "200+" },
];

export function Stats() {
    return (
        <section className="py-16 bg-blue-600 text-white">
            <Container>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <span className="text-4xl md:text-5xl font-bold tracking-tight">
                                {stat.value}
                            </span>
                            <span className="text-blue-100 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
