import { useRef, useState } from "react";
import { Printer, X } from "lucide-react";
import { motion } from "framer-motion";
import { useLMS } from "@/context/LMSContext";

const BRAND = "#6C1D5F";
const TEAL = "#01AC9F";

export function CertificateModal({ course, onClose }) {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { currentUser } = useLMS();

  const completionDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const studentName = currentUser?.name || "Student";
  const certId = `XEB-${String(course.id).slice(0, 8).toUpperCase()}-2026-${currentUser?.id || "student"}`;
  const duration =
    course.duration ||
    `${course.durationHours ? course.durationHours + " hrs" : ""}${course.durationMinutes ? " " + course.durationMinutes + " min" : ""}`.trim() ||
    "40 Hours";

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    window.print();
    setTimeout(() => setIsDownloading(false), 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm print:bg-transparent print:p-0">
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * { visibility: hidden !important; }
          #certificate-print-area, #certificate-print-area * { visibility: visible !important; }
          #certificate-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
            transform: none !important;
            max-width: none !important;
            z-index: 9999 !important;
          }
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-border bg-card shrink-0">
          <div>
            <h3 className="font-extrabold text-foreground">Certificate of Completion</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Issued by Xebia · {completionDate}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-primary hover:bg-[#5a184f] disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              {isDownloading ? "Preparing..." : "Download Certificate"}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-10 print:bg-white print:p-0">
          <div
            id="certificate-print-area"
            ref={certificateRef}
            className="w-full max-h-full bg-white relative overflow-hidden shadow-2xl print:shadow-none"
            style={{
              maxWidth: "794px",
              aspectRatio: "1.414 / 1",
              fontFamily: "'Georgia','Times New Roman',serif",
              containerType: "inline-size",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[7px]" style={{ background: "linear-gradient(90deg,#6C1D5F,#B48C3C,#01AC9F,#B48C3C,#6C1D5F)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-[7px]" style={{ background: "linear-gradient(90deg,#6C1D5F,#B48C3C,#01AC9F,#B48C3C,#6C1D5F)" }} />
            <div className="absolute inset-[10px]" style={{ border: `1.5px solid ${BRAND}`, borderRadius: "2px" }} />
            <div className="absolute inset-[15px]" style={{ border: `0.5px solid ${TEAL}40`, borderRadius: "2px" }} />

            <div className="absolute inset-0 z-10 flex flex-col justify-between px-8 sm:px-16 pt-10 pb-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <img src="/logo-purple.png" alt="Xebia" className="h-[36px] object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <p className="font-extrabold uppercase" style={{ color: TEAL, fontSize: "1.15cqw", letterSpacing: "0.28em" }}>
                  Enterprise Learning Management System
                </p>
                <p className="font-extrabold uppercase mt-1 text-[#1f2937]" style={{ fontSize: "2.1cqw", letterSpacing: "0.35em" }}>
                  Certificate of Completion
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 my-auto py-6">
                <p className="italic text-gray-500 font-serif" style={{ fontSize: "1.6cqw" }}>This is to proudly certify that</p>
                <h2 className="font-bold italic leading-none text-primary font-serif" style={{ fontSize: "6.5cqw" }}>{studentName}</h2>
                <p className="italic text-gray-500 font-serif" style={{ fontSize: "1.6cqw" }}>has successfully completed</p>
                <h3 className="font-bold text-gray-800 leading-snug font-sans" style={{ fontSize: "2.8cqw", maxWidth: "85%" }}>{course.title}</h3>
                <span className="font-bold uppercase tracking-widest rounded-sm" style={{ background: `${TEAL}12`, color: TEAL, border: `1px solid ${TEAL}35`, fontSize: "1.2cqw", padding: "0.4em 1.2em" }}>
                  {duration}
                </span>
              </div>

              <div className="w-full flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pt-3" style={{ borderTop: "1px solid #e2e8f0" }}>
                <div className="text-left">
                  <p className="font-bold text-gray-700" style={{ fontSize: "1.4cqw" }}>{completionDate}</p>
                  <p className="uppercase text-gray-400 mt-0.5" style={{ fontSize: "0.95cqw", letterSpacing: "0.22em" }}>Date of Issue</p>
                </div>
                <p className="text-gray-300 uppercase" style={{ fontSize: "0.95cqw", letterSpacing: "0.15em" }}>ID: {certId}</p>
                <div className="text-right">
                  <p className="font-bold italic text-gray-700 font-serif" style={{ fontSize: "1.5cqw" }}>Anand Sahay</p>
                  <p className="uppercase text-gray-400 mt-0.5" style={{ fontSize: "0.95cqw", letterSpacing: "0.2em" }}>Global CEO, Xebia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
