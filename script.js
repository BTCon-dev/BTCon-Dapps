document.addEventListener('DOMContentLoaded', () => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const connectWalletBtn = document.getElementById('connect-wallet-btn');
        const swapBtn = document.getElementById('swap-btn');
        const btcoAmountInput = document.getElementById('btco-amount');
        const tonAmountInput = document.getElementById('ton-amount');
        const walletStatusMsg = document.getElementById('wallet-status');

        let isDarkMode = localStorage.getItem('darkMode') === 'true';
        let isWalletConnected = false;
        let connectedWalletAddress = null;
        let connectedWalletName = null;

        const EXAMPLE_RATE_BTCO_TO_TON = 0.1; // 1 BTCO = 0.1 TON

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

        // --- Wallet Connection (Mock) ---
        connectWalletBtn.addEventListener('click', async () => {
            if (isWalletConnected) {
                // Disconnect logic (mock)
                isWalletConnected = false;
                connectedWalletAddress = null;
                connectedWalletName = null;
                connectWalletBtn.textContent = 'Connect Wallet';
                connectWalletBtn.title = '';
                walletStatusMsg.textContent = 'Wallet disconnected.';
                console.log('Wallet disconnected (mock)');
            } else {
                // Simulate wallet selection and connection
                walletStatusMsg.textContent = 'Connecting... (mock)';
                
                // Mocking successful connection after a delay
                setTimeout(() => {
                    const mockWallets = [
                        { name: 'Telegram Wallet', address: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c' },
                        { name: 'Tonkeeper', address: 'UQBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBMFp' }
                    ];
                    const selectedMockWallet = mockWallets[Math.floor(Math.random() * mockWallets.length)];

                    isWalletConnected = true;
                    connectedWalletAddress = selectedMockWallet.address;
                    connectedWalletName = selectedMockWallet.name;
                    
                    const shortAddress = `${connectedWalletAddress.substring(0,6)}...${connectedWalletAddress.substring(connectedWalletAddress.length-4)}`;
                    connectWalletBtn.textContent = `Connected: ${shortAddress}`;
                    connectWalletBtn.title = `Connected with ${connectedWalletName}: ${connectedWalletAddress}`;
                    walletStatusMsg.textContent = `Connected with ${connectedWalletName} (mock).`;
                    console.log(`Wallet connected (mock): ${connectedWalletName} - ${connectedWalletAddress}`);
                }, 1500);
            }
            updateSwapButtonState();
        });

        // --- Swap Logic ---
        btcoAmountInput.addEventListener('input', () => {
            const btcoAmount = parseFloat(btcoAmountInput.value);
            if (!isNaN(btcoAmount) && btcoAmount >= 0) {
                const tonAmount = btcoAmount * EXAMPLE_RATE_BTCO_TO_TON;
                // Format TON amount: show more precision for small values, less for large
                let formattedTonAmount;
                if (tonAmount === 0) {
                    formattedTonAmount = '0.0';
                } else if (tonAmount < 0.0001) {
                    formattedTonAmount = tonAmount.toExponential(2);
                } else if (tonAmount < 1) {
                    formattedTonAmount = tonAmount.toFixed(6); // More precision for smaller amounts
                } else {
                    formattedTonAmount = tonAmount.toFixed(4); // Standard precision
                }
                tonAmountInput.value = formattedTonAmount.replace(/\.?0+$/, ""); // Remove trailing zeros after decimal
            } else {
                tonAmountInput.value = '0.0';
            }
            updateSwapButtonState();
        });

        function updateSwapButtonState() {
            const btcoAmount = parseFloat(btcoAmountInput.value);
            if (!isWalletConnected) {
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

        swapBtn.addEventListener('click', () => {
            if (!isWalletConnected) {
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

            const tonAmount = parseFloat(tonAmountInput.value.replace(/,/g, '')); // Ensure no commas if locale uses them

            walletStatusMsg.textContent = `Swapping ${btcoAmount} BTCO for ~${tonAmountInput.value} TON... (mock)`;
            console.log(`Attempting to swap ${btcoAmount} BTCO for ${tonAmountInput.value} TON with wallet ${connectedWalletAddress} (${connectedWalletName})`);
            swapBtn.disabled = true; // Disable during mock transaction
            
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
        });

        // --- Initializations ---
        applyTheme(); // Apply saved theme on load
        updateSwapButtonState(); // Initial state for swap button
    });
