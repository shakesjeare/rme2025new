// 添加到你的main.js或一个新的script标签中
AFRAME.registerComponent('hand-controller-manager', {
    init: function () {
        this.el.addEventListener('controllerconnected', this.onControllerConnected.bind(this));
        this.el.addEventListener('controllerdisconnected', this.onControllerDisconnected.bind(this));
        
        // 确保初始可见性
        this.el.setAttribute('visible', true);
        
        // 监听场景显示状态变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const isVisible = this.el.closest('a-scene').style.display !== 'none';
                    this.el.setAttribute('visible', isVisible);
                }
            });
        });

        const scene = this.el.closest('a-scene');
        observer.observe(scene, { attributes: true });
    },

    onControllerConnected: function (evt) {
        console.log('Controller connected:', this.el.id);
        this.el.setAttribute('visible', true);
        
        // 确保手部模型可见
        const handModel = this.el.querySelector('[gltf-model]');
        if (handModel) {
            handModel.setAttribute('visible', true);
        }
    },

    onControllerDisconnected: function (evt) {
        console.log('Controller disconnected:', this.el.id);
    }
});

// 初始化VR场景
document.addEventListener('DOMContentLoaded', function() {
    const vrScene = document.getElementById('vr-scene');
    const meditationScene = document.getElementById('meditation');

    // 设置初始场景显示状态
    vrScene.addEventListener('loaded', function() {
        console.log('VR scene loaded');
        initializeSceneControllers(vrScene);
    });

    meditationScene.addEventListener('loaded', function() {
        console.log('Meditation scene loaded');
        initializeSceneControllers(meditationScene);
    });
});

function initializeSceneControllers(scene) {
    // 为所有手部控制器添加管理组件
    const controllers = scene.querySelectorAll('[hand-controls]');
    controllers.forEach(controller => {
        if (!controller.hasAttribute('hand-controller-manager')) {
            controller.setAttribute('hand-controller-manager', '');
        }
    });

    // 监听VR模式变化
    scene.addEventListener('enter-vr', function() {
        console.log('Entered VR in scene:', scene.id);
        controllers.forEach(controller => {
            controller.setAttribute('visible', true);
        });
    });

    scene.addEventListener('exit-vr', function() {
        console.log('Exited VR in scene:', scene.id);
    });
}

// 修改场景切换函数
window.switchToMeditation = function() {
    const vrScene = document.getElementById('vr-scene');
    const meditationScene = document.getElementById('meditation');
    const isInVR = vrScene.is('vr-mode');

    // 保存相机状态
    const camera = vrScene.querySelector('[camera]');
    const cameraPosition = camera.getAttribute('position');
    const cameraRotation = camera.getAttribute('rotation');

    // 场景切换前确保控制器可见
    const vrControllers = vrScene.querySelectorAll('[hand-controls]');
    vrControllers.forEach(controller => {
        controller.setAttribute('visible', false);
    });

    vrScene.style.display = 'none';
    meditationScene.style.display = 'block';

    // 设置新场景相机
    const newCamera = meditationScene.querySelector('[camera]');
    newCamera.setAttribute('position', cameraPosition);
    newCamera.setAttribute('rotation', cameraRotation);

    // 确保新场景控制器可见
    const meditationControllers = meditationScene.querySelectorAll('[hand-controls]');
    meditationControllers.forEach(controller => {
        controller.setAttribute('visible', true);
    });

    // 如果在VR模式，重新进入VR
    if (isInVR) {
        setTimeout(() => {
            meditationScene.enterVR();
        }, 100);
    }
};