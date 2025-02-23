import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { FormProvider } from './context/FormContext';
import FormBuilder from './pages/FormBuilder';
import PreviewForm from './pages/PreviewForm';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <FormProvider>
      <Router>
        <div className="flex flex-column h-screen">
          <Navbar />
          
          <div className="flex justify-content-center flex-1 overflow-auto p-4">
            <div className="w-full md:w-8 lg:w-6">
              <Routes>
                <Route path="/" element={<FormBuilder />} />
                <Route path="/preview" element={<PreviewForm />} />
              </Routes>
            </div>
          </div>
        </div>
          <Toaster/>
        </Router>
    </FormProvider>
  );
};

export default App;
