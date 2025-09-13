// Newsletter subscription functionality
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('emailInput');
  const messageDiv = document.getElementById('message');

  // Initialize EmailJS (you'll need to add your EmailJS script to HTML)
  if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission
    
    const email = emailInput.value.trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      showMessage('Please enter your email address.', 'error');
      return;
    }
    
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }
    
    // Check if email is already subscribed
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    
    if (subscribers.includes(email)) {
      showMessage('You\'re already subscribed to our newsletter!', 'info');
      return;
    }
    
    // Show loading message
    showMessage('Subscribing you to our newsletter...', 'info');
    
    // Send welcome email using EmailJS
    if (typeof emailjs !== 'undefined') {
      const templateParams = {
        to_email: email,
        to_name: email.split('@')[0], // Use part before @ as name
        message: `Welcome to Culinary Quest! We're excited to have you join our community of food lovers. You'll receive our latest recipes, cooking tips, and culinary adventures straight to your inbox.`
      };

      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          
          // Add email to subscribers
          subscribers.push(email);
          localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
          
          // Show success message
          showMessage('Thank you for subscribing! Check your email for a welcome message.', 'success');
          
          // Clear the form
          form.reset();
        }, function(error) {
          console.log('FAILED...', error);
          
          // Still add to subscribers even if email fails
          subscribers.push(email);
          localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
          
          showMessage('Subscription successful! Welcome email may be delayed.', 'success');
          form.reset();
        });
    } else {
      // Fallback if EmailJS is not available
      subscribers.push(email);
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
      showMessage('Thank you for subscribing! You\'ll receive our latest recipes and cooking tips soon.', 'success');
      form.reset();
    }
  });
  
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 5000);
  }

  // Recipe card debugging
  const recipeCards = document.querySelectorAll('.recipe-card a');
  recipeCards.forEach(card => {
    card.addEventListener('click', function(e) {
      console.log('Recipe card clicked!');
      console.log('Link href:', this.href);
    });
  });
}); 