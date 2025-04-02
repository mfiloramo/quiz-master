import { QuizQuestion } from "@/types/Quiz.types";
import { motion } from "framer-motion";

type QuizModuleProps = {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (option: string) => void;
};

export default function QuizModule({ question, questionNumber, totalQuestions, onSubmit }: QuizModuleProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">
        Question { questionNumber } of { totalQuestions }
      </h2>
      <p className="mb-6 text-lg">{ question.question }</p>
      <motion.ul className="space-y-3">
        { question.options.map((option, index) => (
          <motion.li
            key={ index }
            whileHover={ { scale: 1.03 } }
            whileTap={ { scale: 0.99 } }
            transition={ { duration: 0.001 } }
            onClick={ () => onSubmit(option) }
            className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition cursor-pointer"
          >
            { option }
          </motion.li>
        )) }
      </motion.ul>
    </div>
  );
}
