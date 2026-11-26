/* HomeLedger views: one render function per page. Each returns HTML for
   #view; main.js wires the buttons and forms after render. */

import {
  CATEGORIES,
  INCOME_CATEGORIES,
  categoryColor,
  monthTotals,
  monthTransactions,
  spendingByCategory,
} from './store.js';
import { donutChart, monthBars } from './charts.js';
import {
  dateLabel,
  escapeHtml,
  money,
  moneyShort,
  monthLabel,
  monthShort,
  previousMonths,
} from './format.js';

function statCard(label, value, note, tone = '') {
  return `<div class="card stat">
    <div class="label">${label}</div>
    <div class="value ${tone}">${value}</div>
    <div class="note">${note}</div>
  </div>`;
}

function txRow(t) {
  const sign = t.type === 'income' ? '+' : '−';
  return `<tr>
    <td>${dateLabel(t.date)}</td>
    <td class="tx-desc">${escapeHtml(t.description)}<small>${escapeHtml(t.category)}</small></td>
    <td class="hide-phone"><span class="cat-dot" style="background:${categoryColor(t.category)}"></span>${escapeHtml(t.category)}</td>
    <td class="amount ${t.type}">${sign}${money(t.amount)}</td>
    <td class="row-actions"><button type="button" data-delete="${t.id}">Delete</button></td>
  </tr>`;
}

export function dashboardView(state) {
  const ym = state.month;
  const { income, spending, remaining } = monthTotals(state, ym);
  const byCat = spendingByCategory(state, ym);
  const top = byCat.slice(0, 6);
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const budgetUsed = totalBudget > 0 ? Math.round((spending / totalBudget) * 100) : 0;
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - spending) / income) * 100)) : 0;
  const recent = monthTransactions(state, ym).slice(0, 6);
  const months = previousMonths(ym, 3).map((m) => ({ label: monthShort(m), ...monthTotals(state, m) }));

  const donutSlices = byCat
    .slice(0, 5)
    .map((c) => ({ ...c, color: categoryColor(c.category) }));
  const otherTotal = byCat.slice(5).reduce((a, c) => a + c.amount, 0);
  if (otherTotal > 0) donutSlices.push({ category: 'Other', amount: otherTotal, color: '#9aa5a0' });
  const legend = top
    .map((c) => {
      const pct = spending > 0 ? Math.round((c.amount / spending) * 100) : 0;
      return `<li><span><span class="cat-dot" style="background:${categoryColor(c.category)}"></span>${escapeHtml(c.category)}</span><span class="pct">${money(c.amount)} · ${pct}%</span></li>`;
    })
    .join('');

  const overBudgets = Object.entries(state.budgets)
    .map(([cat, limit]) => {
      const spent = byCat.find((c) => c.category === cat)?.amount || 0;
      return { cat, limit, spent, pct: limit > 0 ? Math.round((spent / limit) * 100) : 0 };
    })
    .filter((b) => b.spent > b.limit)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const watch = overBudgets.length
    ? `<div class="callout"><strong>Watch these budgets:</strong> ${overBudgets
        .map((b) => `${escapeHtml(b.cat)} is at ${b.pct}% of its ${money(b.limit)} budget`)
        .join(' · ')}. <a href="#/budgets">Review budgets</a></div>`
    : '';

  return `
  <div class="page-head">
    <div>
      <h1>${monthLabel(ym)} at a glance</h1>
      <p>The Harper household — two adults, two kids, one shared budget. Everything below is live: add a transaction and these numbers move.</p>
    </div>
  </div>
  ${watch}
  <div class="grid grid-4">
    ${statCard('Income', money(income), 'paychecks + freelance', 'good')}
    ${statCard('Spending', money(spending), `${monthTransactions(state, ym).filter((t) => t.type === 'expense').length} expenses this month`, 'bad')}
    ${statCard('Left to spend', money(remaining), remaining >= 0 ? 'on track for the month' : 'over income — see Insights', remaining >= 0 ? 'good' : 'bad')}
    <div class="card stat accent">
      <div class="label">Savings rate</div>
      <div class="value">${savingsRate}%</div>
      <div class="note">of income kept · budget ${budgetUsed}% used</div>
    </div>
  </div>
  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Where the money went</h2>
      <p class="sub">Spending by category, ${monthLabel(ym)}</p>
      <div class="chart-wrap">
        ${donutChart(donutSlices)}
        <ul class="donut-legend">${legend}</ul>
      </div>
      <p style="margin-top:12px"><a href="#/transactions">See every transaction →</a></p>
    </section>
    <section class="card">
      <h2>Income vs spending</h2>
      <p class="sub">Last three months — the gap is what you keep</p>
      ${monthBars(months)}
      <div style="margin-top:14px">
        ${months
          .map((m) => `<div class="kv"><span>${m.label} — kept</span><span>${money(m.income - m.spending)}</span></div>`)
          .join('')}
      </div>
    </section>
  </div>
  <section class="card" style="margin-top:16px">
    <h2>Recent transactions</h2>
    <p class="sub">Latest in ${monthLabel(ym)}</p>
    <table>
      <thead><tr><th>Date</th><th>Description</th><th class="hide-phone">Category</th><th class="amount">Amount</th><th></th></tr></thead>
      <tbody>${recent.map(txRow).join('') || '<tr><td colspan="5" class="empty">No transactions this month yet.</td></tr>'}</tbody>
    </table>
    <p style="margin-top:12px"><a href="#/transactions">All transactions →</a> · <a href="#/budgets">Budgets →</a> · <a href="#/goals">Savings goals →</a></p>
  </section>`;
}

export function transactionsView(state, filter) {
  const ym = state.month;
  let rows = monthTransactions(state, ym);
  if (filter.category) rows = rows.filter((t) => t.category === filter.category);
  if (filter.type) rows = rows.filter((t) => t.type === filter.type);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    rows = rows.filter((t) => t.description.toLowerCase().includes(q));
  }
  const { income, spending } = monthTotals(state, ym);
  const catOptions = ['<option value="">All categories</option>']
    .concat(CATEGORIES.map((c) => `<option ${filter.category === c.name ? 'selected' : ''}>${c.name}</option>`))
    .concat(INCOME_CATEGORIES.map((c) => `<option ${filter.category === c ? 'selected' : ''}>${c}</option>`))
    .join('');

  return `
  <div class="page-head">
    <div>
      <h1>Transactions — ${monthLabel(ym)}</h1>
      <p>${rows.length} shown · ${money(income)} in, ${money(spending)} out. Search, filter, or add a new one — every change is saved on this device.</p>
    </div>
    <button class="btn btn-primary" data-open-add type="button">+ Add transaction</button>
  </div>
  <section class="card">
    <div class="filters">
      <label class="field">Search
        <input id="filterQ" type="search" placeholder="e.g. GreenMart" value="${escapeHtml(filter.q || '')}">
      </label>
      <label class="field">Category
        <select id="filterCategory">${catOptions}</select>
      </label>
      <label class="field">Type
        <select id="filterType">
          <option value="">All</option>
          <option value="expense" ${filter.type === 'expense' ? 'selected' : ''}>Expenses</option>
          <option value="income" ${filter.type === 'income' ? 'selected' : ''}>Income</option>
        </select>
      </label>
    </div>
    <table>
      <thead><tr><th>Date</th><th>Description</th><th class="hide-phone">Category</th><th class="amount">Amount</th><th></th></tr></thead>
      <tbody>${rows.map(txRow).join('') || '<tr><td colspan="5" class="empty">Nothing matches — try clearing a filter.</td></tr>'}</tbody>
    </table>
  </section>`;
}

export function budgetsView(state) {
  const ym = state.month;
  const byCat = spendingByCategory(state, ym);
  const spentOf = (cat) => byCat.find((c) => c.category === cat)?.amount || 0;
  const totalBudget = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const totalSpent = Object.keys(state.budgets).reduce((a, c) => a + spentOf(c), 0);

  const rows = Object.entries(state.budgets)
    .map(([cat, limit]) => {
      const spent = spentOf(cat);
      const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      const isOver = spent > limit;
      const cls = isOver ? 'over' : pct >= 80 ? 'warn' : '';
      const status = isOver
        ? `<span class="over-text">Over by ${money(spent - limit)}</span>`
        : spent === limit
          ? `<span class="left-text">Right at budget</span>`
          : `<span class="left-text">${money(limit - spent)} left</span>`;
      return `<div class="budget-row">
        <div class="row-top"><span><span class="cat-dot" style="background:${categoryColor(cat)}"></span>${escapeHtml(cat)}</span><span class="spent">${money(spent)} of ${money(limit)}</span></div>
        <div class="bar"><span class="${cls}" style="width:${Math.min(100, pct)}%"></span></div>
        <div class="row-bottom"><span>${pct}% used · <span class="pill ${isOver ? 'over' : pct >= 80 ? 'warn' : ''}">${isOver ? 'Over budget' : pct >= 80 ? 'Almost there' : 'On track'}</span></span>${status}</div>
        <div style="margin-top:8px"><label class="field" style="max-width:220px">Monthly budget ($)
          <input type="number" min="0" step="5" value="${limit}" data-budget="${escapeHtml(cat)}">
        </label></div>
      </div>`;
    })
    .join('');

  return `
  <div class="page-head">
    <div>
      <h1>Budgets — ${monthLabel(ym)}</h1>
      <p>Give every category a job before the month starts. Change any number below and it saves instantly — the bars update as you spend.</p>
    </div>
    <div class="card stat" style="min-width:220px">
      <div class="label">Total planned</div>
      <div class="value">${money(totalBudget)}</div>
      <div class="note">${money(totalSpent)} spent of it so far</div>
    </div>
  </div>
  <section class="card">
    <h2>Category budgets</h2>
    <p class="sub">Housing is fixed at ${money(state.budgets.Housing || 0)} — rent does not move, so the lever is everywhere else.</p>
    ${rows}
  </section>
  <section class="card" style="margin-top:16px">
    <h2>How to set a budget that sticks</h2>
    <p class="sub">Three rules the Harpers use</p>
    <div class="grid grid-3">
      <div><h3>1 · Look back, not forward</h3><p>Base each number on last month's real spending, not on what you wish it was. A budget you keep beating is a budget you will keep.</p></div>
      <div><h3>2 · One flexible pot</h3><p>Keep Dining Out and Entertainment small and flexible — they absorb the surprises so Groceries and Transport never have to.</p></div>
      <div><h3>3 · Pay yourself first</h3><p>Move the savings transfer on payday, the 1st and the 15th, before anything else gets a chance to spend it.</p></div>
    </div>
  </section>`;
}

export function goalsView(state) {
  const totalSaved = state.goals.reduce((a, g) => a + g.saved, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const goals = state.goals
    .map((g) => {
      const pct = Math.round((g.saved / g.target) * 100);
      const left = g.target - g.saved;
      return `<div class="goal">
        <div class="row-top"><span>${escapeHtml(g.name)}</span><span>${money(g.saved)} of ${money(g.target)}</span></div>
        <p>${escapeHtml(g.note)}</p>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <div class="row-bottom"><span>${pct}% saved · ${money(left)} to go</span><span class="pill">${pct >= 100 ? 'Reached!' : pct >= 50 ? 'Halfway there' : 'Getting started'}</span></div>
        <div class="add-save">
          <input type="number" min="1" step="5" placeholder="Amount $" data-goal-amount="${g.id}" aria-label="Amount to add to ${escapeHtml(g.name)}">
          <button class="btn btn-small" type="button" data-goal-add="${g.id}">Add savings</button>
        </div>
      </div>`;
    })
    .join('');

  return `
  <div class="page-head">
    <div>
      <h1>Savings goals</h1>
      <p>Money with a name gets saved. ${money(totalSaved)} saved toward ${money(totalTarget)} across ${state.goals.length} goals.</p>
    </div>
  </div>
  <div class="grid grid-2">
    <section class="card">
      <h2>Your goals</h2>
      <p class="sub">Add money to a goal whenever you have a spare dollar — it counts the same day.</p>
      ${goals}
    </section>
    <section class="card">
      <h2>Start a new goal</h2>
      <p class="sub">A goal needs a name, a number and a date in mind.</p>
      <form id="goalForm" style="display:flex;flex-direction:column;gap:12px">
        <label class="field">Goal name
          <input name="name" type="text" placeholder="e.g. Christmas gifts" maxlength="60" required>
        </label>
        <label class="field">What is it for?
          <input name="note" type="text" placeholder="e.g. Gifts for the whole family" maxlength="120">
        </label>
        <div class="field-row">
          <label class="field">Target ($)
            <input name="target" type="number" min="1" step="10" placeholder="500" required>
          </label>
          <label class="field">Already saved ($)
            <input name="saved" type="number" min="0" step="10" placeholder="0">
          </label>
        </div>
        <div><button class="btn btn-primary" type="submit">Create goal</button></div>
      </form>
      <h2 style="margin-top:22px">Why goals work</h2>
      <p>The emergency fund comes first: six months of rent, food and bills means a broken car or a lost job is an inconvenience, not a crisis. The Harpers built theirs $400 at a time, on the 1st and the 15th, and never skipped a payday.</p>
    </section>
  </div>`;
}

export function insightsView(state) {
  const ym = state.month;
  const { income, spending, remaining } = monthTotals(state, ym);
  const byCat = spendingByCategory(state, ym);
  const top = byCat[0];
  // Rent cannot be cut, so the "biggest lever" is the largest flexible category.
  const lever = byCat.find((c) => c.category !== 'Housing') || top;
  const day = new Date().getDate();
  const daysInMonth = new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0).getDate();
  const dailyAvg = spending / Math.max(1, day);
  const projected = dailyAvg * daysInMonth;
  const months = previousMonths(ym, 3).map((m) => ({ label: monthShort(m), ...monthTotals(state, m) }));
  const bestMonth = months.reduce((best, m) => (m.income - m.spending > best.income - best.spending ? m : best), months[0]);
  const grocery = byCat.find((c) => c.category === 'Groceries');
  const dining = byCat.find((c) => c.category === 'Dining Out');
  const subs = byCat.find((c) => c.category === 'Subscriptions');
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - spending) / income) * 100)) : 0;

  const tips = [
    {
      title: `Your biggest lever is ${lever ? lever.category : '—'} at ${money(lever ? lever.amount : 0)}.`,
      body: `It is ${spending > 0 ? Math.round(((lever ? lever.amount : 0) / spending) * 100) : 0}% of everything you spent. Cutting it by 10% frees ${money((lever ? lever.amount : 0) * 0.1)} a month — ${money((lever ? lever.amount : 0) * 1.2)} a year.`,
    },
    {
      title: `You spend about ${money(dailyAvg)} a day.`,
      body: `At this pace the month lands near ${money(projected)}. ${projected > income ? 'That is more than your income — the fix is one cheaper week, not a new budget.' : 'That stays inside your income, with room to spare.'}`,
    },
    {
      title: `Groceries (${money(grocery ? grocery.amount : 0)}) beat dining out (${money(dining ? dining.amount : 0)}) ${grocery && dining && grocery.amount > dining.amount ? 'by ' + money(grocery.amount - dining.amount) : ''}.`,
      body: 'Home cooking is doing the heavy lifting. One planned takeaway night a week keeps the treat without letting it become the habit.',
    },
    {
      title: `Subscriptions are ${money(subs ? subs.amount : 0)} this month — small, but silent.`,
      body: 'Check the list every quarter: one unused streaming or app subscription is a free raise. The Harpers cut two last spring and never missed them.',
    },
    {
      title: `${bestMonth.label} was your best month: ${money(bestMonth.income - bestMonth.spending)} kept.`,
      body: `Your savings rate this month is ${savingsRate}%. A steady 15–20% is the range that builds an emergency fund in about two years.`,
    },
  ];

  return `
  <div class="page-head">
    <div>
      <h1>Insights — ${monthLabel(ym)}</h1>
      <p>What your own numbers are saying, in plain language. No advice from the internet — just your household, your month.</p>
    </div>
  </div>
  <div class="grid grid-4">
    ${statCard('Daily average', money(dailyAvg), `over ${day} days so far`)}
    ${statCard('Projected month', money(projected), projected > income ? 'above income — act now' : 'inside income', projected > income ? 'bad' : 'good')}
    ${statCard('Top category', top ? top.category : '—', top ? money(top.amount) : 'no spending yet')}
    ${statCard('Savings rate', savingsRate + '%', remaining >= 0 ? 'of income kept' : 'negative this month', remaining >= 0 ? 'good' : 'bad')}
  </div>
  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h2>Five things your budget wants you to know</h2>
      <p class="sub">Computed from ${monthLabel(ym)} alone</p>
      ${tips.map((t, i) => `<div class="tip"><span class="tip-num">${i + 1}</span><p><strong>${escapeHtml(t.title)}</strong> ${escapeHtml(t.body)}</p></div>`).join('')}
    </section>
    <section class="card">
      <h2>Month by month</h2>
      <p class="sub">Income, spending and what stayed</p>
      ${months.map((m) => `<div class="kv"><span>${m.label} income</span><span>${money(m.income)}</span></div><div class="kv"><span>${m.label} spending</span><span>${money(m.spending)}</span></div><div class="kv"><span>${m.label} kept</span><span>${money(m.income - m.spending)}</span></div>`).join('')}
      <h2 style="margin-top:20px">The 50 / 30 / 20 check</h2>
      <p class="sub">A classic yardstick: 50% needs, 30% wants, 20% savings</p>
      ${(() => {
        const needsCats = ['Housing', 'Groceries', 'Utilities', 'Transport', 'Health', 'Kids & School'];
        const needs = byCat.filter((c) => needsCats.includes(c.category)).reduce((a, c) => a + c.amount, 0);
        const wants = spending - needs;
        const needsPct = income > 0 ? Math.round((needs / income) * 100) : 0;
        const wantsPct = income > 0 ? Math.round((wants / income) * 100) : 0;
        return `<div class="kv"><span>Needs (${needsPct}% of income)</span><span>${money(needs)}</span></div>
        <div class="kv"><span>Wants (${wantsPct}% of income)</span><span>${money(wants)}</span></div>
        <div class="kv"><span>Saved (${savingsRate}% of income)</span><span>${money(Math.max(0, remaining))}</span></div>
        <p style="margin-top:10px">${needsPct <= 50 && savingsRate >= 20 ? 'This month fits the 50 / 30 / 20 shape nicely.' : 'Needs are running a little over half of income — common with rent at this level. The lever is wants, not needs.'}</p>`;
      })()}
    </section>
  </div>`;
}
