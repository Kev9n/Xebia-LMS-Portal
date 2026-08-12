import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { toast } from "sonner";

export const Route = createFileRoute("/student/assessment/$assessmentId")({
  component: ExamTakingView,
});

import { useLMS } from "../../../context/LMSContext";

function ExamTakingView() {
  const { assessmentId } = Route.useParams();
  const navigate = useNavigate();
  const { assessments } = useLMS();

  const assessment = assessments.find((a) => a.id === assessmentId);
  const questions = assessment?.questions || [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleClearSelection = (qId) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    toast.success("Assessment submitted successfully!");

    // Simulate calculating results and redirecting
    setTimeout(() => {
      navigate({ to: "/student/results" });
    }, 2000);
  };

  const currentQ = questions[currentIdx];
  const isLastQ = currentIdx === questions.length - 1;
  const isFirstQ = currentIdx === 0;

  const attemptedCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (attemptedCount / questions.length) * 100 : 0;

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold text-neutral-500">
          No questions found for this assessment.
        </h2>
        <button
          onClick={() => navigate({ to: "/student/assessments" })}
          className="mt-4 px-4 py-2 bg-[#6C1D5F] text-white rounded-lg"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-accent-2/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-accent-2" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Assessment Submitted</h1>
        <p className="text-muted-foreground">Your answers have been saved securely.</p>
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary dark:text-[#b44e9f] animate-pulse">
          Redirecting to Results...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6 animate-in fade-in duration-500">
      {/* ── Top Header Panel ── */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">React Final Exam</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">ID: {assessmentId}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Time Remaining
            </span>
            <div
              className={clsx(
                "flex items-center gap-2 text-3xl font-black font-mono",
                timeLeft < 300 ? "text-destructive animate-pulse" : "text-foreground",
              )}
            >
              <Clock className="w-6 h-6" />
              {formatTime(timeLeft)}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-accent-2 to-[#01AC9F] hover:from-accent-2 hover:to-[#019085] text-white font-bold rounded-xl shadow-[0_2px_12px_-2px_rgba(1,172,159,0.5)] transition-all hover:-translate-y-0.5"
          >
            Submit Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* ── Main Question Area ── */}
        <div className="lg:col-span-3 bg-card border border-border rounded-2xl shadow-sm flex flex-col min-h-[500px]">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-muted rounded-t-2xl overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-extrabold text-primary dark:text-[#b44e9f] uppercase tracking-widest bg-primary/10 dark:bg-[#b44e9f]/10 px-3 py-1.5 rounded-lg">
                Question {currentIdx + 1} of {questions.length}
              </span>

              {answers[currentQ.id] !== undefined && (
                <button
                  onClick={() => handleClearSelection(currentQ.id)}
                  className="text-sm font-bold text-gray-400 hover:text-destructive transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground leading-relaxed mb-8">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQ.id] === idx;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => handleSelectOption(currentQ.id, idx)}
                        className={clsx(
                          "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 group",
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-[0_0_0_4px_rgba(108,29,95,0.1)]"
                            : "border-border hover:border-primary/30 bg-transparent hover:bg-gray-50 dark:hover:bg-[#1a1a24]",
                        )}
                      >
                        <div
                          className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                            isSelected
                              ? "border-primary"
                              : "border-gray-300 dark:border-gray-600 group-hover:border-primary/50",
                          )}
                        >
                          {isSelected && <div className="w-3 h-3 bg-primary rounded-full" />}
                        </div>
                        <span
                          className={clsx(
                            "text-lg font-medium",
                            isSelected ? "text-primary dark:text-[#b44e9f]" : "text-foreground",
                          )}
                        >
                          {option}
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="p-5 border-t border-border flex items-center justify-between bg-gray-50 dark:bg-[#1a1a24] rounded-b-2xl">
            <button
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              disabled={isFirstQ}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>

            {!isLastQ ? (
              <button
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-sm hover:-translate-y-0.5 transition-all"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent-2 text-white font-bold rounded-xl shadow-sm hover:bg-accent-2 hover:-translate-y-0.5 transition-all"
              >
                Finish Assessment <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Question Navigator Panel ── */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm sticky top-6">
          <h3 className="font-extrabold text-foreground mb-4">Questions</h3>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isAttempted = answers[q.id] !== undefined;
              const isActive = currentIdx === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200",
                    isActive
                      ? "ring-2 ring-offset-2 ring-[#6C1D5F] dark:ring-offset-[#15151f] scale-110 z-10"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    isAttempted
                      ? "bg-primary text-white border-transparent"
                      : "bg-transparent border-2 border-border text-muted-foreground",
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground font-medium">
                <div className="w-3 h-3 bg-primary rounded-full" /> Attempted
              </span>
              <span className="font-bold text-foreground">{attemptedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground font-medium">
                <div className="w-3 h-3 border-2 border-gray-300 dark:border-[#2e2e3e] rounded-full" />{" "}
                Unattempted
              </span>
              <span className="font-bold text-foreground">{questions.length - attemptedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
