

function generateRandomPosition() {
    // 半径范围设置为 0.2-0.5
    const radius = Math.random() * (0.5 - 0.2) + 0.2;
    const angle = Math.random() * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    // 保持原有的高度范围 0.1-0.7
    const y = Math.random() * (0.7 - 0.1) + 0.1;

    return { x, y, z };
}


  function setFloatingAnimation(ballParent, position) {
      const deltaY = Math.random() * 0.05 - 0.05;
      const toPosition = { x: position.x, y: position.y + deltaY, z: position.z };
      const fromPosition = { x: position.x, y: position.y - deltaY, z: position.z };

      ballParent.setAttribute(
        "animation__float",
        `property: position; from: ${fromPosition.x} ${fromPosition.y} ${fromPosition.z}; to: ${toPosition.x} ${toPosition.y} ${toPosition.z}; dir: alternate; easing: easeInOutSine; loop: true; dur: 2000; delay: 15000`
      );
    }

    function setPositionAndAnimation() {
      const ballParents = document.querySelectorAll(".ball-parent");
      const pivotPoints = document.querySelectorAll("[id^='pivot-point-']");

      ballParents.forEach((ballParent, index) => {
        const position = generateRandomPosition();
        ballParent.setAttribute("position", position);

        setFloatingAnimation(ballParent, position);

        const deltaY = Math.random() * 0.5 - 0.1;
        const toPosition = {
          x: position.x,
          y: position.y + deltaY,
          z: position.z,
        };

        pivotPoints[index].setAttribute(
          "animation__lift",
          `property: position; from: ${position.x} ${position.y - 0.5} ${position.z}; to: ${toPosition.x} ${toPosition.y} ${toPosition.z}; dur: 15000; easing: easeInOutSine`
        );
      });
    }

    document.addEventListener("DOMContentLoaded", setPositionAndAnimation);

