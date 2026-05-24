/**
 * Notes Website - Main JavaScript
 */

// ========================================
// Toggle Card Expansion
// ========================================
function toggleCard(link) {
    const card = link.closest('.card');
    card.classList.toggle('card-expanded');
    link.textContent = card.classList.contains('card-expanded') ? '↑ Collapse' : '↓ Show Resources';
}

// ========================================
// Search Functionality
// ========================================
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const cards = document.querySelectorAll('.card');
const emptyState = document.querySelector('.empty-state');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterCards();
});

searchInput.addEventListener('input', filterCards);

function filterCards() {
    const query = searchInput.value.trim().toLowerCase();
    let hasResults = false;

    cards.forEach(card => {
        const link = card.querySelector('.card-toggle-link');
        const links = card.querySelectorAll('.card-expanded-content a');
        const linkText = link.textContent.toLowerCase();
        let linkTextMatch = false;

        links.forEach(link => {
            if (link.textContent.toLowerCase().includes(query)) {
                linkTextMatch = true;
            }
        });

        if (query === '' || linkText.includes(query) || linkTextMatch) {
            card.closest('.col-12').style.display = 'block';
            if (query !== '') hasResults = true;
        } else {
            card.closest('.col-12').style.display = 'none';
        }
    });

    emptyState.classList.toggle('show', query !== '' && !hasResults);
}

// ========================================
// Feedback Form Toggle
// ========================================
function toggleFeedbackForm() {
    var popup = document.getElementById('feedbackPopup');
    popup.classList.toggle('active');
}

// ========================================
// Feedback Form Submission
// ========================================
document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var currentDate = new Date().toLocaleString();
    var formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        submission_date: currentDate
    };

    emailjs.send("rohitvendasta@gmail.com", "template_euenjja", formData)
        .then(function (response) {
            document.getElementById('formMessage').innerHTML = '<span style="color:green;">Feedback sent successfully!</span>';
            document.getElementById('feedbackForm').reset();
            setTimeout(toggleFeedbackForm, 2000);
        }, function (error) {
            document.getElementById('formMessage').innerHTML = '<span style="color:red;">Failed to send feedback: ' + error.text + '</span>';
        });
});

// ========================================
// Initialize EmailJS
// ========================================
(function () {
    emailjs.init("dnQ7CtoblL4arIed7");
})();

// ========================================
// Apply Card Button Style to Card Links
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-expanded-content a').forEach(link => {
        link.classList.add('card-btn');
    });
});

