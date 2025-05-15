document.addEventListener('DOMContentLoaded', () => {
    // --- Action Logging Form Elements ---
    const ecoActionForm = document.getElementById('ecoActionForm');
    const whatDidInput = document.getElementById('whatDid');
    const howMuchInput = document.getElementById('howMuch');
    const howMuchSlider = document.getElementById('howMuchSlider');
    const addActionBtn = document.getElementById('addActionBtn');
    const formError = document.getElementById('formError');

    // --- Logged Actions List Elements ---
    const actionsTableBody = document.querySelector('#actionsTable tbody');

    // --- Class Total Elements ---
    const classTotalAmountSpan = document.getElementById('classTotalAmount');
    let currentClassTotal = 10; // Initial simulated total (kg for example)

    // --- Feedback Message Elements ---
    const actionFeedback = document.getElementById('actionFeedback');
    const feedbackText = document.getElementById('feedbackText'); // If you want to customize main text
    const feedbackOkBtn = document.getElementById('feedbackOkBtn');
    let feedbackTimeout;

    // --- Form Input Validation and Button Enable/Disable ---
    function validateForm() {
        const whatDidValue = whatDidInput.value.trim();
        const howMuchValue = howMuchInput.value.trim();
        const isValid = whatDidValue !== '' && howMuchValue !== '' && parseFloat(howMuchValue) >= 0;
        addActionBtn.disabled = !isValid;
        if (isValid) {
            formError.style.display = 'none';
            formError.textContent = '';
        }
        return isValid;
    }

    [whatDidInput, howMuchInput, howMuchSlider].forEach(el => {
        el.addEventListener('input', validateForm);
        el.addEventListener('change', validateForm); // For slider and number input changes
    });

    // --- Slider and Number Input Synchronization ---
    howMuchSlider.addEventListener('input', () => {
        howMuchInput.value = howMuchSlider.value;
        validateForm(); // Re-validate as slider can make it valid
    });
    howMuchInput.addEventListener('input', () => {
        let val = parseInt(howMuchInput.value, 10);
        if (isNaN(val) || val < 0) val = 0;
        if (val > 100) val = 100; // Max range
        howMuchSlider.value = val;
        // howMuchInput.value = val; // Correct input if user types out of range (optional)
        validateForm();
    });


    // --- Handle Form Submission ---
    ecoActionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            formError.textContent = 'Please fill both fields correctly.'; // WCAG 3.3.1
            formError.style.display = 'block';
            whatDidInput.focus(); // Focus on first invalid field
            return;
        }

        const action = whatDidInput.value.trim();
        const amount = parseFloat(howMuchInput.value);
        const unitGuess = determineUnit(action); // Simple unit guess

        // Add to table
        const newRow = actionsTableBody.insertRow(0); // Add to top
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);

        // WCAG 1.1.1 Non-text Content: Leaf icon is decorative (aria-hidden), action text provides info
        cell1.innerHTML = `<span class="leaf-icon" aria-hidden="true">🌿</span> ${action}`;
        cell2.textContent = `${amount} ${unitGuess}`;

        // Update class total (simulated - assuming all amounts are in 'kg' for simplicity here)
        // A real app would need more robust unit handling.
        if (unitGuess.toLowerCase() === 'kg' || !isNaN(amount)) { // Simple check
             currentClassTotal += amount;
             classTotalAmountSpan.textContent = `${currentClassTotal.toFixed(1)} kg`;
        }


        // Show feedback message
        // feedbackText.textContent = "Great job logging!"; // Customize if needed
        actionFeedback.style.display = 'block';
        feedbackOkBtn.focus();
        clearTimeout(feedbackTimeout); // Clear existing timeout
        feedbackTimeout = setTimeout(() => {
            actionFeedback.style.display = 'none';
        }, 3000); // Fades after 3 seconds

        // Reset form
        whatDidInput.value = '';
        howMuchInput.value = '0'; // Reset to 0 or empty
        howMuchSlider.value = '0';
        addActionBtn.disabled = true;
        whatDidInput.focus();
    });

    function determineUnit(actionText) {
        actionText = actionText.toLowerCase();
        if (actionText.includes('recycle') || actionText.includes('compost') || actionText.includes('waste')) return 'kg';
        if (actionText.includes('volunteer') || actionText.includes('hour')) return 'hours';
        if (actionText.includes('plant') || actionText.includes('tree')) return 'items';
        if (actionText.includes('water save') || actionText.includes('shower')) return 'liters';
        return 'units'; // Default unit
    }

    feedbackOkBtn.addEventListener('click', () => {
        clearTimeout(feedbackTimeout);
        actionFeedback.style.display = 'none';
        whatDidInput.focus(); // Return focus to the form
    });

    // --- Chat Box (Track Page Specific) ---
    const chatInputTrack = document.getElementById('chatInputTrack');
    const chatSendBtnTrack = document.getElementById('chatSendBtnTrack');
    const chatResponsePopupTrack = document.getElementById('chatResponsePopupTrack');
    const chatResponseTextTrack = document.getElementById('chatResponseTextTrack');
    const chatClosePopupBtnTrack = document.getElementById('chatClosePopupBtnTrack');
    const chatErrorTrack = document.getElementById('chatErrorTrack');

    chatInputTrack.addEventListener('input', () => {
        const textLength = chatInputTrack.value.trim().length;
        chatSendBtnTrack.disabled = textLength < 5;
        if (textLength >= 5) {
            chatErrorTrack.style.display = 'none';
        }
    });

    chatSendBtnTrack.addEventListener('click', () => {
        const question = chatInputTrack.value.trim();
        if (question.length < 5) {
            chatErrorTrack.textContent = 'Minimum 5 characters required.'; // WCAG 3.3.1
            chatErrorTrack.style.display = 'block';
            return;
        }
        chatErrorTrack.style.display = 'none';

        let response = "Nice question! ";
        if (question.toLowerCase().includes("log recycling") || question.toLowerCase().includes("add recycling")) {
            response += "Enter 'Recycled paper' or similar in 'What I Did', the amount in 'How Much', then click Add!";
        } else if (question.toLowerCase().includes("how much") || question.toLowerCase().includes("slider")) {
            response += "Use the 'How Much' field for the quantity, or adjust it with the slider below. It goes from 0 to 100.";
        } else if (question.toLowerCase().includes("class total")) {
            response += "The 'Class Total' shows the combined efforts of everyone! It updates when new actions are logged.";
        } else {
            response += "For logging actions, fill in the details in the form above and click 'Add'. Every bit helps!";
        }

        chatResponseTextTrack.textContent = response;
        chatResponsePopupTrack.style.display = 'block';
        chatClosePopupBtnTrack.focus();
        chatInputTrack.value = '';
        chatSendBtnTrack.disabled = true;
    });

    chatClosePopupBtnTrack.addEventListener('click', () => {
        chatResponsePopupTrack.style.display = 'none';
        chatInputTrack.focus();
    });

    // Trap focus in chat popup
    chatResponsePopupTrack.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatClosePopupBtnTrack.click();
        }
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === chatClosePopupBtnTrack) {
            e.preventDefault();
            chatClosePopupBtnTrack.focus(); // Loop back
        }
    });
    // Trap focus in feedback popup
     actionFeedback.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            feedbackOkBtn.click();
        }
         if (e.key === 'Tab' && !e.shiftKey && document.activeElement === feedbackOkBtn) {
            e.preventDefault();
            feedbackOkBtn.focus(); // Loop back
        }
    });


    // --- Initial state ---
    classTotalAmountSpan.textContent = `${currentClassTotal} kg`; // Set initial display
    validateForm(); // Set initial button state
    // Pre-populate some peer actions or leave table empty for user to fill
    // Example of adding a dynamic peer action on load for demo
    /*
    const peerRow = actionsTableBody.insertRow();
    peerRow.insertCell(0).innerHTML = `<span class="leaf-icon" aria-hidden="true">🌿</span> Alex: Used reusable bag`;
    peerRow.insertCell(1).textContent = `5 times`;
    */
});