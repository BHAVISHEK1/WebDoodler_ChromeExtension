chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'captureVisibleTab') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            sendResponse(dataUrl);
        });
        return true;  
        } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    },
                    () => {
                        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error: ", chrome.runtime.lastError.message);
                            }
                        });
                    }
                );
            }
        });
    }
});
