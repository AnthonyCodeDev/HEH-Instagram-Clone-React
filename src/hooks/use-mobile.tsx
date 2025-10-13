import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const SIDEBAR_BREAKPOINT = 1300;
const QUICKADD_BREAKPOINT = 1000;

// Hook pour obtenir les classes CSS conditionnelles sans animation au chargement initial
export function useBreakpointClass(breakpoint: number, classWhenBelow: string, classWhenAbove: string = "") {
  // Initialiser directement avec la bonne valeur pour éviter le flash
  const [className, setClassName] = React.useState<string>(() => {
    return window.innerWidth < breakpoint ? classWhenBelow : classWhenAbove;
  });

  // Suivre les changements de taille d'écran après le chargement initial
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const onChange = () => {
      setClassName(window.innerWidth < breakpoint ? classWhenBelow : classWhenAbove);
    };

    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint, classWhenBelow, classWhenAbove]);

  return className;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export function useSidebarBreakpoint() {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SIDEBAR_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsBelow(window.innerWidth < SIDEBAR_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsBelow(window.innerWidth < SIDEBAR_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isBelow;
}

export function useQuickAddBreakpoint() {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${QUICKADD_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsBelow(window.innerWidth < QUICKADD_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsBelow(window.innerWidth < QUICKADD_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isBelow;
}
