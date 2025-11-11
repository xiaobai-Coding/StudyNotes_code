// DeepSeek AI服务实现
// 使用真实的DeepSeek API进行对话

import { Message } from '../types/chat';

// 从环境变量中读取配置
const getConfig = () => ({
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  apiBaseUrl: import.meta.env.VITE_AI_API_BASE_URL || 'https://api.deepseek.com',
  appTitle: import.meta.env.VITE_APP_TITLE || 'DeepSeek AI聊天',
  debug: import.meta.env.VITE_APP_DEBUG === 'true',
  model: 'deepseek-chat'
});

const config = getConfig();

// 辅助函数：延迟执行
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟打字输出效果
export const simulateTyping = async (text: string, onCharacterAdd: (char: string) => void): Promise<void> => {
  console.log('[AI Service] 开始模拟打字效果，文本长度:', text.length);
  
  const chars = text.split('');
  for (const char of chars) {
    onCharacterAdd(char);
    await delay(30 + Math.random() * 30); // 固定打字速度
  }
};

// 简化的API调用函数
const callDeepSeekAPI = async (userMessages: any): Promise<string> => {
  console.log('[AI Service] 开始API调用...');
  console.log('[AI Service] API密钥:', config.apiKey ? '已设置' : '未设置');
  console.log('[AI Service] API基础URL:', config.apiBaseUrl);
  console.log('[AI Service] 用户消息:', userMessages);
  
  // 确保API密钥存在
  if (!config.apiKey) {
    throw new Error('未配置API密钥，请检查.env.local文件');
  }
  
  try {
    const endpoint = `${config.apiBaseUrl}/chat/completions`;
    console.log('[AI Service] API端点:', endpoint);
    
    const requestBody = {
      model: config.model,
      messages: [
        ...userMessages,
        { role: 'system', content: '你是一个前端开发专家，专业知识丰富，能够回答前端相关问题。' }
      ],
      temperature: 0.7, // 控制回复的随机性，0.7是一个平衡值
      max_tokens: 300 // 限制回复的最大长度
    };
    
    console.log('[AI Service] 准备发送fetch请求...');
    
    // 发送API请求
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    console.log('fetch请求参数:', requestBody);
    
    console.log('[AI Service] 收到响应，状态码:', response.status);
    
    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AI Service] 错误响应内容:', errorText);
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }
    
    // 解析响应数据
    const data = await response.json();
    console.log('[AI Service] 响应数据:', JSON.stringify(data, null, 2));
    
    // 提取AI回复
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;
      console.log('[AI Service] 成功获取AI回复，长度:', aiResponse.length);
      return aiResponse;
    }
    
    throw new Error('API响应格式不正确，未找到有效回复');
  } catch (error) {
    console.error('[AI Service] API调用异常:', error);
    throw error;
  }
};
// 获取AI回复 具有上下文记忆功能
export const getAIResponse = async (userMessages: any, onPartialResponse: (partialResponse: string) => void): Promise<string> => {
  console.log('[AI Service] getAIResponse被调用');
  
  try {
    // 直接调用API
    const fullResponse = await callDeepSeekAPI(userMessages);
    
    // 添加一些延迟以模拟处理过程
    await delay(500);
    
    // 模拟打字效果
    await simulateTyping(fullResponse, (char) => {
      onPartialResponse(char);
    });
    
    return fullResponse;
  } catch (error) {
    console.error('[AI Service] 获取AI回复失败:', error);
    
    // 生成错误消息
    const errorMessage = error instanceof Error 
      ? `调用API出错: ${error.message}`
      : '调用API出错，请检查网络连接或API密钥';
    
    // 显示错误消息
    await simulateTyping(errorMessage, (char) => {
      onPartialResponse(char);
    });
    
    return errorMessage;
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