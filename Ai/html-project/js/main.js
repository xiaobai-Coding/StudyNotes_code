// 全局变量
let isProcessing = false;

// DOM 元素
const replyElement = document.getElementById('reply');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const askBtn = document.getElementById('askBtn');
const copyBtn = document.getElementById('copyBtn');

// API 配置
const endpoint = 'https://api.deepseek.com/chat/completions';
const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
};

// 更新状态
function updateStatus(type, message) {
    statusIndicator.className = `status-indicator ${type}`;
    statusText.textContent = message;
}

// 显示加载状态
function showLoading() {
    replyElement.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    replyElement.className = 'reply-box loading';
    updateStatus('loading', '正在思考中...');
    askBtn.disabled = true;
    copyBtn.style.display = 'none';
}

// 显示成功状态
function showSuccess(content) {
    replyElement.innerHTML = content;
    replyElement.className = 'reply-box success';
    updateStatus('success', '回答完成');
    askBtn.disabled = false;
    copyBtn.style.display = 'inline-block';
}

// 显示错误状态
function showError(message) {
    replyElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    replyElement.className = 'reply-box error';
    updateStatus('error', '请求失败');
    askBtn.disabled = false;
    copyBtn.style.display = 'none';
}

// 复制回答内容
function copyResponse() {
    const content = replyElement.textContent;
    navigator.clipboard.writeText(content).then(() => {
        // 显示复制成功提示
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        copyBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, #6c757d, #495057)';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

// 重新提问
function askQuestion() {
    if (isProcessing) return;
    
    isProcessing = true;
    showLoading();
    
    const payload = {
        model: 'deepseek-chat',
        messages: [
            {role: "system", content: "你是一个有用的AI助手，请用中文回答用户的问题。"},
            {role: "user", content: "你好！请介绍一下你自己，并告诉我你能做什么。"}
        ],
        stream: false,
    };

    fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            showSuccess(content);
        } else {
            throw new Error('API返回数据格式错误');
        }
    })
    .catch(error => {
        console.error('请求失败:', error);
        let errorMessage = '请求失败，请检查网络连接';
        
        if (error.message.includes('401')) {
            errorMessage = 'API密钥无效，请检查配置';
        } else if (error.message.includes('429')) {
            errorMessage = '请求过于频繁，请稍后再试';
        } else if (error.message.includes('500')) {
            errorMessage = '服务器错误，请稍后再试';
        }
        
        showError(errorMessage);
    })
    .finally(() => {
        isProcessing = false;
    });
}

// 页面加载完成后自动提问
document.addEventListener('DOMContentLoaded', () => {
    // 延迟一点时间让页面完全加载
    setTimeout(askQuestion, 500);
});

// 导出函数供HTML调用
window.askQuestion = askQuestion;
window.copyResponse = copyResponse;