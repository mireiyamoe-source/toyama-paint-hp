// ===== ハンバーガーメニュー =====
const hamburger = document.querySelector('.hamburger');
const spNav = document.querySelector('.sp-nav');
const spNavClose = document.querySelector('.sp-nav-close');

if (hamburger && spNav) {
  hamburger.addEventListener('click', () => spNav.classList.add('open'));
  spNavClose && spNavClose.addEventListener('click', () => spNav.classList.remove('open'));
  spNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => spNav.classList.remove('open'));
  });
}

// ===== スクロールフェードイン =====
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));
}

// ===== お問い合わせフォームバリデーション =====
function initContactForm() {
  const form = document.querySelector('.contact-form-el');
  if (!form) return;

  const submitBtn = form.querySelector('.btn-submit');
  const typeChecks = form.querySelectorAll('input[name="type"]');
  const nameEl = form.querySelector('input[name="name"]');
  const telEl = form.querySelector('input[name="tel"]');
  const emailEl = form.querySelector('input[name="email"]');
  const methodRadios = form.querySelectorAll('input[name="contact_method"]');
  const telField = form.querySelector('.cm-field-tel');
  const emailField = form.querySelector('.cm-field-email');

  function currentMethod() {
    const r = form.querySelector('input[name="contact_method"]:checked');
    return r ? r.value : 'tel';
  }
  function syncMethod() {
    const m = currentMethod();
    if (telField) telField.style.display = (m === 'email') ? 'none' : '';
    if (emailField) emailField.style.display = (m === 'email') ? '' : 'none';
  }
  function checkForm() {
    // 必須は3つ：お問い合わせ内容(1つ以上)・お名前・選んだ連絡先
    const anyType = Array.from(typeChecks).some(c => c.checked);
    const nameFilled = !!(nameEl && nameEl.value.trim());
    const m = currentMethod();
    const contactFilled = (m === 'email')
      ? !!(emailEl && emailEl.value.trim())
      : !!(telEl && telEl.value.trim());
    if (anyType && nameFilled && contactFilled) {
      submitBtn.classList.add('active');
      submitBtn.textContent = 'この内容で送信する';
    } else {
      submitBtn.classList.remove('active');
      submitBtn.textContent = '入力が完了していません';
    }
  }

  methodRadios.forEach(r => r.addEventListener('change', () => { syncMethod(); checkForm(); }));
  [nameEl, telEl, emailEl].forEach(el => el && el.addEventListener('input', checkForm));
  typeChecks.forEach(c => c.addEventListener('change', checkForm));
  syncMethod();
  checkForm();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!submitBtn.classList.contains('active')) return;
    alert('お問い合わせありがとうございます。\n担当者よりご連絡いたします。');
    form.reset();
    checkForm();
  });
}
initContactForm();

// ===== 施工事例フィルター =====
function initWorksFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.work-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      items.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}
initWorksFilter();

// ===== カレンダー生成（ブログサイドバー） =====
function buildCalendar(year, month, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const today = new Date();
  const d = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = d.getDay();
  const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  let html = `<div class="calendar-header"><span>${year}年 ${monthNames[month-1]}</span></div>`;
  html += '<table><thead><tr>';
  ['日','月','火','水','木','金','土'].forEach(d => { html += `<th>${d}</th>`; });
  html += '</tr></thead><tbody><tr>';
  for (let i = 0; i < startDay; i++) html += '<td></td>';
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day;
    html += `<td${isToday ? ' class="today"' : ''}>${day}</td>`;
    if ((startDay + day) % 7 === 0 && day < daysInMonth) html += '</tr><tr>';
  }
  html += '</tr></tbody></table>';
  el.innerHTML = html;
}
const now = new Date();
buildCalendar(now.getFullYear(), now.getMonth() + 1, 'calendar-widget');
