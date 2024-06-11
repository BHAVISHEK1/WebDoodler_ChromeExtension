if (!document.getElementById('webpage-doodler-canvas')) {
  let drawing = false;
  let currentTool = 'pen';
  let color = '#000000';
  let enabled = false;
  let canvas, context;


  const createCanvas = () => {
    canvas = document.createElement('canvas');
    canvas.id = 'webpage-doodler-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 10000;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    context = canvas.getContext('2d');

    canvas.addEventListener('mousedown', (e) => {
      if (!enabled) return;
      drawing = true;
      context.beginPath();
      context.moveTo(e.clientX, e.clientY);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!enabled || !drawing) return;
      if (currentTool === 'pen') {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = color;
        context.lineWidth = 2;
      } else if (currentTool === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 10;
      }
      context.lineTo(e.clientX, e.clientY);
      context.stroke();
    });

    canvas.addEventListener('mouseup', () => {
      if (!enabled) return;
      drawing = false;
      context.closePath();
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'enable') {
        enabled = true;
        canvas.style.pointerEvents = 'auto';
      } else if (request.action === 'disable') {
        enabled = false;
        canvas.style.pointerEvents = 'none';
      } else if (request.action === 'pen') {
        currentTool = 'pen';
      } else if (request.action === 'eraser') {
        currentTool = 'eraser';
      } else if (request.action === 'clear') {
        context.clearRect(0, 0, canvas.width, canvas.height);
      } else if (request.action === 'save') {
        saveCanvas();
      } else if (request.action === 'setColor') {
        color = request.color;
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCanvas);
  } else {
    createCanvas();
  }

  function saveCanvas() {

    chrome.runtime.sendMessage({ action: 'captureVisibleTab' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Error capturing screenshot:", chrome.runtime.lastError.message);
      } else {

        const screenshotImg = new Image();
        screenshotImg.onload = () => {
          const combinedCanvas = document.createElement('canvas');
          combinedCanvas.width = screenshotImg.width;
          combinedCanvas.height = screenshotImg.height;
          const combinedContext = combinedCanvas.getContext('2d');


          combinedContext.drawImage(screenshotImg, 0, 0);


          // combinedContext.drawImage(canvas, 0, 0);


          const link = document.createElement('a');
          link.download = 'doodled_webpage.png';
          link.href = combinedCanvas.toDataURL('image/png');
          link.click();
        };
        screenshotImg.src = dataUrl;
      }
    });
  }
}
