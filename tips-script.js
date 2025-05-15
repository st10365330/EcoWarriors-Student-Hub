document.addEventListener('DOMContentLoaded', () => {
    // --- Tip Input Section Elements ---
    const tipShareForm = document.getElementById('tipShareForm');
    const tipInput = document.getElementById('tipInput');
    const favoriteTipStarBtn = document.getElementById('favoriteTipStar');
    const shareTipBtn = document.getElementById('shareTipBtn');
    const tipFormError = document.getElementById('tipFormError');

    // --- Shared Tips List Elements ---
    const sharedTipsList = document.getElementById('sharedTipsList');

    // --- Feedback Message Elements ---
    const tipFeedback = document.getElementById('tipFeedback');
    // const tipFeedbackText = document.getElementById('tipFeedbackText'); // If needed for dynamic text
    let feedbackTimeout;

    // --- Input Validation and Button Enable/Disable ---
    function validateTipForm() {
        const tipValue = tipInput.value.trim();
        const isValid = tipValue.length >= 5;
        shareTipBtn.disabled = !isValid;
        if (isValid) {
            tipFormError.style.display = 'none';
            tipFormError.textContent = '';
        }
        return isValid;
    }
    tipInput.addEventListener('input', validateTipForm);

    // --- Favorite Star Toggle ---
    favoriteTipStarBtn.addEventListener('click', () => {
        const isPressed = favoriteTipStarBtn.getAttribute('aria-pressed') === 'true';
        favoriteTipStarBtn.setAttribute('aria-pressed', !isPressed);
        favoriteTipStarBtn.querySelector('.star-icon.empty').style.display = isPressed ? 'inline' : 'none';
        favoriteTipStarBtn.querySelector('.star-icon.filled').style.display = isPressed ? 'none' : 'inline';
    });

    function resetFavoriteStar() {
        favoriteTipStarBtn.setAttribute('aria-pressed', 'false');
        favoriteTipStarBtn.querySelector('.star-icon.empty').style.display = 'inline';
        favoriteTipStarBtn.querySelector('.star-icon.filled').style.display = 'none';
    }

    // --- Handle Tip Sharing ---
    tipShareForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateTipForm()) {
            tipFormError.textContent = 'Minimum 5 characters required for a tip.'; // WCAG 3.3.1
            tipFormError.style.display = 'block';
            tipInput.focus();
            return;
        }

        const tipText = tipInput.value.trim();
        const isFavorited = favoriteTipStarBtn.getAttribute('aria-pressed') === 'true';

        addTipToList(tipText, isFavorited);

        // Show feedback message
        tipFeedback.style.display = 'block';
        // tipInput.focus(); // Could focus back, or let user see list
        clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => {
            tipFeedback.style.display = 'none';
        }, 3000); // Fades after 3 seconds

        // Reset form
        tipInput.value = '';
        resetFavoriteStar();
        shareTipBtn.disabled = true;
        // tipInput.focus(); // Focus after clearing
    });

    function addTipToList(text, isFavorited) {
        const listItem = document.createElement('li');
        
        // Simulate adding a user name for some tips
        const users = ["You", "Alex", "Sam"]; // Could be dynamic from user session
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        let fullTipText = text;
        // For simplicity, only "You" gets the favorited star from input directly.
        // Other names are just to simulate peer tips.
        if (randomUser !== "You" && Math.random() > 0.3) { // Randomly assign a name
             fullTipText = `${randomUser}: ${text}`;
        }


        if (isFavorited && randomUser === "You") { // Only apply input star if "You" shared it
            listItem.classList.add('has-star');
            listItem.innerHTML = `<span class="icon star-icon-list" aria-label="Favorited tip star">★</span> ${fullTipText}`;
        } else {
            listItem.textContent = fullTipText;
        }
        
        sharedTipsList.insertBefore(listItem, sharedTipsList.firstChild); // Add to top
    }
    
    // Pre-populate with a few more tips for demo
    function initialTips() {
        addTipToList("Always carry a reusable shopping bag.", false);
        addTipToList("Use a reusable water bottle instead of buying plastic ones.", false); //This one might become top tip based on current static html
    }


    // --- Chat Box (Tips Page Specific) ---
    const chatInputTips = document.getElementById('chatInputTips');
    const chatSendBtnTips = document.getElementById('chatSendBtnTips');
    const chatResponsePopupTips = document.getElementById('chatResponsePopupTips');
    const chatResponseTextTips = document.getElementById('chatResponseTextTips');
    const chatClosePopupBtnTips = document.getElementById('chatClosePopupBtnTips');
    const chatErrorTips = document.getElementById('chatErrorTips');

    chatInputTips.addEventListener('input', () => {
        const textLength = chatInputTips.value.trim().length;
        chatSendBtnTips.disabled = textLength < 5;
        if (textLength >= 5) {
            chatErrorTips.style.display = 'none';
        }
    });

    chatSendBtnTips.addEventListener('click', () => {
        const question = chatInputTips.value.trim();
        if (question.length < 5) {
            chatErrorTips.textContent = 'Minimum 5 characters required.'; // WCAG 3.3.1
            chatErrorTips.style.display = 'block';
            return;
        }
        chatErrorTips.style.display = 'none';

        let response = "Great question! ";
        if (question.toLowerCase().includes("water saving") || question.toLowerCase().includes("save water")) {
            response += "Try taking shorter showers or installing a low-flow showerhead. Also, fix any leaky faucets promptly!";
        } else if (question.toLowerCase().includes("reduce plastic") || question.toLowerCase().includes("less plastic")) {
            response += "Opt for products with minimal packaging, use reusable containers, and say no to single-use plastic straws and cutlery.";
        } else if (question.toLowerCase().includes("energy saving") || question.toLowerCase().includes("save energy")) {
            response += "Turn off lights when you leave a room, unplug electronics when not in use, and consider switching to LED bulbs.";
        } else {
            response += "Sharing tips is a great way to learn! You can also browse the list above for ideas from the community.";
        }

        chatResponseTextTips.textContent = response;
        chatResponsePopupTips.style.display = 'block';
        chatClosePopupBtnTips.focus();
        chatInputTips.value = '';
        chatSendBtnTips.disabled = true;
    });

    chatClosePopupBtnTips.addEventListener('click', () => {
        chatResponsePopupTips.style.display = 'none';
        chatInputTips.focus();
    });
    
    // Trap focus in chat popup
    chatResponsePopupTips.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatClosePopupBtnTips.click();
        }
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === chatClosePopupBtnTips) {
            e.preventDefault();
            chatClosePopupBtnTips.focus(); // Loop back
        }
    });

    // --- Initial Page Load ---
    validateTipForm(); // Set initial button state
    // initialTips(); // Call to add some dynamic tips on load
});