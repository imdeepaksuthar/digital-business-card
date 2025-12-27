"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Zap, Shield, Smartphone, Globe, BarChart, Layers } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        title: "Lightning Fast",
        description: "Optimized for speed with Next.js App Router and Server Components.",
        icon: Zap,
    },
    {
        title: "Secure by Default",
        description: "Enterprise-grade security features built-in to protect your data.",
        icon: Shield,
    },
    {
        title: "Mobile First",
        description: "Responsive design that looks perfect on any device, anywhere.",
        icon: Smartphone,
    },
    {
        title: "Global Edge",
        description: "Deploy instantly to a global edge network for low latency.",
        icon: Globe,
    },
    {
        title: "Real-time Analytics",
        description: "Track user engagement and performance metrics in real-time.",
        icon: BarChart,
    },
    {
        title: "Scalable Architecture",
        description: "Built to grow with your business, from startup to enterprise.",
        icon: Layers,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-50">
            <Container>
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to ship faster</h2>
                    <p className="text-muted-foreground text-lg">
                        A complete toolkit designed to help you build, launch, and scale your applications with ease.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-0 shadow-none bg-background hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-muted-foreground/90">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
