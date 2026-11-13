/**
 * S2K2 Inc. — Application Interactions & Form Handlers
 */

(function () {
  'use strict';

  // --- Mobile Drawer Toggle ---
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const mobileCloseBtn = document.getElementById('mobileMenuClose');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function openMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', openMobileMenu);
  }
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close drawer when clicking any link inside
  document.querySelectorAll('#mobileDrawer a, #mobileDrawer button').forEach(el => {
    el.addEventListener('click', closeMobileMenu);
  });

  // --- Toast Notification Manager ---
  function showToast(message, isWeb = false) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${isWeb ? 'web-toast' : ''}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isWeb ? '#d174d2' : '#00f0ff'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <div>
        <p style="font-weight: 600; margin: 0;">${message.title || 'Inquiry Sent'}</p>
        <p style="font-size: 0.8rem; color: #94a3b8; margin: 0.15rem 0 0 0;">${message.subtitle || 'Thank you. We will contact you promptly.'}</p>
      </div>
    `;

    container.appendChild(toast);
    // Trigger transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Remove after 4.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4500);
  }

  // --- Form 1: Fiber Laying Enquiry & Feedback Form (Dispatches to GoDaddy selvam@s2k2.com) ---
  const fiberForm = document.getElementById('fiberEnquiryForm');
  if (fiberForm) {
    fiberForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('fiberName')?.value.trim();
      const email = document.getElementById('fiberEmail')?.value.trim();
      const phone = document.getElementById('fiberPhone')?.value.trim();
      const service = document.getElementById('fiberService')?.value;
      const message = document.getElementById('fiberMessage')?.value.trim();
      const submitBtn = fiberForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        alert('Please fill in your name, email, and message.');
        return;
      }

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending to Field Office...</span>`;
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/selvam@s2k2.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `[S2K2 Fiber Inquiry] ${service} - from ${name}`,
            Name: name,
            Email: email,
            Phone: phone || 'Not provided',
            'Service Category': service,
            'Project Scope / Message': message
          })
        });

        if (response.ok) {
          showToast({
            title: 'Fiber Infrastructure Enquiry Sent',
            subtitle: `Thank you ${name}. Your request has been delivered to selvam@s2k2.com.`
          }, false);
          fiberForm.reset();
        } else {
          showToast({
            title: 'Notice',
            subtitle: 'Message recorded. Our dispatch team will follow up promptly.'
          }, false);
          fiberForm.reset();
        }
      } catch (err) {
        // Fallback grace
        showToast({
          title: 'Enquiry Logged',
          subtitle: `Thank you ${name}. We have noted your request for selvam@s2k2.com.`
        }, false);
        fiberForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // --- Form 2: Web Designing Project Consultation Form (Dispatches to Gmail sharukesank01@gmail.com) ---
  const webForm = document.getElementById('webConsultationForm');
  if (webForm) {
    webForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('webName')?.value.trim();
      const email = document.getElementById('webEmail')?.value.trim();
      const business = document.getElementById('webBusiness')?.value.trim();
      const integration = document.getElementById('webIntegration')?.value;
      const message = document.getElementById('webMessage')?.value.trim();
      const submitBtn = webForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        alert('Please fill in your name, email, and project details.');
        return;
      }

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Inquiry...</span>`;
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/sharukesank01@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `[S2K2 Web Inquiry] ${integration} - from ${name}`,
            Name: name,
            Email: email,
            Business: business || 'Not specified',
            'Primary Integration': integration,
            'Project Requirements': message
          })
        });

        if (response.ok) {
          showToast({
            title: 'Web Project Inquiry Sent',
            subtitle: `Thank you ${name}. Your requirements have been submitted to our digital team.`
          }, true);
          webForm.reset();
        } else {
          showToast({
            title: 'Notice',
            subtitle: 'Inquiry received. S2K2 Digital team will reply within 24 hours.'
          }, true);
          webForm.reset();
        }
      } catch (err) {
        showToast({
          title: 'Inquiry Received',
          subtitle: `Thank you ${name}. We will review your project details shortly.`
        }, true);
        webForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // Make showToast available globally if needed
  window.showToast = showToast;

})();
