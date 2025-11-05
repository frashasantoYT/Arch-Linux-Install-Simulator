// ============================================
// Arch Linux Installation Simulator - Script
// ============================================

// === Configuration ===
const CONFIG = {
    archLinuxISO: 'https://archlinux.org/download/',
    archLinuxWiki: 'https://wiki.archlinux.org/title/Installation_guide',
    archLinuxForum: 'https://bbs.archlinux.org/',
    archLinuxPackages: 'https://archlinux.org/packages/',
    creatorPortfolio: 'https://github.com/yourusername' // Update this with actual portfolio link
};

// === Global State ===
let currentStep = 0;
let userInputEnabled = false;
let selectedPath = {
    connection: null, // 'ethernet' or 'wifi'
    bootMode: null    // 'uefi' or 'bios'
};

// === Installation Steps Data ===
const installationSteps = [
    {
        id: 1,
        title: "Verify Boot Mode",
        description: "First, we need to check if your system booted in UEFI or Legacy BIOS mode. This is crucial because it determines how we'll set up the bootloader later.",
        explanation: `
<strong>Why this matters:</strong>
UEFI (Unified Extensible Firmware Interface) is the modern replacement for BIOS. It offers:
• Faster boot times
• Support for drives larger than 2TB
• Better security features
• More reliable booting

<strong>What we're checking:</strong>
The /sys/firmware/efi/efivars directory only exists if the system booted in UEFI mode. If this directory contains files, we're good to go with a modern UEFI installation!

<strong>In a real installation:</strong>
If this directory doesn't exist, you'd need to restart and enable UEFI mode in your BIOS settings.

<strong>Learn more:</strong>
<a href="${CONFIG.archLinuxWiki}#Verify_the_boot_mode" target="_blank" class="text-blue-400 hover:text-blue-300 underline">Arch Wiki - Verify Boot Mode</a>`,
        command: "ls /sys/firmware/efi/efivars",
        hint: "This command lists the contents of the EFI variables directory. Think of it as checking if UEFI mode is 'turned on'.",
        output: `efi-vars-1
efi-vars-2
efi-vars-3
... (many more files)

✓ System is booted in UEFI mode!`,
        type: "command"
    },
    // ... (rest of steps will continue in the HTML file)
];

// === DOM Elements ===
const elements = {
    terminal: null,
    commandInput: null,
    inputSection: null,
    choiceSection: null,
    stepTitle: null,
    stepDescription: null,
    explanationText: null,
    stepExplanation: null,
    commandDisplay: null,
    commandText: null,
    stepHints: null,
    hintText: null,
    stepList: null,
    progressBar: null,
    currentStepDisplay: null,
    totalStepsDisplay: null,
    startBtn: null,
    nextBtn: null,
    successModal: null,
    choices: null,
    archLogin: null
};

// === Initialize ===
function init() {
    cacheElements();
    setupEventListeners();
    renderStepList();
    updateProgress();
    showArchLogin();
}

// === Cache DOM Elements ===
function cacheElements() {
    elements.terminal = document.getElementById('terminal');
    elements.commandInput = document.getElementById('command-input');
    elements.inputSection = document.getElementById('input-section');
    elements.choiceSection = document.getElementById('choice-section');
    elements.stepTitle = document.getElementById('step-title');
    elements.stepDescription = document.getElementById('step-description');
    elements.explanationText = document.getElementById('explanation-text');
    elements.stepExplanation = document.getElementById('step-explanation');
    elements.commandDisplay = document.getElementById('command-display');
    elements.commandText = document.getElementById('command-text');
    elements.stepHints = document.getElementById('step-hints');
    elements.hintText = document.getElementById('hint-text');
    elements.stepList = document.getElementById('step-list');
    elements.progressBar = document.getElementById('progress-bar');
    elements.currentStepDisplay = document.getElementById('current-step');
    elements.totalStepsDisplay = document.getElementById('total-steps');
    elements.startBtn = document.getElementById('start-btn');
    elements.nextBtn = document.getElementById('next-btn');
    elements.successModal = document.getElementById('success-modal');
    elements.choices = document.getElementById('choices');
    elements.archLogin = document.getElementById('arch-login');
}

// === Setup Event Listeners ===
function setupEventListeners() {
    // Enter key for command input
    if (elements.commandInput) {
        elements.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && userInputEnabled) {
                submitCommand();
            }
        });
    }
    
    // External links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// === Arch Linux Login Screen ===
function showArchLogin() {
    if (!elements.archLogin) return;
    
    elements.archLogin.classList.remove('hidden');
    
    // Simulate boot sequence
    setTimeout(() => {
        const loginText = elements.archLogin.querySelector('.login-text');
        if (loginText) {
            loginText.textContent = 'Loading installation environment...';
        }
    }, 1500);
    
    setTimeout(() => {
        elements.archLogin.style.opacity = '0';
        elements.archLogin.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            elements.archLogin.classList.add('hidden');
            elements.archLogin.style.opacity = '1';
        }, 500);
    }, 3000);
}

// === Render Step List ===
function renderStepList() {
    if (!elements.stepList) return;
    
    const steps = getVisibleSteps();
    elements.stepList.innerHTML = steps.map((step, index) => {
        const globalIndex = installationSteps.indexOf(step);
        const isActive = globalIndex === currentStep;
        const isCompleted = globalIndex < currentStep;
        
        return `
            <div class="step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} flex items-center gap-2 p-2 rounded transition">
                <span class="text-gray-500">${isActive ? '▶' : isCompleted ? '✓' : '◦'}</span>
                <span class="${isCompleted ? 'text-green-400 line-through' : isActive ? 'text-white font-semibold' : 'text-gray-500'}">${step.title}</span>
            </div>
        `;
    }).join('');
}

// === Get Visible Steps (based on path choices) ===
function getVisibleSteps() {
    return installationSteps.filter(step => {
        if (!step.showOnlyForPath) return true;
        
        if (step.showOnlyForPath === 'wifi') {
            return selectedPath.connection === 'wifi';
        }
        if (step.showOnlyForPath === 'ethernet') {
            return selectedPath.connection === 'ethernet';
        }
        if (step.showOnlyForPath === 'uefi') {
            return selectedPath.bootMode === 'uefi';
        }
        if (step.showOnlyForPath === 'bios') {
            return selectedPath.bootMode === 'bios';
        }
        
        return true;
    });
}

// === Update Progress Bar ===
function updateProgress() {
    const visibleSteps = getVisibleSteps();
    const totalSteps = visibleSteps.length;
    const currentStepIndex = visibleSteps.findIndex(s => installationSteps.indexOf(s) === currentStep);
    const progress = (currentStepIndex / totalSteps) * 100;
    
    if (elements.progressBar) {
        elements.progressBar.style.width = `${progress}%`;
    }
    if (elements.currentStepDisplay) {
        elements.currentStepDisplay.textContent = currentStepIndex;
    }
    if (elements.totalStepsDisplay) {
        elements.totalStepsDisplay.textContent = totalSteps;
    }
}

// === Start Installation ===
function startInstallation() {
    if (elements.startBtn) {
        elements.startBtn.classList.add('hidden');
    }
    
    clearTerminal();
    appendToTerminal('Starting Arch Linux installation simulation...', 'text-yellow-400');
    appendToTerminal('Follow the instructions carefully and learn the process!', 'text-gray-400');
    appendToTerminal('');
    
    setTimeout(() => {
        nextStep();
    }, 1000);
}

// === Next Step ===
function nextStep() {
    const visibleSteps = getVisibleSteps();
    const currentVisibleIndex = visibleSteps.findIndex(s => installationSteps.indexOf(s) === currentStep);
    
    if (currentVisibleIndex >= visibleSteps.length - 1) {
        showSuccessModal();
        return;
    }
    
    // Move to next visible step
    let nextStepIndex = currentStep + 1;
    while (nextStepIndex < installationSteps.length) {
        const nextStep = installationSteps[nextStepIndex];
        if (!nextStep.showOnlyForPath || shouldShowStep(nextStep)) {
            currentStep = nextStepIndex;
            break;
        }
        nextStepIndex++;
    }
    
    displayCurrentStep();
}

// === Check if step should be shown ===
function shouldShowStep(step) {
    if (!step.showOnlyForPath) return true;
    
    if (step.showOnlyForPath === 'wifi') return selectedPath.connection === 'wifi';
    if (step.showOnlyForPath === 'ethernet') return selectedPath.connection === 'ethernet';
    if (step.showOnlyForPath === 'uefi') return selectedPath.bootMode === 'uefi';
    if (step.showOnlyForPath === 'bios') return selectedPath.bootMode === 'bios';
    
    return true;
}

// === Display Current Step ===
function displayCurrentStep() {
    const step = installationSteps[currentStep];
    
    // Update instruction panel
    elements.stepTitle.textContent = `Step ${currentStep + 1}: ${step.title}`;
    elements.stepDescription.textContent = step.description;
    
    // Show detailed explanation if available
    if (step.explanation) {
        elements.explanationText.innerHTML = step.explanation
            .replace(/\n/g, '<br>')
            .replace(/<strong>/g, '<strong class="text-purple-300">')
            .replace(/• /g, '<span class="text-green-400">•</span> ');
        elements.stepExplanation.classList.remove('hidden');
    } else {
        elements.stepExplanation.classList.add('hidden');
    }
    
    // Update step list highlighting
    renderStepList();
    updateProgress();
    
    // Show appropriate input method
    if (step.type === 'command') {
        showCommandInput();
    } else if (step.type === 'choice' || step.type === 'choice-path') {
        showChoices(step.choices);
    }
    
    // Add prompt to terminal
    appendToTerminal('');
    appendToTerminal(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'text-cyan-600');
    appendToTerminal(`Step ${currentStep + 1}/10: ${step.title}`, 'text-cyan-400 font-bold text-lg');
    appendToTerminal(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, 'text-cyan-600');
    appendToTerminal(step.description, 'text-gray-400');
    appendToTerminal('');
}

// === Show Command Input ===
function showCommandInput() {
    const step = installationSteps[currentStep];
    
    elements.inputSection.classList.remove('hidden');
    elements.choiceSection.classList.add('hidden');
    elements.commandInput.value = '';
    elements.commandInput.focus();
    userInputEnabled = true;
    
    // Show the command to type
    elements.commandDisplay.classList.remove('hidden');
    elements.commandText.textContent = step.command;
    elements.stepHints.classList.remove('hidden');
    elements.hintText.textContent = step.hint;
}

// === Show Choices ===
function showChoices(choices) {
    elements.inputSection.classList.add('hidden');
    elements.choiceSection.classList.remove('hidden');
    elements.commandDisplay.classList.add('hidden');
    
    elements.choices.innerHTML = choices.map((choice, index) => `
        <button 
            onclick="selectChoice(${index}, ${choice.correct}, '${choice.path || ''}')"
            class="choice-button w-full text-left glass-effect hover:bg-gray-600/20 border-2 border-gray-600 hover:border-blue-500 rounded-lg p-4 transition transform hover:scale-105"
        >
            <span class="font-medium">${choice.text}</span>
            ${choice.correct ? '<span class="ml-2 text-green-400 text-sm">✓ Recommended</span>' : ''}
        </button>
    `).join('');
}

// === Submit Command ===
function submitCommand() {
    const input = elements.commandInput.value.trim();
    const step = installationSteps[currentStep];
    
    if (!input) {
        appendToTerminal('Please enter a command.', 'text-red-400');
        return;
    }
    
    // Show command in terminal
    appendToTerminal(`root@archiso ~ # ${input}`, 'text-blue-400');
    
    // Check if command is correct (flexible matching)
    const commandMatch = input.toLowerCase().includes(step.command.split(' ')[0].toLowerCase());
    
    if (commandMatch) {
        appendToTerminal('');
        setTimeout(() => {
            // Show output with typing effect
            const lines = step.output.split('\n');
            let delay = 0;
            lines.forEach(line => {
                setTimeout(() => {
                    appendToTerminal(line, line.includes('✓') ? 'text-green-400' : 'text-gray-300');
                }, delay);
                delay += 100;
            });
            
            setTimeout(() => {
                completeStep();
            }, delay + 1000);
        }, 500);
    } else {
        appendToTerminal(`bash: ${input.split(' ')[0]}: command not found`, 'text-red-400');
        appendToTerminal('Try again or use the auto-fill button.', 'text-yellow-400');
    }
}

// === Select Choice ===
function selectChoice(index, isCorrect, path = '') {
    const step = installationSteps[currentStep];
    const choice = step.choices[index];
    
    appendToTerminal(`Selected: ${choice.text}`, 'text-purple-400');
    appendToTerminal('');
    
    // Save path selection
    if (step.type === 'choice-path' && path) {
        if (path === 'wifi' || path === 'ethernet') {
            selectedPath.connection = path;
        } else if (path === 'uefi' || path === 'bios') {
            selectedPath.bootMode = path;
        }
    }
    
    if (isCorrect || step.type === 'choice-path') {
        setTimeout(() => {
            if (step.output) {
                const lines = step.output.split('\n');
                let delay = 0;
                lines.forEach(line => {
                    setTimeout(() => {
                        appendToTerminal(line, line.includes('✓') ? 'text-green-400' : 'text-gray-300');
                    }, delay);
                    delay += 100;
                });
                
                setTimeout(() => {
                    completeStep();
                }, delay + 1000);
            } else {
                completeStep();
            }
        }, 500);
    } else {
        appendToTerminal('That choice might work, but there\'s a better option. Try again!', 'text-yellow-400');
    }
}

// === Complete Step ===
function completeStep() {
    userInputEnabled = false;
    elements.inputSection.classList.add('hidden');
    elements.choiceSection.classList.add('hidden');
    elements.commandDisplay.classList.add('hidden');
    elements.stepExplanation.classList.add('hidden');
    
    if (elements.nextBtn) {
        elements.nextBtn.classList.remove('hidden');
    }
}

// === Copy Command ===
function copyCommand() {
    const step = installationSteps[currentStep];
    navigator.clipboard.writeText(step.command).then(() => {
        document.getElementById('copy-text').textContent = 'Copied!';
        document.getElementById('copy-icon').textContent = '✓';
        setTimeout(() => {
            document.getElementById('copy-text').textContent = 'Copy';
            document.getElementById('copy-icon').textContent = '📋';
        }, 2000);
    });
}

// === Auto Fill Command ===
function autoFillCommand() {
    const step = installationSteps[currentStep];
    elements.commandInput.value = step.command;
    elements.commandInput.focus();
}

// === Skip Step ===
function skipStep() {
    const step = installationSteps[currentStep];
    appendToTerminal('Skipping step...', 'text-yellow-400');
    appendToTerminal('');
    
    setTimeout(() => {
        if (step.output) {
            const lines = step.output.split('\n');
            lines.forEach(line => {
                appendToTerminal(line, 'text-gray-500');
            });
        }
        completeStep();
    }, 500);
}

// === Append To Terminal ===
function appendToTerminal(text, className = 'text-gray-300') {
    const line = document.createElement('div');
    line.className = className;
    line.textContent = text;
    elements.terminal.appendChild(line);
    elements.terminal.scrollTop = elements.terminal.scrollHeight;
}

// === Clear Terminal ===
function clearTerminal() {
    elements.terminal.innerHTML = '';
}

// === Show Success Modal ===
function showSuccessModal() {
    elements.successModal.classList.remove('hidden');
    elements.successModal.classList.add('flex');
}

// === Close Modal ===
function closeModal() {
    elements.successModal.classList.add('hidden');
    elements.successModal.classList.remove('flex');
}

// === Restart Simulation ===
function restartSimulation() {
    currentStep = 0;
    userInputEnabled = false;
    selectedPath = { connection: null, bootMode: null };
    
    clearTerminal();
    closeModal();
    
    elements.startBtn.classList.remove('hidden');
    elements.nextBtn.classList.add('hidden');
    elements.inputSection.classList.add('hidden');
    elements.choiceSection.classList.add('hidden');
    elements.stepHints.classList.add('hidden');
    elements.commandDisplay.classList.add('hidden');
    elements.stepExplanation.classList.add('hidden');
    
    renderStepList();
    updateProgress();
    
    // Reset instruction panel
    elements.stepTitle.textContent = 'Welcome to Arch Linux Installer';
    elements.stepDescription.textContent = 'Click "Start Installation" to begin the simulation.';
    
    // Show welcome message
    appendToTerminal('', 'text-blue-400');
    const asciiArt = `
   _____                .__     
  /  _  \\_______   ____ |  |__  
 /  /_\\  \\_  __ \\_/ ___\\|  |  \\ 
/    |    \\  | \\/\\  \\___|   Y  \\
\\____|__  /__|    \\___  >___|  /
        \\/            \\/     \\/ 
        Linux Installation Simulator`;
    appendToTerminal(asciiArt, 'text-blue-400 text-xs sm:text-sm');
    appendToTerminal('');
    appendToTerminal('Welcome to the Arch Linux Installation Simulator!', 'text-gray-400');
    appendToTerminal('This interactive guide will walk you through the installation process step-by-step.', 'text-gray-400');
    appendToTerminal('');
    appendToTerminal('Ready to master Arch Linux? Click "Start Installation" to begin.', 'text-yellow-400');
    appendToTerminal('');
    appendToTerminal('root@archiso ~ # _', 'text-blue-400');
}

// === Initialize on DOM Load ===
document.addEventListener('DOMContentLoaded', init);
