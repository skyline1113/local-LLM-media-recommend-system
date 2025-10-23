"use client";

import { use, useEffect, useState } from "react";
import { engine, availableModels, streamingGenerating } from "@/utils/webllmHandler";
import ChatBox from "./_components/ChatBox";
import ImagesList from "./_components/ImagesList";

/*************** 全局变量 ***************/
// let selectedModel = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
let selectedModel = "Qwen2.5-7B-Instruct-q4f16_1-MLC";

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
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Engine: ", engine);
        await engine.reload(selectedModel, config); // 等待模型下载完成
        setLoaded(true); // 下载完成再切换状态
      } catch (err) {
        console.error("模型下载出错:", err);
      }
    };
    if (allowDownload) {
      loadModel();
    }
  }, [allowDownload]);


  // 上面为新增


  const handleDownload = () => {
    setLoading(true);
    setAllowDownload(true);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      {!loaded && (
        <div className="flex flex-col gap-16 justify-center items-center h-[80vh]">
          {!loading ? (<>
            <p className="text-[40px] font-shSans text-center">
              欢迎使用本影视推荐系统<br />
              点击此按钮开始
            </p>
            <button
              className="bg-theme-500 shadow-md font-shSans select-none cursor-pointer hover:bg-theme-300 px-4 py-2 rounded-md"
              onClick={handleDownload}
            >
              开始
            </button>
          </>) : (<>
            <p className="text-[40px] font-shSans text-center">
              欢迎
            </p>
            <p id="download-status" className="ml-4 text-bg-300"></p>
          </>)}
        </div>
      )}

      {loaded && (
        <div className="flex justify-center items-center h-[80vh]">
          <ChatBox engine={engine} />
        </div>
      )}
      {/* <ImagesList /> */}
    </div>
  );
}
