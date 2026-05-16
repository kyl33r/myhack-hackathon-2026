// Shared submit handler for all partner registration forms.
// future: replaced by React form components with react-hook-form + API calls.
document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate all required fields in this form
  let valid = true;
  document.querySelectorAll('input[required], select[required], textarea[required]').forEach(el => {
    const errId = 'err-' + el.id;
    const err = document.getElementById(errId);
    if (!el.value.trim()) {
      if (err) err.classList.add('visible');
      valid = false;
    } else {
      if (err) err.classList.remove('visible');
    }
  });
  if (!valid) return;

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';
  document.getElementById('loading-overlay').classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('loading-overlay').classList.add('hidden');
    document.querySelector('form').innerHTML = `
      <div class="success-box">
        <span class="success-icon">✅</span>
        <h3>Application received!</h3>
        <p>Cradle will review your profile and reach out within 5 working days.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:1rem;display:inline-block">Back to Home</a>
      </div>`;
  }, 2000);
});
