import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useState } from "react";
import { FormContext } from "../context/FormContext";
import { Button } from "primereact/button";
import { loadFormFromLocalStorage, saveFormToLocalStorage } from "../services/localStorageService";
import toast from 'react-hot-toast';
import { useDebounce } from "../util";

const FormHeader: React.FC = () => {
  const { state, dispatch } = useContext(FormContext)!;
  const [isMainActionDisabled, setIsMainActionDisabled] = useState(true);
  const [saveResult, setSaveResult] = useState<'saving' | 'success' | 'failed'>('success');

  const saveBtnTxt: string = (saveResult === "saving") ? "Saving" : "Save";

  useEffect(() => {
    const checkSavedForm = async () => {
      const savedForm = await loadFormFromLocalStorage();
      setIsMainActionDisabled(!savedForm || savedForm.questions.length === 0);
    };

    checkSavedForm();
  }, [state.questions]);

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
    setIsMainActionDisabled(true);
  };

  const handleManualSave = async () => {
    try {
        setSaveResult("saving");
        const response = await saveFormToLocalStorage(state);
        console.log("SAVED FORM", response);

        if (response === "Form Saved") {
          setSaveResult('success');
          toast.success("Form saved successfully!", { position: 'bottom-left' });
        }
      } catch (error) {
        setSaveResult('failed');
      }
  };

  const debouncedSave = useDebounce(handleManualSave, 1500);

  const saveForm = (): void => {
    setSaveResult("saving");
    debouncedSave();
  }

  return (
    <div className="p-1">
      <div className="flex flex-col md:flex-row justify-content-between align-items-center items-start md:items-center">
        <h2 className="text-xl font-semibold">Form Builder</h2>
        
        <div className="flex flex-col md:flex-row gap-4 align-items-center">
          <Button
            label={saveBtnTxt}
            icon="pi pi-save"
            onClick={saveForm}
            severity="success"
            text
            size="small"
            className="p-0 text-xs"
          />

          <Button
            label="Reset"
            icon="pi pi-refresh"
            onClick={resetForm}
            disabled={isMainActionDisabled}
            severity="secondary"
            text
            size="small"
            className="p-0 text-xs"
          />
        </div>
      </div>

      <InputText
        autoComplete="off"
        value={state.formName}
        onChange={(e) => dispatch({ type: "SET_FORM_NAME", payload: e.target.value })}
        placeholder="Enter Form Name"
        className="p-inputtext-lg text-base w-full mt-2"
      />
    </div>
  );
};

export default FormHeader;
