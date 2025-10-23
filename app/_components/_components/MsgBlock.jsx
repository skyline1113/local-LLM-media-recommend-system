import React from "react";

export default function MsgBlock({ role, content }) {
  const alignStyle = role === "user" ? "ml-auto" : "mr-auto";
  const bgStyle = role === "user"
    ? "bg-bg-300 max-w-[calc(50%-1em)] px-3 py-2"
    : "max-w-[100%]"

  return (
    <div className={`${bgStyle} font-shSans break-all shadow-md rounded-lg ${alignStyle}`}>
      {content}
    </div>
  );
}
