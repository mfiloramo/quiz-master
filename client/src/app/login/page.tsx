import { ReactElement } from "react";

export default function LoginPage(): ReactElement {
  // RENDER PAGE
  return (
    // MAIN CONTAINER
    <div
      className={
        "flex h-screen items-center justify-center bg-gradient-to-b from-sky-300 to-sky-100"
      }
    >
      {/* LOGIN CARD */}
      <div
        className={
          "relative -top-16 h-[50vh] w-[40vw] content-center rounded-xl bg-sky-50 p-6 shadow-2xl"
        }
      ></div>
    </div>
  );
}
