"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(45%_40%_at_50%_60%,rgba(59,130,246,0.2),transparent)]" />

            <Container className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 mb-6">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
                            v2.0 is now live
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Build faster with <br className="hidden lg:block" />
                            <span className="text-blue-600">Next.js Intelligence</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Create stunning, responsive web applications in minutes, not days.
                            Equipped with modern UI components and optimized for performance.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <Button size="lg" className="w-full sm:w-auto h-14 text-base px-8 border-none">
                                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-base px-8">
                                View Documentation
                            </Button>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-3 text-sm text-muted-foreground">
                            {["No credit card required", "14-day free trial", "Cancel anytime"].map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg lg:max-w-none"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl -z-10" />
                    <div className="relative h-full w-full rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                        <div className="h-full w-full rounded-xl bg-slate-100 dark:bg-slate-900 grid place-items-center border border-dashed">
                            <span className="text-muted-foreground font-medium">App Dashboard Preview</span>
                            {/* Placeholder for 3D element or App Screenshot */}
                        </div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}
