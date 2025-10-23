import React from "react";

export default function MsgBlock({ role, content }) {
  const alignStyle = role === "user" ?"justify-end": "justify-start"  ;
  const bgStyle = role === "user" ? "bg-blue-900": "bg-slate-500" 

  return (
    <div className={`flex textba items-center gap-2 ${alignStyle} `}>
      <div className={`${bgStyle} px-4 py-2 max-w-[calc(80%-1em)] flex flex-wrap rounded-lg`}>
        {content}
      </div>
    </div>
  );
}
