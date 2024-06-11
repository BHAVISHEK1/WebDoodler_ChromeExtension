document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const penButton = document.getElementById('penButton');
  const eraserButton = document.getElementById('eraserButton');
  const clearButton = document.getElementById('clearButton');
  const colorPicker = document.getElementById('colorPicker');
  const saveButton = document.getElementById('saveButton');
  


  const sendMessageToBackground = (message) => {
      chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
              console.error("Error: ", chrome.runtime.lastError.message);
          }
      });
  };

  toggleButton.addEventListener('change', () => {
      const enabled = toggleButton.checked;
      penButton.enabled = !enabled;
      eraserButton.enabled = !enabled;
      clearButton.enabled = !enabled;
      colorPicker.enabled = !enabled;
      saveButton.enabled = !enabled;

      sendMessageToBackground({ action: enabled ? 'enable' : 'disable' });
  });

  penButton.addEventListener('click', () => {
      sendMessageToBackground({ action: 'pen' });
    
  });

  eraserButton.addEventListener('click', () => {
      sendMessageToBackground({ action: 'eraser' });
  });

  clearButton.addEventListener('click', () => {
      sendMessageToBackground({ action: 'clear' });
  });

  colorPicker.addEventListener('change', (event) => {
      const color = event.target.value;
      sendMessageToBackground({ action: 'setColor', color: color });
  });

  saveButton.addEventListener('click', () => {
      sendMessageToBackground({ action: 'save' });
  });
});
