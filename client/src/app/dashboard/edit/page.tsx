'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingType } from '@/types/QuestionListing.type';
import QuestionListing from '@/components/QuestionListing/QuestionListing';
import EditQuestionModal from '@/components/EditQuestionModal/EditQuestionModal';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { motion } from 'framer-motion';
import axiosInstance from '@/utils/axios';

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
    visibility: modalMode === 'add' ? 'public' : null,
  });

  // SET INITIAL QUIZ FORM DATA
  useEffect(() => {
    if (selectedQuiz) {
      const newForm = {
        id: selectedQuiz.id!,
        title: selectedQuiz.title,
        description: selectedQuiz.description,
        visibility: selectedQuiz.visibility,
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
    // RETURN EARLY IF NO QUIZ SELECTED
    if (!selectedQuiz?.id) return;

    try {
      // SEND GET REQUEST TO FETCH QUESTIONS FOR SELECTED QUIZ
      const { data } = await axiosInstance.get(`/questions/quiz/${selectedQuiz.id}`);

      // FORMAT OPTIONS IF THEY ARE STORED AS STRINGS
      const formattedData = data.map((question: any) => ({
        ...question,
        options:
          typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      }));

      // UPDATE STATE WITH FORMATTED QUESTIONS
      setQuestions(formattedData);
    } catch (error) {
      // LOG ERROR IF FETCH FAILS
      console.error('ERROR FETCHING QUESTIONS:', error);
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

  // HANDLE VISIBILITY CHECKBOX CHANGE
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = e.target.checked;
    setForm((prev) => ({
      ...prev,
      visibility: isChecked ? 'private' : 'public',
    }));
  };

  // HANDLE QUIZ SAVING
  const handleSave = async () => {
    try {
      // PREPARE PAYLOAD WITH UPDATED QUIZ DATA
      const payload = {
        id: form.id,
        title: form.title,
        description: form.description,
        visibility: form.visibility,
      };

      // SEND PUT REQUEST TO UPDATE THE QUIZ
      await axiosInstance.put(`/quizzes/${selectedQuiz?.id}`, payload);

      // LOG SUCCESS MESSAGE
      console.log(`Quiz ${selectedQuiz?.id} updated successfully`);

      // REDIRECT TO LIBRARY PAGE
      router.push('/dashboard/library');
    } catch (error: any) {
      // LOG ERROR IF REQUEST FAILS
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* GENERAL SETTINGS CONTAINER */}
      <div className={'flex flex-row justify-start'}>
        {/* ADD QUESTION BUTTON */}
        <motion.button
          className='m-4 h-12 w-fit rounded bg-cyan-700 px-4 text-sm text-white shadow-lg transition hover:bg-cyan-600 active:bg-cyan-700 sm:text-lg'
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
        {/*TEST*/}

        {/* QUIZ VISIBILITY TOGGLE */}
        {selectedQuiz && form.id !== 0 && (
          <div className='m-4 flex h-12 items-center rounded bg-cyan-800 px-4 text-xs font-bold text-white shadow-lg sm:text-lg'>
            <input
              name='visibility'
              type='checkbox'
              checked={form.visibility === 'private'}
              onChange={handleCheckboxChange}
              className='mr-2 h-4 w-4'
            />
            <label htmlFor='visibility'>Private Visibility</label>
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
            'm-4 h-12 cursor-pointer rounded bg-emerald-600 px-4 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500 active:bg-emerald-400 sm:text-lg'
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
