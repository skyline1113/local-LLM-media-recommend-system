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
      {
        ...logList,
        role: "system", content: `
        你是一个专业的电影推荐助手。严格遵循以下规则：
        1. 只回答与用户问题相关的电影或影视内容建议。
        2. 回答必须简洁、直接，不写无关信息。
        3. 如果用户的问题与电影无关，礼貌告知“我只能提供电影相关的建议”，不要额外扩展。
        4. 优先提供具体推荐，如电影名称、类型、上映年份或评价。
        5. 避免长篇解释、闲聊或与电影无关的内容。`
      },
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
    <div className="border-b-2 relative font-shSans shadow-md border-bg-300 bg-bg-500 p-4 rounded-lg gap-4 flex flex-col h-[800px] w-[800px]">
      <div id='msgList' className="p-8 flex flex-col gap-8 overflow-y-scroll bg-bg-700 rounded-md flex-1">
        {logList.map((item, index) => (
          <MsgBlock key={index} role={item.role} content={item.content} />
        ))}
      </div>
      <button onClick={() => setLogList([])} className="absolute bg-bg-500 cursor-pointer rounded-full top-8 left-8 text-bg-300 hover:text-bg-100 px-3 py-1">
        清除对话记录
      </button>
      <div className="max-h-[200px] flex gap-4  ">
        <div className="bg-bg-700 rounded-md flex-1 relative">
          <input
            className="w-full h-full px-4 py-3 focus:outline-none"
            onChange={handleChange}
            value={text}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(); // 按 Enter 時執行
            }}
          />
        </div>
        <button
          className="bg-theme-500 shadow-md text-md select-none cursor-pointer hover:bg-theme-300 px-8 py-3 rounded-md"
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
}
