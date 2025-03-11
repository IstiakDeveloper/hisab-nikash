function InstallPrompt() {
    const [installPromptEvent, setInstallPromptEvent] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setInstallPromptEvent(e);
        setShowPrompt(true);
      });
    }, []);

    const handleInstallClick = () => {
      if (!installPromptEvent) return;

      // Show the install prompt
      installPromptEvent.prompt();

      // Wait for the user to respond to the prompt
      installPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPromptEvent(null);
        setShowPrompt(false);
      });
    };

    if (!showPrompt) return null;

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Install Finance Tracker</h3>
          <p className="text-sm text-gray-600">Install this app on your device for quick and easy access</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1 text-gray-700 bg-gray-200 rounded"
          >
            Not now
          </button>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 text-white bg-blue-600 rounded"
          >
            Install
          </button>
        </div>
      </div>
    );
  }
