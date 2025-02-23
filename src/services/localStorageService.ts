import { FORM_STORAGE_KEY } from "../config";
import toast from 'react-hot-toast';
import { debouncePromise } from "../util";

const retryAction = async (action: Function, retries: number = 3, delay: number = 1000, errorProbability: number = 0.2) => {
  let lastError = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (Math.random() < errorProbability) {
        throw new Error("Simulated random error");
      }

      return await action();
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

export const saveFormToLocalStorage = (formState: any): Promise<string> => {
    const saveForm = async (): Promise<string> => {
      try {
        await retryAction(() => {
          localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formState));
          return Promise.resolve("Form Saved");
        });
        return "Form Saved";
      } catch (error) {
        console.error("Error saving form data to localStorage:", error);
        toast.dismiss();
        toast.error("Failed to save form data, Please try saving manually again", {
          position: 'bottom-left',
        });
        return "";
      }
    };
  
    const debouncedSave = debouncePromise(saveForm, 3000);
  
    return debouncedSave();
  };

export const loadFormFromLocalStorage = async (): Promise<any | null> => {
  try {
    const formData = await retryAction(() => {
      const savedForm = localStorage.getItem(FORM_STORAGE_KEY);
      return Promise.resolve(savedForm ? JSON.parse(savedForm) : null);
    });
    
    return formData;
  } catch (error) {
    console.error("Error loading form data from localStorage:", error);
    return null;
  }
};

export const clearFormFromLocalStorage = async () => {
  try {
    await retryAction(() => {
      localStorage.removeItem(FORM_STORAGE_KEY);
      return Promise.resolve();
    });
  } catch (error) {
    console.error("Error clearing form data from localStorage:", error);
  }
};
