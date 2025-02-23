import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormContext } from "../context/FormContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { FloatLabel } from 'primereact/floatlabel';
import { ProgressSpinner } from "primereact/progressspinner";
import { Question, QuestionType, QuestionValueType } from "../types";
import "../styles/components/QuestionEditor.css";
import { validateQuestion, ValidationErrors } from "../services/validationService";
import { useDebounce } from "../util";
import { questionTypes, textTypes } from "../config";
import { Chips } from 'primereact/chips';



const QuestionEditor: React.FC = () => {
    const formContext = useContext(FormContext);
    const [errors, setErrors] = useState<Record<string, ValidationErrors>>({});

    if (!formContext) {
        throw new Error("QuestionEditor must be used within a FormProvider");
    }

    const { state, dispatch } = formContext;
    const { questions } = state;

    const saveQuestion = (id: string) => {
        const question = questions.find(q => q.id === id);
        if (!question) return;

        dispatch({ type: "START_SAVING", payload: id });

        setTimeout(() => {
            dispatch({ type: "FINISH_SAVING", payload: id });
        }, 1000);
    };

    const debouncedSaveQuestion = useDebounce(saveQuestion, 800);


    const handleValidationErrorsAndSaveQuestion = (id: string, field: string, value: any) => {
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            const updatedQuestion = questions.find(q => q.id === id);

            if (updatedQuestion) {
                const validationErrors = validateQuestion({ ...updatedQuestion, [field]: value });

                if (Object.keys(validationErrors).length === 0) {
                    delete newErrors[id];

                    debouncedSaveQuestion(id);
                } else {
                    newErrors[id] = validationErrors;
                }
            }

            return newErrors;
        });
    };

    const getUpdatedQuestionType = (id: string, field: string, value: QuestionType): Question | null => {
        try {
            const question = questions.find(question => question.id === id);
            if(question) {
                return {
                    id,
                    label: question.label,
                    type: value,
                    required: false,
                    hidden: false,
                    isParagraph: false,
                    maxLength: undefined,
                    helperText: "",
                    textType: "normal",
                    min: undefined,
                    max: undefined,
                    options: [],
                };
            }
            throw new Error("no question found");
        } catch (err) {
            console.warn(err);
            return null;
        }
        
    }

    const updateQuestion = (id: string, field: string, value: QuestionValueType) => {

        switch (field) {
            case "type":
                const updatedQuestion = getUpdatedQuestionType(id, field, value as QuestionType);
                if(updatedQuestion) {
                    dispatch({ type: "REPLACE_QUESTION", payload: {...updatedQuestion}  });
                }
                break;
        
            default:
                dispatch({ type: "UPDATE_QUESTION", payload: { id, field, value } });
                break;
        }



        handleValidationErrorsAndSaveQuestion(id, field, value);

    };


    const addQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            label: "",
            type: "text",
            required: false,
            hidden: false,
            isSaving: false,
            isParagraph: false,
            maxLength: undefined,
            helperText: "",
            textType: "normal",
            min: undefined,
            max: undefined,
            options: [],
        };
        dispatch({ type: "ADD_QUESTION", payload: newQuestion });
    };

    






    return (
        <div className="p-1 pt-3">
            <div className="flex  align-items-center">
                <Button
                    label="Add Question"
                    icon="pi pi-plus"
                    onClick={addQuestion}
                    className="mb-4 p-button-sm p-button-outlined p-button-primary "
                />
            </div>

            <Accordion >
                {questions.map((question, idx) => {
                    return (
                        <AccordionTab
                            key={question.id}
                            headerClassName="head"
                            unstyled={true}
                            header={
                                <div className="flex justify-content-between align-items-center	 items-center w-full h-full">
                                        <span className="font-semibold text-base ques-title hidden sm:block ">
                                            {question.label || "New Question"}
                                        </span>
                                        
                                        <span className="font-semibold text-base block sm:hidden">
                                            Q{idx + 1}
                                        </span>

                                    <div className="flex justify-content-between align-items-center items-center gap-3">
                                        {question.isSaving && (
                                            <ProgressSpinner style={{ width: "18px", height: "18px" }} strokeWidth="6" />
                                        )}
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-danger p-button-text p-button-sm"
                                            onClick={() => dispatch({ type: "DELETE_QUESTION", payload: question.id })}
                                            tooltip="Delete question"
                                            tooltipOptions={{ position: "top" }}
                                        />
                                    </div>
                                </div>
                            }
                        >
                            <div className="formgrid grid">
                                <div className="field col-12 grid grid-nogutter w-full">
                                    <div className="col-12 p-0 pt-3">
                                        <FloatLabel>
                                            <InputText
                                                autoComplete="off"
                                                id={`label-${question.id}`}
                                                value={question.label}
                                                onChange={(e) => updateQuestion(question.id, "label", e.target.value)}
                                                className={`w-full p-inputtext-sm ${errors[question.id]?.label ? "p-invalid" : ""}`}
                                            />
                                            <label htmlFor={`label-${question.id}`} className="text-xs">Question Label</label>
                                        </FloatLabel>
                                        {errors[question.id]?.label && <small className="p-error">{errors[question.id]?.label}</small>}
                                    </div>
                                </div>


                                <div className=" field col-12 md:col-6 pt-4">
                                    <FloatLabel>
                                        <Dropdown
                                            value={question.type}
                                            options={questionTypes}
                                            onChange={(e) => updateQuestion(question.id, "type", e.value)}
                                            placeholder="Select a type"
                                            className="w-full p-dropdown-lg p-inputtext-sm"
                                        />
                                        <label className="text-xs">Question Type</label>
                                    </FloatLabel>
                                </div>
                                <div className="flex align-items-center field col-12 md:col-6  md:pt-4">
                                    <Checkbox
                                        inputId={`required-${question.id}`}
                                        checked={question.required}
                                        onChange={(e) => updateQuestion(question.id, "required", e.checked || false)}
                                    />
                                    <label htmlFor={`required-${question.id}`} className="ml-2 mt-2 cursor-pointer">Required</label>
                                </div>

                                {question.type === "text" && (
                                    <>
                                        <div className=" field col-12 md:col-6 pt-4">
                                            <FloatLabel>
                                                <label className="text-xs">Text Type</label>
                                                <Dropdown
                                                    value={question.textType}
                                                    options={textTypes}
                                                    onChange={(e) => updateQuestion(question.id, "textType", e.value)}
                                                    className="w-full p-dropdown-lg p-inputtext-sm"
                                                />
                                            </FloatLabel>
                                        </div>
                                        <div className="field col-12 md:col-6 pt-2 pt-4">
                                            <FloatLabel>
                                                <InputNumber
                                                    id={`maxLength-${question.id}`}
                                                    value={question.maxLength}
                                                    onChange={(e) => updateQuestion(question.id, "maxLength", e.value)}
                                                    className={`w-full p-inputtext-sm `}
                                                />
                                                <label htmlFor={`maxLength-${question.id}`} className="text-xs">Max length</label>
                                            </FloatLabel>
                                        </div>
                                    </>
                                )}

                                {question.type === "number" && (
                                    <>
                                        <div className="field col-12 md:col-6 pt-4">
                                            <FloatLabel>
                                                <InputNumber
                                                    id={`min-${question.id}`}
                                                    value={question.min}
                                                    onChange={(e) => updateQuestion(question.id, "min", e.value)}
                                                    className="w-full p-inputtext-sm min-w-0"
                                                />
                                                <label className="text-xs" htmlFor={`min-${question.id}`}>Min Value</label>
                                            </FloatLabel>
                                        </div>
                                        <div className="field col-12 md:col-6 pt-4">
                                            <FloatLabel>
                                                <InputNumber
                                                    id={`max-${question.id}`}
                                                    value={question.max}
                                                    onChange={(e) => updateQuestion(question.id, "max", e.value)}
                                                    className="w-full p-inputtext-sm min-w-0"
                                                />
                                                <label className="text-xs" htmlFor={`max-${question.id}`}>Max Value</label>
                                            </FloatLabel>
                                        </div>
                                    </>
                                )}

                                {question.type === "select" && (
                                    <div className="field col-12 pt-4">
                                        <FloatLabel>
                                            <Chips
                                                id={`options-${question.id}`}
                                                value={question.options}
                                                onChange={(e) => updateQuestion(question.id, "options", e.value || "")}
                                                separator=","
                                                className={`w-full p-inputtext-xs ${errors[question.id]?.options ? "p-invalid" : ""}`}
                                                variant="outlined"
                                            />
                                            <label className="text-xs" htmlFor={`options-${question.id}`}>Options (Comma separated)</label>
                                        </FloatLabel>
                                        {errors[question.id]?.options && <small className="p-error">{errors[question.id]?.options}</small>}
                                    </div>
                                )}


                                <div className="field col-12 w-full pt-4">
                                    <FloatLabel>
                                        <InputText
                                            id={`helpText-${question.id}`}
                                            value={question.helperText}
                                            maxLength={500}
                                            onChange={(e) => updateQuestion(question.id, "helperText", e.target.value)}
                                            className={`w-full p-inputtext-sm`}
                                        />
                                        <label htmlFor={`helpText-${question.id}`} className="text-xs">Help Text</label>
                                    </FloatLabel>
                                </div>



                            </div>
                        </AccordionTab>
                    )}
                )}
            </Accordion>
        </div>
    );
};

export default QuestionEditor;
