(function () {
  'use strict';

  var THEME_KEY = 'notes:theme';

  var input = document.getElementById('q');
  var form = document.getElementById('search-form');
  var countEl = document.getElementById('count');
  var clearBtn = document.getElementById('clear');
  var bulkBtn = document.getElementById('bulk');
  var emptyEl = document.getElementById('empty');
  var emptyTitle = document.getElementById('empty-title');
  var emptyClear = document.getElementById('empty-clear');
  var topicsEl = document.getElementById('topics');
  var railEl = document.getElementById('rail');
  var themeBtn = document.getElementById('theme-toggle');
  var feedbackDialog = document.getElementById('feedbackPopup');
  var feedbackForm = document.getElementById('feedbackForm');
  var feedbackMessage = document.getElementById('formMessage');
  var feedbackOpen = document.getElementById('feedback-open');
  var feedbackClose = document.getElementById('feedback-close');
  var feedbackSubmit = document.getElementById('feedback-submit');
  var messageField = document.getElementById('fb-message');
  var messageCount = document.getElementById('fb-message-count');
  var feedbackCloseTimer = null;
  var MESSAGE_WORD_LIMIT = 50;
  var sending = false;

  var topics = Array.prototype.map.call(topicsEl.querySelectorAll('.topic'), function (el, i) {
    return {
      el: el,
      id: el.dataset.topic,
      order: i,
      countEl: el.querySelector('.topic-count'),
      listEl: el.querySelector('.rows'),
      best: 0,
      shown: 0,
      rows: Array.prototype.map.call(el.querySelectorAll('.rows > li'), function (li, j) {
        var a = li.querySelector('a');
        return {
          li: li,
          a: a,
          keys: li.dataset.keys || '',
          title: li.querySelector('.row-title').textContent.trim().toLowerCase(),
          order: j,
          score: 0
        };
      })
    };
  });

  var byTopic = {};
  topics.forEach(function (t) { byTopic[t.id] = t; });

  var railLinks = Array.prototype.slice.call(railEl.querySelectorAll('.rail-link'));
  var manual = Object.create(null);
  var allExpanded = false;
  var urlTimer = null;
  var topic = null;

  function score(row, tokens) {
    var s = 0;
    for (var i = 0; i < tokens.length; i++) {
      var tok = tokens[i];
      if (row.keys.indexOf(tok) === -1) return -1;
      if (row.title === tok) s += 100;
      else if (row.title.indexOf(tok) === 0) s += 60;
      else if (row.title.indexOf(tok) > -1) s += 40;
      else s += 12;
    }
    return s;
  }

  function reorder(parent, nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (parent.children[i] !== nodes[i]) {
        nodes.forEach(function (n) { parent.appendChild(n); });
        return;
      }
    }
  }

  function apply() {
    var query = input.value.trim().toLowerCase();
    var tokens = query
      ? query.replace(/[^a-z0-9+&.]+/g, ' ').trim().split(/\s+/).filter(Boolean)
      : [];
    var forced = Boolean(query || topic);
    var total = 0;
    var withResults = 0;

    topics.forEach(function (t) {
      var matched = 0;
      var best = -1;

      t.rows.forEach(function (r) {
        r.score = tokens.length ? score(r, tokens) : 0;
        var hit = r.score >= 0;
        if (hit) { matched++; if (r.score > best) best = r.score; }
        r.li.hidden = !hit || (topic && topic !== t.id);
      });

      t.matched = matched;
      t.shown = (topic && topic !== t.id) ? 0 : matched;
      t.best = best;
      t.el.hidden = t.shown === 0;
      t.countEl.textContent = String(t.shown);
      total += t.shown;
      if (t.shown > 0) withResults++;

      var ordered = tokens.length
        ? t.rows.slice().sort(function (a, b) { return b.score - a.score || a.title.localeCompare(b.title); })
        : t.rows;
      reorder(t.listEl, ordered.map(function (r) { return r.li; }));
    });

    var order = topics.slice().sort(function (a, b) {
      return tokens.length ? (b.best - a.best || a.order - b.order) : a.order - b.order;
    });
    reorder(topicsEl, order.map(function (t) { return t.el; }));

    topics.forEach(function (t) {
      var wanted = forced ? t.shown > 0 : false;
      t.el.open = (t.id in manual) ? manual[t.id] : wanted;
    });

    countEl.textContent = query
      ? (total === 0
        ? 'No matches'
        : (total === 1 ? '1 match' : total + ' matches') + ' in ' + (withResults === 1 ? '1 topic' : withResults + ' topics'))
      : (topic
        ? total + (total === 1 ? ' document' : ' documents') + ' in this topic'
        : total + ' documents across ' + withResults + ' topics');

    emptyEl.hidden = total > 0;
    emptyTitle.textContent = 'Nothing matches “' + input.value.trim() + '”';

    clearBtn.hidden = !forced;
    allExpanded = topics.every(function (t) { return t.shown === 0 || t.el.open; });
    bulkBtn.hidden = forced || withResults < 2;
    bulkBtn.textContent = allExpanded ? 'Collapse all' : 'Expand all';

    railLinks.forEach(function (link) {
      var t = byTopic[link.dataset.topic];
      var n = t ? t.matched : 0;
      var on = topic === link.dataset.topic;
      link.querySelector('.rail-count').textContent = String(n);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
      if (n === 0 && !on) link.setAttribute('aria-disabled', 'true');
      else link.removeAttribute('aria-disabled');
    });

    syncUrl(query);
  }

  function syncUrl(query) {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(function () {
      try {
        var url = new URL(location.href);
        url.search = '';
        if (query) url.searchParams.set('q', input.value.trim());
        if (topic) url.searchParams.set('topic', topic);
        history.replaceState(null, '', url.toString());
      } catch (e) {}
    }, 350);
  }

  function focusableRows() {
    return Array.prototype.filter.call(topicsEl.querySelectorAll('a[data-row]'), function (a) {
      var li = a.closest('li');
      var d = a.closest('details');
      return li && !li.hidden && d && d.open && !d.hidden;
    });
  }

  function moveFocus(e, from, delta) {
    var rows = focusableRows();
    var next = rows[rows.indexOf(from) + delta];
    if (next) { e.preventDefault(); next.focus(); }
  }

  function currentTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function paintTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    themeBtn.setAttribute('aria-label', label);
    themeBtn.title = label;
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); });
  input.addEventListener('input', apply);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); input.value = ''; apply(); }
    else if (e.key === 'ArrowDown' || e.key === 'Enter') {
      var first = focusableRows()[0];
      if (first) { e.preventDefault(); first.focus(); }
    }
  });

  railEl.addEventListener('click', function (e) {
    var link = e.target.closest('.rail-link');
    if (!link) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var t = byTopic[link.dataset.topic];
    if (t && t.matched === 0 && topic !== t.id) return;
    topic = topic === link.dataset.topic ? null : link.dataset.topic;
    apply();
  });

  topicsEl.addEventListener('click', function (e) {
    var head = e.target.closest('.topic-head');
    if (!head) return;
    var d = head.closest('details');
    if (!d || !d.dataset.topic) return;
    manual[d.dataset.topic] = !d.open;
  });

  topicsEl.addEventListener('toggle', function () {
    allExpanded = topics.every(function (t) { return t.shown === 0 || t.el.open; });
    bulkBtn.textContent = allExpanded ? 'Collapse all' : 'Expand all';
  }, true);

  topicsEl.addEventListener('keydown', function (e) {
    var a = e.target.closest('a[data-row]');
    if (!a) return;
    if (e.key === 'ArrowDown') moveFocus(e, a, 1);
    else if (e.key === 'ArrowUp') moveFocus(e, a, -1);
  });

  bulkBtn.addEventListener('click', function () {
    var open = !allExpanded;
    topics.forEach(function (t) {
      if (t.shown === 0) return;
      t.el.open = open;
      manual[t.id] = open;
    });
    allExpanded = open;
    bulkBtn.textContent = open ? 'Collapse all' : 'Expand all';
  });

  function clearAll() {
    input.value = '';
    topic = null;
    manual = Object.create(null);
    apply();
  }

  clearBtn.addEventListener('click', clearAll);
  emptyClear.addEventListener('click', clearAll);

  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    paintTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });

  function countWords(text) {
    return (text.match(/\S+/g) || []).length;
  }

  function updateWordCount() {
    var n = countWords(messageField.value);
    messageCount.textContent = n >= MESSAGE_WORD_LIMIT
      ? MESSAGE_WORD_LIMIT + ' of ' + MESSAGE_WORD_LIMIT + ' words, limit reached'
      : n + ' of ' + MESSAGE_WORD_LIMIT + ' words';
    messageCount.toggleAttribute('data-state', n >= MESSAGE_WORD_LIMIT);
  }

  function setFeedbackMessage(text, state) {
    feedbackMessage.textContent = text;
    if (state) feedbackMessage.setAttribute('data-state', state);
    else feedbackMessage.removeAttribute('data-state');
  }

  function toggleFeedbackForm() {
    if (feedbackDialog.open) return feedbackDialog.close();
    if (!sending) setFeedbackMessage('', null);
    updateWordCount();
    feedbackDialog.showModal();
  }

  function sendFeedback(params) {
    var cfg = feedbackForm.dataset;
    return fetch(cfg.endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: cfg.service,
        template_id: cfg.template,
        user_id: cfg.key,
        template_params: params
      })
    }).then(function (res) {
      if (res.ok) return;
      return res.text().then(function (body) {
        var err = new Error('status ' + res.status);
        err.detail = body;
        throw err;
      });
    });
  }

  messageField.addEventListener('beforeinput', function (e) {
    var added = e.data != null ? e.data : (e.dataTransfer ? e.dataTransfer.getData('text') : '');
    if (!added) return;
    var el = messageField;
    var next = el.value.slice(0, el.selectionStart) + added + el.value.slice(el.selectionEnd);
    if (countWords(next) > MESSAGE_WORD_LIMIT) e.preventDefault();
  });

  messageField.addEventListener('input', updateWordCount);

  window.toggleFeedbackForm = toggleFeedbackForm;

  feedbackOpen.addEventListener('click', toggleFeedbackForm);
  feedbackClose.addEventListener('click', toggleFeedbackForm);

  feedbackDialog.addEventListener('click', function (e) {
    if (e.target === feedbackDialog) toggleFeedbackForm();
  });

  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    if (!feedbackForm.checkValidity()) {
      feedbackForm.reportValidity();
      return;
    }
    sending = true;
    feedbackSubmit.disabled = true;
    setFeedbackMessage('Sending…', null);

    sendFeedback({
      name: document.getElementById('fb-name').value,
      email: document.getElementById('fb-email').value,
      message: messageField.value,
      submission_date: new Date().toLocaleString()
    })
      .then(function () {
        setFeedbackMessage('Feedback sent.', 'ok');
        feedbackForm.reset();
        updateWordCount();
        feedbackCloseTimer = setTimeout(function () {
          if (feedbackDialog.open) feedbackDialog.close();
        }, 2000);
      })
      .catch(function (err) {
        console.error('feedback send failed', err, err.detail || '');
        var timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
        var reason = err.detail && err.detail.length < 160 && err.detail.indexOf('<') === -1
          ? ' (' + err.detail.trim() + ')'
          : '';
        setFeedbackMessage(timedOut
          ? 'That took too long to send. Try again.'
          : 'Could not send feedback. Try again in a minute.' + reason, 'error');
      })
      .then(function () {
        sending = false;
        feedbackSubmit.disabled = false;
      });
  });

  feedbackDialog.addEventListener('close', function () {
    clearTimeout(feedbackCloseTimer);
    if (!sending) feedbackSubmit.disabled = false;
  });

  paintTheme(currentTheme());
  themeBtn.hidden = false;

  try {
    var p = new URLSearchParams(location.search);
    var q0 = p.get('q');
    var t0 = p.get('topic');
    if (q0) input.value = q0;
    if (t0 && byTopic[t0]) topic = t0;
  } catch (e) {}

  apply();
}());
