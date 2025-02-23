import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useContext, useState } from "react";
import { Question, QuestionType } from "../types";
import { v4 as uuidv4 } from "uuid";
import { FormContext } from "../context/FormContext";

const AddQuestion: React.FC = () => {
  const { dispatch } = useContext(FormContext)!;
  const [type, setType] = useState<QuestionType>("text");

  const addQuestion = () => {
    const newQuestion: Question = {
        id: uuidv4(),
        label: "",
        type,
        required: false,
        hidden: false,
        helperText: "",
        textType: "",
        isParagraph: false
    };
    dispatch({ type: "ADD_QUESTION", payload: newQuestion });
  };

  return (
    <div className="p-3">
      <Dropdown
        value={type}
        options={[
          { label: "Text", value: "text" },
          { label: "Number", value: "number" },
          { label: "Select", value: "select" },
        ]}
        onChange={(e) => setType(e.value)}
        placeholder="Select Question Type"
        className="w-full"
      />
      <Button label="Add Question" icon="pi pi-plus" className="mt-2" onClick={addQuestion} />
    </div>
  );
};

export default AddQuestion;
