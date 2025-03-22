import { ReactElement } from "react";

export default function QuizModule({ questionData }: any): ReactElement {
return <div className={'h-10 bg-amber-500'}>{ questionData }</div>
}
