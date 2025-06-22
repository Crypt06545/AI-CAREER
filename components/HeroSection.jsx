"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const HeroSection = () => {
  const tl = gsap.timeline();
  useGSAP(() => {
    tl.from(".hero", {
      y: -20,
      opacity: 0,
      delay: 0.25,
      duration: 0.75,
    });
  }, []);
  return (
    <section className="container mx-auto pt-36 min-h-screen pb-10 px-4 text-center max-w-4xl">
      <div className="hero space-y-6">
        {/* Gradient Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
          Your AI Career Coach for <br />
          <span
            className="bg-gradient-to-r from-[var(--chart-1)] via-[var(--chart-3)] to-[var(--chart-4)] bg-clip-text text-transparent"
            style={{ WebkitTextFillColor: "transparent" }}
          >
            Professional Success
          </span>
        </h1>

        {/* Gradient Paragraph */}
        <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto text-gray-200 drop-shadow-sm">
          Get personalized coaching, AI-powered interview preparation, and tools
          tailored to elevate your job search and land your dream role.
        </p>

        <div>
          <Link href={"/dashboard"}>
            <Button size={"lg"} className={"px-8 cursor-pointer"}>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
