document.addEventListener('DOMContentLoaded', () => {
    // --- Goal Setting Elements ---
    const goalSetForm = document.getElementById('goalSetForm');
    const goalInput = document.getElementById('goalInput');
    const setGoalBtn = document.getElementById('setGoalBtn');
    const goalFormError = document.getElementById('goalFormError');
    const goalProgressBar = document.getElementById('goalProgressBar');
    const goalProgressBarFill = document.getElementById('goalProgressBarFill');
    const progressCheer = document.getElementById('progressCheer');

    // --- Goal Display Elements ---
    const personalGoalText = document.getElementById('personalGoalText');
    const personalGoalCheckbox = document.getElementById('personalGoalCheckbox');
    const personalGoalProgressText = document.getElementById('personalGoalProgressText');
    // Group goal elements (checkbox interaction can be added if needed, now static)
    const groupGoalCheckbox = document.getElementById('groupGoalCheckbox');


    // --- Achievement Feedback Elements ---
    const goalAchievementFeedback = document.getElementById('goalAchievementFeedback');
    let achievementFeedbackTimeout;

    // --- Goal State Variables ---
    let currentPersonalGoal = { text: "Not set yet.", target: 0, current: 0, unit: '' };

    // --- Input Validation: Check for a number in the goal ---
    function validateGoalInput() {
        const goalValue = goalInput.value.trim();
        const hasNumber = /\d/.test(goalValue); // Checks if there's any digit
        
        setGoalBtn.disabled = !hasNumber;
        if (hasNumber || goalValue === '') {
            goalFormError.style.display = 'none';
            goalFormError.textContent = '';
        } else if (goalValue !== '' && !hasNumber) {
            goalFormError.textContent = 'Please include a number in your goal (e.g., "Recycle 5 kg" or "Plant 3 trees").'; // WCAG 3.3.1
            goalFormError.style.display = 'block';
        }
        return hasNumber;
    }
    goalInput.addEventListener('input', validateGoalInput);

    // --- Update Progress Bar and Text ---
    function updatePersonalProgressBar() {
        const { current, target } = currentPersonalGoal;
        let percentage = 0;
        if (target > 0) {
            percentage = Math.min((current / target) * 100, 100);
        }
        
        goalProgressBarFill.style.width = `${percentage}%`;
        goalProgressBar.setAttribute('aria-valuenow', current);
        goalProgressBar.setAttribute('aria-valuemax', target);
        // WCAG 1.1.1: Accessible name via aria-label in HTML, value by aria-valuenow/max
        // Textual representation of progress also provided.
        
        personalGoalProgressText.textContent = `Goal Progress: ${current} / ${target} ${currentPersonalGoal.unit}`;

        if (percentage > 0 && percentage < 100) {
            progressCheer.style.display = 'block';
        } else {
            progressCheer.style.display = 'none';
        }
        
        // Update checkbox state based on progress
        personalGoalCheckbox.checked = (current >= target && target > 0);
        personalGoalCheckbox.dispatchEvent(new Event('change')); // Trigger change event for visual update
    }


    // --- Handle Goal Setting ---
    goalSetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateGoalInput()) {
            goalInput.focus();
            return;
        }

        const goalValue = goalInput.value.trim();
        const match = goalValue.match(/(\d+)\s*([a-zA-ZμåΩµçÅäÄöÖüÜß]+)?/); // Extracts number and optional unit

        if (match && match[1]) {
            currentPersonalGoal.text = goalValue;
            currentPersonalGoal.target = parseInt(match[1], 10);
            currentPersonalGoal.unit = match[2] || 'units'; // Default to 'units' if no unit found
            currentPersonalGoal.current = 0; // Reset progress on new goal, or load from storage
            
            // Simulate some progress for demo (e.g. 30% of target if target > 0)
            if (currentPersonalGoal.target > 0) {
                 currentPersonalGoal.current = Math.floor(currentPersonalGoal.target * 0.3);
            }


            personalGoalText.textContent = `Current Goal: ${currentPersonalGoal.text}`;
            goalProgressBar.setAttribute('aria-label', `Progress for goal: ${currentPersonalGoal.text}`);
            updatePersonalProgressBar();

            goalInput.value = ''; // Clear input
            setGoalBtn.disabled = true; // Disable button again
            personalGoalCheckbox.checked = false; // Uncheck if it was checked
            personalGoalCheckbox.dispatchEvent(new Event('change')); 
            goalFormError.style.display = 'none';

        } else {
            // This case should ideally be caught by validateGoalInput, but as a fallback:
            goalFormError.textContent = 'Could not parse a number from your goal. Example: "Recycle 5 kg".';
            goalFormError.style.display = 'block';
        }
    });

    // --- Handle Personal Goal Checkbox ---
    personalGoalCheckbox.addEventListener('change', () => {
        if (personalGoalCheckbox.checked) {
            if (currentPersonalGoal.target > 0 && currentPersonalGoal.current >= currentPersonalGoal.target) {
                goalAchievementFeedback.style.display = 'block';
                clearTimeout(achievementFeedbackTimeout);
                achievementFeedbackTimeout = setTimeout(() => {
                    goalAchievementFeedback.style.display = 'none';
                }, 3000);
            } else {
                // If checked manually but goal not met by numbers, uncheck it
                // Or, allow manual override - for prototype, let's uncheck if numerically not met.
                // This handles the case where it might be checked by user before progress is 100%
                 if (!(currentPersonalGoal.target > 0 && currentPersonalGoal.current >= currentPersonalGoal.target)) {
                    personalGoalCheckbox.checked = false;
                 }
            }
        } else {
            // If unchecked, hide feedback immediately
            goalAchievementFeedback.style.display = 'none';
            clearTimeout(achievementFeedbackTimeout);
        }
    });
    
    // Group goal checkbox is static for this prototype for simplicity, but could have similar logic
    groupGoalCheckbox.addEventListener('change', () => {
        // Could add visual feedback for group goal completion too
        if (groupGoalCheckbox.checked) {
            console.log("Group goal marked as complete!");
        }
    });


    // --- Chat Box (Goals Page Specific) ---
    const chatInputGoals = document.getElementById('chatInputGoals');
    const chatSendBtnGoals = document.getElementById('chatSendBtnGoals');
    const chatResponsePopupGoals = document.getElementById('chatResponsePopupGoals');
    const chatResponseTextGoals = document.getElementById('chatResponseTextGoals');
    const chatClosePopupBtnGoals = document.getElementById('chatClosePopupBtnGoals');
    const chatErrorGoals = document.getElementById('chatErrorGoals');

    chatInputGoals.addEventListener('input', () => {
        const textLength = chatInputGoals.value.trim().length;
        chatSendBtnGoals.disabled = textLength < 5;
        if (textLength >= 5) {
            chatErrorGoals.style.display = 'none';
        }
    });

    chatSendBtnGoals.addEventListener('click', () => {
        const question = chatInputGoals.value.trim();
        if (question.length < 5) {
            chatErrorGoals.textContent = 'Minimum 5 characters required.'; // WCAG 3.3.1
            chatErrorGoals.style.display = 'block';
            return;
        }
        chatErrorGoals.style.display = 'none';

        let response = "Great question! ";
        if (question.toLowerCase().includes("how to set a goal") || question.toLowerCase().includes("set goal")) {
            response += "In the 'My Goal' field, type your goal including a number, like 'Recycle 5 kg' or 'Plant 3 trees', then click 'Set'.";
        } else if (question.toLowerCase().includes("progress bar")) {
            response += "The progress bar shows how close you are to your current goal. It updates as you log actions on the Track page (simulated here).";
        } else if (question.toLowerCase().includes("group goal")) {
            response += "The Group Goal is a target for everyone together! Its progress reflects combined efforts.";
        } else {
            response += "Setting clear goals helps! Make sure to include a number so we can track your progress.";
        }

        chatResponseTextGoals.textContent = response;
        chatResponsePopupGoals.style.display = 'block';
        chatClosePopupBtnGoals.focus();
        chatInputGoals.value = '';
        chatSendBtnGoals.disabled = true;
    });

    chatClosePopupBtnGoals.addEventListener('click', () => {
        chatResponsePopupGoals.style.display = 'none';
        chatInputGoals.focus();
    });

    // Trap focus in chat popup
    chatResponsePopupGoals.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatClosePopupBtnGoals.click();
        }
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === chatClosePopupBtnGoals) {
            e.preventDefault();
            chatClosePopupBtnGoals.focus(); // Loop back
        }
    });
    
    // Trap focus in achievement feedback if it had focusable elements (it doesn't currently)
    // goalAchievementFeedback.addEventListener('keydown', ... );


    // --- Initial Page Load ---
    validateGoalInput(); // Set initial button state
    updatePersonalProgressBar(); // Initialize progress bar display (will be 0/0 initially)
    // Set initial group goal progress (static example)
    const groupProgressBarFill = document.createElement('div'); // If we wanted a visual bar for group
    // For now, group goal progress is just text.
});