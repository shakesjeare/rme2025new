// 在文件开头添加全局变量
let mediaRecorder;
let audioChunks = [];
let recordingStartTime;
let recordingTimer;


// 更新录音计时器显示
// 添加更新计时器显示的函数
function updateRecordingTimer() {
    const now = Date.now();
    const diff = now - recordingStartTime;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = (seconds % 60).toString().padStart(2, '0');
    const displayMinutes = minutes.toString().padStart(2, '0');
    document.getElementById('recording-timer').textContent = `${displayMinutes}:${displaySeconds}`;
}

window.addEventListener("DOMContentLoaded", async function () {
  async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('Microphone permission granted');
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('请允许访问麦克风以启用录音功能');
    }
}
requestMicrophonePermission();
  

  // Get the elements by their ID
  const fireTrigger = document.querySelector("#firetrigger");
  const breath = document.querySelector("#breath");
  const guide = document.querySelector("#guide");
  const touchFire = document.querySelector("#touchfire");
  const fire = document.querySelector("#fire");
  const island = document.querySelector("#island");

  // Store the original position of fireTrigger
  const fireTriggerOriginalPosition = fireTrigger.getAttribute("position");

  // 初始化状态 - 完全禁用所有相关元素
  function disableAllFireComponents() {
    // 禁用视觉显示
    fire.setAttribute("visible", false);
    touchFire.setAttribute("visible", false);
    breath.setAttribute("visible", false);
    
    // 移除所有交互属性
    fireTrigger.removeAttribute("grabbable");
    fireTrigger.removeAttribute("clickable");
    
    // 移除事件监听器
    fireTrigger.removeEventListener("mousedown", handleActions);
    fireTrigger.removeEventListener("click", handleActions);
    fireTrigger.removeEventListener("grab-start", handleActions);
    
    // 设置交互标志
    window.isFireInteractionEnabled = false;
  }

  // 初始禁用
  disableAllFireComponents();

  // 处理悬停事件
  function handleHover(event) {
    if (!window.isFireInteractionEnabled) {
      event.stopPropagation();
      return;
    }
  }

  window.showAndEnableComponents = function () {
  // 检查计数器
  if (window.ballsGrabbed !== 3) {
    return;
  }

  // 启用交互标志
  window.isFireInteractionEnabled = true;

  // 显示视觉元素 - 确保fire可见
  fire.setAttribute("visible", true);
  touchFire.setAttribute("visible", true);
  
  // 检查并确保fire内部的模型可见
  fire.addEventListener('model-loaded', function() {
    console.log("Fire model loaded successfully");
    // 如果模型加载后需要进行额外设置，可以在这里添加
  });

  // 设置触发器位置 - 现在使用绝对位置
  fireTrigger.setAttribute("position", {
    x: 0.15,
    y: -0.032,
    z: -0.8
  });

  // 确保触发器不可见，但可交互
  fireTrigger.setAttribute("visible", false);
  
  // 删除任何可能导致触发器可见的材质设置
  fireTrigger.removeAttribute("material");

  // 启用交互属性
  fireTrigger.setAttribute("grabbable", "");
  fireTrigger.setAttribute("clickable", "");

  // 添加事件监听器
  fireTrigger.addEventListener("mousedown", handleActions);
  fireTrigger.addEventListener("click", handleActions);
  fireTrigger.addEventListener("grab-start", handleActions);

  console.log("Fire components enabled with trigger at position:", fireTrigger.getAttribute("position"));
  
  // 检查fire模型是否可见
  setTimeout(() => {
    if (fire.getAttribute("visible") === true) {
      console.log("Fire model is set to visible");
    } else {
      console.log("Warning: Fire model visibility issue detected");
      // 强制设置fire可见
      fire.setAttribute("visible", true);
    }
  }, 500);
};

  
  
  // Function to handle the desired actions
 function handleActions(event) {
  // 检查是否允许交互
  if (!window.isFireInteractionEnabled || window.ballsGrabbed !== 3) {
    event.stopPropagation();
    return;
  }

  console.log("Fire action triggered:", event.type);
  
  // 临时禁用交互，防止重复触发
  window.isFireInteractionEnabled = false;

  // 先停止所有球体的声音和效果
  window.stopBallSounds();
  window.hideBallsAndEffects();

  // 禁用所有球体的交互
  const balls = document.querySelectorAll('.interactive-ball');
  balls.forEach(ball => {
    // 移除交互属性
    ball.removeAttribute('grabbable');
    ball.removeAttribute('draggable');
    ball.removeAttribute('hoverable');
    ball.removeAttribute('clickable');
    
    // 移除事件监听器
    ball.removeEventListener('grab-start', window.handleBallGrab);
    ball.removeEventListener('grab-end', window.handleBallDrop);
    ball.removeEventListener('click', window.handleBallClick);
    
    // 设置标志表明球体已被禁用
    ball.setAttribute('data-disabled', 'true');
  });

  // Make breath visible
  breath.setAttribute("visible", true);
  
  // 立即隐藏 touchFire
  touchFire.setAttribute("visible", false);

  // Store the visible state
  window.storeVisibleState();

  // Play guide sound
  guide.components.sound.playSound();

  // Hide elements
  window.hideElements();

  // 将触发器移到视野外
  fireTrigger.setAttribute("position", "0 -100 0");
  
  // 移除所有交互属性
  fireTrigger.removeAttribute("hoverable");
  fireTrigger.removeAttribute("grabbable");
  fireTrigger.removeAttribute("clickable");

  // 隐藏 fire 和触发器
  fire.setAttribute("visible", false);
  fireTrigger.setAttribute("visible", false);

  // Pause island sound
  if (island && island.components.sound) {
    island.components.sound.pauseSound();
  }
}

  // 定义 handleSoundEnded 函数
    function handleSoundEnded() {
    if (window.ballsGrabbed === 3) {
        // 1. 禁用 breath 和 touchFire
        breath.setAttribute("visible", false);
        touchFire.setAttribute("visible", false);
        breath.removeAttribute("hoverable");
        breath.removeAttribute("clickable");
        touchFire.removeAttribute("hoverable");
        touchFire.removeAttribute("clickable");

        // 2. 播放蜡烛指示音频
        const candleInstructions = document.querySelector("#candle-instructions");
        if (candleInstructions && candleInstructions.components.sound) {
            candleInstructions.components.sound.playSound();
        }

        // 3. 获取所需元素
        const candleSystem = document.querySelector('#personal-candle-system');
        const personalCandle = document.querySelector('#personal-candle');
        const candleModel = document.querySelector('#candle-model');

        // 4. 设置蜡烛的初始位置和状态
        const startPosition = {
            x: 0.25,
            y: -0.9,
            z: -1.3
        };

        candleSystem.setAttribute("visible", true);
        candleModel.setAttribute("visible", true);
        candleSystem.setAttribute("position", 
            `${startPosition.x} ${startPosition.y} ${startPosition.z}`
        );

        // 5. 蜡烛上升动画
        const riseHeight = 1; // 上升高度
        candleSystem.setAttribute("animation__rise", {
            property: "position",
            dur: 3500,
            easing: "easeOutCubic",
            from: `${startPosition.x} ${startPosition.y} ${startPosition.z}`,
            to: `${startPosition.x} ${startPosition.y + riseHeight} ${startPosition.z}`
        });

        // 6. 在上升动画结束后开始抛物线动画
        setTimeout(() => {
            // 获取相机
            const camera = document.querySelector('[camera]');
            // 获取相机的位置和旋转
            const cameraPosition = camera.object3D.position;
            const cameraRotation = camera.getAttribute('rotation');
            
            // 计算相机正面的位置（考虑相机的Y轴旋转）
            const angleRad = cameraRotation.y * Math.PI / 180;
            const endPosition = {
                x: cameraPosition.x - (Math.sin(angleRad) * 0.5), // 使用减号确保在正面
                y: 0.4,
                z: cameraPosition.z - (Math.cos(angleRad) * 0.5)  // 使用减号确保在正面
            };

            const currentPos = {
                x: startPosition.x,
                y: startPosition.y + riseHeight,
                z: startPosition.z
            };
            
            const distance = Math.sqrt(
                Math.pow(endPosition.x - currentPos.x, 2) +
                Math.pow(endPosition.z - currentPos.z, 2)
            );
            const peakHeight = Math.max(endPosition.y, currentPos.y) + (distance * 0.5);
            const totalDuration = Math.min(5000 + (distance * 1000), 8000);
          
           // 设置抛物线动画
            candleSystem.setAttribute("animation__parabola", {
                property: "position",
                dur: totalDuration,
                easing: "easeInOutQuad",
                from: `${currentPos.x} ${currentPos.y} ${currentPos.z}`,
                to: `${endPosition.x} ${endPosition.y} ${endPosition.z}`,
                dir: "normal",
                midPoints: [
                    {
                        percentage: 50,
                        value: `${(currentPos.x + endPosition.x) / 2} ${peakHeight} ${(currentPos.z + endPosition.z) / 2}`
                    }
                ]
            });

            // 旋转动画保持不变
            candleSystem.setAttribute("animation__rotate", {
                property: "rotation",
                from: "0 0 0",
                to: "0 360 0",
                dur: totalDuration,
                easing: "linear"
            });


            // 添加交互事件监听器
            personalCandle.addEventListener("mousedown", handleCandleGrab);
            personalCandle.addEventListener("mouseup", handleCandleRelease);
            personalCandle.addEventListener("grab-start", handleCandleGrab);
            personalCandle.addEventListener("grab-end", handleCandleRelease);

             // 在抛物线动画结束后调整朝向
            setTimeout(() => {
                const angle = Math.atan2(
                    cameraPosition.x - endPosition.x,
                    cameraPosition.z - endPosition.z
                );
                
                candleSystem.setAttribute("rotation", `0 ${(angle * 180 / Math.PI)} 0`);
            }, totalDuration);

        }, 2500);

        window.isFireInteractionEnabled = false;
    }
}

let isFirstGrabComplete = false;
let isSecondGrab = false;  // 添加第二次grab的标记

async function handleCandleGrab(event) {
    const candleFire = document.querySelector('#personal-candle-fire');
    const candleParticle = document.querySelector('#personal-candle-particle');
    const candleSystem = document.querySelector('#personal-candle-system');
    const recordingText = document.querySelector('#recording-text');
    const releaseInstructionText = document.querySelector('#release-instruction-text');
  
    // 如果是第一次grab
    if (!isFirstGrabComplete) {
        // 显示录音提示文本
        recordingText.setAttribute('visible', true);
        
        // 显示火焰和粒子效果
        candleFire.setAttribute("visible", true);
        candleParticle.setAttribute("visible", true);
        
        // 标记蜡烛被抓住
        event.target.setAttribute("grabbed", "true");
        
        // 设置漂浮动画
        const currentPos = candleSystem.getAttribute("position");
        const deltaY = 0.05;
        
        candleSystem.setAttribute("animation__float", {
            property: "position",
            from: `${currentPos.x} ${currentPos.y - deltaY} ${currentPos.z}`,
            to: `${currentPos.x} ${currentPos.y + deltaY} ${currentPos.z}`,
            dir: "alternate",
            easing: "easeInOutSine",
            loop: true,
            dur: 2000
        });

        // 开始录音
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                await sendAudioToServer(audioBlob);
            };

            mediaRecorder.start();
            recordingStartTime = Date.now();
            recordingTimer = setInterval(updateRecordingTimer, 1000);
            document.getElementById('recording-status').style.display = 'block';
            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    } else if (!isSecondGrab) {
        // 第二次grab，标记已经第二次抓取
        isSecondGrab = true;
        
        // 隐藏提示文本
        releaseInstructionText.setAttribute('visible', false);
        // 可以添加新的提示文本，比如"Release to send your blessing"
        recordingText.setAttribute('value', 'Release to send your blessing');
        recordingText.setAttribute('color', '#FFD700'); // 金色
    }
}
  
function handleCandleRelease(event) {
    if (!isFirstGrabComplete) {
        // 第一次release
        isFirstGrabComplete = true;
        
        // 显示新的指示文本
        const releaseInstructionText = document.querySelector('#release-instruction-text');
        if (releaseInstructionText) {
            releaseInstructionText.setAttribute('visible', true);
            releaseInstructionText.setAttribute('position', '0 -0.03 0');
            releaseInstructionText.setAttribute('value', '');
        }
    } else if (isSecondGrab) {
        // 第二次release，执行最终释放逻辑
        handleFinalRelease(event);
    }
}

function handleFinalRelease(event) {
    // 隐藏所有提示文本
    const recordingText = document.querySelector('#recording-text');
    const releaseInstructionText = document.querySelector('#release-instruction-text');
    if (recordingText) {
        recordingText.setAttribute('visible', false);
    }
    if (releaseInstructionText) {
        releaseInstructionText.setAttribute('visible', false);
    }
   
    // 停止录音
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        clearInterval(recordingTimer);
        document.getElementById('recording-status').style.display = 'none';
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        console.log('Recording stopped');
    }
   
    const candleSystem = document.querySelector('#personal-candle-system');
    const personalCandle = document.querySelector('#personal-candle');
    
     // 播放结束导引音频
    const finalGuide = document.querySelector('#final-guide');
    if (finalGuide && finalGuide.components.sound) {
        finalGuide.components.sound.playSound();
    }
    
    // 获取当前位置
    const currentPos = candleSystem.getAttribute("position");
    const toPosition = { x: 0, y: 30, z: -0.5 };

    // 停止所有之前的动画
    candleSystem.removeAttribute("animation__float");
    candleSystem.removeAttribute("animation__parabola");
    candleSystem.removeAttribute("animation__rise");
    
    // 创建向上飘升的动画序列
    const animations = {
        rise: {
            property: "position",
            from: `${currentPos.x} ${currentPos.y} ${currentPos.z}`,
            to: `${currentPos.x} ${currentPos.y + 5} ${toPosition.z}`,
            dur: 15000,
            easing: "easeOutQuad"
        },
        ascend: {
            property: "position",
            from: `${currentPos.x} ${currentPos.y + 5} ${toPosition.z}`,
            to: `${toPosition.x} ${toPosition.y} ${toPosition.z}`,
            dur: 10000,
            easing: "easeInOutSine",
            delay: 15000
        },
        fade: {
            property: "material.opacity",
            from: "1",
            to: "0",
            dur: 15000,
            easing: "easeInOutSine"
        },
        scale: {
            property: "scale",
            from: "1 1 1",
            to: "0.1 0.1 0.1",
            dur: 15000,
            easing: "easeInOutSine"
        }
    };

    // 应用所有动画
    Object.entries(animations).forEach(([name, animation]) => {
        candleSystem.setAttribute(`animation__${name}`, animation);
    });

    // 在蜡烛消失后切换场景
    // 修改原来的场景切换代码
setTimeout(() => {
    if (candleSystem.parentNode) {
        candleSystem.parentNode.removeChild(candleSystem);
    }
    // 切换到冥想环境
    switchToMeditationEnvironment();
}, 18000);
  
  async function switchToMeditationEnvironment() {
    const scene = document.querySelector('a-scene');
    const isInVR = scene.is('vr-mode');
    
    // 创建淡出效果
    const fadeEffect = document.createElement('a-entity');
    fadeEffect.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.1
    });
    fadeEffect.setAttribute('material', {
        color: '#000',
        opacity: 0,
        transparent: true,
        side: 'back'
    });
    
    // 设置位置到相机位置
    const camera = scene.querySelector('[camera]');
    const position = camera.object3D.position;
    fadeEffect.setAttribute('position', position);
    
    scene.appendChild(fadeEffect);
    
    // 淡出动画
    fadeEffect.setAttribute('animation__scale', {
        property: 'scale',
        to: '4 4 4',
        dur: 1000,
        easing: 'easeInQuad'
    });
    
    fadeEffect.setAttribute('animation__opacity', {
        property: 'material.opacity',
        to: '1',
        dur: 1000,
        easing: 'easeInQuad'
    });

    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查是否支持 XR 导航
    if (isInVR && scene.renderer && scene.renderer.xr && scene.renderer.xr.getSession()) {
        const xrSession = scene.renderer.xr.getSession();
        if (xrSession.environmentBlendMode === 'opaque' && 'navigate' in xrSession) {
            // 使用 XR 导航
            try {
                await xrSession.navigate('https://shakesjeare.github.io/meditation2025/');
            } catch (err) {
                console.error('XR Navigation failed:', err);
                // 降级到普通导航
                window.location.href = 'https://shakesjeare.github.io/meditation2025/';
            }
        } else {
            // 如果不支持 XR 导航，使用普通导航
            window.location.href = 'https://shakesjeare.github.io/meditation2025/';
        }
    } else {
        // 如果不在 VR 模式，直接导航
        window.location.href = 'https://shakesjeare.github.io/meditation2025/';
    }
}
   
    // 移除事件监听器
    personalCandle.removeEventListener("mousedown", handleCandleGrab);
    personalCandle.removeEventListener("mouseup", handleCandleRelease);
    personalCandle.removeEventListener("grab-start", handleCandleGrab);
    personalCandle.removeEventListener("grab-end", handleCandleRelease);

    // 禁用进一步的交互
    personalCandle.removeAttribute("grabbable");
    personalCandle.removeAttribute("draggable");
    personalCandle.removeAttribute("hoverable");
    personalCandle.removeAttribute("droppable");
}
  
  
// 添加发送音频函数
async function sendAudioToServer(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('发送失败');
        }
        
        console.log('录音已成功发送到邮箱');
    } catch (error) {
        console.error('Error sending audio:', error);
    }
}
  
  // Listen for the sound-ended event
  guide.addEventListener("sound-ended", handleSoundEnded);

  // 添加清理函数
  function cleanup() {
    fireTrigger.removeEventListener("mousedown", handleActions);
    fireTrigger.removeEventListener("click", handleActions);
    fireTrigger.removeEventListener("grab-start", handleActions);
    guide.removeEventListener("sound-ended", handleSoundEnded);
    
    const personalCandle = document.querySelector('#personal-candle');
    if (personalCandle) {
        personalCandle.removeEventListener("mousedown", handleCandleGrab);
        personalCandle.removeEventListener("mouseup", handleCandleRelease);
        personalCandle.removeEventListener("grab-start", handleCandleGrab);
        personalCandle.removeEventListener("grab-end", handleCandleRelease);
    }
  }

  // 在场景卸载时清理
  document.querySelector("a-scene").addEventListener("unload", cleanup);
}); 