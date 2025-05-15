document.addEventListener('DOMContentLoaded', () => {
    // --- Contact Form Elements ---
    const contactForm = document.getElementById('contactForm');
    const contactNameInput = document.getElementById('contactName');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactMessageInput = document.getElementById('contactMessage');
    const sendContactBtn = document.getElementById('sendContactBtn');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // --- Confirmation Feedback Elements ---
    const contactConfirmation = document.getElementById('contactConfirmation');
    let confirmationTimeout;

    // --- Validation Functions ---
    function isValidEmail(email) {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateField(inputElement, errorElement, minLength, errorMessage, validationFn) {
        const value = inputElement.value.trim();
        let isValid = true;

        if (validationFn) { // Custom validation like email
            isValid = validationFn(value);
        } else if (value.length < minLength) { // Length check
            isValid = false;
        }

        if (!isValid && value !== '') { // Show error only if input is not empty but invalid
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', errorElement.id);
        } else if (!isValid && value === '' && inputElement.hasAttribute('data-touched')) { // Show error if touched and empty
             errorElement.textContent = 'This field is required.';
             errorElement.style.display = 'block';
             inputElement.setAttribute('aria-invalid', 'true');
             inputElement.setAttribute('aria-describedby', errorElement.id);
        }
        else {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            inputElement.removeAttribute('aria-invalid');
            inputElement.removeAttribute('aria-describedby');
        }
        return isValid || value === ''; // Allow empty initially unless submit attempt
    }
    
    function checkAllFieldsValid() {
        const isNameValid = contactNameInput.value.trim().length >= 2;
        const isEmailValid = isValidEmail(contactEmailInput.value.trim());
        const isMessageValid = contactMessageInput.value.trim().length >= 5;
        
        sendContactBtn.disabled = !(isNameValid && isEmailValid && isMessageValid);
        return isNameValid && isEmailValid && isMessageValid;
    }
    
    // Mark fields as 'touched' on blur to trigger "required" error if left empty
    [contactNameInput, contactEmailInput, contactMessageInput].forEach(input => {
        input.addEventListener('blur', () => {
            input.setAttribute('data-touched', 'true');
            // Re-validate on blur to show specific errors if content is invalid
            if (input === contactNameInput) validateField(contactNameInput, nameError, 2, 'Name must be at least 2 characters.');
            if (input === contactEmailInput) validateField(contactEmailInput, emailError, 1, 'Please enter a valid email address.', isValidEmail);
            if (input === contactMessageInput) validateField(contactMessageInput, messageError, 5, 'Message must be at least 5 characters.');
            checkAllFieldsValid();
        });
        input.addEventListener('input', () => {
             // Clear general error on input, specific validation on blur/submit
            if (input === contactNameInput) validateField(contactNameInput, nameError, 2, 'Name must be at least 2 characters.');
            if (input === contactEmailInput) validateField(contactEmailInput, emailError, 1, 'Please enter a valid email address.', isValidEmail);
            if (input === contactMessageInput) validateField(contactMessageInput, messageError, 5, 'Message must be at least 5 characters.');
            checkAllFieldsValid();
        });
    });


    // --- Handle Contact Form Submission ---
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mark all fields as touched to show errors if empty
        contactNameInput.setAttribute('data-touched', 'true');
        contactEmailInput.setAttribute('data-touched', 'true');
        contactMessageInput.setAttribute('data-touched', 'true');

        const isNameValidOnSubmit = validateField(contactNameInput, nameError, 2, 'Name must be at least 2 characters.');
        const isEmailValidOnSubmit = validateField(contactEmailInput, emailError, 1, 'Please enter a valid email address.', isValidEmail);
        const isMessageValidOnSubmit = validateField(contactMessageInput, messageError, 5, 'Message must be at least 5 characters.');

        if (isNameValidOnSubmit && isEmailValidOnSubmit && isMessageValidOnSubmit && checkAllFieldsValid()) {
            // WCAG 3.3.1 Error Identification: Handled by individual field messages.
            console.log('Form submitted:', {
                name: contactNameInput.value.trim(),
                email: contactEmailInput.value.trim(),
                message: contactMessageInput.value.trim()
            });

            // Show confirmation message
            contactConfirmation.style.display = 'block';
            clearTimeout(confirmationTimeout);
            confirmationTimeout = setTimeout(() => {
                contactConfirmation.style.display = 'none';
            }, 3000); // Fades after 3 seconds

            // Reset form
            contactForm.reset();
            sendContactBtn.disabled = true;
             // Clear touched status and errors
            [contactNameInput, contactEmailInput, contactMessageInput].forEach(input => {
                input.removeAttribute('data-touched');
                input.removeAttribute('aria-invalid');
                input.removeAttribute('aria-describedby');
            });
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            messageError.style.display = 'none';
            contactNameInput.focus(); // Focus on the first field after reset

        } else {
            // Focus on the first invalid field
            if (!isNameValidOnSubmit) contactNameInput.focus();
            else if (!isEmailValidOnSubmit) contactEmailInput.focus();
            else if (!isMessageValidOnSubmit) contactMessageInput.focus();
        }
    });


    // --- Chat Box (Contact Page Specific) ---
    const chatInputContact = document.getElementById('chatInputContact');
    const chatSendBtnContact = document.getElementById('chatSendBtnContact');
    const chatResponsePopupContact = document.getElementById('chatResponsePopupContact');
    const chatResponseTextContact = document.getElementById('chatResponseTextContact');
    const chatClosePopupBtnContact = document.getElementById('chatClosePopupBtnContact');
    const chatErrorContact = document.getElementById('chatErrorContact');

    chatInputContact.addEventListener('input', () => {
        const textLength = chatInputContact.value.trim().length;
        chatSendBtnContact.disabled = textLength < 5;
        if (textLength >= 5) {
            chatErrorContact.style.display = 'none';
        }
    });

    chatSendBtnContact.addEventListener('click', () => {
        const question = chatInputContact.value.trim();
        if (question.length < 5) {
            chatErrorContact.textContent = 'Minimum 5 characters required.'; // WCAG 3.3.1
            chatErrorContact.style.display = 'block';
            return;
        }
        chatErrorContact.style.display = 'none';

        let response = "Happy to help! ";
        if (question.toLowerCase().includes("how to contact") || question.toLowerCase().includes("support")) {
            response += "You can use the contact form above to send us a detailed message, or for urgent matters, email support@ecowarriors.com.";
        } else if (question.toLowerCase().includes("response time") || question.toLowerCase().includes("how long")) {
            response += "We aim to respond to all inquiries within 24-48 business hours. Thanks for your patience!";
        } else {
            response += "For general questions, try the form above. If it's about a specific page, you can ask there too!";
        }

        chatResponseTextContact.textContent = response;
        chatResponsePopupContact.style.display = 'block';
        chatClosePopupBtnContact.focus();
        chatInputContact.value = '';
        chatSendBtnContact.disabled = true;
    });

    chatClosePopupBtnContact.addEventListener('click', () => {
        chatResponsePopupContact.style.display = 'none';
        chatInputContact.focus();
    });
    
    // Trap focus in chat popup
    chatResponsePopupContact.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatClosePopupBtnContact.click();
        }
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === chatClosePopupBtnContact) {
            e.preventDefault();
            chatClosePopupBtnContact.focus(); // Loop back
        }
    });

    // --- Initial Page Load ---
    checkAllFieldsValid(); // Set initial button state
});