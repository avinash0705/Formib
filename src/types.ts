
export type FormAction =
  | { type: "ADD_QUESTION"; payload: Question }
  | { type: "UPDATE_QUESTION"; payload: { id: string; field: string; value: QuestionValueType } }
  | { type: "DELETE_QUESTION"; payload: string }
  | { type: "SET_FORM_NAME"; payload: string }
  | { type: "LOAD_FORM"; payload: FormState }
  | { type: "RESET_FORM" }
  | { type: "START_SAVING"; payload: string }
  | { type: "REPLACE_QUESTION"; payload: Question}
  | { type: "FINISH_SAVING"; payload: string };


export type QuestionType = "text" | "number" | "select";

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  hidden: boolean;
  options?: string[];
  maxLength?: number;
  min?: number;
  max?: number;
  isSaving?: boolean;
  isParagraph: boolean;
  helperText: string;
  textType: string;
}

export interface FormContextProps {
    state: FormState;
    dispatch: React.Dispatch<FormAction>;
}


export interface Answer {
    questionId: string;
    ans: string | number | null;
}


export interface FormState {
    formName: string;
    questions: Question[];
}


export type  QuestionValueType = string | number | boolean | string[] | null;
