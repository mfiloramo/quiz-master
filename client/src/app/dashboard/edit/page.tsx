'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/question-listing/question-listing';
import { useQuiz } from '@/contexts/QuizContext';
import EditModalQuestion from '@/components/edit-modal-question/edit-modal-question';
import { motion } from 'framer-motion';

export default function EditQuiz(): ReactElement {
  // STATE HOOKS
  const [questions, setQuestions] = useState<QuestionListingType[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionListingType | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');

  // CONTEXT HOOKS
  const { selectedQuiz } = useQuiz();

  // FETCH ALL QUESTIONS FOR QUIZ
  const fetchQuestions = async (): Promise<void> => {
    if (!selectedQuiz?.id) return;
    try {
      const response = await fetch(`http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`);
      const data = await response.json();

      // FORMAT OPTIONS CORRECTLY
      const formattedData = data.map((question: any) => ({
        ...question,
        options:
          typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      }));

      setQuestions(formattedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // UPDATE QUESTIONS LISTING & OPEN MODAL
  const updateQuestionsModal = (updatedQuestion: QuestionListingType): void => {
    if (modalMode === 'edit') {
      setQuestions((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
    } else if (modalMode === 'add') {
      setQuestions((prev) => [...prev, updatedQuestion]);
    }
    setEditingQuestion(null);
  };

  // LOAD ONCE QUIZ SELECTED
  useEffect(() => {
    fetchQuestions().then((r) => r);
  }, [selectedQuiz]);

  return (
    <div className='flex flex-col'>
      {/* ADD QUESTION BUTTON */}
      <motion.button
        className='m-4 h-12 w-fit rounded bg-cyan-700 px-4 py-2 text-white shadow-lg transition hover:bg-cyan-600 active:bg-cyan-500'
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.005 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setModalMode('add');
          setEditingQuestion({
            id: 0,
            question: '',
            options: ['', '', '', ''],
            correct: '',
          });
        }}
      >
        Add Question
      </motion.button>

      {/* MODAL: EDIT OR ADD */}
      {editingQuestion && (
        <EditModalQuestion
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={updateQuestionsModal}
          mode={modalMode}
          quizId={selectedQuiz!.id}
        />
      )}

      {/* LIST QUESTIONS */}
      {questions.map((question, index) => (
        <QuestionListing
          key={question.id}
          id={question.id}
          question={question.question}
          options={question.options}
          correct={question.correct}
          index={index}
          onEdit={() => {
            setModalMode('edit');
            setEditingQuestion(question);
          }}
          onDelete={() => {
            setQuestions((prev) => prev.filter((q) => q.id !== question.id));
          }}
        />
      ))}
    </div>
  );
}
