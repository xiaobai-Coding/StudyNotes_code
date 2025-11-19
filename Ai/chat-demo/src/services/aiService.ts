// DeepSeek AI服务实现
// 使用真实的DeepSeek API进行对话

import { Message } from "../types/chat";

// 从环境变量中读取配置
const getConfig = () => ({
  apiKey: import.meta.env.VITE_AI_API_KEY || "",
  apiBaseUrl:
    import.meta.env.VITE_AI_API_BASE_URL || "https://api.deepseek.com",
  appTitle: import.meta.env.VITE_APP_TITLE || "DeepSeek AI聊天",
  debug: import.meta.env.VITE_APP_DEBUG === "true",
  model: "deepseek-chat",
  temperature: 0.3 // 控制回复的随机性
});

const config = getConfig();

// 辅助函数：延迟执行
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟打字输出效果
export const simulateTyping = async (
  text: string,
  onCharacterAdd: (char: string) => void
): Promise<void> => {
  console.log("[AI Service] 开始模拟打字效果，文本长度:", text.length);

  const chars = text.split("");
  for (const char of chars) {
    onCharacterAdd(char);
    await delay(30 + Math.random() * 30); // 固定打字速度
  }
};

// 简化的API调用函数
const callDeepSeekAPI = async (userMessages: any, showDebugReasoning: boolean): Promise<string> => {
  console.log("[AI Service] 开始API调用...");
  console.log("[AI Service] API密钥:", config.apiKey ? "已设置" : "未设置");
  console.log("[AI Service] API基础URL:", config.apiBaseUrl);
  console.log("[AI Service] 用户消息:", userMessages);

  // 确保API密钥存在
  if (!config.apiKey) {
    throw new Error("未配置API密钥，请检查.env.local文件");
  }

  try {
    const endpoint = `${config.apiBaseUrl}/chat/completions`;
    console.log("[AI Service] API端点:", endpoint);

    const requestBody = {
      model: config.model,
      messages: [
        ...userMessages,
        {
          role: "system",
          content: `
你是一个严谨的历史学家，拥有丰富的历史知识。能解答历史相关问题。并能根据问题生成历史事件的摘要。并能够以生动的语言解释。你必须要用著名说书人单田芳的风格。
你要把你的思考过程输出在回复中（但不要太长）。
1. 在回复用户问题前，先简短的输出你的思考过程，再输出用户问题的回答。
2. 禁止胡编乱造、编造不存在的历史事件和人物。
3. 只能以历史文献和资料为基础。
4. 如果没有相关资料文献，优先回答暂无相关资料。
5. 最终输出必须为 JSON：
{
  "judgement": "has_evidence | no_evidence",
  "result": null | "string",
  "reason": "string",
  "confidence": 0-1,
  "debug_reasoning": ${ showDebugReasoning } ? "短推理摘要(最多2行)" : null
}
`
        }
      ],
      temperature: config.temperature, // 控制回复的随机性，
      max_tokens: 300 // 限制回复的最大长度
    };

    console.log("[AI Service] 准备发送fetch请求...");

    // 发送API请求
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    console.log("fetch请求参数:", requestBody);

    console.log("[AI Service] 收到响应，状态码:", response.status);

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AI Service] 错误响应内容:", errorText);
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }

    // 解析响应数据
    const data = await response.json();
    console.log("[AI Service] 响应数据:", JSON.stringify(data, null, 2));

    // 提取AI回复
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;
      console.log("[AI Service] 成功获取AI回复，长度:", aiResponse.length);
      return aiResponse;
    }

    throw new Error("API响应格式不正确，未找到有效回复");
  } catch (error) {
    console.error("[AI Service] API调用异常:", error);
    throw error;
  }
};
// 获取AI回复 具有上下文记忆功能
// 定义AI响应的返回类型
export interface AIResponse {
  content: string;
  debug_reasoning?: string | null;
}

export const getAIResponse = async (
  userMessages: any,
  onPartialResponse: (partialResponse: string) => void,
  showDebugReasoning: boolean = false
): Promise<AIResponse> => {
  console.log("[AI Service] getAIResponse被调用");

  try {
    // 直接调用API
    const apiResponse = await callDeepSeekAPI(userMessages, showDebugReasoning);
    
    // 尝试解析JSON格式的响应
    let fullResponse = apiResponse;
    let debugReasoning = null;
    
    try {
      // 尝试解析JSON响应
      const jsonResponse = JSON.parse(apiResponse);
      // 提取主内容
      fullResponse = jsonResponse.result || apiResponse;
      // 提取推理内容
      debugReasoning = jsonResponse.debug_reasoning || null;
      
      console.log("[AI Service] 成功解析JSON响应:", {
        result: fullResponse,
        debug_reasoning: debugReasoning
      });
    } catch (e) {
      // 如果不是有效的JSON，就使用原始响应
      console.log("[AI Service] 响应不是JSON格式，使用原始内容");
    }

    // 添加一些延迟以模拟处理过程
    await delay(500);

    // 模拟打字效果
    await simulateTyping(fullResponse, (char) => {
      onPartialResponse(char);
    });

    // 返回响应对象，包含内容和推理信息
    return {
      content: fullResponse,
      debug_reasoning: debugReasoning
    };
  } catch (error) {
    console.error("[AI Service] 获取AI回复失败:", error);
    // 直接抛出错误，让调用方处理
    throw error;
  }
};

// 判断是否应该提出追问
export const shouldAskFollowUp = (userMessage: string): boolean => {
  return userMessage.length < 30;
};

// 生成追问建议
export const getFollowUpSuggestion = (userMessage: string): string => {
  const suggestions = [
    "你想了解更多关于哪个方面的信息？",
    "你能详细说明一下你的问题吗？",
    "有什么特定的例子你想了解吗？"
  ];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};

// 导出配置
export { config };
