// Test animation issue fix
// This script can be run in the browser console to test the fix

console.log('Animation Blinking Issue Fix Test');
console.log('======================================');

// Check if the job cards have proper animation controls
const jobCards = document.querySelectorAll('[class*="group relative w-full"]');
console.log(`Found ${jobCards.length} job cards`);

// Test hover behavior
if (jobCards.length > 0) {
  console.log('Testing hover animations...');
  
  // Simulate hover on first card
  const firstCard = jobCards[0];
  firstCard.dispatchEvent(new MouseEvent('mouseenter'));
  
  setTimeout(() => {
    // Simulate clicking apply on first card while hovering on second
    const applyButton = firstCard.querySelector('button[class*="bg-gradient-to-r from-white"]');
    if (applyButton) {
      console.log('Clicking Apply Now button...');
      applyButton.click();
      
      // Immediately hover on second card to test for blinking
      if (jobCards[1]) {
        console.log('Hovering on second card...');
        jobCards[1].dispatchEvent(new MouseEvent('mouseenter'));
        
        setTimeout(() => {
          console.log('Test complete. Check for blinking effects.');
        }, 1000);
      }
    }
  }, 500);
} else {
  console.log('No job cards found. Make sure you are on the careers page.');
}
