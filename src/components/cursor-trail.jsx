import { useEffect, useRef } from "react";

export function CursorTrail() {
  const dotRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    // Only run on client-side and ignore touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const circle = circleRef.current;
    if (!dot || !circle) return;

    const dotInner = dot.firstElementChild;
    const circleInner = circle.firstElementChild;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;

    let isHovering = false;
    let isClicking = false;
    let isText = false;
    let isHidden = false;

    // Inject global styles to hide the default cursor
    // The .show-default-cursor class will revert this when hovering over text
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      body:not(.show-default-cursor) * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    let animationFrameId;

    const render = () => {
      // Easing factor for the outer circle (lower = smoother/slower)
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;

      // Translate wrapper divs using 3D transforms for hardware acceleration
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      circle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;

      // Scale inner divs based on interaction state
      const dotScale = isClicking ? 0.5 : isHovering ? 0 : 1;
      const circleScale = isClicking ? 0.8 : isHovering ? 1.6 : 1;

      dotInner.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
      circleInner.style.transform = `translate(-50%, -50%) scale(${circleScale})`;

      // Handle opacity
      const showTextCursor = isText;
      const opacity = isHidden || showTextCursor ? 0 : 1;

      dot.style.opacity = opacity;
      // If hovering, make the circle more opaque
      circle.style.opacity = isHidden || showTextCursor ? 0 : isHovering ? 0.6 : 0.4;

      if (showTextCursor) {
        document.body.classList.add("show-default-cursor");
      } else {
        document.body.classList.remove("show-default-cursor");
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHidden = false;

      const target = e.target;
      if (!target) return;

      const tagName = target.tagName?.toLowerCase();
      const isInput =
        tagName === "input" ||
        tagName === "textarea" ||
        target.isContentEditable ||
        tagName === "code" ||
        tagName === "pre";
      const hasSelection = window.getSelection()?.toString().length > 0;

      if (isInput || hasSelection) {
        isText = true;
        isHovering = false;
      } else {
        isText = false;
        // Check for interactive elements
        const isInteractive =
          target.closest("button") ||
          target.closest("a") ||
          target.closest('[role="button"]') ||
          window.getComputedStyle(target).cursor === "pointer";
        isHovering = !!isInteractive;
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
    };
    const handleMouseUp = () => {
      isClicking = false;
    };
    const handleMouseLeave = () => {
      isHidden = true;
    };
    const handleMouseEnter = () => {
      isHidden = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
      document.body.classList.remove("show-default-cursor");
    };
  }, []);

  // Return null on touch devices so no cursor elements are rendered
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      style={{
        pointerEvents: "none",
        zIndex: 9999,
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Outer easing circle */}
      <div
        ref={circleRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          willChange: "transform, opacity",
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          className="border-[#6C1D5F] dark:border-primary bg-[#6C1D5F]/10 dark:bg-primary/10 backdrop-blur-[1px]"
          style={{
            width: "36px",
            height: "36px",
            borderWidth: "2px",
            borderStyle: "solid",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        />
      </div>

      {/* Inner instant dot */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          willChange: "transform, opacity",
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          className="bg-[#6C1D5F] dark:bg-primary shadow-sm"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            transition: "transform 0.15s ease-out",
          }}
        />
      </div>
    </div>
  );
}
