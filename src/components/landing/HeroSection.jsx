import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const fullText = "Welcome to Xebia Enterprise LMS";

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (text !== fullText) {
            // Typing forward
            setText(fullText.slice(0, text.length + 1));
            setIsPaused(false);
          } else {
            // Reached the end, pause before deleting
            if (!isPaused) {
              setIsPaused(true);
              setTimeout(() => {
                setIsDeleting(true);
                setIsPaused(false);
              }, 2000); // 2 second pause at the end
            }
          }
        } else {
          if (text === "") {
            // Finished deleting, start typing again immediately
            setIsDeleting(false);
          } else {
            // Deleting backward
            setText(fullText.slice(0, text.length - 1));
          }
        }
      },
      isPaused ? 2000 : isDeleting ? 30 : 60,
    ); // Typing is 60ms, deleting is 30ms

    return () => clearTimeout(timeout);
  }, [text, isDeleting, isPaused]);

  const handleScroll = (e) => {
    e.preventDefault();
    document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative pt-20 pb-12 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-transparent flex items-center min-h-[70vh]"
    >
      <div className="container mx-auto px-4 max-w-full relative z-10 w-full overflow-hidden">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-black tracking-tighter mb-8 leading-[1.1] min-h-[100px] md:min-h-[80px] flex justify-center items-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6C1D5F] to-[#01AC9F] pr-2 pb-1">
              {text}
            </span>
            <span
              className={`w-[3px] md:w-[4px] lg:w-[5px] h-[5vw] sm:h-[4vw] md:h-[3.5vw] lg:h-[3.5vw] xl:h-[3vw] bg-[#01AC9F] rounded-full inline-block ml-2 transition-opacity duration-300 ${isPaused ? "opacity-0" : "opacity-100 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"}`}
            />
          </h1>

          <h2 className="text-xl md:text-2xl font-bold text-[#6C1D5F] dark:text-[#FFACE8] mb-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500 fill-mode-both">
            Enterprise Learning Management System
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl leading-relaxed font-medium animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-[800ms] fill-mode-both">
            Empower your workforce with AI-powered learning, intelligent analytics, and a unified
            platform for training, upskilling, certifications, and employee development.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-[1100ms] fill-mode-both">
            <Button
              className="bg-[#6C1D5F] hover:bg-[#84117C] text-white rounded-full px-8 py-5 sm:px-10 sm:py-7 h-auto text-base sm:text-lg font-bold flex items-center gap-3 transition-colors shadow-lg hover:-translate-y-1"
              onClick={handleScroll}
            >
              Get Started <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
