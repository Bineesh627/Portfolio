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
        only a few safe constructs (links, bold, bullet lists).
     =================================================================== */
  var Format = (function () {
    function esc(t) {
      return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function inline(t) {
      t = esc(t);
      t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      t = t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      return t;
    }
    function render(text) {
      var out = [], list = false;
      String(text).replace(/\r/g, '').split('\n').forEach(function (line) {
        var m = line.match(/^\s*(?:[-*\u2022]|\d+[.)])\s+(.*)$/);
        if (m) {
          if (!list) { out.push('<ul>'); list = true; }
          out.push('<li>' + inline(m[1]) + '</li>');
          return;
        }
        if (list) { out.push('</ul>'); list = false; }
        if (line.trim()) out.push('<p>' + inline(line.trim()) + '</p>');
      });
      if (list) out.push('</ul>');
      return out.join('');
    }
    return { render: render };
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
        body: JSON.stringify({ prompt: prompt, history: recent }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
          var text = (data.response || data.reply || '').toString().trim();
          if (!text) throw new Error('Empty response');
          return text;
        });
      }).then(function (text) { clearTimeout(t); return text; },
              function (err) { clearTimeout(t); throw err; });
    }

    function send(raw) {
      var text = (raw || '').trim();
      if (!text || busy) return;
      text = text.slice(0, CFG.maxInputChars || 500);

      if (chips) { chips.remove(); chips = null; }
      View.els.input.value = '';
      View.addMessage('user', text);
      setBusy(true);
      typingRow = View.showTyping();
      var myRun = runId;

      ask(text).then(function (reply) {
        if (myRun !== runId) return;
        history.push({ role: 'user', content: text }, { role: 'assistant', content: reply });
        View.removeTyping(typingRow); typingRow = null;
        View.addMessage('assistant', reply).classList.add('cw-enter');
      }).catch(function (err) {
        if (myRun !== runId) return;
        if (window.console) console.error('Chat error:', err);
        View.removeTyping(typingRow); typingRow = null;
        var msg = (err && err.name === 'AbortError')
          ? 'That took too long. Please try again.'
          : 'Sorry, I could not reach the AI right now. Please try again in a moment, or use the <a href="/contact">contact page</a>.';
        View.addMessage('assistant', msg, { error: true, html: true });
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
      View.addMessage('assistant', CFG.welcome || 'Hi! Ask me anything about Bineesh.', { html: false }).classList.add('cw-enter');
      if (CFG.suggestions && CFG.suggestions.length) chips = View.showChips(CFG.suggestions, send);
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
