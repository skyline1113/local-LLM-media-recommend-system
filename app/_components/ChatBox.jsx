import { useState } from "react";
import MsgBlock from "./_components/MsgBlock";

export default function ChatBox() {
  const [text, setText] = useState("");
  const [logList, setLogList] = useState([
    { sender: "Me", msg: "Hello" },
    { sender: "Bot", msg: "No Hello" },
  ]);

  const handleSend = async () => {
    const userMsg = { sender: "Me", msg: text };
    setText('');

    // 先立即更新畫面顯示使用者訊息
    setLogList(prev => [...prev, userMsg]);

    // 等回覆後再追加
    const res = await sendMsg(text);
    setLogList(prev => [...prev, { sender: "Bot", msg: res.msg }]);
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
          <MsgBlock key={index} sender={item.sender} msg={item.msg} />
        ))}
      </div>
      <div className="max-h-[200px] flex gap-2  ">
        <div className="border-2 border-gray-400 rounded-md flex-1">
          <input className="w-full h-full p-2" onChange={handleChange} value={text} />
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
