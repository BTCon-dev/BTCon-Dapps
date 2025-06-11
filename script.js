document.addEventListener('DOMContentLoaded', () => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const swapBtn = document.getElementById('swap-btn');
        const btcoAmountInput = document.getElementById('btco-amount');
        const tonAmountInput = document.getElementById('ton-amount');
        const walletStatusMsg = document.getElementById('wallet-status');
        const rateDisplay = document.getElementById('rate-display');

        let isDarkMode = localStorage.getItem('darkMode') === 'true';
        const EXAMPLE_RATE_BTCO_TO_TON = 33320; // Updated: 1 BTCO = 33320 TON

        // --- Theme Toggle ---
        function applyTheme() {
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                themeToggleBtn.textContent = '☀️'; // Sun icon for switching to light
            } else {
                document.body.classList.remove('dark-mode');
                themeToggleBtn.textContent = '🌙'; // Moon icon for switching to dark
            }
        }

        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
        });

        // --- TonConnect UI Initialization ---
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://btcon-dev.github.io/BTCon-Dapps/tonconnect-manifest.json',
            buttonRootId: 'ton-connect-button'
        });

        tonConnectUI.onStatusChange(wallet => {
            if (wallet) {
                const shortAddress = `${wallet.account.address.substring(0, 6)}...${wallet.account.address.substring(wallet.account.address.length - 4)}`;
                walletStatusMsg.textContent = `Connected: ${wallet.device.appName} (${shortAddress})`;
                console.log("Connected to:", wallet.device.appName);
                console.log("Address:", wallet.account.address);
                console.log("Chain:", wallet.account.chain);
                console.log("Public Key:", wallet.account.publicKey);
            } else {
                walletStatusMsg.textContent = 'Wallet disconnected.';
                console.log("Disconnected");
            }
            updateSwapButtonState();
        });

        // --- Swap Logic ---
        btcoAmountInput.addEventListener('input', () => {
            const btcoAmount = parseFloat(btcoAmountInput.value);
            if (!isNaN(btcoAmount) && btcoAmount >= 0) {
                const tonAmount = btcoAmount * EXAMPLE_RATE_BTCO_TO_TON;
                let formattedTonAmount;
                if (tonAmount === 0) {
                    formattedTonAmount = '0.0';
                } else if (tonAmount < 0.0001 && tonAmount > 0) { // Avoid exponential for 0
                    formattedTonAmount = tonAmount.toExponential(2);
                } else if (tonAmount < 1 && tonAmount > 0) { // Avoid toFixed(6) for 0
                    formattedTonAmount = tonAmount.toFixed(6);
                } else {
                    formattedTonAmount = tonAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
                    });
                }
                tonAmountInput.value = formattedTonAmount.replace(/\.?0+$/, ""); // Remove trailing zeros after decimal, if any
            } else {
                tonAmountInput.value = '0.0';
            }
            updateSwapButtonState();
        });

        function updateSwapButtonState() {
            const btcoAmount = parseFloat(btcoAmountInput.value);
            const wallet = tonConnectUI.wallet;

            if (!wallet) {
                swapBtn.disabled = true;
                swapBtn.textContent = 'Connect Wallet to Swap';
            } else if (isNaN(btcoAmount) || btcoAmount <= 0) {
                swapBtn.disabled = true;
                swapBtn.textContent = 'Enter Amount';
            } else {
                swapBtn.disabled = false;
                swapBtn.textContent = 'Swap';
            }
        }

        swapBtn.addEventListener('click', async () => {
            const wallet = tonConnectUI.wallet;
            if (!wallet) {
                walletStatusMsg.textContent = 'Please connect your wallet first.';
                console.warn('Swap attempt failed: Wallet not connected.');
                return;
            }

            const btcoAmount = parseFloat(btcoAmountInput.value);
            if (isNaN(btcoAmount) || btcoAmount <= 0) {
                walletStatusMsg.textContent = 'Please enter a valid amount of BTCO to swap.';
                console.warn('Swap attempt failed: Invalid BTCO amount.');
                return;
            }

            walletStatusMsg.textContent = `Preparing to swap ${btcoAmount} BTCO... (mock)`;
            console.log(`Attempting to swap ${btcoAmount} BTCO for ${tonAmountInput.value} TON`);
            console.log(`Using wallet: ${wallet.device.appName}, Address: ${wallet.account.address}`);
            
            swapBtn.disabled = true;
            swapBtn.textContent = 'Processing...';

            // This is where you would build and send a transaction
            // For demo purposes, we'll simulate it:
            try {
                // Example: const transaction = { validUntil: ..., messages: [...] };
                // await tonConnectUI.sendTransaction(transaction);
                // For now, just a timeout to simulate.
                setTimeout(() => {
                    const success = Math.random() > 0.2; // 80% chance of success for demo
                    if (success) {
                        walletStatusMsg.textContent = `Successfully swapped ${btcoAmount} BTCO! (mock)`;
                        console.log('Swap successful (mock).');
                        btcoAmountInput.value = '';
                        tonAmountInput.value = '';
                    } else {
                        walletStatusMsg.textContent = 'Swap failed. Please try again. (mock)';
                        console.error('Swap failed (mock).');
                    }
                    updateSwapButtonState(); // Re-enable or set to 'Enter Amount'
                }, 2500);

            } catch (error) {
                walletStatusMsg.textContent = 'Swap transaction error. (mock)';
                console.error('Swap transaction error:', error);
                updateSwapButtonState();
            }
        });
        
        function updateRateDisplay() {
            if (rateDisplay) {
                rateDisplay.textContent = `1 BTCO ≈ ${EXAMPLE_RATE_BTCO_TO_TON.toLocaleString()} TON`;
            }
        }

        // --- Initializations ---
        applyTheme(); // Apply saved theme on load
        updateSwapButtonState(); // Initial state for swap button
        updateRateDisplay(); // Update the displayed rate
    });
