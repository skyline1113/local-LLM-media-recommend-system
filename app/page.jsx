"use client";

import { use, useEffect, useState } from "react";
import { engine, availableModels, streamingGenerating } from "@/utils/webllmHandler";
import ChatBox from "./_components/ChatBox";
import ImagesList from "./_components/ImagesList";

/*************** 全局变量 ***************/
let selectedModel = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
// let selectedModel = "Qwen2.5-7B-Instruct-q4f16_1-MLC";

// 新增控制变量
let isGenerating = false;
let currentCompletion = null;
let tokenCount = 0;

const config = {
  temperature: 0.5,  // 降低温度减少随机性
  top_p: 0.9,        // 限制词汇选择
  max_tokens: 2048   // 限制最大生成长度
};
/*************** WebLLM 引擎初始化 ***************/
function updateEngineInitProgressCallback(report) {
  console.log("initialize", report.progress);
  document.getElementById("download-status").textContent = report.text;
}

engine.setInitProgressCallback(updateEngineInitProgressCallback);

export default function Home() {
  const [modelInited, setModelInited] = useState(false);
  const [allowDownload, setAllowDownload] = useState(false);
  // const [engine, setEngine] = useState(null);
  // const [selectedModel, setSelectedModel] = useState("TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC-1k");

  useEffect(() => {
    if (allowDownload) {
      console.log("Engine: ", engine, modelInited);
      engine.reload(selectedModel, config);
    }
  }, [allowDownload]);


  // 上面为新增

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

          </div>
          <div className="w-full overflow-y-scroll">
            {availableModels.map((item, index) => (
              <div key={index} className="cursor-pointer" onClick={() => handleSelect(item)}>
                {item}
              </div>
            ))}
          </div>
        </div> */}
        <div>
          <button
          className="bg-gray-400 select-none cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={handleDownload}>
            Download
          </button>
          <p id="download-status"></p>
        </div>
          <ChatBox engine={engine} />

      </main>
    </div>
  );
}
