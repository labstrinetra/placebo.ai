
        // --- SUPABASE CLIENT INITIALIZATION ---
        let supabaseClient = null;
        let activeUser = null;
        let activeToken = null;

        async function initializeSupabase() {
            try {
                const response = await fetch("/config");
                const config = await response.json();
                const SUPABASE_URL = config.supabase_url;
                const SUPABASE_ANON_KEY = config.supabase_anon_key;

                if (window.supabase && typeof window.supabase.createClient === 'function' && SUPABASE_URL && SUPABASE_URL !== "https://your-project-id.supabase.co") {
                    // Wipe any old local storage sessions lingering from before this feature
                    for (let key in localStorage) {
                        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                            localStorage.removeItem(key);
                        }
                    }
                    
                    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                        auth: {
                            persistSession: false // Forces logout on every page refresh
                        }
                    });
                    console.log("Supabase Client initialized with ephemeral sessions. Testing connectivity...");
                    
                    // Connection ping test with 2-second timeout
                    const pingPromise = supabaseClient.auth.getSession();
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Supabase connection timeout")), 2000));
                    
                    await Promise.race([pingPromise, timeoutPromise]);
                    console.log("Supabase connectivity verified successfully.");
                    
                    supabaseClient.auth.onAuthStateChange((event, session) => {
                        console.log("Auth State Changed Event:", event);
                        updateAuthState();
                    });
                } else {
                    console.warn("Supabase configuration is using placeholder credentials or offline.");
                }
            } catch (e) {
                console.warn("Failed to verify Supabase connectivity or load config.", e);
                supabaseClient = null;
            }
            // Sync current authentication state on load
            await updateAuthState();
        }

        async function updateAuthState() {
            const authButtons = document.getElementById('nav-auth-buttons');
            const userButtons = document.getElementById('nav-user-buttons');
            const displayEmail = document.getElementById('user-display-email');
            
            if (supabaseClient) {
                try {
                    const { data: { session } } = await supabaseClient.auth.getSession();
                    if (session) {
                        activeUser = session.user;
                        activeToken = session.access_token;
                    } else {
                        activeUser = null;
                        activeToken = null;
                    }
                } catch (err) {
                    console.error("Error fetching Supabase session:", err);
                }
            }
            
            if (activeUser) {
                authButtons.style.display = 'none';
                userButtons.style.display = 'flex';
                displayEmail.innerText = activeUser.email;
                
                let userDefaultMode = activeUser.user_metadata?.defaultMode;
                if (!userDefaultMode) {
                    document.getElementById('profession-modal').style.display = 'flex';
                } else {
                    activeMode = userDefaultMode;
                    updateModeButtons(activeMode);
                }
                
                // Dynamically update user limits
                const creditText = document.querySelector('.credit-info span');
                if (creditText) {
                    let userCredits = activeUser.user_metadata?.credits_remaining !== undefined ? activeUser.user_metadata.credits_remaining : 500;
                    if (userCredits > 500) userCredits = 500; // Cap grandfathered users at 500
                    creditText.innerText = `${userCredits}/500 credits`;
                }
            } else {
                authButtons.style.display = 'flex';
                userButtons.style.display = 'none';
                activeToken = null;
                const creditText = document.querySelector('.credit-info span');
                if (creditText) {
                    creditText.innerText = "Log in to check credits";
                }
            }
        }

        // Initialize state check
        window.addEventListener('DOMContentLoaded', () => {
            initializeSupabase();
        });

        const chatForm = document.getElementById('chat-form');
        const video = document.getElementById('hero-video');
        let opacity = 1;

        function setOpacity(val) {
            opacity = val;
            video.style.opacity = opacity;
        }

        if (video.readyState >= 1) {
            video.play();
            setOpacity(1);
        } else {
            video.addEventListener('loadedmetadata', () => {
                video.play();
                setOpacity(1);
            });
        }

        setTimeout(() => setOpacity(1), 2000);

        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const charCount = document.getElementById('char-count');
        const responsePanel = document.getElementById('response-panel');
        const responseText = document.getElementById('response-text');
        const sourceList = document.getElementById('source-list');
        const pageModal = document.getElementById('page-modal');
        const modalImg = document.getElementById('page-preview-img');
        const modalTitle = document.getElementById('modal-title');
        const closeModal = document.getElementById('close-modal');
        const clearBtn = document.getElementById('clear-btn');

        let activeMode = 'unified';
        
        function updateModeButtons(mode) {
            const buttons = document.querySelectorAll('.model-btn');
            buttons.forEach(b => {
                b.classList.remove('active');
                if (b.getAttribute('data-mode') === mode || (mode === 'unified' && b.getAttribute('data-mode') === 'all')) {
                    b.classList.add('active');
                }
            });
        }

        document.querySelectorAll('.profession-btn').forEach(btn => {
            btn.onclick = async () => {
                const mode = btn.getAttribute('data-mode');
                if (supabaseClient && activeUser) {
                    btn.innerText = "Saving...";
                    const { data, error } = await supabaseClient.auth.updateUser({
                        data: { defaultMode: mode }
                    });
                    if (!error) {
                        activeUser = data.user;
                        activeMode = mode;
                        updateModeButtons(mode);
                        document.getElementById('profession-modal').style.display = 'none';
                        
                        // Reset button text in case they log out and it re-shows
                        btn.innerText = mode === "mbbs" ? "MBBS Student / Doctor" : 
                                      (mode === "pharmacy" ? "Pharmacy Student / Pharmacist" : "Unified (Both Domains)");
                    }
                }
            };
        });

        const modelButtons = document.querySelectorAll('.model-btn');
        modelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modelButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeMode = btn.getAttribute('data-mode');
            });
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                responseText.innerHTML = '';
                sourceList.innerHTML = '';
                responsePanel.style.display = 'none';
                chatInput.value = '';
                charCount.innerText = '0/3,000';
            });
        }

        chatInput.addEventListener('input', () => {
            charCount.innerText = `${chatInput.value.length}/3,000`;
        });

        const historyBtn = document.getElementById('history-btn');
        const promptsBtn = document.getElementById('prompts-btn');
        const sideDrawer = document.getElementById('side-drawer');
        const closeDrawer = document.getElementById('close-drawer');
        const drawerTitle = document.getElementById('drawer-title');
        const drawerItems = document.getElementById('drawer-items');

        const PREDEFINED_PROMPTS = [
            "Explain the clinical presentation, diagnosis, and surgical management of acute appendicitis.",
            "What are the histological features of a myocardial infarction across different time frames?",
            "Explain the mechanism of action, pharmacokinetics, and adverse effects of Aspirin.",
            "What is the principle behind Non-aqueous Titrations and which indicators are used?",
            "Explain Type II Diabetes Mellitus, including its pathophysiology and the pharmacological management using Metformin.",
            "Describe the physiological pathway of the Renin-Angiotensin-Aldosterone System (RAAS)."
        ];

        async function saveToHistory(query, answer = '', sources = []) {
            if (!activeUser || !supabaseClient) return;
            
            try {
                await supabaseClient.from('chat_history').insert({
                    user_id: activeUser.id,
                    query: query,
                    answer: answer,
                    sources: sources
                });
            } catch (error) {
                console.error('Error saving chat history to Supabase:', error);
            }
        }

        function displayStoredResult(item) {
            const queryHTML = `<div style="font-size: 16px; font-weight: 500; color: white; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><span style="opacity: 0.5; font-size: 12px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">You Asked:</span>${item.query}</div>`;
            
            sourceList.innerHTML = '';
            item.sources.forEach(src => {
                const tag = document.createElement('span');
                tag.className = 'source-tag';
                tag.innerText = `${src.book_name} (Pg ${src.page_number})`;
                tag.style.cursor = 'default';
                sourceList.appendChild(tag);
            });
            
            responseText.innerHTML = queryHTML + DOMPurify.sanitize(applyMedicalTooltips(marked.parse(item.answer)), { ADD_ATTR: ['data-tooltip'] });
            
            responsePanel.style.display = 'flex';
            chatInput.value = item.query;
            sideDrawer.classList.remove('open');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }

        async function openDrawer(type) {
            drawerItems.innerHTML = '';
            if (type === 'history') {
                drawerTitle.innerText = 'History';
                
                if (!activeUser || !supabaseClient) {
                    drawerItems.innerHTML = '<div style="opacity: 0.5; text-align: center; margin-top: 20px;">Please log in to view history.</div>';
                    sideDrawer.classList.add('open');
                    return;
                }

                drawerItems.innerHTML = '<div style="opacity: 0.5; text-align: center; margin-top: 20px;">Loading...</div>';
                sideDrawer.classList.add('open');

                try {
                    const { data: history, error } = await supabaseClient
                        .from('chat_history')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(20);

                    drawerItems.innerHTML = '';
                    if (error || !history || history.length === 0) {
                        drawerItems.innerHTML = '<div style="opacity: 0.5; text-align: center; margin-top: 20px;">No history yet.</div>';
                    } else {
                        history.forEach(item => {
                            const el = document.createElement('div');
                            el.className = 'drawer-item';
                            const dateStr = new Date(item.created_at).toLocaleDateString();
                            el.innerHTML = `${item.query} <span class="time">${dateStr}</span>`;
                            el.onclick = () => displayStoredResult(item);
                            drawerItems.appendChild(el);
                        });
                    }
                } catch (e) {
                    drawerItems.innerHTML = '<div style="color: #ef4444; text-align: center; margin-top: 20px;">Failed to load history.</div>';
                }
            } else {
                drawerTitle.innerText = 'Prompts';
                PREDEFINED_PROMPTS.forEach(prompt => {
                    const el = document.createElement('div');
                    el.className = 'drawer-item';
                    el.innerText = prompt;
                    el.onclick = () => {
                        chatInput.value = prompt;
                        sideDrawer.classList.remove('open');
                        handleSend();
                    };
                    drawerItems.appendChild(el);
                });
            }
            sideDrawer.classList.add('open');
        }

        historyBtn.onclick = () => openDrawer('history');
        promptsBtn.onclick = () => openDrawer('prompts');
        closeDrawer.onclick = () => sideDrawer.classList.remove('open');

        // --- AUTH OVERLAY CONTROLLERS ---
        const authModal = document.getElementById('auth-modal');
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const closeAuthModal = document.getElementById('close-auth-modal');
        const authModalTitle = document.getElementById('auth-modal-title');
        
        const googleAuthBtn = document.getElementById('google-auth-btn');
        
        const otpStep1 = document.getElementById('otp-step-1');
        const authEmail = document.getElementById('auth-email');
        const authSendOtpBtn = document.getElementById('auth-send-otp-btn');
        
        const otpStep2 = document.getElementById('otp-step-2');
        const authOtpCode = document.getElementById('auth-otp-code');
        const authVerifyOtpBtn = document.getElementById('auth-verify-otp-btn');
        const authBackToStep1 = document.getElementById('auth-back-to-step1');
        
        const authMessage = document.getElementById('auth-message');
        const logoutBtn = document.getElementById('logout-btn');

        function resetAuthModal() {
            authMessage.innerText = '';
            authEmail.value = '';
            authOtpCode.value = '';
            otpStep1.style.display = 'flex';
            otpStep2.style.display = 'none';
        }

        function showAuthModal() {
            resetAuthModal();
            authModal.style.display = 'flex';
            if (!supabaseClient) {
                authMessage.style.color = '#eab308'; // Warning gold/yellow
                authMessage.innerText = 'Supabase server is offline (Error 521). Sandbox simulation mode active.';
            }
        }

        loginBtn.onclick = () => showAuthModal();
        signupBtn.onclick = () => showAuthModal();
        closeAuthModal.onclick = () => authModal.style.display = 'none';
        
        // Close auth modal when clicking outside content box
        authModal.onclick = (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        };

        // Go back to Step 1
        authBackToStep1.onclick = (e) => {
            e.preventDefault();
            authMessage.innerText = '';
            authOtpCode.value = '';
            otpStep1.style.display = 'flex';
            otpStep2.style.display = 'none';
        };

        // --- DISPOSABLE EMAIL CHECK ---
        function isDisposableEmail(email) {
            const disposableDomains = [
                'mailinator.com', 'tempmail.com', 'temp-mail.org', '10minutemail.com', 
                'yopmail.com', 'guerrillamail.com', 'dispostable.com', 'trashmail.com', 
                'getairmail.com', 'sharklasers.com', 'guerrillamailblock.com', 
                'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 
                'tempmailo.com', 'generator.email', 'maildrop.cc', 'tempmail.dev',
                'tempmail.net', 'disposable.com', 'fakeinbox.com', 'disposablemail.com'
            ];
            const parts = email.split('@');
            if (parts.length < 2) return true;
            const domain = parts[1].toLowerCase().trim();
            return disposableDomains.includes(domain);
        }

        // --- GOOGLE OAUTH LOGIN TRIGGER ---
        googleAuthBtn.onclick = async () => {
            if (!supabaseClient) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = 'Authentication service is offline. Mock login is disabled.';
                return;
            }

            authMessage.style.color = '#10b981';
            authMessage.innerText = 'Redirecting to Google...';
            
            try {
                const { error } = await supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                if (error) throw error;
            } catch (err) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = err.message || 'OAuth redirection failed.';
            }
        };

        // --- PASSWORDLESS SEND EMAIL OTP TRIGGER ---
        authSendOtpBtn.onclick = async () => {
            const email = authEmail.value.trim();
            if (!email) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = 'Please enter a valid email address.';
                return;
            }

            if (isDisposableEmail(email)) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = 'Please use a valid personal, academic, or professional email address. Temporary email addresses are not supported.';
                return;
            }

            if (!supabaseClient) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = 'Authentication service is offline. Mock login is disabled.';
                return;
            }

            authSendOtpBtn.disabled = true;
            authMessage.style.color = '#10b981';
            authMessage.innerText = 'Sending verification code...';

            try {
                const { error } = await supabaseClient.auth.signInWithOtp({
                    email: email,
                    options: {
                        shouldCreateUser: true // Automatically sign up new users
                    }
                });
                if (error) throw error;
                
                authMessage.innerText = 'Verification code sent to your email!';
                setTimeout(() => {
                    authMessage.innerText = '';
                    otpStep1.style.display = 'none';
                    otpStep2.style.display = 'flex';
                    authOtpCode.focus();
                }, 1000);
            } catch (err) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = err.message || 'Failed to send OTP code.';
            } finally {
                authSendOtpBtn.disabled = false;
            }
        };

        // --- PASSWORDLESS VERIFY EMAIL OTP TRIGGER ---
        authVerifyOtpBtn.onclick = async () => {
            const email = authEmail.value.trim();
            const otpCode = authOtpCode.value.trim();
            if (!otpCode || otpCode.length !== 8) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = 'Please enter the 8-digit verification code.';
                return;
            }

            if (!supabaseClient) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = 'Authentication service is offline. Mock login is disabled.';
                return;
            }

            authVerifyOtpBtn.disabled = true;
            authMessage.style.color = '#10b981';
            authMessage.innerText = 'Verifying security code...';

            try {
                const { data, error } = await supabaseClient.auth.verifyOtp({
                    email: email,
                    token: otpCode,
                    type: 'email'
                });
                if (error) throw error;
                
                authMessage.innerText = 'Authentication successful!';
                setTimeout(() => {
                    authModal.style.display = 'none';
                    updateAuthState();
                }, 1000);
            } catch (err) {
                authMessage.style.color = '#ef4444';
                authMessage.innerText = err.message || 'Invalid or expired verification code.';
            } finally {
                authVerifyOtpBtn.disabled = false;
            }
        };

        logoutBtn.onclick = async () => {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            } else {
                activeUser = null;
                activeToken = null;
                updateAuthState();
            }
        };

        async function handleSend() {
            if (!activeUser) {
                showAuthModal();
                return;
            }

            const message = chatInput.value.trim();
            if (!message) return;

            // Disable inputs while processing
            chatInput.disabled = true;
            sendBtn.disabled = true;
            document.querySelector('.input-wrapper').classList.add('disabled');

            // Hide feedback widget and reset its state
            const feedbackContainer = document.getElementById('response-feedback');
            const thumbsUpBtn = document.getElementById('thumbs-up-btn');
            const thumbsDownBtn = document.getElementById('thumbs-down-btn');
            if (feedbackContainer) feedbackContainer.style.display = 'none';
            if (thumbsUpBtn) thumbsUpBtn.classList.remove('active-up');
            if (thumbsDownBtn) thumbsDownBtn.classList.remove('active-down');

            saveToHistory(message);
            chatInput.value = '';
            charCount.innerText = '0/3,000';

            // --- CREDIT DEDUCTION LOGIC ---
            if (activeUser && supabaseClient) {
                let currentCredits = activeUser.user_metadata?.credits_remaining !== undefined ? activeUser.user_metadata.credits_remaining : 500;
                if (currentCredits > 500) currentCredits = 500; // Instantly scale legacy users down to new 500 limit
                
                if (currentCredits < 10) {
                    responsePanel.style.display = 'flex';
                    responseText.innerHTML = '<span style="color: #ef4444; padding: 20px; display: block; text-align: center;">Insufficient credits. You need at least 10 credits to perform a clinical search. Please upgrade your account.</span>';
                    chatInput.disabled = false;
                    sendBtn.disabled = false;
                    document.querySelector('.input-wrapper').classList.remove('disabled');
                    return;
                }
                
                let newCredits = Math.max(0, currentCredits - 10);
                
                // Optimistic UI update
                const creditText = document.querySelector('.credit-info span');
                if (creditText) creditText.innerText = `${newCredits}/500 credits`;
                
                // Background sync with Supabase User Metadata
                supabaseClient.auth.updateUser({
                    data: { credits_remaining: newCredits }
                }).then(({ data, error }) => {
                    if (!error && data.user) {
                        activeUser = data.user;
                    }
                });
            }

            responsePanel.style.display = 'flex';
            
            let modeDisplay = "Unified Library";
            if (activeMode === "mbbs") modeDisplay = "Dx(MBBS) Knowledge Base";
            if (activeMode === "pharmacy") modeDisplay = "Rx(Pharmacy) Knowledge Base";
            
            const queryHTML = `<div style="font-size: 16px; font-weight: 500; color: white; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);"><span style="opacity: 0.5; font-size: 12px; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">You Asked:</span>${message}</div>`;
            const badgeHTML = `<div style="font-size: 11px; color: var(--primary); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; border-left: 2px solid var(--primary); padding-left: 8px;">Response from ${modeDisplay}</div>`;
            
            responseText.innerHTML = queryHTML + badgeHTML + `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-short"></div>
            `;
            sourceList.innerHTML = '';

            try {
                const headers = { 'Content-Type': 'application/json' };
                if (activeToken) {
                    headers['Authorization'] = `Bearer ${activeToken}`;
                }

                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ message: message, mode: activeMode })
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        responseText.innerHTML = '<span style="color: #ef4444;">Session expired or unauthorized. Please log out and log back in.</span>';
                        return;
                    }
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullAnswer = "";
                let sources = [];
                let sourceGalleryHTML = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const json = JSON.parse(line);
                            if (json.type === 'sources') {
                                sources = json.data;
                                sources.forEach(src => {
                                    // Keep the static tags for history, but disable the image modal
                                    const tag = document.createElement('span');
                                    tag.className = 'source-tag';
                                    tag.innerText = `${src.book_name} (Pg ${src.page_number})`;
                                    tag.style.cursor = 'default';
                                    sourceList.appendChild(tag);
                                });
                                
                                // Manually update the view since sources arrive last in the stream now
                                const finalHtml = DOMPurify.sanitize(applyMedicalTooltips(marked.parse(fullAnswer)), { ADD_ATTR: ['data-tooltip'] });
                                responseText.innerHTML = queryHTML + badgeHTML + finalHtml;
                                
                                // Add PDF Export Button
                                const pdfBtn = document.createElement('button');
                                pdfBtn.className = 'export-pdf-btn';
                                pdfBtn.innerHTML = `
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Export Clinical Report
                                `;
                                pdfBtn.onclick = () => {
                                    pdfBtn.innerHTML = "Generating PDF...";
                                    const opt = {
                                        margin: 1,
                                        filename: 'Clinical_Report.pdf',
                                        image: { type: 'jpeg', quality: 0.98 },
                                        html2canvas: { scale: 2, useCORS: true },
                                        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                                    };
                                    const elementToExport = responseText.cloneNode(true);
                                    elementToExport.removeChild(elementToExport.lastChild); // Remove the button from the PDF
                                    elementToExport.style.color = '#000'; // Make text black for PDF
                                    elementToExport.style.background = '#fff';
                                    elementToExport.style.padding = '20px';
                                    html2pdf().set(opt).from(elementToExport).save().then(() => {
                                        pdfBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Export Clinical Report`;
                                    });
                                };
                                responseText.appendChild(pdfBtn);
                                
                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                
                            } else if (json.type === 'start_answer') {
                                responseText.innerHTML = queryHTML + badgeHTML;
                                fullAnswer = ""; // Reset buffer
                            } else if (json.type === 'content') {
                                fullAnswer += json.data;
                                const parsedHtml = DOMPurify.sanitize(applyMedicalTooltips(marked.parse(fullAnswer)), { ADD_ATTR: ['data-tooltip'] });
                                responseText.innerHTML = queryHTML + badgeHTML + parsedHtml;
                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            }
                        } catch (e) { }
                    }
                }
                // Save complete result to history
                saveToHistory(message, fullAnswer, sources);

                // Revert to user's default mode if they did a temporary override
                if (activeUser?.user_metadata?.defaultMode) {
                    activeMode = activeUser.user_metadata.defaultMode;
                    updateModeButtons(activeMode);
                }

                // Show feedback widget when streaming completes successfully
                if (feedbackContainer) feedbackContainer.style.display = 'flex';
            } catch (error) {
                responseText.innerHTML = '<span style="color: #ef4444;">Connection error.</span>';
            } finally {
                // Re-enable inputs
                chatInput.disabled = false;
                sendBtn.disabled = false;
                document.querySelector('.input-wrapper').classList.remove('disabled');
                chatInput.focus();
            }
        }

        const resetModal = () => { 
            pageModal.style.display = 'none'; 
            modalImg.dataset.scale = 1;
            modalImg.style.transform = 'scale(1)';
        };
        closeModal.onclick = resetModal;
        window.onclick = (event) => { if (event.target == pageModal) resetModal(); };

        modalImg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = (modalImg.dataset.scale || 1) * delta;
            if (newScale >= 1 && newScale <= 5) {
                modalImg.dataset.scale = newScale;
                modalImg.style.transform = `scale(${newScale})`;
            }
        });

        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;

        const modalBody = document.querySelector('.modal-body');
        modalBody.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - modalBody.offsetLeft;
            startY = e.pageY - modalBody.offsetTop;
            scrollLeft = modalBody.scrollLeft;
            scrollTop = modalBody.scrollTop;
        });

        modalBody.addEventListener('mouseleave', () => { isDragging = false; });
        modalBody.addEventListener('mouseup', () => { isDragging = false; });

        modalBody.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - modalBody.offsetLeft;
            const y = e.pageY - modalBody.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            modalBody.scrollLeft = scrollLeft - walkX;
            modalBody.scrollTop = scrollTop - walkY;
        });

        // Feedback loop logic
        const thumbsUpBtn = document.getElementById('thumbs-up-btn');
        const thumbsDownBtn = document.getElementById('thumbs-down-btn');
        const feedbackLabel = document.querySelector('.feedback-label');

        if (thumbsUpBtn && thumbsDownBtn) {
            thumbsUpBtn.addEventListener('click', () => {
                thumbsUpBtn.classList.toggle('active-up');
                thumbsDownBtn.classList.remove('active-down');
                if (thumbsUpBtn.classList.contains('active-up')) {
                    feedbackLabel.innerText = "Thank you!";
                    setTimeout(() => { feedbackLabel.innerText = "Was this helpful?"; }, 3000);
                }
            });

            thumbsDownBtn.addEventListener('click', () => {
                thumbsDownBtn.classList.toggle('active-down');
                thumbsUpBtn.classList.remove('active-up');
                if (thumbsDownBtn.classList.contains('active-down')) {
                    feedbackLabel.innerText = "Thank you!";
                    setTimeout(() => { feedbackLabel.innerText = "Was this helpful?"; }, 3000);
                }
            });
        }
        
        const medicalDictionary = {
            "myocardial infarction": "A heart attack; tissue death of the heart muscle due to lack of blood supply.",
            "hypertension": "High blood pressure, which can lead to heart disease and stroke.",
            "tachycardia": "A rapid heart rate, usually defined as greater than 100 beats per minute.",
            "ischemia": "An inadequate blood supply to an organ or part of the body, especially the heart muscles.",
            "hyperlipidemia": "High levels of fat particles (lipids) in the blood.",
            "arrhythmia": "An irregular heartbeat or abnormal heart rhythm."
        };

        function applyMedicalTooltips(html) {
            let modifiedHtml = html;
            for (const [term, definition] of Object.entries(medicalDictionary)) {
                const regex = new RegExp(`\\b(${term})\\b`, 'gi');
                modifiedHtml = modifiedHtml.replace(regex, `<span class="medical-tooltip" data-tooltip="${definition}">$1</span>`);
            }
            return modifiedHtml;
        }

        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    