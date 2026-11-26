/* HomeLedger boot: hash routing, the add-transaction modal, and wiring for
   the filters, budget inputs, goal forms and delete buttons each view renders. */

import {
  CATEGORIES,
  INCOME_CATEGORIES,
  addGoal,
  addToGoal,
  addTransaction,
  deleteTransaction,
  loadState,
  resetState,
  setBudget,
} from './store.js';
import { dashboardView, transactionsView, budgetsView, goalsView, insightsView } from './views.js';
import { monthLabel, todayIso } from './format.js';

let state = loadState();
let txFilter = { q: '', category: '', type: '' };

const viewEl = document.getElementById('view');
const monthSelect = document.getElementById('monthSelect');
const backdrop = document.getElementById('modalBackdrop');
const txForm = document.getElementById('txForm');
const formError = document.getElementById('formError');

function availableMonths() {
  const seen = new Set(state.transactions.map((t) => t.date.slice(0, 7)));
  seen.add(state.month);
  return [...seen].sort().reverse();
}

function fillMonthSelect() {
  monthSelect.innerHTML = availableMonths()
    .map((ym) => `<option value="${ym}" ${ym === state.month ? 'selected' : ''}>${monthLabel(ym)}</option>`)
    .join('');
}

function setActiveNav(route) {
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === route);
  });
}

function render() {
  fillMonthSelect();
  const hash = location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0] || 'dashboard';
  setActiveNav(route);
  if (route === 'transactions') viewEl.innerHTML = transactionsView(state, txFilter);
  else if (route === 'budgets') viewEl.innerHTML = budgetsView(state);
  else if (route === 'goals') viewEl.innerHTML = goalsView(state);
  else if (route === 'insights') viewEl.innerHTML = insightsView(state);
  else viewEl.innerHTML = dashboardView(state);
  window.scrollTo(0, 0);
}

function openModal() {
  const catSelect = document.getElementById('txCategory');
  const typeSelect = document.getElementById('txType');
  const fillCats = () =>
    (catSelect.innerHTML =
      typeSelect.value === 'income'
        ? INCOME_CATEGORIES.map((c) => `<option>${c}</option>`).join('')
        : CATEGORIES.map((c) => `<option>${c.name}</option>`).join(''));
  typeSelect.onchange = fillCats;
  fillCats();
  document.getElementById('txDate').value = todayIso();
  document.getElementById('txDesc').value = '';
  document.getElementById('txAmount').value = '';
  formError.hidden = true;
  backdrop.hidden = false;
  document.getElementById('txDesc').focus();
}

function closeModal() {
  backdrop.hidden = true;
}

txForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = Number(document.getElementById('txAmount').value);
  const description = document.getElementById('txDesc').value.trim();
  const date = document.getElementById('txDate').value;
  if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
    formError.textContent = 'Please fill in a description, a date and an amount over $0.';
    formError.hidden = false;
    return;
  }
  addTransaction(state, {
    type: document.getElementById('txType').value,
    date,
    description,
    category: document.getElementById('txCategory').value,
    amount: Math.round(amount * 100) / 100,
  });
  closeModal();
  location.hash = '#/transactions';
  render();
});

document.getElementById('addBtn').addEventListener('click', openModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

monthSelect.addEventListener('change', () => {
  state.month = monthSelect.value;
  render();
});

document.getElementById('resetDemo').addEventListener('click', () => {
  if (window.confirm('Reset HomeLedger to the original demo household? Your changes will be lost.')) {
    state = resetState();
    txFilter = { q: '', category: '', type: '' };
    render();
  }
});

/* Delegated wiring for the controls each view renders. */
viewEl.addEventListener('click', (e) => {
  const del = e.target.closest('[data-delete]');
  if (del) {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(state, del.dataset.delete);
      render();
    }
    return;
  }
  const opener = e.target.closest('[data-open-add]');
  if (opener) {
    openModal();
    return;
  }
  const goalBtn = e.target.closest('[data-goal-add]');
  if (goalBtn) {
    const input = viewEl.querySelector(`[data-goal-amount="${goalBtn.dataset.goalAdd}"]`);
    const amount = Number(input.value);
    if (Number.isFinite(amount) && amount > 0) {
      addToGoal(state, goalBtn.dataset.goalAdd, amount);
      render();
    } else {
      input.focus();
    }
  }
});

viewEl.addEventListener('change', (e) => {
  if (e.target.id === 'filterCategory') {
    txFilter.category = e.target.value;
    render();
    document.getElementById('filterCategory').focus();
  }
  if (e.target.id === 'filterType') {
    txFilter.type = e.target.value;
    render();
  }
  const budgetInput = e.target.closest('[data-budget]');
  if (budgetInput) {
    const amount = Number(budgetInput.value);
    if (Number.isFinite(amount) && amount >= 0) {
      setBudget(state, budgetInput.dataset.budget, amount);
      render();
    }
  }
});

viewEl.addEventListener('input', (e) => {
  if (e.target.id === 'filterQ') {
    txFilter.q = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const q = document.getElementById('filterQ');
    if (q) {
      q.focus();
      q.setSelectionRange(pos, pos);
    }
  }
});

viewEl.addEventListener('submit', (e) => {
  if (e.target.id === 'goalForm') {
    e.preventDefault();
    const data = new FormData(e.target);
    addGoal(state, {
      name: String(data.get('name')).trim(),
      note: String(data.get('note')).trim() || 'A new goal for the household.',
      target: Number(data.get('target')),
      saved: Number(data.get('saved')) || 0,
    });
    render();
  }
});

window.addEventListener('hashchange', render);
render();
