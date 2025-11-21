// DeepSeek AI服务实现
// 使用真实的DeepSeek API进行对话

import { Message, FunctionDefinition, CalculatorParams } from "../types/chat";



// 定义计算器工具函数
export const calculator = (params: CalculatorParams): number => {
  const { num1, num2, operation } = params;

  switch (operation) {
    case "add":
      return num1 + num2;
    case "subtract":
      return num1 - num2;
    case "multiply":
      return num1 * num2;
    case "divide":
      if (num2 === 0) {
        throw new Error("除数不能为零");
      }
      return num1 / num2;
    default:
      throw new Error(`不支持的操作: ${operation}`);
  }
};

// 定义计算器函数的描述
export const calculatorFunction: FunctionDefinition = {
  name: "calculator",
  description: "用于进行数学四则运算的计算器工具。仅在用户明确要求进行数学计算（如加减乘除运算）时使用。注意：历史事件中的年份、日期、数量等描述性数字不需要使用此工具进行计算。",
  parameters: {
    type: "object",
    properties: {
      num1: {
        type: "number",
        description: "第一个操作数（必须是需要参与计算的数字）"
      },
      num2: {
        type: "number",
        description: "第二个操作数（必须是需要参与计算的数字）"
      },
      operation: {
        type: "string",
        description: "运算操作类型：add(加法)、subtract(减法)、multiply(乘法)、divide(除法)",
        enum: ["add", "subtract", "multiply", "divide"]
      }
    },
    required: ["num1", "num2", "operation"]
  }
};

// 所有可用的工具函数
// availableFunctions已在下方重新定义，带有类型签名

// 所有可用的函数定义
export const functionDefinitions: FunctionDefinition[] = [calculatorFunction];

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
  // console.log("[AI Service] 开始模拟打字效果，文本长度:", text.length);

  const chars = text.split("");
  for (const char of chars) {
    onCharacterAdd(char);
    await delay(30 + Math.random() * 30); // 固定打字速度
  }
};

// 裁剪模型消息 只保留最近 6 轮对话
function trimModelMessages(modelMessages: any[]) {
  const system = modelMessages[0];
  const rest = modelMessages.slice(1);
  // 如果消息数量大于6，则裁剪只保留最近三轮对话
  if (rest.length > 6) { 
    const trimmed = rest.slice(-6); // slice 传递负数时，表示从后往前数
    modelMessages = [system, ...trimmed];
    return modelMessages;
  }
  return [system, ...rest];  // 如果消息数量小于6，则不裁剪
}

// 简化的API调用函数
const callDeepSeekAPI = async (
  userMessages: any,
  showDebugReasoning: boolean
): Promise<any> => {
  // 确保API密钥存在
  if (!config.apiKey) {
    throw new Error("未配置API密钥，请检查.env.local文件");
  }
  // 传给模型的消息需要裁剪
  let modelMessages = trimModelMessages(userMessages) // 过滤掉工具调用消息
  try {
    const endpoint = `${config.apiBaseUrl}/chat/completions`;

    const requestBody = {
      model: config.model,
      messages: modelMessages, // 传给模型的消息需要裁剪
      tools: [
        {
          type: "function",
          function: calculatorFunction
        }
      ],
      tool_choice: "auto",
      temperature: config.temperature, // 控制回复的随机性，
      max_tokens: 300 // 限制回复的最大长度
    };

    // 验证functions参数格式
    console.log(
      "[AI Service] Functions参数:",
      JSON.stringify(functionDefinitions, null, 2)
    );

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

    // 检查响应格式
    if (
      !data.choices ||
      data.choices.length === 0 ||
      !data.choices[0].message
    ) {
      throw new Error("API响应格式不正确，未找到有效回复");
    }

    // 返回完整的响应对象，以便getAIResponse可以检查function_call
    return data;
  } catch (error: any) {
    console.error("[AI Service] API调用异常:", error);
    
    // 提供更详细的错误信息
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      // 网络错误或CORS错误
      const detailedError = new Error(
        `网络请求失败。可能的原因：\n` +
        `1. 网络连接问题，请检查网络连接\n` +
        `2. API端点无法访问: ${config.apiBaseUrl}\n` +
        `3. CORS跨域问题，请检查API配置\n` +
        `4. API密钥无效或已过期\n` +
        `原始错误: ${error.message}`
      );
      throw detailedError;
    }
    
    // 如果是其他错误，直接抛出
    throw error;
  }
};
// 获取AI回复 具有上下文记忆功能
// 定义AI响应的返回类型
export interface AIResponse {
  content: string;
  debug_reasoning?: string | null;
  function_call?: {
    name: string;
    parameters: Record<string, any>;
  };
}

// 为availableFunctions添加索引签名
export const availableFunctions: Record<string, (params: any) => any> = {
  calculator
};

// 处理工具调用响应，执行工具并将结果发送回模型生成最终回复
export const handleToolResponse = async (
  userMessages: any[],
  assistantMessage: any,
  toolCalls: any[],
  showDebugReasoning: boolean = false
): Promise<AIResponse> => {
  console.log(`[AI Service] 处理工具调用，工具数量: ${toolCalls.length}`);

  try {
    // 执行所有工具调用
    const toolResults = [];
    for (const toolCall of toolCalls) {
      const functionCall = toolCall.function;
      const functionName = functionCall.name;
      const functionArgs = JSON.parse(functionCall.arguments || "{}");

      console.log(`[AI Service] 执行工具: ${functionName}`, functionArgs);

      if (availableFunctions[functionName]) {
        const functionToCall = availableFunctions[functionName];
        const result = functionToCall(functionArgs);

        console.log(`[AI Service] 工具 ${functionName} 执行结果: ${result}`);

        toolResults.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(result)
        });
      } else {
        throw new Error(`未找到工具函数: ${functionName}`);
      }
    }

    // 构建包含工具调用和结果的完整消息历史
    // 注意：userMessages 不应该包含 system message，因为 callDeepSeekAPI 会在内部添加
    const messagesWithToolResults = [
      ...userMessages,
      {
        role: "assistant",
        content: assistantMessage.content || null,
        tool_calls: toolCalls
      },
      ...toolResults
    ];

    console.log("[AI Service] 准备发送第二次API请求，包含工具结果");
    console.log("[AI Service] 消息历史:", JSON.stringify(messagesWithToolResults, null, 2));

    // 第二次API调用：将工具结果发送给模型，让模型生成最终回复
    const data = await callDeepSeekAPI(messagesWithToolResults, showDebugReasoning);

    // 处理模型的最终回复
    if (data.choices && data.choices[0].message) {
      const apiResponse = data.choices[0].message.content;
      console.log("[AI Service] 第二次请求最终响应apiResponse:", apiResponse);
      // 尝试解析JSON格式的响应
      let fullResponse = apiResponse;
      let debugReasoning = null;

      try {
        const jsonResponse = JSON.parse(apiResponse);
        fullResponse = jsonResponse.result || jsonResponse.reason;
        debugReasoning = jsonResponse.debug_reasoning || null;

        console.log("[AI Service] 成功解析JSON响应:", {
          result: fullResponse,
          debug_reasoning: debugReasoning
        });
      } catch (e) {
        console.log("[AI Service] 响应不是JSON格式，使用原始内容");
      }

      return {
        content: fullResponse,
        debug_reasoning: debugReasoning
      };
    }

    throw new Error("API响应格式不正确，未找到有效回复");
  } catch (error: any) {
    console.error(`[AI Service] 工具调用处理失败: ${error}`);
    throw error;
  }
};

export const getAIResponse = async (
  userMessages: any,
  onPartialResponse: (partialResponse: string) => void,
  showDebugReasoning: boolean = false
): Promise<AIResponse> => {
  console.log("[AI Service] getAIResponse被调用");

  try {
    // 调用API获取响应
    const data = await callDeepSeekAPI(userMessages, showDebugReasoning);

    // 检查是否有tool_calls
    if (
      data.choices &&
      data.choices[0].message &&
      data.choices[0].message.tool_calls
    ) {
      const toolCalls = data.choices[0].message.tool_calls; // 工具调用数组
      const assistantMessage = data.choices[0].message;
      console.log("[AI Service] ⚠️ 检测到工具调用请求");
      console.log("[AI Service] 工具调用详情:", JSON.stringify(toolCalls, null, 2));
      console.log("[AI Service] 用户消息:", JSON.stringify(userMessages[userMessages.length - 1], null, 2));

      // 第二次请求：执行工具并将结果发送给模型，让模型生成最终回复
      const finalResponse = await handleToolResponse(
        userMessages,
        assistantMessage,
        toolCalls,
        showDebugReasoning
      );
      console.log("[AI Service] 模型最终回复:", finalResponse);

      // 添加一些延迟以模拟处理过程
      await delay(500);

      // 模拟打字效果
      await simulateTyping(finalResponse.content, (char) => {
        onPartialResponse(char);
      });

      // 返回最终回复
      return finalResponse;
    }

    // 处理正常文本响应（没有工具调用）
    if (data.choices && data.choices[0].message) {
      const apiResponse = data.choices[0].message.content;
      console.log("[AI Service] ✅ 正常文本响应（未调用工具）");
      console.log("[AI Service] 原始响应apiResponse:", apiResponse);
      // 尝试解析JSON格式的响应
      let fullResponse = apiResponse;
      let debugReasoning = null;

      try {
        // 尝试解析JSON响应
        const jsonResponse = JSON.parse(apiResponse);
        console.log("[AI Service] 成功解析JSON响应jsonResponse:", jsonResponse);
        // 提取主内容
        fullResponse = jsonResponse.result || jsonResponse.reason;
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
    }

    throw new Error("API响应格式不正确，未找到有效回复");
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
