'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/question-listing/question-listing';
import { useQuiz } from '@/contexts/QuizContext';
import EditModalQuestion from '@/components/edit-modal-question/edit-modal-question';

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

  // LOAD ONCE QUIZ SELECTED
  useEffect(() => {
    fetchQuestions();
  }, [selectedQuiz]);

  return (
    <div className='flex flex-col'>
      {/* ADD QUESTION BUTTON */}
      <button
        className='m-4 h-24 w-32 rounded bg-blue-700 text-white'
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
      </button>

      {/* MODAL: EDIT OR ADD */}
      {editingQuestion && (
        <EditModalQuestion
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={(updatedQuestion) => {
            if (modalMode === 'edit') {
              setQuestions((prev) =>
                prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
              );
            } else if (modalMode === 'add') {
              setQuestions((prev) => [...prev, updatedQuestion]);
            }
            setEditingQuestion(null);
          }}
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
