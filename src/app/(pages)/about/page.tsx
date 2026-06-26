"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, BookOpen, CheckCircle2, Wrench, TrendingUp } from "lucide-react";

const teamMembers = [
  {
    name: "Ahmed  Waleed",
    role: "UI/UX Designer",
    bio: "Responsible for user research, interface design, prototyping, and creating the overall user experience.",
    image: "https://media.discordapp.net/attachments/1482428442409566291/1519646845389897738/Screenshot_2025-12-16_221907.png?ex=6a3ef9a9&is=6a3da829&hm=d058b7d45436b409d838d44bec4faea727b02a30c5e39d43918a2022ba0cfdfe&=&format=webp&quality=lossless",
  },
  {
    name: "Youssef Zidan",
    role: "Flutter & Dart Developer",
    bio: "Responsible for the application development, creating scalable Flutter components, connecting app flows, and delivering a smooth mobile experience.",
    image: "./pics/Yousef.jpg",
  },
  {
    name: "Ali Mansour",
    role: "Backend Developer",
    bio: "Built the backend systems and APIs, managing data flow and creating the foundation that powers the application",
    image: "./pics/Ali.jpg",
  },
  {
    name: "Omar Mosad",
    role: "Frontend Developer",
    bio: "Responsible for building the user interface, turning design wireframes into responsive code, and ensuring a seamless interactive web experience.",
    image: "./pics/Omar.jpg",
  },
  {
    name: "Abraam Michal",
    role: "Assets, Content & Testing",
    bio: "Provided visual resources and content while testing the product and sharing feedback to enhance the final experience.",
    image: "./pics/Abraam.jpg",
  },
];

const philosophyPillars = [
  { icon: BookOpen, label: "Learn", desc: "Structured roadmaps curated by industry veterans.", color: "text-primary" },
  { icon: CheckCircle2, label: "Validate", desc: "Interactive assessments to confirm your skill acquisition.", color: "text-green-500" },
  { icon: Wrench, label: "Build", desc: "Apply theory to real-world sandboxed projects.", color: "text-amber-500" },
  { icon: TrendingUp, label: "Progress", desc: "Continuous growth tracking and career-ready badges.", color: "text-rose-500" },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">DevMap</Link>
          <ChevronRight size={12} />
          <span className="text-primary font-medium">About Us</span>
        </nav>

        {/* Philosophy card */}
        <div className="devmap-card max-w-2xl mx-auto mb-20">
          <h1 className="text-2xl font-bold text-primary mb-3">Our Philosophy</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            At DevMap, we believe technical mastery isn&apos;t a destination — it&apos;s a deliberate
            journey. We have engineered a circular learning ecosystem designed to transform
            beginners into industry-ready engineers.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {philosophyPillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label}>
                  <p className={`flex items-center gap-2 font-semibold text-sm mb-1 ${p.color}`}>
                    <Icon size={15} />
                    {p.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Meet Our Team</h2>
          <p className="text-sm text-muted-foreground">
            The minds behind the roadmaps, building the future of technical education.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 mb-20">
          {teamMembers.map((member) => (
            <div key={member.name} className="devmap-card text-center p-4">
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-muted relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <p className="font-bold text-sm text-foreground">{member.name}</p>
              <p className="text-xs text-primary font-medium mb-2">{member.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Story section */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5">The DevMap Story</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                DevMap began with a challenge: creating a digital solution that is not only functional, but enjoyable and easy to use. What 
                started as a graduation project quickly became an opportunity to apply real product thinking — from identifying user needs 
                to designing and building a complete experience.
              </p>
              <p>
                Our journey involved research, planning, design iterations, development, testing, and continuous improvement. We focused
                 on creating a product where every feature has a purpose and every interaction helps users achieve their goals more effectively.
              </p>
              <p>
               After months of collaboration and refinement, DevMap became a complete experience that reflects our team's effort,
                creativity, and commitment to solving problems through design and technology.
              </p>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
              {[
                { value: "2021", label: "Founded in Austin, TX", color: "text-primary" },
                { value: "500k+", label: "Active Learners", color: "text-foreground" },
                { value: "42", label: "Expert Roadmaps", color: "text-green-500" },
              ].map((s, i) => (
                <div key={s.label} className={i > 0 ? "pl-6 border-l border-border" : ""}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3] relative bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&h=700&fit=crop"
              alt="DevMap office"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
