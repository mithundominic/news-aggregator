import { useEffect, RefObject } from 'react';

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, callback, options]);
}