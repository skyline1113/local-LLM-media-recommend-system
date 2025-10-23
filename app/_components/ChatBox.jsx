import { useState } from "react";
import MsgBlock from "./_components/MsgBlock";


export default function ChatBox({ engine }) {
  const [text, setText] = useState("");
  const [logList, setLogList] = useState([]);

/*************** 核心聊天功能 ***************/
async function streamingGenerating(messages, onUpdate, onFinish, onError) {
  try {
    let curMessage = "";
    const completion = await engine.chat.completions.create({
      stream: true,
      messages
    });
    for await (const chunk of completion) {
      const curDelta = chunk.choices[0].delta.content;
      if (curDelta) {
        curMessage += curDelta;
      }
      onUpdate(curMessage);
    }
    const finalMessage = await engine.getMessage();
    onFinish(finalMessage);
  } catch (err) {
    onError(err);
  }
}

const handleSend = async () => {
  const newMsg = { role: "user", content: text };
  setLogList([...logList, newMsg]);
  setText("");

  const messages = [
    {...logList,
    role: "system", content: "你是一个专业的电影推荐助手。请专注于用户当前的问题，回答要简洁直接。如果问题与电影无关，请礼貌地告知用户你只能提供电影相关的建议。" },
    { role: "user", content: text },
  ];


  await streamingGenerating(
    messages,
    // onUpdate: 模型流式输出中
    (curMsg) => {
      setLogList((prev) => {
        // 移除旧的临时 Bot 消息
        const filtered = prev.filter((m) => m.role !== "BotTemp");
        return [...filtered, { role: "BotTemp", content: curMsg }];
      });
    },
    // onFinish: 生成结束
    (finalMsg) => {
      setLogList((prev) => {
        const filtered = prev.filter((m) => m.role !== "BotTemp");
        return [...filtered, { role: "Bot", content: finalMsg }];
      });
    },
    // onError: 出错处理
    (err) => {
      console.error("出错:", err);
      setLogList((prev) => [
        ...prev,
        { role: "Bot", content: "⚠️ 出错了，请重试。" },
      ]);
    }
  );
  MsgBlock(logList);
};


  async function sendMsg(text) {
    // 同樣回傳 Promise（範例：模擬）
    await new Promise(r => setTimeout(r, 300));
    return { msg: `回應（async）: ${text}` };
  }

  const handleChange = (e) => setText(e.target.value);

  return (
    <div className="border-2 border-gray-600 p-4 rounded-md gap-2 flex flex-col h-[500px] w-[500px]">
      <div className="border-2 px-4 py-3 flex flex-col gap-4 overflow-y-scroll border-gray-400 rounded-md flex-1">
        {logList.map((item, index) => (
          <MsgBlock key={index} role={item.role} content={item.content} />
        ))}
      </div>
      <div className="max-h-[200px] flex gap-2  ">
        <div className="border-2 border-gray-400 rounded-md flex-1">
          <input 
            className="w-full h-full p-2"
            onChange={handleChange} 
            value={text}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(); // 按 Enter 時執行
            }}
             />
        </div>
        <button
          className="bg-gray-400 select-none cursor-pointer hover:bg-gray-600 px-4 py-2 rounded-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
