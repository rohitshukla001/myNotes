(function() {
   emailjs.init("dnQ7CtoblL4arIed7"); 
})();
if (typeof AOS !== 'undefined') {
   AOS.init();
}
function toggleFeedbackForm() {
   var popup = document.getElementById('feedbackPopup');
   popup.classList.toggle('active');
}
document.getElementById('feedbackForm').addEventListener('submit', function(event) {
   event.preventDefault();
   var currentDate = new Date().toLocaleString();
   var formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      submission_date: currentDate 
   };
   emailjs.send("rohitvendasta@gmail.com", "template_euenjja", formData)
      .then(function(response) {
         document.getElementById('formMessage').innerHTML = '<span style="color:green;">Feedback sent successfully!</span>';
         document.getElementById('feedbackForm').reset();
         setTimeout(toggleFeedbackForm, 2000);
      }, function(error) {
         document.getElementById('formMessage').innerHTML = '<span style="color:red;">Failed to send feedback: ' + error.text + '</span>';
      });
});
// Store original card HTML
const cardContainers = [
   document.getElementById('cardContainer'),
   document.getElementById('cardContainer2'),
   document.getElementById('cardContainer3')
];
const originalCards = cardContainers.map(container => container.innerHTML);
const emptyState = document.getElementById('emptyState');
// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
   const searchTerm = e.target.value.trim().toLowerCase();
   // Hide empty state and clear all card containers
   emptyState.style.display = 'none';
   cardContainers.forEach(container => {
      container.innerHTML = '';
   });
   // If search term is empty, restore all cards with accordions collapsed
   if (searchTerm === '') {
      cardContainers.forEach((container, index) => {
         container.innerHTML = originalCards[index];
         const accordions = container.querySelectorAll('.accordion-collapse');
         accordions.forEach(accordion => {
            accordion.classList.remove('show');
         });
      });
      if (typeof AOS !== 'undefined') {
         AOS.refresh();
      }
      return;
   }
   // Create a temporary container to parse original cards
   const tempContainer = document.createElement('div');
   let hasMatches = false;
   // Restore and filter cards for each container
   cardContainers.forEach((container, index) => {
      tempContainer.innerHTML = originalCards[index];
      const cards = tempContainer.querySelectorAll('.card-section');
      cards.forEach(card => {
         const buttons = card.querySelectorAll('.list-group-item a');
         let hasMatch = false;
         buttons.forEach(button => {
            const text = button.textContent.trim().toLowerCase();
            if (text.includes(searchTerm)) {
               hasMatch = true;
               hasMatches = true;
            }
         });
         if (hasMatch) {
            container.appendChild(card.cloneNode(true));
            const accordionCollapse = card.querySelector('.accordion-collapse');
            if (accordionCollapse) {
               accordionCollapse.classList.add('show');
            }
         }
      });
   });
   // Show empty state if no matches found
   if (!hasMatches) {
      emptyState.style.display = 'block';
   }
   // Refresh AOS animations
   if (typeof AOS !== 'undefined') {
      AOS.refresh();
   }
});
