document.addEventListener('DOMContentLoaded', () => {
    // --- Eco Quiz ---
    const quizContent = document.getElementById('quiz-content');
    const quizScoreFeedback = document.getElementById('quiz-score-feedback');
    
    const quizQuestions = [
        { question: "Do you recycle?", id: "q1" },
        { question: "Do you use public transport?", id: "q2" },
        { question: "Do you compost?", id: "q3" }
    ];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];

    function displayQuestion(index) {
        if (index < quizQuestions.length) {
            const questionData = quizQuestions[index];
            quizContent.innerHTML = `
                <div class="quiz-question" id="question-${questionData.id}" role="group" aria-labelledby="question-text-${questionData.id}">
                    <p id="question-text-${questionData.id}">${questionData.question}</p>
                    <div class="quiz-buttons">
                        <button data-answer="yes" aria-describedby="question-text-${questionData.id}">Yes</button>
                        <button data-answer="no" aria-describedby="question-text-${questionData.id}">No</button>
                    </div>
                </div>
            `;
            addQuizButtonListeners();
        } else {
            showScore();
        }
    }

    function addQuizButtonListeners() {
        const buttons = quizContent.querySelectorAll('.quiz-buttons button');
        buttons.forEach(button => {
            button.addEventListener('click', handleQuizAnswer);
        });
    }

    function handleQuizAnswer(event) {
        const answer = event.target.dataset.answer;
        userAnswers[currentQuestionIndex] = answer;

        // Simple scoring: "yes" is good for these questions
        if (answer === "yes") {
            score++;
        }

        // Disable buttons for current question after answering
        const currentQuestionButtons = event.target.parentElement.querySelectorAll('button');
        currentQuestionButtons.forEach(btn => btn.disabled = true);
        
        // WCAG 2.3.1 Three Flashes or Below Threshold: No flashing animations used.
        // Simulate frame progression by moving to next question
        currentQuestionIndex++;
        setTimeout(() => {
            displayQuestion(currentQuestionIndex);
        }, 200);
    }

    function showScore() {
        quizContent.innerHTML = ''; // Clear questions
        let feedbackMessage = "";
        if (score === quizQuestions.length) {
            feedbackMessage = "You Rock! Perfect score!";
        } else if (score >= Math.ceil(quizQuestions.length / 2)) {
            feedbackMessage = "Nice job! Keep up the great work!";
        } else {
            feedbackMessage = "Good start! Every little bit helps.";
        }

        quizScoreFeedback.innerHTML = `
            <p>Your Score: ${score}/${quizQuestions.length} correct - ${feedbackMessage}</p>
            <button id="close-score-button">Close</button>
        `;
        quizScoreFeedback.style.display = 'block';
        const closeButton = document.getElementById('close-score-button');
        closeButton.addEventListener('click', closeScorePopup);
        closeButton.focus(); // Focus on close button for screen readers
    }

    function closeScorePopup() {
        quizScoreFeedback.style.display = 'none';
        quizScoreFeedback.innerHTML = '';
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        displayQuestion(currentQuestionIndex); // Restart quiz
    }

    // --- Chat Box ---
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-button');
    const chatResponsePopup = document.getElementById('chat-response-popup');
    const chatResponseText = document.getElementById('chat-response-text');
    const chatClosePopupButton = document.getElementById('chat-close-popup-button');

    chatInput.addEventListener('input', () => {
        // WCAG Design Constraint: Send disabled until 5+ characters
        chatSendButton.disabled = chatInput.value.trim().length < 5;
    });

    chatSendButton.addEventListener('click', () => {
        const question = chatInput.value.trim();
        if (question.length >= 5) {
            // Simulate a response
            let response = "Great question! ";
            if (question.toLowerCase().includes("eco-tip") || question.toLowerCase().includes("tip")) {
                response += "One great eco-tip is to use a reusable water bottle.";
            } else if (question.toLowerCase().includes("recycle")) {
                response += "Recycling helps reduce landfill waste and conserves natural resources.";
            } else if (question.toLowerCase().includes("sustainability")) {
                response += "Sustainability means meeting our own needs without compromising the ability of future generations to meet their own needs.";
            } else {
                response += "Thanks for asking! We're always learning more about sustainability.";
            }
            
            // WCAG 3.3.1 Error Identification: Basic check for input length handled by disabling button.
            // More complex validation would show specific error messages.
            
            chatResponseText.textContent = response;
            chatResponsePopup.style.display = 'block';
            chatClosePopupButton.focus(); // Focus on close button in popup
            chatInput.value = ''; // Clear input
            chatSendButton.disabled = true; // Re-disable send button
        }
    });

    chatClosePopupButton.addEventListener('click', () => {
        chatResponsePopup.style.display = 'none';
        chatInput.focus(); // Return focus to input field
    });

    // --- Initial Page Load ---
    displayQuestion(currentQuestionIndex); // Start the quiz

    // --- Accessibility: Ensure popups are handled correctly ---
    // Trap focus within modal dialogs (simplified for this example)
    // A more robust solution would use a focus trapping library or more complex JS
    chatResponsePopup.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatClosePopupButton.click();
        }
        // Basic focus trap for Tab key
        if (e.key === 'Tab' && !e.shiftKey) {
            if (document.activeElement === chatClosePopupButton) {
                e.preventDefault();
                chatClosePopupButton.focus(); // Loop back to the only focusable element
            }
        }
    });

    // Quiz score popup focus trapping
    quizScoreFeedback.addEventListener('keydown', (e) => {
        const closeButton = quizScoreFeedback.querySelector('#close-score-button');
        if (e.key === 'Escape' && closeButton) {
            closeButton.click();
        }
        if (e.key === 'Tab' && closeButton) {
            e.preventDefault();
            closeButton.focus();
        }
    });

    // WCAG 2.1.2 No Keyboard Trap: Covered by Escape key and careful tabbing.
    // WCAG 4.1.2 Name, Role, Value: Buttons and inputs have text or aria-labels. Roles are implicit or set.
    // WCAG 4.1.1 Parsing: HTML should be well-formed.
});