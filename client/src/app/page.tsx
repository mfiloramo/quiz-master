import { JSX } from "react";
import DisplayBanner from "@/components/display-banner/display-banner";

export default function Home(): JSX.Element {
  const items = [
    "🚀 Learn fast",
    "🔥 Fail smart",
    "🔁 Iterate constantly",
    "🌱 Always be learning",
    "💡 Keep shipping",
  ];


  return (
    <div className="h-screen bg-stub-background-home text-center text-black">
      <div className="pt-12 px-2">
        <div className="font-bold text-7xl max-w-5xl mx-auto">
          Build quizzes for your entire classroom
        </div>
        <div className="mt-2 text-2xl max-w-3xl mx-auto">
          A dynamic and fun way to create an engaging learning environment among students
        </div>
        <div className={ 'my-8 mx-5' }>
          <DisplayBanner/>
        </div>

        {/* SCROLLING MARQUEE */}
        <div className="relative w-full h-12 overflow-hidden bg-blue-800">
          <div className="flex whitespace-nowrap animate-marquee align-middle">
            { [ ...items, ...items ].map((item, index) => (
              <span
                key={ index }
                className="mx-8 text-white text-lg shrink-0"
              >
            { item }
          </span>
            )) }
          </div>
        </div>

      </div>
    </div>
  );
}
