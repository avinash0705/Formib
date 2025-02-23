import { useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (...args: Parameters<T>) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => func(...args), delay);
    };
};

let debounceTimeout: NodeJS.Timeout | null = null;

export const debouncePromise = <T>(func: () => Promise<T>, delay: number): (() => Promise<T>) => {
  return () => {
    return new Promise<T>((resolve, reject) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(() => {
        func()
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  };
};

