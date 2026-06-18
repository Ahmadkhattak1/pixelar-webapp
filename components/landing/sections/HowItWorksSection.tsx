"use client";

import { Container } from "@/components/landing/layout/Container";
import { SectionTitle } from "@/components/landing/ui/SectionTitle";
import { HOW_IT_WORKS_STEPS } from "@/lib/landing-constants";
import { cn } from "@/lib/utils";

// Step icons
function StepIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    pencil: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)} fill="currentColor">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
      </svg>
    ),
    sliders: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)} fill="currentColor">
        <path d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)} fill="currentColor">
        <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69a1.734 1.734 0 0 0-1.097-1.097l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
      </svg>
    ),
    download: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)} fill="currentColor">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
      </svg>
    ),
    film: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)} fill="currentColor">
        <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z"/>
      </svg>
    ),
  };

  return icons[type] || null;
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-[#141414] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pixel-grid opacity-20" />

      {/* Floating pixels decoration */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-[#9FDE5A]/30 animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-[#7bc234]/30 animate-float-slow" />
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-[#FFD700]/30 animate-float" />

      <Container className="relative z-10">
        <SectionTitle
          title="LEVEL UP YOUR WORKFLOW"
          subtitle="From prompt to game-ready assets in four simple steps"
        />

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-16 left-[15%] right-[15%] h-0.5">
            <div className="w-full h-full bg-[#9FDE5A]/50" />
            {/* Animated dots on line */}
            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-shimmer" style={{ left: '25%' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-shimmer" style={{ left: '50%', animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-shimmer" style={{ left: '75%', animationDelay: '1s' }} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={step.step} className="relative group">
                {/* Step number */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#9FDE5A] blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />

                    {/* Step circle */}
                    <div className="relative w-20 h-20 bg-[#0a0a0a] border-2 border-[#9FDE5A] flex items-center justify-center group-hover:border-[#7bc234] transition-colors">
                      <span className="font-pixel text-2xl text-[#9FDE5A] group-hover:text-[#7bc234] transition-colors">
                        {String(step.step).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Pixel corners */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#9FDE5A] group-hover:bg-[#7bc234] transition-colors" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#9FDE5A] group-hover:bg-[#7bc234] transition-colors" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#9FDE5A] group-hover:bg-[#7bc234] transition-colors" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#9FDE5A] group-hover:bg-[#7bc234] transition-colors" />
                  </div>

                  {/* Icon */}
                  <div className="w-8 h-8 mb-4 text-[#a1a1aa] group-hover:text-white transition-colors">
                    <StepIcon type={step.icon} />
                  </div>

                  {/* Title */}
                  <h3 className="font-pixel text-sm text-white mb-3">{step.title.toUpperCase()}</h3>

                  {/* Description */}
                  <p className="text-[#a1a1aa] text-sm text-center max-w-[200px]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile/tablet */}
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-[#9FDE5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo preview */}
        <div className="mt-16 bg-[#0a0a0a] border border-[#262626] p-6 sm:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
              <div className="w-3 h-3 rounded-full bg-[#FFD93D]" />
              <div className="w-3 h-3 rounded-full bg-[#6BCB77]" />
            </div>
            <span className="font-mono text-xs text-[#a1a1aa]">pixelar-generator</span>
          </div>

          <div className="font-mono text-sm">
            <p className="text-[#a1a1aa]">
              <span className="text-[#9FDE5A]">&gt;</span> Enter prompt:{" "}
              <span className="text-[#7bc234]">&quot;A brave knight with golden armor&quot;</span>
            </p>
            <p className="text-[#a1a1aa] mt-2">
              <span className="text-[#9FDE5A]">&gt;</span> Style:{" "}
              <span className="text-[#FFD700]">pixel_art</span> | Size:{" "}
              <span className="text-[#FFD700]">64x64</span> | Variations:{" "}
              <span className="text-[#FFD700]">4</span>
            </p>
            <p className="text-[#7bc234] mt-2">
              <span className="text-[#9FDE5A]">&gt;</span> Generating...{" "}
              <span className="animate-blink">|</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
