// Register service worker for PWA functionality
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

// Check if the app can be installed (for install prompt)
export function checkInstallable() {
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install button or notification to the user
    // This could be implemented in the UI as needed
    console.log('App can be installed. Show install button.');
    
    // You could dispatch an event or set a reactive variable here
    // to show an install button in your UI
    document.dispatchEvent(new CustomEvent('appInstallable', { detail: true }));
  });
  
  // Handle the install button click
  document.addEventListener('appInstall', () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the saved prompt since it can't be used again
        deferredPrompt = null;
      });
    }
  });
}
