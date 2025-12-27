"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Star } from "lucide-react";

const testimonials = [
    {
        content: "This platform explicitly transformed how we build web applications. The speed and flexibility are unmatched.",
        author: "Sarah Johnson",
        role: "CTO at TechCorp",
        avatar: "S",
    },
    {
        content: "I was skeptical at first, but the results speak for themselves. Our mobile conversion rate increased by 40%.",
        author: "Michael Chen",
        role: "Product Manager",
        avatar: "M",
    },
    {
        content: "The best developer experience I've had in years. Documentation is top-notch and the community is super helpful.",
        author: "Alex Rivera",
        role: "Frontend Lead",
        avatar: "A",
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-50">
            <Container>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Trusted by developers worldwide</h2>
                    <p className="text-muted-foreground text-lg">
                        Don't just take our word for it. Here's what our community is saying.
                    </p>
                </div>

                {/* 
          Mobile: Swipeable Row (Snap Scroll)
          Desktop: Grid
        */}
                <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="snap-center shrink-0 w-[85vw] md:w-auto">
                            <Card className="h-full bg-background border-border/50">
                                <CardHeader>
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-lg font-medium leading-relaxed leading-7">
                                        "{testimonial.content}"
                                    </p>
                                </CardHeader>
                                <CardFooter>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{testimonial.author}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
