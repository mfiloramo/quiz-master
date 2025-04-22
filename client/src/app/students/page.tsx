import { ReactElement } from 'react';

export default function StudentsPage(): ReactElement {
  return (
    // MAIN CONTAINER
    <div className={'mt-5 flex h-[60vh] w-[90%] flex-col rounded-xl bg-slate-300 shadow'}>
      {/* QUESTION */}
      <div className={'text-3xl font-bold text-black'}>What is the correct answer?</div>

      {/* BUTTONS ROW 1 */}
      <div className={'flex w-full flex-row'}>
        <div
          className={
            'm-1 h-24 w-full cursor-pointer rounded-xl bg-red-600 p-3 text-center text-white transition hover:bg-red-500 active:bg-red-700'
          }
        >
          Carrots
        </div>
        <div
          className={
            'm-1 h-24 w-full cursor-pointer rounded-xl bg-blue-600 p-3 text-center text-white transition hover:bg-blue-500 active:bg-blue-700'
          }
        >
          Bananas
        </div>
      </div>

      {/* BUTTONS ROW 2 */}
      <div className={'flex w-full flex-row'}>
        <div
          className={
            'm-1 h-24 w-full cursor-pointer rounded-xl bg-amber-600 p-3 text-center text-white transition hover:bg-amber-500 active:bg-amber-700'
          }
        >
          Apples
        </div>
        <div
          className={
            'm-1 h-24 w-full cursor-pointer rounded-xl bg-green-600 p-3 text-center text-white transition hover:bg-green-500 active:bg-green-700'
          }
        >
          Kiwis
        </div>
      </div>
    </div>
  );
}
