'use client';

import React, { ReactElement, useEffect, useState } from 'react';
import { QuestionListingProps } from '@/types/QuestionListingProps';
import QuestionListing from '@/components/QuestionListing/QuestionListing';
import EditQuestionModal from '@/components/EditQuestionModal/EditQuestionModal';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useToast } from '@/contexts/ToastContext';
import { motion } from 'framer-motion';
import axiosInstance from '@/utils/axios';
import { QuizQuestion } from '@/types/Quiz.types';

export default function EditQuiz(): ReactElement {
  // CUSTOM HOOKS
  const { selectedQuiz } = useQuiz();
  const { toastSuccess, toastError } = useToast();
  const router = useRouter();

  // STATE HOOKS
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
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
    // DO NOT AWAIT HERE; FIRE AND FORGET IS FINE FOR INITIAL LOAD
    fetchQuestions().then((r) => r);
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
      const errorMsg: string = `Error fetching quizzes: ${error}`;
      toastError(errorMsg);
      console.error(error);
    }
  };

  // UPDATE QUESTIONS LISTING & OPEN MODAL
  const updateQuestionsModal = (updatedQuestion: QuizQuestion): void => {
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
      toastSuccess(`Quiz updated successfully`);

      // REDIRECT TO LIBRARY PAGE
      router.push('/dashboard/library');
    } catch (error: any) {
      // LOG ERROR IF REQUEST FAILS
      const errorMsg: string = `Error updating quiz: ${error}`;
      toastError(errorMsg);
      console.error(error);
    }
  };

  // HANDLE QUESTION DELETION (PARENT OWNS SIDE-EFFECTS)
  const handleDelete = async (questionId: string | number): Promise<void> => {
    // OPTIMISTIC UPDATE: REMOVE LOCALLY FIRST
    const prev = questions;
    setQuestions((curr) => curr.filter((q) => String(q.id) !== String(questionId)));

    try {
      // SEND DELETE REQUEST TO SERVER
      await axiosInstance
        .delete(`/questions/${selectedQuiz?.id}/${questionId}`)
        .then((response: any): string => toastSuccess(response.data));
      // SUCCESS IS SILENT HERE; TOAST OPTIONAL
    } catch (error: any) {
      // ROLLBACK ON FAILURE
      setQuestions(prev);
      toastError(error?.response?.data?.message || 'Failed to delete question');
    }
  };

  // RENDER PAGE
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
          onCloseAction={() => setEditingQuestion(null)}
          onSaveAction={updateQuestionsModal}
          mode={modalMode}
          quizId={selectedQuiz!.id}
        />
      )}

      {/* LIST QUESTIONS */}
      {questions.length ? (
        // CHILD COMPONENT NOW CALLS onDelete(id) INSTEAD OF FORWARDING DOM EVENTS
        questions.map((question, index) => (
          <QuestionListing
            key={question.id}
            id={question.id}
            question={question.question}
            options={question.options}
            correct={question.correct}
            index={index}
            onEditAction={() => {
              setModalMode('edit');
              setEditingQuestion(question);
            }}
            // PASS HANDLER; CHILD WILL CALL IT WITH THE ID
            onDeleteAction={handleDelete}
          />
        ))
      ) : (
        <div className={'text-xl text-black'}>No questions in this quiz yet. Add some!</div>
      )}
    </div>
  );
}
