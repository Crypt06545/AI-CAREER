"use client";
import HeroSection from "@/components/HeroSection";
import { features } from "./data/features";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const tl = gsap.timeline();
  useGSAP(() => {
    tl.from(".feature-section", {
      scrollTrigger: {
        trigger: ".feature-section",
        markers: true,
      },
    });
  }, []);
  return (
    <div>
      <div className="grid-background" />
      <main className="relative z-10">
        <HeroSection />

        <section className="feature-section w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              {/* tracking-tighter - used to word gap*/}
              Powerful Features For Your Career Groth
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {features.map((feature, indx) => (
                <Card
                  key={indx}
                  className={
                    "border-2 hover:border-primary cursor-pointer transition-colors duration-300"
                  }
                >
                  <CardContent
                    className={"pt-6 text-center flex flex-col items-center"}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div>{feature?.icon}</div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature?.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
