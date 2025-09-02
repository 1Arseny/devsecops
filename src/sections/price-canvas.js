export function initPriceSectionCanvas() {
  const section = document.getElementById("price-register");
  const canvas = document.getElementById("price-canvas");
  if (!section || !canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    // Генерируем 5-7 светящихся полос на разных высотах
    for (let i = 0; i < 7; i++) {
      let y = (h / 8) * (i + 1) + Math.sin(time / (1100 + i * 220)) * 10;
      let alpha = 0.13 + 0.11 * Math.abs(Math.sin(time / (600 + i * 80) + i));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "#15e6cb";
      ctx.shadowBlur = 18 + 6 * Math.sin(time / (900 + i * 50));
      let grad = ctx.createLinearGradient(0, y - 3, w, y + 3);
      grad.addColorStop(0, "#21d4fd44");
      grad.addColorStop(0.5, "#15e6cb");
      grad.addColorStop(1, "#21d4fd44");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 18 + 8 * Math.abs(Math.cos(time / (1200 + i * 40) + i * 1.2));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.restore();
    }

    // Дополнительно можно добавить "глитч" вспышки
    for (let i = 0; i < 3; i++) {
      if (Math.random() > 0.96) {
        let y = Math.random() * h;
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.random() * 0.1;
        ctx.shadowColor = "#21d4fd";
        ctx.shadowBlur = 30;
        ctx.strokeStyle = "#21d4fd";
        ctx.lineWidth = 10 + Math.random() * 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.restore();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  setTimeout(resize, 200);
  requestAnimationFrame(draw);
}

// price-section form logic
export function initPriceForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const el = (id) => document.getElementById(id);
  const endpoint = 'https://services-webinar-pentest-170325.codeby.school/send_lead_extended.php';

  const state = { submitting: false };

  const show = (elem, on) => elem.classList.toggle('hidden', !on);

  const validators = {
    name(v) {
      return /^[A-Za-zА-Яа-яЁё\s'-]{2,60}$/.test(v.trim());
    },
    email(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    },
    phone(v) {
      const digits = v.replace(/\D+/g, '');
      // допускаем +7XXXXXXXXXX или 8XXXXXXXXXX
      if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) return true;
      if (digits.length === 12 && v.trim().startsWith('+7')) return true;
      return false;
    },
    comment(v) {
      return v.length <= 1000;
    },
    consentRequired(on) {
      return !!on;
    }
  };

  function setError(input, errEl, hasError) {
    if (!input || !errEl) return;
    input.classList.toggle('border-red-500', hasError);
    input.classList.toggle('focus:ring-red-400', hasError);
    show(errEl, hasError);
  }

  function isFormValid() {
    const name = el('name')?.value ?? '';
    const email = el('email')?.value ?? '';
    const phone = el('phone')?.value ?? '';
    const comment = el('comment')?.value ?? '';
    const consentRequired = !!el('consentRequired')?.checked;

    return (
      validators.name(name) &&
      validators.email(email) &&
      validators.phone(phone) &&
      validators.comment(comment) &&
      validators.consentRequired(consentRequired)
    );
  }

  const submitBtn = el('submitBtn');
  const hint = el('formHint');

  function updateSubmitState() {
    const enable = isFormValid() && !state.submitting;
    if (submitBtn) submitBtn.disabled = !enable;
  }

  // live-валидация на ввод
  const bindLiveValidation = () => {
    const map = [
      ['name', 'nameErr', (v) => validators.name(v)],
      ['email', 'emailErr', (v) => validators.email(v)],
      ['phone', 'phoneErr', (v) => validators.phone(v)],
      ['comment', 'commentErr', (v) => validators.comment(v)],
    ];

    map.forEach(([id, errId, check]) => {
      const input = el(id);
      const errEl = el(errId);
      if (!input) return;
      input.addEventListener('input', () => {
        setError(input, errEl, !check(input.value));
        updateSubmitState();
      });
      // первичная подсветка (не агрессивная): без ошибки
      setError(input, errEl, false);
    });

    const cr = el('consentRequired');
    if (cr) {
      cr.addEventListener('change', () => {
        show(el('consentReqErr'), !cr.checked);
        updateSubmitState();
      });
    }
    
    const phoneInput = el('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        let digits = phoneInput.value.replace(/\D/g, '');

        // начинаем всегда с 7
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;

        // ограничим 11 цифрами
        digits = digits.slice(0, 11);

        // формат: +7 (999) 123-45-67
        let formatted = '+7';
        if (digits.length > 1) {
          formatted += ' (' + digits.slice(1, 4);
        }
        if (digits.length >= 4) {
          formatted += ') ' + digits.slice(4, 7);
        }
        if (digits.length >= 7) {
          formatted += '-' + digits.slice(7, 9);
        }
        if (digits.length >= 9) {
          formatted += '-' + digits.slice(9, 11);
        }

        phoneInput.value = formatted;
        updateSubmitState();
      });
    }
  };

  bindLiveValidation();
  updateSubmitState(); // первичная инициализация

  async function submit(e) {
    e.preventDefault();
    if (state.submitting) return;

    // honeypot (если заполнен — прерываем молча)
    if (el('website')?.value) return;

    const name = el('name').value;
    const email = el('email').value;
    const phone = el('phone').value;
    const comment = el('comment').value;
    const consentRequired = el('consentRequired').checked;
    const consentOptional = el('consentOptional')?.checked ?? false;

    const v = {
      name: validators.name(name),
      email: validators.email(email),
      phone: validators.phone(phone),
      comment: validators.comment(comment),
      consentRequired: validators.consentRequired(consentRequired),
    };

    setError(el('name'), el('nameErr'), !v.name);
    setError(el('email'), el('emailErr'), !v.email);
    setError(el('phone'), el('phoneErr'), !v.phone);
    setError(el('comment'), el('commentErr'), !v.comment);
    show(el('consentReqErr'), !v.consentRequired);
    updateSubmitState();

    if (Object.values(v).some(ok => !ok)) return;

    const payload = {
      form_name: 'DevSecOps',   // заголовок проставляет фронт
      site: location.hostname,
      name,
      email,
      phone,
      comment,
      consentOptional,          // Y/N проставит бэк в нужное поле
      consentRequired,          // для аналитики/логов
    };

    try {
      state.submitting = true;
      updateSubmitState();
      if (hint) hint.textContent = 'Отправляем… Это займёт несколько секунд.';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Ошибка отправки');
      }

      if (hint) hint.textContent = 'Заявка отправлена. Мы свяжемся с вами в течение 1–2 рабочих дней.';
      form.reset();
    } catch (err) {
      if (hint) hint.textContent = 'Не получилось отправить. Попробуйте ещё раз.';
      console.error(err);
    } finally {
      state.submitting = false;
      updateSubmitState();
    }
  }

  form.addEventListener('submit', submit);

  // --- спец. обработка ссылок в label ---
  // --- ссылки внутри label: 1 клик = toggle чекбокса, 2 клика = открыть ссылку ---
  document.querySelectorAll('#leadForm label').forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    label.querySelectorAll('a').forEach(link => {
      let clickTimer = null;

      // единый обработчик клика: откладываем действие, чтобы отловить возможный dblclick
      link.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // если скоро будет dblclick — не переключаем чекбокс
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          // одиночный клик: переключаем чекбокс и шлём change
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }, 220); // таймаут под двойной клик
      });

      link.addEventListener('dblclick', e => {
        e.preventDefault();
        e.stopPropagation();
        if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
        // двойной клик: открываем ссылку
        window.open(link.href, '_blank', 'noopener');
      });
    });
  });


}