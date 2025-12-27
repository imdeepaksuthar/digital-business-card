"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/container";

export function CTA() {
    return (
        <section className="py-24 bg-blue-600 dark:bg-blue-700">
            <Container>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto text-white">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Ready to start your next project?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 text-balance">
                        Join thousands of developers offering the best user experiences on the web.
                        Start building for free today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 shadow-lg border-2 border-transparent">
                            Get Started for Free
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white">
                            Talk to Sales
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
