const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

// Smooth animations for form status
function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type} show`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 5000);
    }
}

// Enhanced button loading state
function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

// NIP validation
function validateNIP(nip) {
    if (!nip) return true; // NIP is optional
    const cleanNIP = nip.replace(/\s/g, '');
    return /^\d{10}$/.test(cleanNIP);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Clear previous status
    statusEl.classList.remove('show');
    
    // Validate required fields
    const requiredFields = ['imie', 'email', 'zrodlo'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        if (!field.value.trim()) {
            field.focus();
            isValid = false;
        }
    });
    
    // Validate NIP if provided
    if (form.nip.value && !validateNIP(form.nip.value)) {
        showStatus('NIP musi składać się z 10 cyfr', 'error');
        form.nip.focus();
        return;
    }
    
    if (!isValid) {
        showStatus('Proszę wypełnić wszystkie wymagane pola', 'error');
        return;
    }
    
    setLoading(true);
    
    const data = {
        imie: form.imie.value.trim(),
        email: form.email.value.trim(),
        telefon: form.telefon.value.trim(),
        nip: form.nip.value.trim(),
        zrodlo: form.zrodlo.value,
        wiadomosc: form.wiadomosc.value.trim()
    };
    
    try {
        const res = await fetch("https://norbertsobala.app.n8n.cloud/webhook/lead-crm-test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showStatus('Dziękujemy! Skontaktujemy się wkrótce.', 'success');
            form.reset();
            
            // Reset floating labels
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.blur();
            });
        } else {
            throw new Error(`Server error: ${res.status}`);
        }
    } catch (err) {
        showStatus('Wystąpił problem. Spróbuj ponownie.', 'error');
        console.error('Form submission error:', err);
    } finally {
        setLoading(false);
    }
});

// Enhanced form interactions
form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
        if (statusEl.classList.contains('error')) {
            statusEl.classList.remove('show');
        }
    });
});
