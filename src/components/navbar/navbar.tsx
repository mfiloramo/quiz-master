import { JSX, ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinkInterface } from "@/interfaces/Navlink.interface";

export default function Navbar(): JSX.Element {
  const navLinksLeft: navLinkInterface[] = [
    { path: '/', label: 'Home' },
    { path: '/students', label: 'Students' },
    { path: '/teachers', label: 'Teachers' },
  ];

  // RENDER COMPONENT
  return (
    <>
      {/* NAVBAR MAIN CONTAINER */ }
      <div className={ 'h-16 bg-gradient-to-b from-sky-800 to-sky-600 shadow-2xl  flow-root' }>

        {/* LEFT BUTTONS CONTAINER */ }
        <div className={ 'mt-2 flex float-left items-center ml-4' }>

          {/* APP LOGO */ }
          <Image
            className={ 'shadow-lg' }
            src={ '/logos/logo-mini.png' }
            width={ 160 }
            height={ 45 }
            alt={ 'QuizMaster logo' }
          />

          {/* LEFT BUTTONS */}
          {
            navLinksLeft.map((button: navLinkInterface): ReactElement => (
              <Link
                className={ 'text-sky-100 ml-5 transition hover:text-white active:text-sky-100' }
                href={ button.path }
                key={ button.label }>{ button.label }
              </Link>
            ))
          }
        </div>


        {/* RIGHT BUTTONS CONTAINER */ }
        <div className={ 'mt-4 flex float-right items-center mr-7' }>

          {/* RIGHT BUTTONS */ }
          <Link
            className={ 'bg-green-600 px-3 py-1 ml-4 transition text-white hover:bg-[#1BB755] active:bg-green-600 rounded-lg font-bold shadow-lg' }
            href={ '/signup' }
            key={ 'signup' }>{ 'Sign Up' }
          </Link>

          <Link
            className={ 'text-sky-100 ml-4 transition hover:text-white active:text-sky-100' }
            href={ '/login' }
            key={ 'login' }>{ 'Log In' }
          </Link>
        </div>
      </div>
    </>
  );
}
