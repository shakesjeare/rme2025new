
window.document.querySelector("a-scene").addEventListener("loaded", function () {
  // 元素选择
  const balls = [
    document.querySelector("#ball1"),
    document.querySelector("#ball2"),
    document.querySelector("#ball3"),
    document.querySelector("#ball4"),
    document.querySelector("#ball5"),
    document.querySelector("#ball6"),
    document.querySelector("#ball7"),
    document.querySelector("#ball8"),
    document.querySelector("#ball9"),
    document.querySelector("#ball10"),
    document.querySelector("#ball11"),
    document.querySelector("#ball12"),
    document.querySelector("#ball13"),
    document.querySelector("#ball14"),
    document.querySelector("#ball15"),
    document.querySelector("#ball16"),
    document.querySelector("#ball17"),
    document.querySelector("#ball18"),
  ];

  const pivotPoints = [
    document.querySelector("#pivot-point-1"),
    document.querySelector("#pivot-point-2"),
    document.querySelector("#pivot-point-3"),
    document.querySelector("#pivot-point-4"),
    document.querySelector("#pivot-point-5"),
    document.querySelector("#pivot-point-6"),
    document.querySelector("#pivot-point-7"),
    document.querySelector("#pivot-point-8"),
    document.querySelector("#pivot-point-9"),
    document.querySelector("#pivot-point-10"),
    document.querySelector("#pivot-point-11"),
    document.querySelector("#pivot-point-12"),
    document.querySelector("#pivot-point-13"),
    document.querySelector("#pivot-point-14"),
    document.querySelector("#pivot-point-15"),
    document.querySelector("#pivot-point-16"),
    document.querySelector("#pivot-point-17"),
    document.querySelector("#pivot-point-18"),
  ];

  const cantoneseElements = [
    document.querySelector("#cantonese1"),
    document.querySelector("#cantonese2"),
    document.querySelector("#cantonese3"),
    document.querySelector("#cantonese4"),
    document.querySelector("#cantonese5"),
    document.querySelector("#cantonese6"),
    document.querySelector("#cantonese7"),
    document.querySelector("#cantonese8"),
    document.querySelector("#cantonese9"),
  ];

  const chineseElements = [
    document.querySelector("#chinese1"),
    document.querySelector("#chinese2"),
    document.querySelector("#chinese3"),
    document.querySelector("#chinese4"),
    document.querySelector("#chinese5"),
  ];

  const englishElements = [
    document.querySelector("#english1"),
    document.querySelector("#english2"),
    document.querySelector("#english3"),
    document.querySelector("#english4"),
  ];

  // UI元素
  const text1 = document.querySelector("#text1");
  const text2 = document.querySelector("#text2");
  const textbg = document.querySelector("#textbg");
  const yellowCandle = document.querySelector("#yellowcandle");
  const greyCandle = document.querySelector("#greycandle");
  const redCandle = document.querySelector("#redcandle");
  const canton = document.querySelector("#canton");
  const english = document.querySelector("#english");
  const chinese = document.querySelector("#Chinese");
  const uiContainer = document.querySelector("#uiContainer");
  const fireCanton = document.querySelector("#fire-canton");
  const fireEnglish = document.querySelector("#fire-english");
  const fireChinese = document.querySelector("#fire-chinese");

  // 音频元素
  const cantonAudio = document.querySelector("#cantonaudio");
  const englishAudio = document.querySelector("#englishaudio");
  const chineseAudio = document.querySelector("#chineseaudio");

  // 初始化UI状态
  text1.setAttribute("opacity", "0");
  text2.setAttribute("opacity", "0");
  yellowCandle.setAttribute("visible", false);
  greyCandle.setAttribute("visible", false);
  redCandle.setAttribute("visible", false);

  // 文本淡入动画
  text1.setAttribute("animation", {
    property: "opacity",
    to: "1",
    dur: "3000",
  });

  // 辅助函数
  function disableInteraction(ball) {
    ball.removeAttribute("hoverable");
    ball.removeAttribute("grabbable");
    ball.removeAttribute("draggable");
    ball.removeAttribute("droppable");
  }

  function enableInteraction(ball) {
    ball.setAttribute("hoverable", "");
    ball.setAttribute("grabbable", "");
    ball.setAttribute("draggable", "");
    ball.setAttribute("droppable", "");
  }

  function isParentVisible(ball) {
    const cantoneseParent = ball.closest('[id^="cantonese"]');
    const chineseParent = ball.closest('[id^="chinese"]');
    const englishParent = ball.closest('[id^="english"]');
    
    if (cantoneseParent) {
      return cantoneseElements.some(el => el.getAttribute("visible"));
    }
    if (chineseParent) {
      return chineseElements.some(el => el.getAttribute("visible"));
    }
    if (englishParent) {
      return englishElements.some(el => el.getAttribute("visible"));
    }
    return false;
  }

  function hideElements(elementArray) {
    elementArray.forEach((element) => {
      element.setAttribute("visible", false);
    });
  }

  function showElements(elementArray) {
    elementArray.forEach((element) => {
      element.setAttribute("visible", true);
    });
  }
  
  // 切换到文本2并显示蜡烛
  function switchToText2() {
    text1.setAttribute("animation", {
      property: "opacity",
      to: "0",
      dur: "500",
    });

    text2.setAttribute("animation", {
      property: "opacity",
      to: "1",
      dur: "500",
    });

    yellowCandle.setAttribute("visible", true);
    greyCandle.setAttribute("visible", true);
    redCandle.setAttribute("visible", true);
  }

  setTimeout(switchToText2, 15000);

  // 状态管理
  window.previousVisibleState = {
    cantoneseElements: [],
    chineseElements: [],
    englishElements: [],
    particleVisible: false,
  };

  window.storeVisibleState = function () {
    window.previousVisibleState = {
      cantoneseElements: cantoneseElements.map(el => el.getAttribute("visible")),
      chineseElements: chineseElements.map(el => el.getAttribute("visible")),
      englishElements: englishElements.map(el => el.getAttribute("visible")),
      particleVisible: balls.map(ball => {
        const particle = ball.querySelector('[gltf-model*="particle.glb"]');
        return particle ? particle.getAttribute("visible") : false;
      })
    };
  };

  window.restoreVisibleState = function () {
    cantoneseElements.forEach((el, i) => {
      el.setAttribute("visible", window.previousVisibleState.cantoneseElements[i]);
    });
    chineseElements.forEach((el, i) => {
      el.setAttribute("visible", window.previousVisibleState.chineseElements[i]);
    });
    englishElements.forEach((el, i) => {
      el.setAttribute("visible", window.previousVisibleState.englishElements[i]);
    });
    balls.forEach((ball, i) => {
      const particle = ball.querySelector('[gltf-model*="particle.glb"]');
      if (particle) {
        particle.setAttribute("visible", window.previousVisibleState.particleVisible[i]);
      }
    });
  };

  // 初始隐藏所有元素
  hideElements(cantoneseElements);
  hideElements(chineseElements);
  hideElements(englishElements);

  function startAnimationLift() {
    const pivotPoints = document.querySelectorAll("[animation__lift]");
    pivotPoints.forEach((pivotPoint) => {
      const animationLift = pivotPoint.getAttribute("animation__lift");
      pivotPoint.setAttribute("animation", animationLift);
    });
  }

  // 球体声音和光照控制
  window.ballsGrabbed = 0;

  function playSoundAndIncreaseLightIntensity(grabbedBall, index) {
    balls.forEach((ball, ballIndex) => {
      if (ball.id === grabbedBall.id && isParentVisible(ball)) {
        ball.components.sound.playSound();
        ball.setAttribute("light", "intensity", 0.1);
        showModelsOnGrab(ball);

        ball.addEventListener("sound-ended", function onSoundEnded() {
          const pivotPoint = pivotPoints[index];
          pivotPoint.emit("rise");
          ball.removeEventListener("sound-ended", onSoundEnded);
        });
      } else {
        ball.components.sound.stopSound();
      }
    });
  }

  function showModelsOnGrab(grabbedBall) {
    const flameModel = grabbedBall.querySelector(
      "a-entity[gltf-model='https://cdn.glitch.global/e9b206da-54a7-4fd5-a508-c992ea1bd559/521fire.glb']"
    );
    flameModel.setAttribute("visible", "true");

    const particleModel = grabbedBall.querySelector(
      "a-entity[gltf-model='https://cdn.glitch.global/e9b206da-54a7-4fd5-a508-c992ea1bd559/particle.glb']"
    );
    particleModel.setAttribute("visible", "true");
    particleModel.setAttribute("opacity", "1");
  }

  // 语言选择事件处理
  function setupLanguageEvents(element, elements, fire, audio) {
    const events = ["grab-start", "mousedown", "click"];
    
    events.forEach(eventName => {
      element.addEventListener(eventName, () => {
        showElements(elements);
        fire.setAttribute("visible", true);
        audio.components.sound.playSound();
        
        // 禁用所有球体交互
        balls.forEach(ball => {
          disableInteraction(ball);
        });
        
        // 只启用对应语言的球体交互
        balls.forEach(ball => {
          if (ball.closest(`[id^="${elements[0].id.split(/\d/)[0]}"]`)) {
            enableInteraction(ball);
          }
        });
        
        startAnimationLift();
      });
    });
  }

  // 设置语言选择事件
  setupLanguageEvents(canton, cantoneseElements, fireCanton, cantonAudio);
  setupLanguageEvents(english, englishElements, fireEnglish, englishAudio);
  setupLanguageEvents(chinese, chineseElements, fireChinese, chineseAudio);

// 在main.js中的球体事件处理部分
balls.forEach((ball, index) => {
    const ballParent = ball.parentNode;

    ball.addEventListener("grab-start", function () {
        if (isParentVisible(ball)) {
            playSoundAndIncreaseLightIntensity(ball, index);
            window.ballsGrabbed++;
            if (window.ballsGrabbed === 3) {
                // 确保之前是完全禁用的
                window.showAndEnableComponents();
            }
        }
    });

    ball.addEventListener("mousedown", function () {
        if (isParentVisible(ball)) {
            playSoundAndIncreaseLightIntensity(ball, index);
        }
    });
});

 
  // 在 main.js 中添加
window.hideBallsAndEffects = function() {
    balls.forEach(ball => {
        // 隐藏球体本身
        ball.setAttribute("visible", false);
        
        // 隐藏火焰效果
        const flame = ball.querySelector('[gltf-model*="521fire.glb"]');
        if (flame) {
            flame.setAttribute("visible", false);
        }
        
        // 隐藏粒子效果
        const particle = ball.querySelector('[gltf-model*="particle.glb"]');
        if (particle) {
            particle.setAttribute("visible", false);
        }

        // 停止声音
        if (ball.components.sound && ball.components.sound.isPlaying) {
            ball.components.sound.stopSound();
        }

        // 关闭光照
        ball.setAttribute("light", "intensity", 0);
    });
};
  
  
  // UI容器隐藏功能
  function hideUIContainerAfterDelay() {
    setTimeout(() => {
      uiContainer.setAttribute("animation", {
        property: "opacity",
        to: "0",
        dur: "3000",
        easing: "easeOutQuad",
      });

      setTimeout(() => {
        uiContainer.setAttribute("visible", false);
      }, 4000);
    }, 4000);
  }

  // 蜡烛交互事件
  [yellowCandle, greyCandle, redCandle].forEach(candle => {
    ["mousedown", "grab-start"].forEach(eventName => {
      candle.addEventListener(eventName, hideUIContainerAfterDelay);
    });
  });

  // 退出球体功能
  const exitSphere = document.querySelector("#exit");
  let exitSphereHovering = false;

  ["hover-start", "mouseenter"].forEach(eventName => {
    exitSphere.addEventListener(eventName, () => {
      exitSphereHovering = true;
    });
  });

  ["hover-end", "mouseleave"].forEach(eventName => {
    exitSphere.addEventListener(eventName, () => {
      exitSphereHovering = false;
    });
  });

  ["grab-start", "mousedown"].forEach(eventName => {
    exitSphere.addEventListener(eventName, () => {
      if (exitSphereHovering) {
        window.location.href = "https://shakesjeare.github.io/rme2025/";
      }
    });
  });

  // 全局停止声音功能
  window.stopBallSounds = function () {
    balls.forEach((ball) => {
      if (ball.components.sound && ball.components.sound.isPlaying) {
        ball.components.sound.stopSound();
      }
    });
  };
});