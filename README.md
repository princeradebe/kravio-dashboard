# Kravio Dashboard

A 1:1 rebuild of the [Kravio support dashboard](https://kravio-dashboard.vercel.app/) — collapsible sidebar, KPI cards with sparklines and animated counters, a ticket volume trend chart with keyboard-navigable bars, a searchable activity feed, and a fully interactive SLA monitoring table.

## Stack

- Vite 7 + React 19 + TypeScript
- Tailwind CSS v4
- [coss ui](https://coss.com/ui) component registry (Base UI)

## Develop

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — typecheck + production build
- `npm run lint` — eslint
- `npm run preview` — preview the production build
