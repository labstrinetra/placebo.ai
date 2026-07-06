
        // Disable Right-Click Context Menu
        document.addEventListener('contextmenu', event => event.preventDefault());

        // Disable Copy, Cut, and Paste
        document.addEventListener('copy', event => {
            event.preventDefault();
            alert('Copying content is disabled for security reasons.');
        });
        document.addEventListener('cut', event => event.preventDefault());
        document.addEventListener('paste', event => event.preventDefault());

        // Disable Dragging of Elements (like images)
        document.addEventListener('dragstart', event => event.preventDefault());

        // Disable Keyboard Shortcuts (Ctrl+C, Ctrl+P, Ctrl+S, PrintScreen)
        document.addEventListener('keydown', event => {
            if (event.ctrlKey && (event.key === 'c' || event.key === 'C' || event.key === 'p' || event.key === 'P' || event.key === 's' || event.key === 'S')) {
                event.preventDefault();
            }
            if (event.key === 'PrintScreen') {
                // Attempt to obscure screen during PrintScreen (works on some OS)
                document.body.style.opacity = '0';
                setTimeout(() => { document.body.style.opacity = '1'; }, 1000);
                navigator.clipboard.writeText(''); // Attempt to clear clipboard
            }
        });
    