document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotClose = document.getElementById('chatbot-close');

    // Show modal when chatbot button is clicked
    chatbotButton.addEventListener('click', function() {
        chatbotModal.style.display = 'flex';
    });

    // Hide modal when close button is clicked
    chatbotClose.addEventListener('click', function() {
        chatbotModal.style.display = 'none';
    });

    // Hide modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target === chatbotModal) {
            chatbotModal.style.display = 'none';
        }
    });
});
