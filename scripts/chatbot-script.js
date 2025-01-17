// Get references to modal elements
const chatbotButton = document.getElementById('chatbot-button');
const chatbotModal = document.getElementById('chatbot-modal');
const closeModalButton = document.getElementById('chatbot-close');

// Show the modal when the button is clicked
chatbotButton.addEventListener('click', () => {
    chatbotModal.style.display = 'flex'; // Show modal with flexbox alignment
});

// Hide the modal when the close button is clicked
closeModalButton.addEventListener('click', () => {
    chatbotModal.style.display = 'none'; // Hide modal
});
