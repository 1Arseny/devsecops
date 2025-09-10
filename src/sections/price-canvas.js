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

  // ---------- Toast ----------
  function ensureToastRoot() {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.className = 'fixed inset-0 pointer-events-none z-[9999]';
      document.body.appendChild(root);
    }
    return root;
  }

  function showToast(message = 'Готово! Заявка отправлена.', opts = {}) {
    const {
      duration = 4000,
      icon = '✓',
      sub = 'Мы свяжемся с вами в ближайшее время.',
    } = opts;

    const root = ensureToastRoot();

    const wrap = document.createElement('div');
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');
    wrap.className = `
      pointer-events-auto
      fixed right-6 bottom-6
      max-w-sm
      bg-[#222f3a]/95 border border-[#15e6cb]/20 rounded-xl shadow-2xl
      px-4 py-3
      text-gray-100
      translate-y-3 opacity-0
      transition-all duration-200 ease-out
    `;

    wrap.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-gradient-to-r from-[#21d4fd] to-[#13e0ba] grid place-items-center text-[#131a22] font-bold">${icon}</div>
        <div class="flex-1">
          <div class="text-sm font-semibold">${message}</div>
          <div class="text-xs text-gray-300 mt-0.5">${sub}</div>
        </div>
        <button type="button" aria-label="Закрыть уведомление"
          class="ml-2 text-gray-400 hover:text-white transition">×</button>
      </div>
    `;

    // появление
    requestAnimationFrame(() => {
      root.appendChild(wrap);
      requestAnimationFrame(() => {
        wrap.classList.remove('translate-y-3', 'opacity-0');
      });
    });

    // закрытие
    let hideTimer = setTimeout(close, duration);
    function close() {
      if (!wrap.isConnected) return;
      wrap.classList.add('translate-y-3', 'opacity-0');
      setTimeout(() => wrap.remove(), 180);
    }

    // кнопка закрытия
    wrap.querySelector('button')?.addEventListener('click', () => {
      clearTimeout(hideTimer);
      close();
    });

    // Esc закрывает
    const onKey = (e) => { if (e.key === 'Escape') { clearTimeout(hideTimer); close(); } };
    document.addEventListener('keydown', onKey, { once: true });
  }
  // ---------- /Toast ----------

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

  // live-валидация и маска телефона
  const bindLiveValidation = () => {
    const map = [
      ['name', 'nameErr', (v) => validators.name(v)],
      ['email', 'emailErr', (v) => validators.email(v)],
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
      setError(input, errEl, false);
    });

    const phoneInput = el('phone');
    const phoneErr = el('phoneErr');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        let digits = phoneInput.value.replace(/\D/g, '');

        // нормализуем к "7..." (заменяем лидирующую 8 на 7, если есть)
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;
        digits = digits.slice(0, 11); // максимум 11 цифр

        // формат: +7 (999) 123-45-67
        let formatted = '+7';
        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
        if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
        if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);

        phoneInput.value = formatted;
        setError(phoneInput, phoneErr, !validators.phone(formatted));
        updateSubmitState();
      });
    }

    const cr = el('consentRequired');
    if (cr) {
      cr.addEventListener('change', () => {
        show(el('consentReqErr'), !cr.checked);
        updateSubmitState();
      });
    }
    const co = el('consentOptional');
    if (co) {
      co.addEventListener('change', () => {
        updateSubmitState();
      });
    }
  };

  bindLiveValidation();
  updateSubmitState(); // первичная инициализация

function showModalSuccess() {
  try {
    // если вдруг осталась предыдущая — удалим
    const prev = document.getElementById('success-overlay');
    if (prev) prev.remove();

    const prevActive = document.activeElement;

    // overlay
    const overlay = document.createElement('div');
    overlay.id = 'success-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.style.cssText = [
      'position:fixed','inset:0','z-index:999999',
      'display:flex','align-items:center','justify-content:center',
      'background:rgba(0,0,0,0.7)','backdrop-filter:blur(4px)'
    ].join(';');

    // dialog
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-labelledby','successTitle');
    modal.setAttribute('aria-describedby','successDesc');
    modal.tabIndex = -1;
    modal.style.cssText = [
      'background:#222f3a','color:#fff','border-radius:16px',
      'box-shadow:0 20px 60px rgba(0,0,0,0.5)',
      'padding:32px','width:90%','max-width:480px','text-align:center',
      // анимация
      'opacity:0','transform:scale(0.96)','transition:opacity .18s ease, transform .18s ease'
    ].join(';');

    modal.innerHTML = `
      <div id="successTitle" style="font-size:22px;font-weight:800;margin-bottom:12px">Заявка отправлена!</div>
      <p id="successDesc" style="color:#cbd5e1;margin-bottom:24px">Мы свяжемся с вами в ближайшее время.</p>
      <button id="modalCloseBtn"
        style="
          background:linear-gradient(90deg,#21d4fd,#13e0ba);
          color:#131a22;font-weight:700;border:none;border-radius:12px;
          padding:10px 20px;cursor:pointer
        ">
        Хорошо
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // запрет прокрутки фона
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // анимация появления
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
      modal.style.transform = 'scale(1)';
      // фокус в модалку
      document.getElementById('modalCloseBtn').focus();
    });

    // закрытие
    function close() {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.96)';
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = prevOverflow;
        if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
        document.removeEventListener('keydown', onKey);
      }, 180);
    }

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        // простая ловушка фокуса
        const btn = document.getElementById('modalCloseBtn');
        e.preventDefault();
        btn.focus();
      }
    };

    document.getElementById('modalCloseBtn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    console.log('[modal] success modal shown');
  } catch (e) {
    console.error('[modal] failed, fallback to alert', e);
    alert('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
  }
}




  async function submit(e) {
    e.preventDefault();
    if (state.submitting) return;

    // honeypot
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
      form_name: 'Лид с сайта DevSecOps',
      site: location.hostname,
      name,
      email,
      phone,
      comment,
      consentOptional,
      consentRequired,
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

      if (hint) hint.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.';
      showModalSuccess();
      form.reset();

      //  по умолчанию обязательный чекбокс отмечен — вернуть его в true:
      const cr = el('consentRequired');
      if (cr && !cr.checked) { cr.checked = true; }
    } catch (err) {
      if (hint) hint.textContent = 'Не получилось отправить. Попробуйте ещё раз.';
      console.error(err);
    } finally {
      state.submitting = false;
      updateSubmitState();
    }
  }

  form.addEventListener('submit', submit);

  // --- ссылки внутри label: 1 клик = toggle чекбокса, 2 клика = открыть ссылку ---
  document.querySelectorAll('#leadForm label').forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    label.querySelectorAll('a').forEach(link => {
      let clickTimer = null;

      link.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (clickTimer) clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        }, 220);
      });

      link.addEventListener('dblclick', e => {
        e.preventDefault();
        e.stopPropagation();
        if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
        window.open(link.href, '_blank', 'noopener');
      });
    });
  });
}
