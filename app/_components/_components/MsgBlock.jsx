import React from "react";

export default function MsgBlock({ sender, msg }) {
  const alignStyle = sender === "Bot" ? "justify-start" : "justify-end";
  const bgStyle = sender === "Bot" ? "bg-slate-500" : "bg-blue-900"

  return (
    <div className={`flex items-center gap-2 ${alignStyle} `}>
      <div className={`${bgStyle} px-4 py-2 max-w-[calc(50%-1em)] flex flex-wrap rounded-lg`}>
        {msg}
      </div>
    </div>
  );
}
