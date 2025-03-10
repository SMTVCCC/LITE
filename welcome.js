document.addEventListener('DOMContentLoaded', () => {
    // 获取页面元素
    const startChatBtn = document.getElementById('startChatBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    
    // 隐藏设置按钮
    settingsBtn.style.display = 'none';
    
    // 开始聊天按钮点击事件
    startChatBtn.addEventListener('click', () => {
        // 直接跳转到聊天页面
        window.location.href = 'chat.html';
    });
    
    // 显示提示消息的函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 2000);
    }
});
