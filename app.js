document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const chatContainer = document.querySelector('.chat-container');
    const settingsBtn = document.getElementById('settingsBtn');
    
    // 隐藏设置按钮
    settingsBtn.style.display = 'none';
    
    // 在全局作用域声明变量，方便在不同函数间共享
    let isWaitingForResponse = false; // 标记是否正在等待AI响应
    let currentResponseElement = null; // 跟踪当前响应元素
    
    // 初始化欢迎消息状态
    const welcomeMessage = document.querySelector('.assistant-message');
    if (welcomeMessage) {
        welcomeMessage.dataset.complete = 'true';
    }
    
    // 设置API回调
    setupSparkApi();
    
    // 添加发送按钮点击事件
    sendButton.addEventListener('click', () => {
        sendMessage();
    });
    
    // 添加回车发送功能
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // 设置星火API的回调函数
    function setupSparkApi() {
        window.sparkAPI.setResponseCallback((response, type, isComplete) => {
            // 移除所有"正在思考"消息
            document.querySelectorAll('.thinking-message').forEach(el => el.remove());
            
            console.log('收到 AI 响应:', response, '类型:', type, '是否完成:', isComplete);
            
            if (!response) {
                console.error('收到空响应');
                return;
            }
            
            // 如果是错误消息，直接创建新的消息元素
            if (type === 'error') {
                createMessageElement(response, type);
                isWaitingForResponse = false; // 重置状态
                currentResponseElement = null; // 重置当前响应元素
            } else if (type === 'assistant') {
                // 如果没有当前响应元素，创建一个新的
                if (!currentResponseElement) {
                    currentResponseElement = createMessageElement(response, type);
                    currentResponseElement.dataset.complete = isComplete ? 'true' : 'false';
                } else {
                    // 更新现有消息内容
                    const paragraph = currentResponseElement.querySelector('p');
                    if (paragraph) {
                        paragraph.textContent = response;
                    }
                    currentResponseElement.dataset.complete = isComplete ? 'true' : 'false';
                }
                
                // 如果响应完成，重置状态
                if (isComplete) {
                    isWaitingForResponse = false;
                    currentResponseElement = null; // 下一次将创建新的消息元素
                }
            }
            
            // 滚动到底部
            scrollToBottom();
        });
    }
    
    // 发送消息的函数
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // 重置状态
            isWaitingForResponse = true;
            currentResponseElement = null;
            
            // 创建用户消息
            createMessageElement(message, 'user');
            
            // 清空输入框
            messageInput.value = '';
            
            // 添加"正在思考"提示
            createThinkingMessage();
            
            // 发送消息到API
            window.sparkAPI.sendMessage(message);
            
            // 滚动到底部
            scrollToBottom();
        }
    }
    
    // 创建消息元素
    function createMessageElement(content, type) {
        let messageClass, iconSpan, nameSpan, textClass;
        
        switch(type) {
            case 'error':
                messageClass = 'bg-gradient-to-r from-red-100 to-red-50 rounded-2xl p-4 shadow-lg border-2 border-red-200';
                iconSpan = '<span class="mr-2">⚠️</span>';
                nameSpan = '<span class="text-sm font-medium text-red-600">系统提示</span>';
                textClass = 'text-sm text-red-600';
                break;
            case 'system':
                messageClass = 'bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-4 shadow-lg border-2 border-gray-200';
                iconSpan = '<span class="mr-2">🔔</span>';
                nameSpan = '<span class="text-sm font-medium text-gray-600">系统提示</span>';
                textClass = 'text-sm text-gray-600';
                break;
            case 'user':
                messageClass = 'bg-gradient-to-r from-cyan-100 to-pink-100 rounded-2xl p-4 shadow-lg border-2 border-cyan-200';
                iconSpan = '<span class="mr-2">👤</span>';
                nameSpan = '<span class="text-sm font-medium text-cyan-600">我</span>';
                textClass = 'text-sm text-cyan-600';
                break;
            case 'assistant':
            default:
                messageClass = 'bg-gradient-to-r from-pink-100 to-cyan-100 rounded-2xl p-4 shadow-lg border-2 border-pink-200 assistant-message';
                iconSpan = '<span class="mr-2">🍬</span>';
                nameSpan = '<span class="text-sm font-medium text-pink-600">糖果精灵</span>';
                textClass = 'text-sm text-pink-600';
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = messageClass;
        messageElement.innerHTML = `
            <div class="flex items-center mb-2">
                ${iconSpan}
                ${nameSpan}
            </div>
            <p class="${textClass}">${content}</p>
        `;
        chatContainer.appendChild(messageElement);
        
        return messageElement;
    }
    
    // 创建"正在思考"提示
    function createThinkingMessage() {
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-4 shadow-lg border-2 border-gray-200 thinking-message';
        thinkingMessage.innerHTML = `
            <div class="flex items-center mb-2">
                <span class="mr-2">🤔</span>
                <span class="text-sm font-medium text-gray-600">思考中</span>
            </div>
            <p class="text-sm text-gray-600">糖果精灵正在思考回答...</p>
        `;
        chatContainer.appendChild(thinkingMessage);
    }
    
    // 显示提示消息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-50';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 2000);
    }
    
    // 滚动到底部
    function scrollToBottom() {
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }
});