import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';
import { MOTION_TOKENS } from '../constants/motionTokens';
import { formatNumberID } from '../constants/labels';

const MotionContext = createContext({
  reducedMotion: false,
  demoOff: false,
  toggleReducedMotion: () => {}
});

/**
 * Provider preferensi animasi yang menghormati:
 * 1. Media query `prefers-reduced-motion: reduce` dari sistem operasi
 * 2. Parameter URL `?demo=off` (atau `?demo=on`) untuk kontrol saat presentasi lomba
 * 3. Tombol manual "Kurangi Animasi" di Navbar
 */
export function MotionProvider({ children }) {
  const [osReduced, setOsReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [manualOff, setManualOff] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const demoParam = params.get('demo');
    if (demoParam === 'off') return true;
    if (demoParam === 'on') return false;
    try {
      return window.localStorage.getItem('eduinsight_reduced_motion') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setOsReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleReducedMotion = () => {
    setManualOff((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem('eduinsight_reduced_motion', String(next));
      } catch {
        // Abaikan jika penyimpanan lokal dibatasi
      }
      return next;
    });
  };

  const reducedMotion = osReduced || manualOff;

  return (
    <MotionContext.Provider
      value={{
        reducedMotion,
        demoOff: manualOff,
        osReduced,
        toggleReducedMotion
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMotionPreferences() {
  return useContext(MotionContext);
}

/**
 * Hook Count-Up angka dengan kurva ease-out (durasi 500–900 ms) dan format locale id-ID.
 * Hanya berjalan sekali saat elemen masuk viewport.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCountUp(
  targetValue,
  {
    duration = MOTION_TOKENS.duration.countUp,
    decimals = 1,
    prefix = '',
    suffix = '',
    delay = 0
  } = {}
) {
  const { reducedMotion } = useMotionPreferences();
  const [element, setElement] = useState(null);
  const [currentValue, setCurrentValue] = useState(() =>
    reducedMotion ? Number(targetValue) || 0 : 0
  );
  const hasAnimatedRef = useRef(false);
  const prevTargetRef = useRef(targetValue);

  useEffect(() => {
    const numTarget = Number(targetValue) || 0;

    if (reducedMotion) {
      hasAnimatedRef.current = true;
      prevTargetRef.current = targetValue;
      return;
    }

    const startAnimation = (fromVal, toVal, animDelay) => {
      let rafId = null;
      let timeoutId = null;

      const run = () => {
        const startTime = performance.now();
        const step = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Cubic ease-out: 1 - (1 - t)^3
          const eased = 1 - Math.pow(1 - progress, 3);
          const nextVal = fromVal + (toVal - fromVal) * eased;
          setCurrentValue(nextVal);
          if (progress < 1) {
            rafId = requestAnimationFrame(step);
          } else {
            setCurrentValue(toVal);
          }
        };
        rafId = requestAnimationFrame(step);
      };

      if (animDelay > 0) {
        timeoutId = setTimeout(run, animDelay);
      } else {
        run();
      }

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    };

    // Jika sudah pernah animasi masuk dan nilai target berubah (misal ganti tab indikator),
    // transisikan halus dari nilai sebelumnya ke nilai baru
    if (hasAnimatedRef.current && prevTargetRef.current !== targetValue) {
      const fromVal = Number(prevTargetRef.current) || 0;
      prevTargetRef.current = targetValue;
      return startAnimation(fromVal, numTarget, 0);
    }

    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      hasAnimatedRef.current = true;
      return startAnimation(0, numTarget, delay);
    }

    let cleanupAnim = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            prevTargetRef.current = targetValue;
            cleanupAnim = startAnimation(0, numTarget, delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (cleanupAnim) cleanupAnim();
    };
  }, [element, targetValue, duration, delay, reducedMotion]);

  const effectiveValue = reducedMotion ? Number(targetValue) || 0 : currentValue;
  const formatted = `${prefix}${formatNumberID(effectiveValue, decimals)}${suffix}`;
  return { ref: setElement, value: formatted, rawValue: effectiveValue };
}

/**
 * Komponen Reveal: menganimasikan elemen sekali saat masuk viewport
 * hanya menggunakan `transform` (translate3d / scale) dan `opacity` tanpa layout shift.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  duration = MOTION_TOKENS.duration.reveal,
  y = MOTION_TOKENS.distance.revealY,
  scale = 1,
  as: Component = 'div',
  ...rest
}) {
  const { reducedMotion } = useMotionPreferences();
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const isShown = reducedMotion || visible;

  const style = reducedMotion
    ? undefined
    : {
        opacity: isShown ? 1 : 0,
        transform: isShown
          ? 'translate3d(0, 0, 0) scale(1)'
          : `translate3d(0, ${y}px, 0) scale(${scale})`,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: MOTION_TOKENS.easing.easeOut,
        transitionDelay: `${delay}ms`,
        willChange: isShown ? 'auto' : 'transform, opacity'
      };

  return (
    <Component ref={ref} className={className} style={style} {...rest}>
      {children}
    </Component>
  );
}

function PageTransitionInner({ children, className = '', reducedMotion }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const raf = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const isShown = reducedMotion || entered;

  const style = reducedMotion
    ? undefined
    : {
        opacity: isShown ? 1 : 0,
        transform: isShown
          ? 'translate3d(0, 0, 0)'
          : `translate3d(0, ${MOTION_TOKENS.distance.pageSlideY}px, 0)`,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${MOTION_TOKENS.duration.pageTransition}ms`,
        transitionTimingFunction: MOTION_TOKENS.easing.easeOut
      };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Komponen PageTransition: menganimasikan perpindahan halaman/tab
 * dengan fade + geser vertikal 10px (8–12 px) tanpa layout shift.
 */
export function PageTransition({ activeKey, children, className = '' }) {
  const { reducedMotion } = useMotionPreferences();
  return (
    <PageTransitionInner
      key={activeKey}
      className={className}
      reducedMotion={reducedMotion}
    >
      {children}
    </PageTransitionInner>
  );
}

/**
 * Komponen AnimatedBar: menganimasikan batang progres/grafik menggunakan
 * murni `transform: scaleX(...)` atau `transform: scaleY(...)` (tanpa animasi width/height).
 */
export function AnimatedBar({
  percent = 0,
  direction = 'horizontal',
  delay = 0,
  duration = MOTION_TOKENS.duration.barGrow,
  className = '',
  style: customStyle = {},
  title
}) {
  const { reducedMotion } = useMotionPreferences();
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const isShown = reducedMotion || visible;
  const clamped = Math.min(100, Math.max(0, Number(percent) || 0));
  const ratio = clamped / 100;

  const isHorizontal = direction === 'horizontal';
  const transformValue = isShown
    ? isHorizontal
      ? `scaleX(${ratio})`
      : `scaleY(${ratio})`
    : isHorizontal
    ? 'scaleX(0)'
    : 'scaleY(0)';

  return (
    <div
      ref={ref}
      title={title}
      className={`w-full h-full ${className}`}
      style={{
        ...customStyle,
        transformOrigin: isHorizontal ? 'left center' : 'center bottom',
        transform: transformValue,
        transitionProperty: reducedMotion ? 'none' : 'transform, background-color',
        transitionDuration: reducedMotion ? '0ms' : `${duration}ms`,
        transitionTimingFunction: MOTION_TOKENS.easing.easeOut,
        transitionDelay: reducedMotion ? '0ms' : `${delay}ms`
      }}
    />
  );
}

/**
 * Komponen SkeletonShimmer: satu-satunya animasi berulang saat memuat,
 * lalu fade halus ke konten utama.
 */
export function SkeletonShimmer({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-xl bg-[#0f2d3d]/60 ${className}`}
    />
  );
}
