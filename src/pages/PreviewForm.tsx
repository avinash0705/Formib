import { useEffect, useState, useContext } from "react";
import { FormContext } from "../context/FormContext";
import { validateAnswersForm, ValidationErrors } from "../services/validationService";
import { loadFormFromLocalStorage } from "../services/localStorageService";
import { Card } from "primereact/card";
import { Answer, FormState, Question } from "../types";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { HelperText } from "../components/HelperText";
import toast from 'react-hot-toast';

const PreviewForm: React.FC = () => {
    const formContext = useContext(FormContext);
    const initialFormState: FormState = {
        formName: "",
        questions: [],
    };

    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!formContext) {
        throw new Error("PreviewForm must be used within a FormProvider");
    }

    const { questions, formName } = formState;

    useEffect(() => {
        const loadSavedForm = async () => {
            setIsLoading(true);
            const savedForm = await loadFormFromLocalStorage();
            if (savedForm) {
                setFormState(savedForm);

                const initialAnswers = savedForm.questions.map((q: Question) => ({
                    questionId: q.id,
                    ans: null,
                }));
                setAnswers(initialAnswers);
            }
            setIsLoading(false);
        };
        loadSavedForm();
    }, []);

    const handleInputChange = (questionId: string, value: string | number | null) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = prevAnswers.map((answer) =>
                answer.questionId === questionId ? { ...answer, ans: value } : answer
            );

            const validationErrors = validateAnswersForm(questions, updatedAnswers);
            setErrors(validationErrors);
            return updatedAnswers;
        });
    };

    const handleSubmit = () => {
        const validationErrors = validateAnswersForm(questions, answers);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("Validation failed:", validationErrors);
        } else {
            console.log("Form submitted successfully with answers:", answers);
            toast.success("Form saved successfully!", { position: 'bottom-left' });
            setIsSubmitted(true);
        }
    };

    if (isLoading) {
        return <h2 className="text-xl font-bold mb-4">Loading form...</h2>;
    }

    return (
        <div className="p-1">
            <h2 className="text-xl font-bold mb-4">{formName || "Preview Form"}</h2>

            {isSubmitted ? (
                <div>
                    <h3 className="font-semibold text-xl">Form Submission Summary</h3>
                    <div className="mt-4">
                        <ul>
                            {answers.map((answer) => {
                                const question = questions.find((q) => q.id === answer.questionId);
                                return (
                                    <li key={answer.questionId} className="mb-2">
                                        <strong>{question?.label}</strong>: {answer.ans || "No answer"}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <button
                        className="p-button p-component mt-4"
                        onClick={() => {
                            setIsSubmitted(false);
                            setAnswers(answers.map((a) => ({ ...a, ans: null })));
                        }}
                    >
                        Fill Again
                    </button>
                </div>
            ) : (
                <>
                    {questions.length === 0 ? (
                        <p>No questions added yet.</p>
                    ) : (
                        <Card className="mb-3">
                            {questions.map((question) => {
                                const answer = answers.find((a) => a.questionId === question.id)?.ans || null;

                                return (
                                    <div key={question.id} className="mb-4">
                                        <div className="flex justify-content-between items-center gap-2 mb-2">
                                            <label htmlFor={question.id} className="text-sm font-medium text--blue-200">
                                                {question.label}
                                                {question.required && <span className="text-red"> *</span>}
                                            </label>
                                            {question.helperText && <HelperText helperText={question.helperText} />}
                                        </div>

                                        {question.type === "text" && (
                                            <InputText
                                                autoComplete="off"
                                                id={question.id}
                                                type={question.textType}
                                                maxLength={question.maxLength || 200}
                                                value={(answer || "") as string}
                                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                                className={`w-full p-inputtext-sm ${errors[question.id] ? "p-invalid" : ""}`}
                                            />
                                        )}

                                        {question.type === "number" && (
                                            <InputNumber
                                                id={question.id}
                                                value={(answer || null) as number}
                                                maxLength={question.maxLength || 200}
                                                onChange={(e) => handleInputChange(question.id, e.value)}
                                                className={`w-full p-inputtext-sm ${errors[question.id] ? "p-invalid" : ""}`}
                                            />
                                        )}

                                        {question.type === "select" && (
                                            <Dropdown
                                                options={question.options}
                                                value={answer}
                                                onChange={(e) => handleInputChange(question.id, e.value)}
                                                placeholder="Select an option"
                                                className={`w-full p-dropdown-lg ${errors[question.id] ? "p-invalid" : ""}`}
                                            />
                                        )}

                                        {errors[question.id] && <small className="p-error">{errors[question.id]}</small>}
                                    </div>
                                );
                            })}
                        </Card>
                    )}
                    <button className="p-button p-component" onClick={handleSubmit}>
                        Submit
                    </button>
                </>
            )}
        </div>
    );
};

export default PreviewForm;
