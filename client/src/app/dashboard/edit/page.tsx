'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/QuestionListing/QuestionListing';
import EditQuestionModal from '@/components/EditQuestionModal/EditQuestionModal';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';

export default function EditQuiz(): ReactElement {
  // CONTEXT HOOKS
  const { selectedQuiz } = useQuiz();
  const router = useRouter();

  // STATE HOOKS
  const [questions, setQuestions] = useState<QuestionListingType[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuestionListingType | null>(null);
  const [modalMode, setModalMode] = useState<'edit' | 'add'>('edit');
  const [form, setForm] = useState({
    id: 0,
    title: '',
    description: '',
    visibility: 'public',
  });

  // SET INITIAL QUIZ FORM DATA
  useEffect(() => {
    if (selectedQuiz) {
      const newForm = {
        id: selectedQuiz.id,
        title: selectedQuiz.title,
        description: selectedQuiz.description,
        visibility: selectedQuiz.visibility ?? 'public',
      };
      setForm(newForm);
    }
  }, [selectedQuiz]);

  // LOAD ONCE QUIZ SELECTED
  useEffect(() => {
    fetchQuestions().then((response: any) => response);
  }, [selectedQuiz]);

  // FETCH ALL QUESTIONS FOR QUIZ
  const fetchQuestions = async (): Promise<void> => {
    if (!selectedQuiz?.id) return;
    try {
      const response: any = await fetch(
        `http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = e.target.checked;
    setForm((prev) => ({
      ...prev,
      visibility: isChecked ? 'private' : 'public',
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: form.id,
        title: form.title,
        description: form.description,
        visibility: form.visibility,
      };

      const response: any = await fetch(`http://localhost:3030/api/quizzes/${selectedQuiz?.id}`, {
        method: 'PUT',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }

      console.log(`Quiz ${selectedQuiz?.id} updated successfully`);

      router.push('/dashboard/library');
    } catch (error: any) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* GENERAL SETTINGS CONTAINER */}
      <div className={'flex flex-row justify-start'}>
        {/* ADD QUESTION BUTTON */}
        <motion.button
          className='m-4 h-12 w-fit rounded bg-cyan-700 px-4 py-2 text-white shadow-lg transition hover:bg-cyan-600 active:bg-cyan-700'
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setModalMode('add');
            setEditingQuestion({
              index: 0,
              onDelete(): void {},
              onEdit(): void {},
              id: 0,
              question: '',
              options: ['', '', '', ''],
              correct: '',
            });
          }}
        >
          Add Question
        </motion.button>

        {/* QUIZ VISIBILITY TOGGLE */}
        {selectedQuiz && form.id !== 0 && (
          <div className='align-center m-4 h-12 rounded bg-cyan-800 px-4 py-3 font-bold text-white shadow-lg'>
            <input
              name='visibility'
              type='checkbox'
              checked={form.visibility === 'private'}
              onChange={handleCheckboxChange}
              className='mr-1.5'
            />
            <label>Private Visibility</label>
          </div>
        )}

        {/* SAVE QUIZ BUTTON */}
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={
            'm-4 h-12 cursor-pointer rounded bg-emerald-600 px-4 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-500 active:bg-emerald-400'
          }
          onClick={handleSave}
        >
          Save Quiz
        </motion.button>
      </div>

      {/* MODAL: EDIT OR ADD */}
      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={updateQuestionsModal}
          mode={modalMode}
          quizId={selectedQuiz!.id}
        />
      )}

      {/* LIST QUESTIONS */}
      {questions.length ? (
        questions.map((question, index) => (
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
        ))
      ) : (
        <div className={'text-xl text-black'}>No questions in this quiz yet. Add some!</div>
      )}
    </div>
  );
}
