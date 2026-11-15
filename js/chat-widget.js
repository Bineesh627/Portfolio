/* =====================================================================
   chat-widget.js — live AI chat widget.

   Sends the visitor's message to a Cloudflare Worker (Workers AI) with
   fetch() and renders the reply. Config lives in data/chatbot.js, styles
   in css/chat-widget.css, worker source in /worker.

   Modules (all inside one IIFE, nothing leaks to window):
     1. Format     — safe text -> HTML (escapes everything, then links/bold/lists)
     2. View       — builds the DOM and renders bubbles / typing dots
     3. Controller — conversation state, network calls, open / close
   ===================================================================== */
(function () {
  'use strict';

  var CFG = window.SITE_DATA && window.SITE_DATA.chatbotData;
  if (!CFG || !CFG.workerUrl) return;           // not configured -> do nothing

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================================================================
     1. FORMAT — model output is untrusted: escape first, then re-add
        only a few safe constructs. Every link in a reply (website, social
        profile, e-mail, phone, site page) is pulled out of the text and
        shown as a tappable BUTTON with an icon under the message.
     =================================================================== */
  var Format = (function () {
    var S = window.Site || {};
    var MAX_BUTTONS = 6;
    var PAGE = '\\/(?:projects?|blogs?|certifications|contact)(?:\\?slug=[a-z0-9-]+)?';

    /* known sites -> label, colour and icon (brand icons come from Site.brand) */
    var SITES = [
      { re: /(^|\.)linkedin\.com$/i,         key: 'linkedin',    label: 'LinkedIn' },
      { re: /(^|\.)github\.com$/i,           key: 'github',      label: 'GitHub', icon: 'github' },
      { re: /(^|\.)instagram\.com$/i,        key: 'instagram',   label: 'Instagram' },
      { re: /(^|\.)(twitter|x)\.com$/i,      key: 'twitter',     label: 'X (Twitter)', icon: 'twitter' },
      { re: /(^|\.)huggingface\.co$/i,       key: 'huggingface', label: 'Hugging Face' },
      { re: /^wa\.me$|(^|\.)whatsapp\.com$/i, key: 'whatsapp',   label: 'WhatsApp' },
      { re: /(^|\.)facebook\.com$/i,         key: 'facebook',    label: 'Facebook' },
      { re: /(^|\.)(youtube\.com|youtu\.be)$/i, key: 'youtube',  label: 'YouTube' }
    ];
    var PAGES = {
      '/projects':       { label: 'All projects',   icon: 'folder-open' },
      '/blogs':          { label: 'Blog',           icon: 'book-open' },
      '/blog':           { label: 'Read article',   icon: 'book-open' },
      '/certifications': { label: 'Certifications', icon: 'award' },
      '/contact':        { label: 'Contact page',   icon: 'message-circle' }
    };
    var GENERIC = { mail: { label: 'Email', icon: 'mail' }, phone: { label: 'Call', icon: 'phone' }, web: { label: 'Website', icon: 'globe' }, page: { icon: 'arrow-up-right' } };

    function esc(t) {
      return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function icon(key, iconName) {
      var size = 16;
      if (S.brand && S.brand[key]) return S.brand[key](size);
      return S.ic ? S.ic(iconName || GENERIC.web.icon, size) : '';
    }
    function shortTitle(t) { return String(t).split(/\s[—–-]\s/)[0]; }
    function goodLabel(l) { return l && l.length <= 24 && !/https?:|www\./i.test(l); }

    /* turn a url (+ optional label) into a button description, or null if not allowed */
    function classify(url, label) {
      url = String(url).trim();
      var own = url.match(/^https?:\/\/(?:www\.)?bineeshs\.vercel\.app(\/.*)?$/i);
      if (own) url = own[1] || '/';

      if (url.charAt(0) === '/') {                                   // a page of this site
        var m = url.match(/^(\/[a-z]+)(\?slug=([a-z0-9-]+))?$/i);
        if (!m) return null;
        var base = m[1].toLowerCase(), p = PAGES[base];
        if (base === '/project' && m[3]) {
          var pr = ((S.data && S.data.projectsData) || []).filter(function (x) { return x.slug === m[3]; })[0];
          return { url: url, key: 'page', icon: 'arrow-up-right', internal: true, label: pr ? 'Case study: ' + shortTitle(pr.title) : 'View case study' };
        }
        if (base === '/blog' && m[3]) {
          var bl = ((S.data && S.data.blogsData) || []).filter(function (x) { return x.slug === m[3]; })[0];
          return { url: url, key: 'page', icon: 'book-open', internal: true, label: bl ? 'Read: ' + (function (t) { return t.length > 34 ? t.slice(0, 33).replace(/\s+\S*$/, '') + '\u2026' : t; })(shortTitle(bl.title).replace(/<[^>]+>/g, '').split(':')[0]) : 'Read article' };
        }
        if (!p) return null;
        return { url: url, key: 'page', icon: p.icon, internal: true, label: p.label };
      }
      if (/^mailto:/i.test(url)) return { url: url, key: 'mail', icon: 'mail', label: 'Email', title: url.slice(7) };
      if (/^tel:/i.test(url))    return { url: url, key: 'phone', icon: 'phone', label: label || 'Call' };
      if (!/^https?:\/\//i.test(url)) return null;                  // blocks javascript:, data:, etc.

      var host;
      try { host = new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return null; }
      for (var i = 0; i < SITES.length; i++) {
        if (SITES[i].re.test(host)) {
          return { url: url, key: SITES[i].key, icon: SITES[i].icon, label: goodLabel(label) ? label : SITES[i].label };
        }
      }
      return { url: url, key: 'web', icon: 'globe', label: goodLabel(label) ? label : host };
    }

    function button(l) {
      return '<a class="cw-btn cw-btn-' + l.key + '" href="' + esc(l.url) + '"' +
        (l.internal ? '' : ' target="_blank" rel="noopener noreferrer"') +
        (l.title ? ' title="' + esc(l.title) + '"' : '') + '>' +
        '<span class="cw-btn-ic">' + icon(l.key, l.icon) + '</span><span class="cw-btn-tx">' + esc(l.label) + '</span></a>';
    }

    /* a row of buttons for a list of urls (used for the welcome message) */
    function row(items) {
      var html = (items || []).map(function (it) {
        var l = classify(it.url, it.label); return l ? button(l) : '';
      }).join('');
      return html ? '<div class="cw-links">' + html + '</div>' : '';
    }

    var BARE = /^[\s\-*•\d.)]*(?:linkedin|github|instagram|twitter|x|whatsapp|hugging ?face|facebook|youtube|website|web ?site|portfolio|e-?mail|mail|phone|contact|link|links|socials?|profiles?)?[\s:,\-–—]*$/i;

    function inline(t) { return esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); }

    function render(text) {
      var links = [], seen = {};
      function add(url, label) {
        var l = classify(url, label);
        if (!l || seen[l.url]) return;
        seen[l.url] = 1;
        if (links.length < MAX_BUTTONS) links.push(l);
      }

      var lines = [];
      String(text).replace(/\r/g, '').split('\n').forEach(function (line) {
        var before = line;
        line = line.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {            // [label](url)
          add(url, label);
          if (/^(?:https?:\/\/(?:www\.)?bineeshs\.vercel\.app)?\/(?:project|blog|blogs|projects|certifications|contact)\b/i.test(url)) return '';   // the button says it
          return /^(?:linkedin|github|instagram|twitter|x|whatsapp|hugging ?face|facebook|youtube|web ?site|portfolio|e-?mail|link|here|contact( page)?|case study|[\w.-]+\.(?:com|in|co|app|dev|ai|org))$/i.test(label.trim()) ? '' : label;
        });
        line = line.replace(/(?:mailto:)?([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, function (m, mail) { add('mailto:' + mail); return ''; });
        line = line.replace(/https?:\/\/[^\s<>()]+[^\s<>().,;:!?]/g, function (u) { add(u); return ''; });
        line = line.replace(new RegExp('(^|[\\s(])(' + PAGE + ')(?=[\\s).,;:!?]|$)', 'g'), function (m, pre, path) { add(path); return pre; });
        line = line.replace(/\+\d[\d\s-]{8,}\d/g, function (num) { add('tel:' + num.replace(/[^\d+]/g, ''), 'Call ' + num.trim()); return num; });

        if (line !== before) {                                                                  // tidy what the removed links left behind
          line = line.replace(/\(\s*\)/g, '').replace(/\s+([,.;:!?])/g, '$1').replace(/\s{2,}/g, ' ')
                     .replace(/(?:\s+(?:at|on|via|from|here|is|are|and|or))*[\s:,\-–—]*$/i, '').trimEnd();
          if (BARE.test(line)) return;
        }
        lines.push(line);
      });

      var out = [], list = false;
      lines.forEach(function (line) {
        var m = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
        if (m) {
          if (!list) { out.push('<ul>'); list = true; }
          out.push('<li>' + inline(m[1]) + '</li>');
          return;
        }
        if (list) { out.push('</ul>'); list = false; }
        if (line.trim()) out.push('<p>' + inline(line.trim()) + '</p>');
      });
      if (list) out.push('</ul>');
      if (links.length) out.push('<div class="cw-links">' + links.map(button).join('') + '</div>');
      return out.join('');
    }
    /* the closing call-to-action: only a real wa.me link is accepted */
    function whatsapp(url) {
      if (!/^https:\/\/wa\.me\/\d{8,15}(\?[^\s"'<>]*)?$/i.test(String(url || ''))) return '';
      return '<a class="cw-wa" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="cw-wa-ic">' + icon('whatsapp', 'message-circle').replace(/width="\d+"/, 'width="22"').replace(/height="\d+"/, 'height="22"') + '</span>' +
        '<span class="cw-wa-tx"><strong>Continue on WhatsApp</strong><small>Chat with Bineesh directly</small></span>' +
        '<span class="cw-wa-go" aria-hidden="true">&rarr;</span></a>';
    }
    return { render: render, row: row, whatsapp: whatsapp };
  })();

  /* ===================================================================
     2. VIEW — DOM creation and rendering
     =================================================================== */
  var View = (function () {
    var els = {};
    var AVATAR_SVG =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z"/><path d="M12 8.2l3.4 1.95v3.9L12 16l-3.4-1.95v-3.9z" fill="currentColor" stroke="none" opacity=".9"/></svg>';

    function el(tag, className, attrs) {
      var n = document.createElement(tag);
      if (className) n.className = className;
      if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
      return n;
    }

    function build() {
      /* launcher (floating button) */
      els.launcher = el('button', 'cw-launcher', { type: 'button', 'aria-label': 'Open chat assistant', 'aria-expanded': 'false', 'aria-controls': 'cw-panel' });
      els.launcher.innerHTML =
        '<span class="cw-launcher-icon cw-icon-chat"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12z"/></svg></span>' +
        '<span class="cw-launcher-icon cw-icon-close"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></span>';

      /* panel */
      els.panel = el('section', 'cw-panel', { id: 'cw-panel', role: 'dialog', 'aria-label': CFG.botName, hidden: '' });

      var header = el('header', 'cw-header');
      header.innerHTML =
        '<span class="cw-avatar" aria-hidden="true">' + AVATAR_SVG + '</span>' +
        '<div class="cw-title"><strong>' + CFG.botName + '</strong>' +
        '<span class="cw-status"><i class="cw-dot" aria-hidden="true"></i>' + CFG.statusLabel + '</span></div>';
      els.close = el('button', 'cw-iconbtn', { type: 'button', 'aria-label': 'Close chat' });
      els.close.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
      header.appendChild(els.close);

      els.log = el('div', 'cw-log', { role: 'log', 'aria-live': 'polite', 'aria-label': 'Chat messages' });

      /* footer: actions + disabled input + disclaimer */
      var footer = el('footer', 'cw-footer');
      var bar = el('div', 'cw-bar');
      els.newChat = el('button', 'cw-newchat', { type: 'button', title: 'Clear the conversation and start over' });
      els.newChat.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/></svg><span>New Chat</span>';
      var input = el('input', 'cw-input', { type: 'text', placeholder: CFG.inputPlaceholder, maxlength: String(CFG.maxInputChars || 500), autocomplete: 'off', 'aria-label': 'Message to the assistant' });
      var send = el('button', 'cw-send', { type: 'button', 'aria-label': 'Send message' });
      els.input = input; els.send = send;
      send.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      bar.appendChild(els.newChat); bar.appendChild(input); bar.appendChild(send);
      var note = el('p', 'cw-disclaimer'); note.textContent = CFG.disclaimer;
      footer.appendChild(bar); footer.appendChild(note);

      els.panel.appendChild(header); els.panel.appendChild(els.log); els.panel.appendChild(footer);
      document.body.appendChild(els.panel);
      document.body.appendChild(els.launcher);
      return els;
    }

    function scrollToBottom() {
      els.log.scrollTo({ top: els.log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    /* adds a chat bubble. Assistant text is always sanitised via Format */
    function addMessage(role, content, opts) {
      var row = el('div', 'cw-row cw-' + role);
      if (role === 'assistant') row.innerHTML = '<span class="cw-mini" aria-hidden="true">' + AVATAR_SVG + '</span>';
      var bubble = el('div', 'cw-bubble');
      if (opts && opts.error) bubble.classList.add('cw-error');
      if (role === 'assistant') bubble.innerHTML = (opts && opts.html) ? content : Format.render(content); else bubble.textContent = content;
      if (opts && opts.extra) bubble.insertAdjacentHTML('beforeend', opts.extra);
      row.appendChild(bubble);
      els.log.appendChild(row);
      scrollToBottom();
      return row;
    }

    function showTyping() {
      var row = el('div', 'cw-row cw-assistant cw-typing-row');
      row.innerHTML = '<span class="cw-mini" aria-hidden="true">' + AVATAR_SVG + '</span>' +
        '<div class="cw-bubble cw-typing" role="status" aria-label="Assistant is thinking"><i></i><i></i><i></i></div>';
      els.log.appendChild(row);
      els.log.setAttribute('aria-busy', 'true');
      scrollToBottom();
      return row;
    }

    function removeTyping(row) {
      if (row && row.parentNode) row.parentNode.removeChild(row);
      els.log.setAttribute('aria-busy', 'false');
    }

    function showChips(labels, onPick) {
      var wrap = el('div', 'cw-chips', { role: 'group', 'aria-label': 'Suggested questions' });
      labels.forEach(function (label) {
        var b = el('button', 'cw-chip', { type: 'button' });
        b.textContent = label;
        b.addEventListener('click', function () { onPick(label); });
        wrap.appendChild(b);
      });
      els.log.appendChild(wrap);
      scrollToBottom();
      return wrap;
    }

    function clear() { els.log.innerHTML = ''; els.log.setAttribute('aria-busy', 'false'); }

    return { build: build, addMessage: addMessage, showChips: showChips, showTyping: showTyping, removeTyping: removeTyping, clear: clear, els: els };
  })();

  /* ===================================================================
     3. CONTROLLER — conversation state + network
     =================================================================== */
  var Chat = (function () {
    var runId = 0;            // bumps on every reset so stale replies are ignored
    var history = [];         // [{ role: 'user'|'assistant', content }]
    var typingRow = null;
    var chips = null;
    var busy = false;
    var started = false;
    var isOpen = false;
    var asked = {};           // suggestion chips already used
    var waShown = false;      // the WhatsApp card is shown once per conversation

    function setBusy(v) {
      busy = v;
      View.els.input.disabled = v;
      View.els.send.disabled = v;
    }

    /* POST the prompt (+ recent history) to the worker, resolve to reply text */
    function ask(prompt) {
      var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var t = ctrl ? setTimeout(function () { ctrl.abort(); }, CFG.timeoutMs || 30000) : null;
      var recent = history.slice(-(CFG.historyTurns || 6));

      return fetch(CFG.workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt, messages: recent.concat([{ role: 'user', content: prompt }]) }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
          var text = (data.response || data.reply || '').toString().trim();
          if (!text) throw new Error('Empty response');
          return { text: text, whatsapp: typeof data.whatsapp === 'string' ? data.whatsapp : '' };
        });
      }).then(function (text) { clearTimeout(t); return text; },
              function (err) { clearTimeout(t); throw err; });
    }

    function send(raw) {
      var text = (raw || '').trim();
      if (!text || busy) return;
      text = text.slice(0, CFG.maxInputChars || 500);

      if (chips) { chips.remove(); chips = null; }
      asked[text] = true;
      View.els.input.value = '';
      View.addMessage('user', text);
      setBusy(true);
      typingRow = View.showTyping();
      var myRun = runId;

      ask(text).then(function (reply) {
        if (myRun !== runId) return;
        history.push({ role: 'user', content: text }, { role: 'assistant', content: reply.text });
        View.removeTyping(typingRow); typingRow = null;
        var wa = reply.whatsapp && !waShown ? Format.whatsapp(reply.whatsapp) : '';
        if (wa) waShown = true;
        View.addMessage('assistant', reply.text, { extra: wa }).classList.add('cw-enter');
        if (!wa) {
          var next = (CFG.suggestions || []).filter(function (q) { return !asked[q]; }).slice(0, 3);   // follow-up ideas
          if (next.length) chips = View.showChips(next, send);
        }
      }).catch(function (err) {
        if (myRun !== runId) return;
        if (window.console) console.error('Chat error:', err);
        View.removeTyping(typingRow); typingRow = null;
        var msg = (err && err.name === 'AbortError')
          ? 'That took too long. Please try again.'
          : 'Sorry, I could not reach the AI right now. Please try again in a moment, or use the <a href="/contact">contact page</a>.';
        var row = View.addMessage('assistant', msg, { error: true, html: true, extra: '<div class="cw-links"><button type="button" class="cw-btn cw-retry">Try again</button></div>' });
        row.querySelector('.cw-retry').addEventListener('click', function () { row.remove(); var u = View.els.log.querySelectorAll('.cw-user'); if (u.length) u[u.length - 1].remove(); send(text); });
      }).then(function () {
        if (myRun !== runId) return;
        setBusy(false);
        if (isOpen && !(mq && mq.matches)) View.els.input.focus({ preventScroll: true });
      });
    }

    /* fresh conversation: welcome bubble + suggestion chips */
    function start() {
      runId++;                                   // invalidate any in-flight request
      if (typingRow) { View.removeTyping(typingRow); typingRow = null; }
      history = [];
      started = true;
      View.clear();
      setBusy(false);
      View.addMessage('assistant', CFG.welcome || 'Hi! Ask me anything about Bineesh.', { extra: Format.row(CFG.quickLinks) }).classList.add('cw-enter');
      asked = {}; waShown = false;
      if (CFG.suggestions && CFG.suggestions.length) chips = View.showChips(CFG.suggestions.slice(0, 4), send);
    }

    /* keep the panel inside the visible viewport (shrinks when the keyboard opens) */
    var vv = window.visualViewport, mq = window.matchMedia ? window.matchMedia('(max-width: 600px)') : null;
    function fit() {
      var p = View.els.panel;
      if (!isOpen || !mq || !mq.matches || !vv) { p.style.removeProperty('--cw-top'); p.style.removeProperty('--cw-h'); return; }
      p.style.setProperty('--cw-top', vv.offsetTop + 'px');
      p.style.setProperty('--cw-h', vv.height + 'px');
      View.els.log.scrollTop = View.els.log.scrollHeight;
    }
    function lock(on) {
      if (mq && mq.matches) document.documentElement.classList.toggle('cw-lock', on);
    }

    function open() {
      isOpen = true;
      lock(true); fit();
      View.els.panel.hidden = false;
      requestAnimationFrame(function () { View.els.panel.classList.add('cw-open'); });
      View.els.launcher.classList.add('cw-active');
      View.els.launcher.setAttribute('aria-expanded', 'true');
      View.els.launcher.setAttribute('aria-label', 'Close chat assistant');
      if (!started) start();
      if (!(mq && mq.matches)) View.els.input.focus({ preventScroll: true });   // on phones, don't pop the keyboard up automatically
    }

    function close() {
      isOpen = false;
      lock(false); fit();
      View.els.panel.classList.remove('cw-open');
      View.els.launcher.classList.remove('cw-active');
      View.els.launcher.setAttribute('aria-expanded', 'false');
      View.els.launcher.setAttribute('aria-label', 'Open chat assistant');
      setTimeout(function () { if (!isOpen) View.els.panel.hidden = true; }, reduceMotion ? 0 : 220);
      View.els.launcher.focus({ preventScroll: true });
    }

    function init() {
      var e = View.build();
      e.launcher.addEventListener('click', function () { isOpen ? close() : open(); });
      e.close.addEventListener('click', close);
      e.log.addEventListener('click', function (ev) {                 // internal link inside a reply: the router opens it, we get out of the way on phones
        var a = ev.target.closest && ev.target.closest('a[href^="/"]');
        if (a && mq && mq.matches) close();
      });
      e.newChat.addEventListener('click', start);
      e.send.addEventListener('click', function () { send(e.input.value); });
      e.input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); send(e.input.value); }
      });
      document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && isOpen) close(); });
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
      window.addEventListener('orientationchange', function () { setTimeout(fit, 250); });
      e.input.addEventListener('focus', function () { setTimeout(fit, 300); });
    }

    return { init: init };
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Chat.init);
  else Chat.init();
})();
