<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { Message } from '../types/chat';
import { getAIResponse, shouldAskFollowUp, getFollowUpSuggestion, config } from '../services/aiService';

// 使用环境变量中的应用标题
const appTitle = config.appTitle || 'AI 聊天助手';

// 调试配置
const debug = config.debug || true;

// 聊天消息列表
const messages = ref<Message[]>([]);
// 用户输入内容
const userInput = ref('');
// 是否正在生成AI回复
const isTyping = ref(false);
// 临时存储AI正在输入的内容
const tempAIResponse = ref('');
// 会话ID，用于生成唯一消息ID
const sessionId = Date.now().toString();
// 消息计数器
let messageCounter = 0;

// 生成唯一消息ID
const generateId = (): string => {
  return `${sessionId}-msg-${messageCounter++}`;
};

// 添加消息到聊天列表
const addMessage = (content: string, sender: 'user' | 'ai') => {
  const newMessage: Message = {
    id: generateId(),
    content,
    sender,
    timestamp: Date.now()
  };
  messages.value.push(newMessage);
  sessionStorage.setItem('chatMessages', JSON.stringify(messages.value));
  console.log('[Chat] 添加消息:', messages.value);
  // 自动滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
};

// 滚动到底部
const scrollToBottom = () => {
  const chatContainer = document.getElementById('chat-container');
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
};

// 发送用户消息
const sendMessage = async () => {
  const trimmedInput = userInput.value.trim();
  if (!trimmedInput || isTyping.value) return;
  
  // if (debug) {
  //   console.log('[Chat] 发送消息:', trimmedInput);
  //   console.log('[Chat] API配置:', {
  //     apiKey: config.apiKey ? '已设置' : '未设置',
  //     apiBaseUrl: config.apiBaseUrl
  //   });
  // }
  
  // 添加用户消息
  addMessage(trimmedInput, 'user');
  userInput.value = '';
  
  // 开始生成AI回复
  isTyping.value = true;
  tempAIResponse.value = '';
  
  try {
    if (debug) {
      console.log('[Chat] 调用getAIResponse函数');
    }
    const historyMessages  = messages.value.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    // 调用AI API获取回复
    await getAIResponse([...historyMessages, { content: trimmedInput, role: 'user' }], (char) => {
      tempAIResponse.value += char;
    });
    
    // 添加完整的AI回复
    addMessage(tempAIResponse.value, 'ai');
    
    // 检查是否需要追问
    if (shouldAskFollowUp(trimmedInput)) {
      // setTimeout(() => {
      //   addMessage(getFollowUpSuggestion(trimmedInput), 'ai');
      // }, 1000);
    }
  } catch (error) {
    console.error('[Chat] 生成AI回复时出错:', error);
    addMessage('抱歉，我暂时无法回复。请稍后再试。', 'ai');
  } finally {
    if (debug) {
      console.log('[Chat] AI回复完成');
    }
    isTyping.value = false;
    tempAIResponse.value = '';
  }
};

// 处理键盘事件
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 清空聊天
const clearChat = () => {
  messages.value = [];
  messageCounter = 0;
  sessionStorage.setItem('chatMessages', JSON.stringify(messages.value));
};

// 组件挂载后，添加欢迎消息
onMounted(() => {
  // 从sessionStorage加载聊天记录
  const savedMessages = sessionStorage.getItem('chatMessages');
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages);
  }
  
});
</script>

<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <h2>{{ appTitle }}</h2>
      <button class="clear-button" @click="clearChat">清空聊天</button>
    </div>
    
    <!-- 聊天消息区域 -->
    <div id="chat-container" class="messages-container">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        :class="['message', message.sender]"
      >
        <div class="message-avatar">
          {{ message.sender === 'user' ? '👤' : '🤖' }}
        </div>
        <div class="message-content">
          <p>{{ message.content }}</p>
          <span class="message-time">
            {{ new Date(message.timestamp).toLocaleTimeString() }}
          </span>
        </div>
      </div>
      
      <!-- AI打字中指示器 -->
      <div v-if="isTyping" class="message ai">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <p>{{ tempAIResponse }}<span class="typing-indicator">|</span></p>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-container">
      <textarea
        v-model="userInput"
        @keypress="handleKeyPress"
        placeholder="输入你的问题..."
        :disabled="isTyping"
        class="chat-input"
      ></textarea>
      <button 
        @click="sendMessage" 
        :disabled="!userInput.trim() || isTyping"
        class="send-button"
      >
        {{ isTyping ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 主容器 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 850px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

/* 头部样式 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.clear-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

/* 自定义滚动条 */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 1rem;
  max-width: 75%;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.ai {
  align-self: flex-start;
}

/* 头像样式 */
.message-avatar {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.5rem;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.message:hover .message-avatar {
  transform: scale(1.05);
}

/* 消息内容样式 */
.message-content {
  padding: 1rem 1.25rem;
  border-radius: 18px;
  position: relative;
  line-height: 1.5;
  word-wrap: break-word;
}

/* AI消息样式 */
.message.ai .message-content {
  background-color: white;
  color: #333;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 4px;
}

/* 用户消息样式 */
.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  border-bottom-right-radius: 4px;
}

.message p {
  margin: 0;
  font-size: 1rem;
}

/* 时间戳 */
.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  display: block;
}

.message.user .message-time {
  text-align: left;
}

.message.ai .message-time {
  text-align: right;
}

/* 打字指示器 */
.typing-indicator {
  animation: typing 1.4s infinite;
  font-weight: bold;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 1;
  }
  30% {
    opacity: 0;
  }
}

/* 输入区域 */
.input-container {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.chat-input {
  flex: 1;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  resize: none;
  min-height: 45px;
  max-height: 150px;
  font-family: inherit;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0 1.75rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

.send-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    max-width: none;
    border-radius: 0;
  }
  
  .messages-container {
    padding: 1rem;
    gap: 1rem;
  }
  
  .message {
    max-width: 85%;
  }
  
  .chat-header {
    padding: 0.875rem 1.25rem;
  }
  
  .input-container {
    padding: 1rem;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .message {
    max-width: 90%;
    gap: 0.75rem;
  }
  
  .message-content {
    padding: 0.875rem 1rem;
    border-radius: 16px;
  }
  
  .clear-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
}
</style>