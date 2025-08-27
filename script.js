const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Wysyłanie...";

  const data = {
    imie: form.imie.value.trim(),
    email: form.email.value.trim(),
    telefon: form.telefon.value.trim(),
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
      statusEl.textContent = "Dziękujemy! Formularz został wysłany.";
      statusEl.className = "success";
      form.reset();
    } else {
      throw new Error("Błąd serwera: " + res.status);
    }
  } catch (err) {
    statusEl.textContent = "Wystąpił problem. Spróbuj ponownie później.";
    statusEl.className = "error";
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Wyślij";
  }
});
