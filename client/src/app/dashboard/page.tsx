import { ReactElement } from "react";

export default function Dashboard(): ReactElement {
  return (
    // MAIN CONTAINER
    <div className='min-h-[calc(100vh-4rem)] text-black bg-gradient-to-b from-sky-300 to-sky-800 flex'>

      {/* SIDE NAVBAR */ }
      <div className={ 'h-[calc(100vh-4rem)] w-56 bg-slate-700 overflow-y-auto' }>

        {/* MOCK SIDENAV CONTENT */ }
        <ul className="pt-1 space-y-1">
          { Array.from({ length: 20 }, (_, i) => (
            <li key={ i }
                className="px-3 py-2 text-slate-100 hover:bg-slate-600 active:bg-slate-500 transition cursor-pointer">
              Item { i + 1 }
            </li>
          )) }
        </ul>

      </div>

      {/* MAIN CONTENT */ }
      <div className="flex-1 p-4">
        This is the dashboard content.
      </div>

    </div>
  );
}
