import { Answer, Question } from "../types";

export type ValidationErrors = Record<string, string>;

export const validateQuestion = (question: Question): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!question.label.trim()) {
    errors.label = "Question label is required.";
  }

  if (question.type === "number") {
    if (question.min !== undefined && question.max !== undefined && question.min > question.max) {
      errors.minMax = "Min value cannot be greater than max value.";
    }
  }

  if (question.type === "select" && question.options?.length === 0) {
    errors.options = "At least one option is required for a select question.";
  }

  return errors;
};

export const validateForm = (questions: Question[]): ValidationErrors[] => {
  return questions.map(validateQuestion);
};


export const validateAnswer = (question: Question, answer: string | number | null): string | null => {
    if (question.required && (answer === null || answer === "")) {
      return "This field is required.";
    }
  
    if (question.type === "number") {
      if (typeof answer === "number") {
        if (question.min !== undefined && answer < question.min) {
          return `Value must be at least ${question.min}.`;
        }
        if (question.max !== undefined && answer > question.max) {
          return `Value must be at most ${question.max}.`;
        }
      } else if (answer !== null) {
        return "Please enter a valid number.";
      }
    }
  
    if (question.type === "select") {
      if (question.options && !question.options.includes(answer as string)) {
        return "Invalid selection.";
      }
    }
  
    return null;
  };
  

  export const validateAnswersForm = (
    questions: Question[],
    answers: Answer[]
  ): ValidationErrors => {
    const errors: ValidationErrors = {};
  
    questions.forEach((question) => {
      const answerObj = answers.find((a) => a.questionId === question.id);
      const error = validateAnswer(question, answerObj?.ans ?? null);
  
      if (error) {
        errors[question.id] = error;
      }
    });
  
    return errors;
  };
