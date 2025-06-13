import React from 'react';

const useWebViewMessage = (message: any) => {
  React.useEffect(() => {
    console.log('[useWebViewMessage] Sending message to WebView:', message);
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, [message]);
};

export default useWebViewMessage;
