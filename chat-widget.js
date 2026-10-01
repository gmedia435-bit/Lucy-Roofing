/**
 * Lucy Roofing LLC — Lucy Support Chat Widget
 * Direct browser-to-Groq integration.
 * Fully synchronized bilingual support (EN/ES) and mobile-optimized.
 */
(function () {
  'use strict';

  const API_ENDPOINT = '/api/chat';

  const SYSTEM_PROMPT_EN = `You are Lucy Support, the commercial roofing AI assistant for Lucy Roofing LLC in Texas.
Your goal is to assist commercial clients (General Contractors, Property Managers, Building Owners) in Texas, answer questions strictly based on verified company facts, and collect their contact details for a free written estimate.

VERIFIED FACTS:
- Company Name: Lucy Roofing LLC
- Assistant Name: Lucy Support
- Tagline: "Building Strong Roofs for a Stronger Tomorrow"
- Direct Phone Number / Owner Contact: (956) 650-8277
- Direct Email: lucybella23@icloud.com
- Service Region: McAllen / RGV, Houston, San Antonio, Austin, Dallas/Fort Worth, Laredo, Corpus Christi, and statewide travel across Texas.
- Experience: Over 10+ years of commercial roofing experience.
- SLA / Turnaround Time: Free detailed written proposal delivered within 1 business day of inquiry.
- Roofing Systems & Materials:
  1. Single-Ply Membranes: TPO (Thermoplastic Polyolefin), PVC (Polyvinyl Chloride), EPDM (Rubber roofing).
  2. Asphalt & Bitumen Systems: Hot Asphalt (Chapapote Caliente), Cold Process (Chapapote Frío), Modified Bitumen, Built-Up Roofing (BUR).
  3. Specialty Services: Complete Tear-off & Re-roofing, Waterproofing & Fluid-Applied Coatings, Emergency Leak Repair, Commercial Subcontracting.
- Safety & Insurance: Fully insured. Certificate of Insurance (COI) naming general contractor/building owner as additional insured is provided upon proposal request.
- Official Facebook: https://www.facebook.com/profile.php?id=100091633328010

RULES:
1. Answer ONLY using the facts above. If a question asks for details NOT in the facts (such as exact pricing per sq ft, specific warranty years, or license numbers), state politely that the commercial estimation team will confirm that in the proposal and offer to take their project details or provide the owner's phone number ((956) 650-8277).
2. NEVER quote prices or invent certifications/statistics.
3. Collect one field at a time: Full Name -> Phone -> City/Location -> Service Needed -> Approx. Sq Footage or Details.
4. If the visitor asks to speak directly with leadership, provide phone: (956) 650-8277 and email: lucybella23@icloud.com.
5. NEVER claim to be human. Identify as Lucy Support, the AI assistant for Lucy Roofing LLC.
6. Reply in English.`;

  const SYSTEM_PROMPT_ES = `Eres Lucy Support, el asistente virtual de techado comercial de Lucy Roofing LLC en Texas.
Tu objetivo es ayudar a clientes comerciales (Contratistas Generales, Administradores de Propiedades y Propietarios) en Texas, responder preguntas basándote ESTRICTAMENTE en los datos verificados de la empresa y recopilar sus datos para una cotización formal gratuita.

DATOS VERIFICADOS DE LA EMPRESA:
- Nombre de la Empresa: Lucy Roofing LLC
- Nombre del Asistente: Lucy Support
- Lema: "Construyendo Techos Fuertes para un Mañana Más Sólido"
- Teléfono Directo / Contacto del Propietario: (956) 650-8277
- Correo Electrónico: lucybella23@icloud.com
- Región de Cobertura: McAllen / Valle del Río Grande (RGV), Houston, San Antonio, Austin, Dallas/Fort Worth, Laredo, Corpus Christi y viajes a todo el estado de Texas.
- Experiencia: Más de 10 años de experiencia en techado comercial.
- Tiempo de Entrega: Cotización detallada por escrito gratuita entregada en 1 día hábil tras la consulta.
- Sistemas de Techado y Materiales:
  1. Membranas Monocapa: TPO (Poliolefina Termoplástica), PVC (Policloruro de Vinilo), EPDM (Membrana de Caucho).
  2. Sistemas Asfálticos y Bitumen: Chapapote Caliente (Hot Asphalt), Proceso Frío (Cold Process), Bitumen Modificado, Techos Construidos (BUR).
  3. Servicios Especializados: Remoción Completa y Re-Techado (Tear-off & Re-roof), Impermeabilización y Recubrimientos Líquidos, Reparación de Fugas de Emergencia, Subcontratación Comercial.
- Seguridad y Seguros: Totalmente asegurados. Certificado de Seguro (COI) nombrando al contratista general o dueño del inmueble como asegurado adicional entregado al solicitar propuesta.
- Facebook Oficial: https://www.facebook.com/profile.php?id=100091633328010

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE utilizando los datos anteriores. Si preguntan por precios exactos por pie cuadrado, números de licencia o años exactos de garantía, explica con cortesía que el equipo de estimación confirmará esos detalles en la propuesta y solicita sus datos o brinda el teléfono directo: (956) 650-8277.
2. NUNCA inventes precios ni certificaciones.
3. Solicita un dato a la vez: Nombre Completo -> Teléfono -> Ciudad/Ubicación -> Servicio Requerido -> Detalles del Proyecto.
4. Si el visitante desea hablar directamente con la dirección, proporciona el teléfono (956) 650-8277 y correo lucybella23@icloud.com.
5. NUNCA digas que eres humano. Preséntate como Lucy Support de Lucy Roofing LLC.
6. Responde SIEMPRE en Español fluido y profesional.`;

  let isChatOpen          = false;
  let conversationHistory = [];
  const leadData          = { name: '', phone: '', city: '', service: '' };

  let bubbleEl, windowEl, messagesEl, inputEl, sendBtnEl, formEl, nudgeEl, subTitleEl;

  function init() {
    buildDOM();
    attachListeners();
    observeLanguageChanges();

    // 30s Nudge Tooltip trigger
    setTimeout(function () {
      if (!isChatOpen && nudgeEl) {
        nudgeEl.classList.add('lucy-nudge-visible');
      }
    }, 30000);
  }

  function getLang() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function buildDOM() {
    const isEs = getLang() === 'es';

    // 1. Small Floating Bubble Button
    bubbleEl = document.createElement('button');
    bubbleEl.className   = 'lucy-chat-bubble';
    bubbleEl.setAttribute('aria-label', 'Open Lucy Support Chat');
    bubbleEl.innerHTML   = `
      <i class="fas fa-comment-dots lucy-chat-icon-fa"></i>
      <span class="lucy-bubble-label">${isEs ? 'Soporte Lucy' : 'Lucy Support'}</span>`;
    document.body.appendChild(bubbleEl);

    // 2. 30s Nudge Tooltip
    nudgeEl = document.createElement('div');
    nudgeEl.className = 'lucy-nudge';
    nudgeEl.innerHTML = `
      <span class="lucy-nudge-text">${isEs ? '¡Hola! ¿Necesita ayuda con algún proyecto de techado?' : 'Hi, need help with anything?'}</span>
      <button class="lucy-nudge-close" aria-label="Dismiss">&times;</button>`;
    
    nudgeEl.querySelector('.lucy-nudge-text').addEventListener('click', function () {
      nudgeEl.classList.remove('lucy-nudge-visible');
      toggle(true);
    });
    nudgeEl.querySelector('.lucy-nudge-close').addEventListener('click', function (e) {
      e.stopPropagation();
      nudgeEl.classList.remove('lucy-nudge-visible');
    });
    document.body.appendChild(nudgeEl);

    // 3. Main Chat Window
    windowEl = document.createElement('div');
    windowEl.className   = 'lucy-chat-window';
    windowEl.setAttribute('role', 'dialog');
    windowEl.setAttribute('aria-label', 'Lucy Support');
    windowEl.style.display = 'none';
    windowEl.innerHTML   = `
      <div class="lucy-chat-header">
        <div class="lucy-chat-header-info">
          <div class="lucy-chat-avatar">LS</div>
          <div class="lucy-chat-title">
            <h4>Lucy Support</h4>
            <span id="lucyChatSubTitle"><span class="lucy-chat-status-dot"></span> ${isEs ? 'Asistente de Techado Comercial' : 'Commercial Roofing Assistant'}</span>
          </div>
        </div>
        <button class="lucy-chat-close-win" aria-label="Close chat">&times;</button>
      </div>
      <div class="lucy-chat-messages" id="lucyChatMessages" aria-live="polite"></div>
      <div class="lucy-chat-input-wrapper">
        <form id="lucyChatForm" class="lucy-chat-input-form">
          <input id="lucyChatInput" type="text" class="lucy-chat-input"
            placeholder="${isEs ? 'Escriba a Soporte Lucy...' : 'Ask Lucy Support...'}" autocomplete="off" />
          <button id="lucyChatSend" type="submit" class="lucy-chat-send-btn" aria-label="Send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
        <div class="lucy-chat-privacy" id="lucyChatPrivacy">
          ${isEs ? 'Lucy Roofing LLC · Llame directamente al (956) 650-8277' : 'Powered by Lucy Roofing LLC · Call (956) 650-8277'}
        </div>
      </div>`;
    document.body.appendChild(windowEl);

    messagesEl  = windowEl.querySelector('#lucyChatMessages');
    inputEl     = windowEl.querySelector('#lucyChatInput');
    sendBtnEl   = windowEl.querySelector('#lucyChatSend');
    formEl      = windowEl.querySelector('#lucyChatForm');
    subTitleEl  = windowEl.querySelector('#lucyChatSubTitle');
  }

  function attachListeners() {
    bubbleEl.addEventListener('click', function () { toggle(true); });

    windowEl.querySelector('.lucy-chat-close-win').addEventListener('click', function () {
      toggle(false);
    });

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text) {
        inputEl.value = '';
        handleUser(text);
      }
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isChatOpen) toggle(false);
    });
  }

  function observeLanguageChanges() {
    const observer = new MutationObserver(function () {
      updateWidgetLanguage();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  function updateWidgetLanguage() {
    const isEs = getLang() === 'es';

    // 1. Update bubble & nudge text
    const labelEl = bubbleEl.querySelector('.lucy-bubble-label');
    if (labelEl) labelEl.textContent = isEs ? 'Soporte Lucy' : 'Lucy Support';

    if (nudgeEl) {
      const nudgeTxt = nudgeEl.querySelector('.lucy-nudge-text');
      if (nudgeTxt) nudgeTxt.textContent = isEs ? '¡Hola! ¿Necesita ayuda con algún proyecto de techado?' : 'Hi, need help with anything?';
    }

    // 2. Update placeholder & header in chat
    if (inputEl) inputEl.placeholder = isEs ? 'Escriba a Soporte Lucy...' : 'Ask Lucy Support...';
    if (subTitleEl) {
      subTitleEl.innerHTML = `<span class="lucy-chat-status-dot"></span> ${isEs ? 'Asistente de Techado Comercial' : 'Commercial Roofing Assistant'}`;
    }
    const privEl = windowEl.querySelector('#lucyChatPrivacy');
    if (privEl) {
      privEl.textContent = isEs ? 'Lucy Roofing LLC · Llame directamente al (956) 650-8277' : 'Powered by Lucy Roofing LLC · Call (956) 650-8277';
    }

    // 3. If chat has only greeting and no user response yet, update greeting
    if (conversationHistory.length === 1 && conversationHistory[0].role === 'assistant') {
      conversationHistory = [];
      if (messagesEl) messagesEl.innerHTML = '';
      sendGreeting();
    }
  }

  function sendGreeting() {
    const isEs = getLang() === 'es';
    const greeting = isEs
      ? '¡Hola! Soy Lucy Support, asistente de Lucy Roofing LLC en Texas. ¿En qué podemos ayudarle hoy con su proyecto comercial de techado?'
      : 'Hello! I am Lucy Support for Lucy Roofing LLC in Texas. How can I help you with your commercial roofing project today?';
    
    appendMsg(greeting, 'assistant');
    conversationHistory.push({ role: 'assistant', content: greeting });
  }

  function toggle(open) {
    isChatOpen = (open !== undefined) ? !!open : !isChatOpen;
    windowEl.style.display = isChatOpen ? 'flex' : 'none';
    bubbleEl.setAttribute('aria-expanded', String(isChatOpen));

    if (isChatOpen && nudgeEl) {
      nudgeEl.classList.remove('lucy-nudge-visible');
    }

    if (isChatOpen && conversationHistory.length === 0) {
      sendGreeting();
    }

    if (isChatOpen) {
      setTimeout(function () { inputEl && inputEl.focus(); }, 150);
    }
  }

  function handleUser(text) {
    appendMsg(text, 'user');
    conversationHistory.push({ role: 'user', content: text });
    extractLead(text);
    setLoading(true);

    const isEs = getLang() === 'es';
    const systemPrompt = isEs ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-14)
    ];

    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages,
        lang: isEs ? 'es' : 'en'
      })
    })
    .then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) { throw new Error(res.status + ': ' + t); });
      }
      return res.json();
    })
    .then(function (data) {
      const reply = data.reply || fallbackText();
      appendMsg(reply, 'assistant');
      conversationHistory.push({ role: 'assistant', content: reply });
      trySubmitLead();
    })
    .catch(function (err) {
      console.warn('[LucySupport] API error:', err);
      appendFallback();
    })
    .finally(function () {
      setLoading(false);
    });
  }

  function appendMsg(text, role) {
    if (!messagesEl) return;
    const div       = document.createElement('div');
    div.className   = 'lucy-msg-bubble lucy-msg-' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendFallback() {
    if (!messagesEl) return;
    const isEs  = getLang() === 'es';
    const div   = document.createElement('div');
    div.className = 'lucy-msg-bubble lucy-msg-assistant';
    div.innerHTML = (isEs
      ? 'Estamos teniendo dificultades de conexión. Puede contactarnos directamente:'
      : 'I\'m having trouble connecting. Reach us directly:') +
      '<div class="lucy-chat-fallback-actions">' +
        '<a href="tel:+19566508277" class="lucy-chat-fallback-btn"><i class="fas fa-phone-alt"></i> ' + (isEs ? 'Llamar al (956) 650-8277' : 'Call (956) 650-8277') + '</a>' +
        '<a href="sms:+19566508277" class="lucy-chat-fallback-btn"><i class="fas fa-comment-alt"></i> ' + (isEs ? 'Enviar Mensaje de Texto' : 'Text Us') + '</a>' +
        '<a href="#contact" class="lucy-chat-fallback-btn" onclick="window.__LucySupport.toggle(false)"><i class="fas fa-file-alt"></i> ' + (isEs ? 'Formulario de Cotización' : 'Free Estimate Form') + '</a>' +
      '</div>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function fallbackText() {
    const isEs = getLang() === 'es';
    return isEs
      ? 'Para asistencia inmediata con su techo comercial, llame al (956) 650-8277 o escriba a lucybella23@icloud.com.'
      : 'For immediate commercial roofing assistance, call (956) 650-8277 or email lucybella23@icloud.com.';
  }

  function setLoading(on) {
    if (inputEl)  inputEl.disabled   = on;
    if (sendBtnEl) sendBtnEl.disabled = on;
    const dots = messagesEl && messagesEl.querySelector('.lucy-typing');
    if (on && !dots && messagesEl) {
      const d = document.createElement('div');
      d.className = 'lucy-msg-bubble lucy-msg-assistant lucy-typing';
      d.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(d);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    } else if (!on && dots) {
      dots.remove();
    }
    if (!on && inputEl) inputEl.focus();
  }

  function extractLead(text) {
    const phone = text.match(/(\+?1[\-.\s]?)?\(?\d{3}\)?[\-.\s]?\d{3}[\-.\s]?\d{4}/);
    if (phone && !leadData.phone) leadData.phone = phone[0];
    if (!leadData.name && /my name is |me llamo |mi nombre es /i.test(text)) {
      leadData.name = text.split(/my name is |me llamo |mi nombre es /i)[1].split(/[.,]/)[0].trim();
    }
    const cities = {
      mcallen:'McAllen, TX', houston:'Houston, TX', austin:'Austin, TX',
      'san antonio':'San Antonio, TX', dallas:'Dallas, TX', laredo:'Laredo, TX', 'corpus christi':'Corpus Christi, TX'
    };
    if (!leadData.city) {
      const lower = text.toLowerCase();
      for (const k in cities) {
        if (lower.indexOf(k) !== -1) { leadData.city = cities[k]; break; }
      }
    }
  }

  function trySubmitLead() {
    if (!leadData.phone || leadData.submitted || !leadData.name) return;
    leadData.submitted = true;
    const endpoint = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formEndpoint)
      ? SITE_CONFIG.formEndpoint : 'https://formspree.io/f/YOUR_FORMSPREE_ID';
    const body = new FormData();
    body.append('name', leadData.name || 'Chat Lead');
    body.append('phone', leadData.phone);
    body.append('address', leadData.city || 'Texas');
    body.append('service', leadData.service || 'Commercial Inquiry (Lucy Support)');
    body.append('message', 'Lead captured via Lucy Support chat.');
    fetch(endpoint, { method: 'POST', body: body, headers: { Accept: 'application/json' } }).catch(function(){});
  }

  window.__LucySupport = {
    toggle: toggle,
    updateLanguage: updateWidgetLanguage
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
