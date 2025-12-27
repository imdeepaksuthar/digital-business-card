"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/container";
import { Check } from "lucide-react";
import Image from "next/image";

export function About() {
    return (
        <section id="about" className="py-24 overflow-hidden">
            <Container>
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse" />
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-zinc-100 dark:bg-zinc-800">
                            {/* Using a solid color placeholder since I cannot guarantee an image exists. 
                     In a real app, next/image would be used here. 
                  */}
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-200 dark:bg-slate-800">
                                About Image Placeholder
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                            Designed for developers, <br />
                            <span className="text-blue-600">loved by teams</span>.
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We understand the challenges of modern web development. That's why we built a platform that handles the complexity, so you can focus on innovation.
                        </p>

                        <ul className="space-y-4 mb-8">
                            {[
                                "Pre-built accessible components",
                                "Advanced animation capabilities",
                                "Enterprise-grade customizable themes",
                                "Seamless integration with existing tools",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Button size="lg" variant="outline">
                            Learn more about us
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
