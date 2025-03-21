document.addEventListener('DOMContentLoaded', () => {
    const timeToggle = document.getElementById('timeToggle');
    const timerDisplay = document.getElementById('timer');
    // const screenshotPreview = document.getElementById('screenshotPreview');

    let tracking = false;

    timeToggle?.addEventListener('change', () => {
        tracking = timeToggle.checked;
        if (tracking) {
            window.tracker.startTimer();
        } else {
            window.tracker.stopTimer();
        }
    });

    window.tracker.onTimerUpdate((time) => {
        timerDisplay.innerText = time;
    });

    window.tracker.onScreenshotTaken((imagePath) => {
        console.log("Received screenshot:", imagePath);
    
        const imgElement = document.createElement('img');
        imgElement.src = imagePath;
        imgElement.classList.add('screenshot-preview');
        imgElement.style.width = '100%';  // Make it responsive
        imgElement.style.height = 'auto'; // Prevent distortion
    
        const screenshotPreview = document.getElementById('screenshotPreview');
        screenshotPreview.appendChild(imgElement);
    });
});
//timer running graphics
timeToggle.addEventListener("change", function () {
  if (this.checked) {
    timerDisplay.classList.add("running");
  } else {
    timerDisplay.classList.remove("running");
  }
});