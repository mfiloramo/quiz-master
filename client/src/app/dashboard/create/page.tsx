'use client';

import { ReactElement, useState } from 'react';

export default function Create(): ReactElement {
  // STATE HOOKS
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // HANDLE FORM SUBMISSION
  const handleSubmit: void = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // SEND QUIZ TO SERVER
      const response = await fetch(`${process.env.API_BASE_URL}/quiz/create`);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    // MAIN CONTAINER
    <div className={'m-3 flex flex-col'}>
      {/* PAGE TITLE */}
      <div className={'flex flex-row text-5xl font-bold md:flex-col'}>Quiz Creator</div>

      {/* CONTENT CONTAINER */}
      <div className={'my-3 flex flex-row rounded-xl'}>
        {/* COVER IMAGE DROPBOX */}
        <div
          className={
            'h-[30vh] w-[35vw] max-w-xl content-center rounded-lg bg-white text-center text-4xl'
          }
        >
          Cover Image Module
        </div>

        {/* VERBIAGE CONTAINER */}
        <div className={'mx-4 flex w-full flex-col items-start rounded-lg bg-slate-300 p-3'}>
          {/* TITLE SECTION */}
          <div className={'w-full text-2xl font-bold'}>
            Title (required)
            <form className={'my-2'}>
              <input
                type={'text'}
                placeholder={'Give your quiz a cool title...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={'w-full rounded p-3'}
              />
            </form>
            {/* DESCRIPTION SECTION */}
            <div className={'mt-5 w-full text-2xl font-bold'}>
              Description
              <form className={'my-2'}>
                <input
                  type={'text'}
                  placeholder={'Tell us what your quiz will be about...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={'h-[8vh] w-full rounded p-3'}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
