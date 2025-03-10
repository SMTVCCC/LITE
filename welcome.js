document.addEventListener('DOMContentLoaded', () => {
    // 获取页面元素
    const startChatBtn = document.getElementById('startChatBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const welcomeVideo = document.getElementById('welcomeVideo');
    
    // 隐藏设置按钮
    settingsBtn.style.display = 'none';
    
    // 随机选择视频
    if (welcomeVideo) {
        const videos = ['RW.mov', 'RW1.mov', 'RW3.mov'];
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        
        // 创建视频源元素
        const source = document.createElement('source');
        source.src = randomVideo;
        source.type = 'video/mp4';
        
        // 添加到视频元素
        welcomeVideo.appendChild(source);
        
        // 确保视频静音
        welcomeVideo.muted = true;
        
        // 添加错误处理
        welcomeVideo.addEventListener('error', () => {
            console.error('视频加载失败:', randomVideo);
            // 尝试加载默认视频
            if (randomVideo !== 'RW.mov') {
                source.src = 'RW.mov';
                welcomeVideo.load();
            }
        });
        
        // 加载视频
        welcomeVideo.load();
    }
    
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
