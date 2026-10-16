# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Nuxt 2 (Vue 2, SSR, `target: 'server'`) frontend for i-Plant / ERP Head Office (DSN Group: palm oil plantations and mills). It consumes the Laravel API in the sibling repo `../dsn_ho_backend`. Most features ship as a pair: a backend endpoint plus a page here, built together. The README (in Indonesian) documents every module in detail.

## Commands

```bash
npm install
npm run dev        # nuxt dev server on :3000
npm run build && npm run start
npm run lint       # prettier --check . (only linter; no ESLint rules, no tests)
npm run lintfix    # prettier --write --list-different .
```

Prettier config: no semicolons, single quotes. Webpack 4 means Node 14/16. On Node ≥17, use `NODE_OPTIONS=--openssl-legacy-provider`.

## Configuration

There is no `.env`. Everything lives in `nuxt.config.js`:
- `axios.baseURL` is currently `http://dsn_ho_backend.test`, with alternative server IPs commented out. Don't commit a changed baseURL by accident.
- `publicRuntimeConfig.grievanceBaseURL` is exposed as `$config.grievanceBaseURL`.
- `@nuxtjs/auth-next` local strategy (`/api/admin/login`, `/logout`, `/user`) with the global `auth` middleware, so every page requires login.

## Architecture

**Routing.** Pages live under `pages/erp_ho/<module>/<feature>/` and follow a fixed CRUD layout:
- `index.vue`: list
- `create/index.vue`: create form
- `edit/_id.vue`: edit form
- `_id.vue`: detail/children
- `create/_id.vue`: create a child of `:id`

Named routes follow Nuxt's scheme, e.g. `erp_ho-mill-station`. Use `pages/erp_ho/mill/station/` as the canonical example when adding a feature.

**Page conventions** (match these):
- `layout: 'admin'` and `head()` with a `'<Module> - <Feature>'` title.
- List pages load data in `asyncData({ $axios, query })` from `/api/admin/<feature>?q=...&page=...` and read `res.data.data` (rows) and `res.data.total`. They set `watchQuery: ['q', 'page']`. Search and pagination push new query params with `$router.push`; they don't call the API directly.
- Tables use `b-table` + `b-pagination` (bootstrap-vue). Dropdowns use `multiselect` fed by `/api/admin/lov_*` endpoints.
- Forms build a `FormData` and `$axios.post`/`put`. On error, they assign `error.response.data` to `this.validation` and render `validation.<field>[0]`. This depends on the backend returning Laravel's raw validator error bag.
- Feedback goes through `this.$swal.fire(...)` with Indonesian text (`'BERHASIL!'`, `'Data Berhasil Disimpan!'`, delete confirm `'APAKAH ANDA YAKIN ?'`). After mutations, call `this.$nuxt.refresh()`.
- Excel export: `$axios({ url: '/api/admin/<feature>-export?<same filters>', responseType: 'blob' })`, then a temporary `<a download>` link. Pass the same filters as the list query.
- Shared helpers: `utils/formatters.js` (`formatPrice`, `formatDateTable` with Indonesian month names) and `mixins/menuAccessLog.js` (`recordMenuLog(menuName)` posts to `/api/admin/access_logs/daily`).

**Access control is data-driven, not in code.**
- `components/admin/sidebar.vue` calls `/api/admin/menu_user/<path>` and `/api/admin/check_user_menu/<path>`, where `<path>` is `$route.path` with `/` replaced by `*`.
- The sidebar HTML comes back from the server and is rendered with `v-html`.
- A `"Tidak"` answer redirects to `/erp_ho/main/dashboard`. A new page therefore needs a menu row whose `path_file_name` equals its route, assigned to a role in the System module, before anyone can open it.
- `components/admin/header.vue` calls `/api/admin/profile` on mount and logs out on 401. Login stores profile codes (`department_code`, `company_code`, `activity_group_*`) in cookies via `cookie-universal-nuxt`.

**State.** Vuex (`store/index.js`) is used only for the dashboard filter shared by `components/FilterBar.vue` and the dashboard pages. It holds company/department/afdeling selections, dates, the composed `queryString`, and a `search` counter that triggers a refresh. Feature pages keep their own local state.

**Global assets.**
- jQuery, Bootstrap and AdminLTE are loaded as static scripts from `static/js` in `head`, not from npm. Their CSS comes from `assets/css`.
- FusionCharts is registered client-only in `plugins/chart.js`.
- `v-number`/`v-money` come from `plugins/vue-number-format.js`.
- Components are auto-imported (`components: true`). `components/admin/mill/*` holds reusable form sections for the sampling grading, spot cek, and sortasi report pages.

## Gotchas

- The repo contains backup and practice files that shouldn't be used as references: `_nuxt.config - Copy.js`, `* - Copy.vue`, `index_1.vue`, `index5.vue`, `*.vue.old`, `index-cek.vue`, `pages/erp_ho/test/`, `dashboard_test/`, `overtime_test/`.
- Many modules have `_ho` / `_ph` variants of the same page (e.g. `report_sortasi_harian`, `_ho`, `_ph`), scoped to a different audience. Check whether a change must apply to all variants.
- Branch workflow: work on `dev-rangga`, open PRs to `main` on `rendrasuwondo/dsn_ho_frontend`.
