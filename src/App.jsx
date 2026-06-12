import { useEffect } from "react";
import landingMarkup from "./landing.html?raw";

function useApoaLandingInteractions() {
  useEffect(() => {
    document.body.dataset.hero = "A";

    const cleanups = [];
    const timeouts = [];
    let anatomyTimer = null;
    let raf = null;

    const nav = document.getElementById("nav");
    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
    onScroll();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );
      revealEls.forEach((el) => revealObserver.observe(el));
      cleanups.push(() => revealObserver.disconnect());
    }

    const fieldList = document.getElementById("fieldList");
    const fieldBtns = Array.from(document.querySelectorAll("#fieldList button"));
    const codeLines = Array.from(document.querySelectorAll("#anatomyCode .ln"));
    const highlightLine = (lineNumber) => {
      codeLines.forEach((line) => {
        line.classList.toggle("hl", line.getAttribute("data-l") === String(lineNumber));
      });
    };
    const activateField = (button) => {
      fieldBtns.forEach((fieldButton) => fieldButton.classList.remove("active"));
      button.classList.add("active");
      highlightLine(button.getAttribute("data-line"));
    };
    fieldBtns.forEach((button) => {
      const activate = () => activateField(button);
      button.addEventListener("mouseenter", activate);
      button.addEventListener("focus", activate);
      button.addEventListener("click", activate);
      cleanups.push(() => {
        button.removeEventListener("mouseenter", activate);
        button.removeEventListener("focus", activate);
        button.removeEventListener("click", activate);
      });
    });

    let anatomyIndex = 0;
    let anatomyTouched = false;
    const autoCycleAnatomy = () => {
      if (anatomyTouched || fieldBtns.length === 0) return;
      activateField(fieldBtns[anatomyIndex % fieldBtns.length]);
      anatomyIndex += 1;
    };
    const anatomy = document.getElementById("what");
    if (anatomy && !prefersReducedMotion && "IntersectionObserver" in window) {
      const anatomyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !anatomyTimer && !anatomyTouched) {
              autoCycleAnatomy();
              anatomyTimer = window.setInterval(autoCycleAnatomy, 2200);
            }
          });
        },
        { threshold: 0.3 },
      );
      anatomyObserver.observe(anatomy);
      cleanups.push(() => anatomyObserver.disconnect());
    }
    if (fieldList) {
      const onFieldListEnter = () => {
        anatomyTouched = true;
        if (anatomyTimer) {
          window.clearInterval(anatomyTimer);
          anatomyTimer = null;
        }
      };
      fieldList.addEventListener("mouseenter", onFieldListEnter);
      cleanups.push(() => fieldList.removeEventListener("mouseenter", onFieldListEnter));
    }

    const flowSteps = Array.from(document.querySelectorAll("#flowTrack .flow-step"));
    const flowProg = document.getElementById("flowProg");
    const flowTrack = document.getElementById("flowTrack");
    let flowPlayed = false;
    const playFlow = () => {
      if (flowPlayed) return;
      flowPlayed = true;
      let index = 0;
      const step = () => {
        if (index >= flowSteps.length) return;
        flowSteps[index].classList.add("on");
        const progress = index / Math.max(flowSteps.length - 1, 1);
        if (flowProg) flowProg.style.right = String(100 - progress * 100) + "%";
        index += 1;
        timeouts.push(window.setTimeout(step, 620));
      };
      step();
    };
    if (flowTrack && !prefersReducedMotion && "IntersectionObserver" in window) {
      const flowObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && playFlow()),
        { threshold: 0.4 },
      );
      flowObserver.observe(flowTrack);
      cleanups.push(() => flowObserver.disconnect());
    } else {
      flowSteps.forEach((step) => step.classList.add("on"));
      if (flowProg) flowProg.style.right = "0%";
    }

    const canvas = document.getElementById("constellation");
    if (canvas && !prefersReducedMotion) {
      const ctx = canvas.getContext("2d");
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const olive = "110,119,64";
      let width = 0;
      let height = 0;
      let points = [];
      const mouse = { x: -9999, y: -9999 };

      const buildPoints = () => {
        let count = Math.max(14, Math.round((width * height) / 42000));
        count = Math.min(count, 46);
        points = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: Math.random() * 1.6 + 0.8,
        }));
      };

      const sizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildPoints();
      };

      const frame = () => {
        ctx.clearRect(0, 0, width, height);
        points.forEach((point) => {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x < 0 || point.x > width) point.vx *= -1;
          if (point.y < 0 || point.y > height) point.vy *= -1;
        });
        for (let a = 0; a < points.length; a += 1) {
          for (let b = a + 1; b < points.length; b += 1) {
            const dx = points[a].x - points[b].x;
            const dy = points[a].y - points[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
              ctx.strokeStyle = "rgba(" + olive + "," + ((1 - distance / 150) * 0.34) + ")";
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(points[a].x, points[a].y);
              ctx.lineTo(points[b].x, points[b].y);
              ctx.stroke();
            }
          }
        }
        points.forEach((point) => {
          const dx = point.x - mouse.x;
          const dy = point.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 170) {
            ctx.strokeStyle = "rgba(" + olive + "," + ((1 - distance / 170) * 0.5) + ")";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
        points.forEach((point) => {
          ctx.fillStyle = "rgba(" + olive + ",0.55)";
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
          ctx.fill();
        });
        raf = window.requestAnimationFrame(frame);
      };

      const onMouseMove = (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      };
      const onMouseLeave = () => {
        mouse.x = -9999;
        mouse.y = -9999;
      };
      parent?.addEventListener("mousemove", onMouseMove);
      parent?.addEventListener("mouseleave", onMouseLeave);
      cleanups.push(() => {
        parent?.removeEventListener("mousemove", onMouseMove);
        parent?.removeEventListener("mouseleave", onMouseLeave);
      });

      const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(sizeCanvas) : null;
      if (resizeObserver) {
        resizeObserver.observe(canvas);
        cleanups.push(() => resizeObserver.disconnect());
      } else {
        window.addEventListener("resize", sizeCanvas);
        cleanups.push(() => window.removeEventListener("resize", sizeCanvas));
      }
      sizeCanvas();
      frame();
    }

    return () => {
      if (anatomyTimer) window.clearInterval(anatomyTimer);
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      if (raf) window.cancelAnimationFrame(raf);
      cleanups.forEach((cleanup) => cleanup());
      delete document.body.dataset.hero;
    };
  }, []);
}

export default function App() {
  useApoaLandingInteractions();
  return <div className="apoa-landing" dangerouslySetInnerHTML={{ __html: landingMarkup }} />;
}
