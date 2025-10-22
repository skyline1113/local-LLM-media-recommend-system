import * as webllm from "@mlc-ai/web-llm";

const availableModels = webllm.prebuiltAppConfig.model_list.map(
  (m) => m.model_id
);

// Callback function for initializing progress
function updateEngineInitProgressCallback(report) {
  console.log("initialize", report.progress);
}

// Create engine instance
const engine = new webllm.MLCEngine();
engine.setInitProgressCallback(updateEngineInitProgressCallback);

async function streamingGenerating(messages, onUpdate, onFinish, onError) {
  try {
    let curMessage = "";
    const completion = await engine.chat.completions.create({
      stream: true,
      messages,
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

export { engine, availableModels, streamingGenerating };
