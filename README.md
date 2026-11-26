# HomeLedger — Household Budget Site

[![make.fun](https://make.fun/badge/competition/best-household-budget-site-20261126-1457)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![make.fun](https://make.fun/badge/entry/best-household-budget-site-20261126-1457)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![make.fun](https://make.fun/badge/valid/best-household-budget-site-20261126-1457)](https://make.fun/c/best-household-budget-site-20261126-1457)

HomeLedger is a household budget planner that runs entirely in the browser from static files — no account, no server, no network requests. Your numbers live in `localStorage` on your own device.

## What it does

- **Dashboard** — income, spending, money left and savings rate for the month, a donut chart of spending by category, income-vs-spending bars for the last three months, and the latest transactions.
- **Transactions** — every income and expense for the month, with search, category and type filters, plus add and delete. Seeded with the Harper household's real-looking September–November 2026 books.
- **Budgets** — a monthly budget per category with live progress bars, over-budget warnings, and editable amounts that save instantly.
- **Goals** — savings goals (emergency fund, family vacation, car down payment) with progress bars, add-savings buttons, and a form to create new goals.
- **Insights** — five plain-language findings computed from your own month: biggest spending lever, daily average, projected month-end, the 50 / 30 / 20 check, and month-by-month kept amounts.
- **Month picker** — switch between September, October and November 2026; every page follows the chosen month.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## Layout

- `app/index.html` — page shell, navigation, month picker, add-transaction modal
- `app/style.css` — the whole design system (warm paper, deep green, amber)
- `app/main.js` — hash router and all event wiring
- `app/views.js` — one render function per page
- `app/store.js` — state, seed data, localStorage, totals
- `app/charts.js` — hand-rolled SVG donut and bar charts
- `app/format.js` — money and date formatting

## License

MIT — see `LICENSE`.
