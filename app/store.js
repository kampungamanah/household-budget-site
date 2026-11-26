/* HomeLedger store: the household's data, kept in localStorage.
   Seed data is the Harper household's real-looking September–November 2026
   books, so every page opens with figures in place. */

const KEY = 'homeledger-v1';

export const CATEGORIES = [
  { name: 'Housing', color: '#1d5c46' },
  { name: 'Groceries', color: '#e8a33d' },
  { name: 'Utilities', color: '#4a7fa5' },
  { name: 'Transport', color: '#7a5ea8' },
  { name: 'Dining Out', color: '#c96a4a' },
  { name: 'Entertainment', color: '#5aa98c' },
  { name: 'Health', color: '#b3402e' },
  { name: 'Kids & School', color: '#8a9a3b' },
  { name: 'Clothing', color: '#a8763e' },
  { name: 'Subscriptions', color: '#6b7a72' },
  { name: 'Home & Garden', color: '#3f7d5a' },
  { name: 'Other', color: '#9aa5a0' },
];

export const INCOME_CATEGORIES = ['Paycheck', 'Other Income'];

export const DEFAULT_BUDGETS = {
  Housing: 1450,
  Groceries: 700,
  Utilities: 280,
  Transport: 320,
  'Dining Out': 220,
  Entertainment: 150,
  Health: 200,
  'Kids & School': 250,
  Clothing: 120,
  Subscriptions: 85,
  'Home & Garden': 180,
};

const SEED_ROWS = [
  // September 2026
  ['2026-09-01', 'Paycheck — Maya Harper', 'Paycheck', 2400, 'income'],
  ['2026-09-01', 'Rent — Maple Court Apt 4B', 'Housing', 1450, 'expense'],
  ['2026-09-02', 'GreenMart weekly shop', 'Groceries', 148.20, 'expense'],
  ['2026-09-03', 'Electric bill — City Power', 'Utilities', 96.40, 'expense'],
  ['2026-09-05', 'School lunch money — Leo', 'Kids & School', 45, 'expense'],
  ['2026-09-06', 'GreenMart weekly shop', 'Groceries', 132.75, 'expense'],
  ['2026-09-07', 'Gas — Shell on Route 9', 'Transport', 42.10, 'expense'],
  ['2026-09-09', 'Internet — NorthNet', 'Utilities', 69.99, 'expense'],
  ['2026-09-10', 'Movie night — family of four', 'Entertainment', 54, 'expense'],
  ['2026-09-12', 'GreenMart weekly shop', 'Groceries', 161.30, 'expense'],
  ['2026-09-13', 'Dentist check-up — Sam', 'Health', 85, 'expense'],
  ['2026-09-14', 'Pizza Friday — Tony’s', 'Dining Out', 38.50, 'expense'],
  ['2026-09-15', 'Paycheck — Daniel Harper', 'Paycheck', 2400, 'income'],
  ['2026-09-16', 'Bus passes — September', 'Transport', 120, 'expense'],
  ['2026-09-18', 'GreenMart weekly shop', 'Groceries', 127.90, 'expense'],
  ['2026-09-19', 'Water bill', 'Utilities', 58.20, 'expense'],
  ['2026-09-20', 'New school shoes — Leo', 'Clothing', 64.99, 'expense'],
  ['2026-09-21', 'Streaming — Streamly', 'Subscriptions', 15.99, 'expense'],
  ['2026-09-22', 'Freelance design — Maya', 'Other Income', 420, 'income'],
  ['2026-09-24', 'GreenMart weekly shop', 'Groceries', 144.60, 'expense'],
  ['2026-09-25', 'Dinner out — anniversary', 'Dining Out', 86, 'expense'],
  ['2026-09-26', 'Gas — Shell on Route 9', 'Transport', 38.75, 'expense'],
  ['2026-09-27', 'Garden soil & seeds', 'Home & Garden', 42.30, 'expense'],
  ['2026-09-28', 'Pharmacy — allergy meds', 'Health', 28.40, 'expense'],
  ['2026-09-29', 'Phone plan — family', 'Utilities', 92, 'expense'],
  ['2026-09-30', 'Transfer to emergency fund', 'Savings', 400, 'expense'],
  // October 2026
  ['2026-10-01', 'Paycheck — Maya Harper', 'Paycheck', 2400, 'income'],
  ['2026-10-01', 'Rent — Maple Court Apt 4B', 'Housing', 1450, 'expense'],
  ['2026-10-02', 'GreenMart weekly shop', 'Groceries', 152.45, 'expense'],
  ['2026-10-03', 'Electric bill — City Power', 'Utilities', 88.10, 'expense'],
  ['2026-10-04', 'Kids’ Halloween costumes', 'Kids & School', 72.50, 'expense'],
  ['2026-10-06', 'GreenMart weekly shop', 'Groceries', 139.80, 'expense'],
  ['2026-10-07', 'Gas — Shell on Route 9', 'Transport', 45.30, 'expense'],
  ['2026-10-08', 'Internet — NorthNet', 'Utilities', 69.99, 'expense'],
  ['2026-10-09', 'Streaming — Streamly', 'Subscriptions', 15.99, 'expense'],
  ['2026-10-10', 'GreenMart weekly shop', 'Groceries', 168.25, 'expense'],
  ['2026-10-11', 'Zoo tickets — family day', 'Entertainment', 68, 'expense'],
  ['2026-10-12', 'Burgers — Route 9 Diner', 'Dining Out', 44.20, 'expense'],
  ['2026-10-14', 'Winter coats — kids', 'Clothing', 118.40, 'expense'],
  ['2026-10-15', 'Paycheck — Daniel Harper', 'Paycheck', 2400, 'income'],
  ['2026-10-16', 'Bus passes — October', 'Transport', 120, 'expense'],
  ['2026-10-17', 'GreenMart weekly shop', 'Groceries', 147.10, 'expense'],
  ['2026-10-18', 'Water bill', 'Utilities', 61.35, 'expense'],
  ['2026-10-19', 'Flu shots — family', 'Health', 60, 'expense'],
  ['2026-10-20', 'Freelance design — Maya', 'Other Income', 550, 'income'],
  ['2026-10-21', 'GreenMart weekly shop', 'Groceries', 155.60, 'expense'],
  ['2026-10-22', 'New vacuum filter', 'Home & Garden', 24.99, 'expense'],
  ['2026-10-23', 'Pizza Friday — Tony’s', 'Dining Out', 41.75, 'expense'],
  ['2026-10-24', 'Gas — Shell on Route 9', 'Transport', 41.60, 'expense'],
  ['2026-10-25', 'School field trip — Leo', 'Kids & School', 38, 'expense'],
  ['2026-10-26', 'Phone plan — family', 'Utilities', 92, 'expense'],
  ['2026-10-27', 'Board game night supplies', 'Entertainment', 32.90, 'expense'],
  ['2026-10-28', 'GreenMart weekly shop', 'Groceries', 129.45, 'expense'],
  ['2026-10-29', 'Haircuts — Maya & Sam', 'Health', 46, 'expense'],
  ['2026-10-31', 'Transfer to emergency fund', 'Savings', 400, 'expense'],
  // November 2026 (to the 26th)
  ['2026-11-01', 'Paycheck — Maya Harper', 'Paycheck', 2400, 'income'],
  ['2026-11-01', 'Rent — Maple Court Apt 4B', 'Housing', 1450, 'expense'],
  ['2026-11-02', 'GreenMart weekly shop', 'Groceries', 158.30, 'expense'],
  ['2026-11-03', 'Electric bill — City Power', 'Utilities', 92.55, 'expense'],
  ['2026-11-04', 'School lunch money — Leo', 'Kids & School', 45, 'expense'],
  ['2026-11-05', 'Gas — Shell on Route 9', 'Transport', 44.20, 'expense'],
  ['2026-11-06', 'GreenMart weekly shop', 'Groceries', 141.15, 'expense'],
  ['2026-11-07', 'Internet — NorthNet', 'Utilities', 69.99, 'expense'],
  ['2026-11-08', 'Streaming — Streamly', 'Subscriptions', 15.99, 'expense'],
  ['2026-11-09', 'GreenMart weekly shop', 'Groceries', 149.80, 'expense'],
  ['2026-11-10', 'Dentist check-up — Maya', 'Health', 85, 'expense'],
  ['2026-11-11', 'Pizza Friday — Tony’s', 'Dining Out', 39.90, 'expense'],
  ['2026-11-12', 'New curtains — living room', 'Home & Garden', 56.40, 'expense'],
  ['2026-11-13', 'GreenMart weekly shop', 'Groceries', 162.40, 'expense'],
  ['2026-11-14', 'Movie night — family of four', 'Entertainment', 58, 'expense'],
  ['2026-11-15', 'Paycheck — Daniel Harper', 'Paycheck', 2400, 'income'],
  ['2026-11-16', 'Bus passes — November', 'Transport', 120, 'expense'],
  ['2026-11-17', 'GreenMart weekly shop', 'Groceries', 133.25, 'expense'],
  ['2026-11-18', 'Water bill', 'Utilities', 59.80, 'expense'],
  ['2026-11-19', 'Winter boots — Sam', 'Clothing', 72.99, 'expense'],
  ['2026-11-20', 'Freelance design — Maya', 'Other Income', 600, 'income'],
  ['2026-11-21', 'GreenMart weekly shop', 'Groceries', 147.60, 'expense'],
  ['2026-11-22', 'Dinner out — Rosa’s Kitchen', 'Dining Out', 64.50, 'expense'],
  ['2026-11-23', 'Gas — Shell on Route 9', 'Transport', 39.85, 'expense'],
  ['2026-11-24', 'Pharmacy — vitamins', 'Health', 31.20, 'expense'],
  ['2026-11-25', 'Phone plan — family', 'Utilities', 92, 'expense'],
  ['2026-11-26', 'Transfer to emergency fund', 'Savings', 400, 'expense'],
];

function seedState() {
  return {
    month: '2026-11',
    budgets: { ...DEFAULT_BUDGETS },
    goals: [
      { id: 'g1', name: 'Emergency fund', note: 'Six months of essential bills, kept in a separate savings account.', target: 10000, saved: 6250 },
      { id: 'g2', name: 'Family vacation — coast trip', note: 'A week at the coast next summer: cabin, fuel and food.', target: 2400, saved: 1150 },
      { id: 'g3', name: 'New car down payment', note: 'Replacing the old sedan before it needs another big repair.', target: 6000, saved: 1800 },
    ],
    transactions: SEED_ROWS.map(([date, description, category, amount, type], i) => ({
      id: `seed-${i + 1}`,
      date,
      description,
      category,
      amount,
      type,
    })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions)) return parsed;
    }
  } catch {
    /* corrupted storage: fall through to seed data */
  }
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable: the site still works in memory */
  }
}

export function resetState() {
  const fresh = seedState();
  saveState(fresh);
  return fresh;
}

export function categoryColor(name) {
  const found = CATEGORIES.find((c) => c.name === name);
  return found ? found.color : '#9aa5a0';
}

export function monthTransactions(state, ym) {
  return state.transactions.filter((t) => t.date.startsWith(ym));
}

export function monthTotals(state, ym) {
  const rows = monthTransactions(state, ym);
  let income = 0;
  let spending = 0;
  for (const t of rows) {
    if (t.type === 'income') income += t.amount;
    else spending += t.amount;
  }
  return { income, spending, remaining: income - spending };
}

export function spendingByCategory(state, ym) {
  const rows = monthTransactions(state, ym).filter((t) => t.type === 'expense');
  const totals = {};
  for (const t of rows) totals[t.category] = (totals[t.category] || 0) + t.amount;
  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function addTransaction(state, tx) {
  const id = `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  state.transactions.push({ id, ...tx });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  saveState(state);
  return id;
}

export function deleteTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudget(state, category, amount) {
  if (amount > 0) state.budgets[category] = amount;
  else delete state.budgets[category];
  saveState(state);
}

export function addToGoal(state, id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (goal) {
    goal.saved = Math.min(goal.target, Math.round((goal.saved + amount) * 100) / 100);
    saveState(state);
  }
}

export function addGoal(state, goal) {
  const id = `g-${Date.now()}`;
  state.goals.push({ id, ...goal });
  saveState(state);
}
