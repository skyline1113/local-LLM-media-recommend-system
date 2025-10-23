"use client";

import { use, useEffect, useState } from "react";
import { engine, availableModels, streamingGenerating } from "@/utils/webllmHandler";
import ChatBox from "./_components/ChatBox";
import ImagesList from "./_components/ImagesList";

const messages = [
  {
    content: "You are a helpful AI agent helping users.",
    role: "system",
  },
];

const config = {
  temperature: 1.0,
  top_p: 1,
};

export default function Home() {
  const [modelInited, setModelInited] = useState(false);
  const [allowDownload, setAllowDownload] = useState(false);
  const [selectedModel, setSelectedModel] = useState("TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC-1k");

  useEffect(() => {
    if (allowDownload) {
      console.log("Engine: ", engine, modelInited);
      engine.reload(selectedModel, config).then(() => {
        console.log("Initialized Engine: ", engine);
        setModelInited(true);
      });
    }
  }, [allowDownload]);

  const handleSelect = (selected) => setSelectedModel(selected);

  const handleDownload = () => setAllowDownload(true);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex gap-[32px] justify-center row-start-2 items-center sm:items-start">
        {/* <div className="max-h-[500px] max-w-[500px] grid grid-rows-[auto_1fr] gap-4">
          <div className="flex gap-2 items-center">
            <div>
              <span className="font-bold text-xl">SELECT: </span>
              <span className="text-xl underline">{selectedModel}</span>
            </div>
            <button
            className="bg-gray-400 select-none cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
            onClick={handleDownload}>
              Download
            </button>
          </div>
          <div className="w-full overflow-y-scroll">
            {availableModels.map((item, index) => (
              <div key={index} className="cursor-pointer" onClick={() => handleSelect(item)}>
                {item}
              </div>
            ))}
          </div>
        </div> */}
        <ImagesList/>
        <ChatBox />
      </main>
    </div>
  );
}
