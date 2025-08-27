const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type} show`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 6000);
    }
}

function setLoading(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

function validateNIP(nip) {
    const cleanNIP = nip.replace(/\s/g, '');
    return /^\d{10}$/.test(cleanNIP);
}

function validateForm() {
    const requiredFields = [
        { field: form.imie, message: 'Proszę podać imię' },
        { field: form.email, message: 'Proszę podać email' },
        { field: form.nip, message: 'Proszę podać NIP' },
        { field: form.consent, message: 'Proszę wyrazić zgodę na przetwarzanie danych' }
    ];
    
    for (const { field, message } of requiredFields) {
        if (!field.value || (field.type === 'checkbox' && !field.checked)) {
            showStatus(message, 'error');
            field.focus();
            return false;
        }
    }
    
    if (!validateNIP(form.nip.value)) {
        showStatus('NIP musi składać się z dokładnie 10 cyfr', 'error');
        form.nip.focus();
        return false;
    }
    
    return true;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    statusEl.classList.remove('show');
    
    if (!validateForm()) {
        return;
    }
    
    setLoading(true);
    
    const data = {
        imie: form.imie.value.trim(),
        email: form.email.value.trim().toLowerCase(),
        nip: form.nip.value.trim(),
        wiadomosc: form.wiadomosc.value.trim(),
        consent: form.consent.checked
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
        } else {
            throw new Error(`Błąd serwera: ${res.status}`);
        }
    } catch (err) {
        showStatus('Wystąpił problem z połączeniem. Spróbuj ponownie.', 'error');
        console.error('Form submission error:', err);
    } finally {
        setLoading(false);
    }
});

form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
        if (statusEl.classList.contains('error')) {
            statusEl.classList.remove('show');
        }
    });
});

form.nip.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});
