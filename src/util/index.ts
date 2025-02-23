import { useRef, useCallback } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number,
    options: { leading?: boolean; trailing?: boolean } = { trailing: true }
) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastArgsRef = useRef<Parameters<T> | null>(null);
    const isFirstCallRef = useRef(true);

    return useCallback(
        (...args: Parameters<T>) => {
            const { leading = false, trailing = true } = options;

            if (leading && isFirstCallRef.current) {
                func(...args);
                isFirstCallRef.current = false;
            }

            lastArgsRef.current = args;

            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                if (trailing && lastArgsRef.current) {
                    func(...lastArgsRef.current);
                }
                isFirstCallRef.current = true;
            }, delay);
        },
        [options, delay, func]
    );
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

