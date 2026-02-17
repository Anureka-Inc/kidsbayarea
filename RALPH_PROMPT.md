# Ralph Prompt: Kids Bay Area (kidsbayarea.com)

## Command

```bash
/ralph-loop "$(cat RALPH_PROMPT.md)" --max-iterations 100 --completion-promise "KIDSBAYAREA_COMPLETE"
```

---

## Project Context

You are building **kidsbayarea.com** — the ultimate family activity guide for the San Francisco Bay Area. The project is a Next.js 16 + React 19 + TypeScript + Tailwind v4 website with next-intl for i18n, supporting **ALL major world languages**.

**Core concept:** 湾区遛娃指南 — 让湾区的家长们，一下子就知道带娃去哪玩、吃什么、学什么。

The repo is at: `/Users/wangpengan/Desktop/kidsbayarea`

### Supported Languages (ALL must be implemented)
EN, ZH, ES, JA, KO, FR, DE, PT, IT, RU, AR, HI, TH, VI, ID, TR, NL, PL, SV, DA, NB, FI, CS, HE, MS, TL, UK, RO, HU, EL

That's **30 languages**. 分两层:

**UI 层 (30 languages):** 导航、按钮、分类名、页面标题、meta description 等 UI 文本
- Complete message file in `src/messages/{locale}.json`
- Correct locale in `src/i18n/routing.ts` (already done)
- Sitemap entries for every locale x every page
- hreflang alternates for SEO

**内容层 (EN + ZH only):** Place 描述、活动介绍、攻略正文等深度内容
- 只做英文和中文两种语言的内容正文
- 其他 28 种语言显示英文内容 + 本地化 UI

**Implementation strategy:**
- Phase 1-2: Core 5 languages (EN, ZH, ES, JA, KO) — UI + content
- Phase 3: Add next 10 (FR, DE, PT, IT, RU, AR, HI, TH, VI, ID) — UI only
- Phase 4: Add remaining 15 (TR, NL, PL, SV, DA, NB, FI, CS, HE, MS, TL, UK, RO, HU, EL) — UI only
- RTL support for AR and HE (right-to-left layout)

### Current State (What Already Exists)
- ~68 places across 5 categories: Play, Eat, Learn, Shop, Explore
- Homepage: Hero, TodaysPick, SeasonalBanner, BayAreaMap, CategoryCards, NewsletterSignup
- Individual place detail pages: `/[locale]/[category]/[slug]`
- Components: Header, Footer, MobileNav, ThemeToggle, SearchOverlay, FadeIn, BackToTop, Breadcrumbs, FavoriteButton, ShareButton, PlaceCard
- i18n: 30 locales configured in routing.ts, but only en.json and zh.json exist
- Leaflet + OpenStreetMap map integration
- Dark mode support
- Google Analytics placeholder
- FavoritesProvider (localStorage-based)
- Contact form with Resend API

## Ultimate Vision

**一个湾区家长离不开的网站。** 不只是一个地点列表，而是一个"今天带娃去哪"的决策引擎。打开网站第一眼就知道——这就是我需要的。

核心价值：**让湾区的家长们，一键找到最适合自家娃的活动、餐厅、课程和周末好去处。**

覆盖 **吃喝玩乐学行** — 从室内乐园到户外探险、从亲子餐厅到兴趣班、从 STEM 营到周末 day trip。

## Architecture Constraint: 纯前端，无后端

**严格要求 (Phase 1-5):**
- **NO new backend** — 不要创建新的 API routes (已有 contact API 除外)
- **NO login/auth** — 不要任何用户登录、注册功能
- **NO database** — 所有数据都是静态的，hardcode 在代码中或 JSON 文件中
- 这是一个 **纯静态内容网站**，用 Next.js SSG (Static Site Generation)
- 所有数据放在 `src/data/` 目录下的 TypeScript/JSON 文件中
- Newsletter 表单 UI 已有，保持现状
- 地图用 Leaflet + OpenStreetMap（免费，不需要 API key）
- "Submit a Spot" 用 Google Form 外链
- 收藏功能用 localStorage (已实现)

---

## Phase 1: Foundation & Core Experience (Iterations 1-25)

### 地图体验优化
- [ ] 首页地图上标满所有地点，按分类颜色区分:
  - 🟢 绿色 pin = Play (游乐场/博物馆/公园)
  - 🍽 橙色 pin = Eat (亲子餐厅)
  - 📚 蓝色 pin = Learn (课程/营地)
  - 🛍 紫色 pin = Shop (玩具店/书店)
  - 🧭 青色 pin = Explore (day trip/自然探险)
- [ ] 点击 pin → 弹出信息卡片（名字、评分、年龄范围、一键导航）
- [ ] 地图按分类/区域筛选
- [ ] 地图按年龄筛选 (0-2, 2-5, 5-8, 8-12)

### "Today's Pick" 智能推荐增强
- [ ] 根据当前季节/星期推荐不同的地方:
  - 工作日 → 附近室内活动
  - 周末 → 户外公园/day trip
  - 夏天 → 水上乐园/海滩
  - 冬天/雨天 → 室内博物馆/乐园
  - 节假日 → 特别活动推荐
- [ ] "Random Adventure" 按钮 — 随机推荐一个地方
- [ ] 按年龄段推荐 — 选择孩子年龄后推荐

### UI/UX Excellence
- [ ] Design a proper SVG logo (kids + Bay Area themed)
- [ ] Favicon and apple-touch-icon
- [ ] Smooth scroll animations (已有 FadeIn, 检查完善)
- [ ] Pixel-perfect responsive: mobile, tablet, desktop
- [ ] Loading skeleton screens for place cards
- [ ] 404 page with cute theme (迷路的小朋友)
- [ ] Breadcrumb navigation (已有, 检查完善)
- [ ] Mobile bottom tab navigation (已有, 检查完善)
- [ ] Category page banner images / illustrations
- [ ] Place card hover effects and transitions
- [ ] Image optimization placeholders (blur-up)

### SEO 基础
- [ ] 每页独立 `<title>` + `<meta description>` (随语言扩展逐步增加)
- [ ] JSON-LD: WebSite, Organization, BreadcrumbList (部分已有)
- [ ] Open Graph + Twitter Cards (部分已有)
- [ ] sitemap.xml 包含所有页面 x 当前已支持的语言
- [ ] robots.txt (已有)
- [ ] canonical URLs + hreflang alternates
- [ ] RTL stylesheet/layout for Arabic and Hebrew

**Verify:** `npm run build` zero errors. 浏览器打开每个页面检查。

---

## Phase 2: Deep Content — 扩充数据 (Iterations 26-45)

### Play 游乐场/活动 (至少 20 个)
每个 Play 地点的数据模板:
```
Bay Area Discovery Museum ★★★★★
📍 Sausalito | 🏠 Indoor & Outdoor | 👶 Ages 0-8 | 💰 $$
🅿️ 停车: Free parking, fills up on weekends by 10am
🍼 设施: Stroller-friendly, changing stations, dining on site
⏰ 最佳时间: Weekday mornings 9-11am
🎯 适合: Toddlers, curious explorers, rainy day backup
💡 Tips: Check website for special workshop schedules
```

按区域覆盖:
- San Francisco (5+): Children's Creativity Museum, Exploratorium, California Academy of Sciences, Yerba Buena playground, Golden Gate Park playgrounds
- East Bay (4+): Oakland Zoo, Habitot Children's Museum, Tilden Little Farm, Lake Merritt playground
- South Bay (4+): Happy Hollow, Children's Discovery Museum San Jose, Great America, Shoreline Park
- North Bay (3+): Bay Area Discovery Museum, Marine Mammal Center, Muir Woods
- Peninsula (3+): CuriOdyssey, Hiller Aviation Museum, Central Park Fremont

### Eat 亲子餐厅 (至少 15 个)
每个餐厅标注:
- 是否有 high chair, kids menu, play area
- 价格范围
- 适合的年龄段
- 停车难度
- 周末排队等待时间
- 特色菜品推荐

### Learn 课程/营地 (至少 12 个)
分类:
- STEM/编程营 (Code.org, iD Tech, etc.)
- 中文学校
- 音乐课 (Music Together, Kindermusik)
- 艺术课
- 游泳课
- 体操/舞蹈
- 每个标注: 年龄范围、费用、是否 drop-in、注册方式

### Shop 亲子商店 (至少 8 个)
- 玩具店 (Ambassador Toys, Lakeshore Learning)
- 童书店
- 二手童装店 (consignment)
- 教育用品店
- 每个标注: 是否有试玩区、停车、在线购物

### Explore 探险/Day Trip (至少 10 个)
- Monterey Bay Aquarium
- Santa Cruz Beach Boardwalk
- Point Reyes National Seashore
- Muir Woods (stroller-accessible trails)
- Train rides (Niles Canyon, Roaring Camp)
- 农场体验 (Ardenwood Farm, Slide Ranch)
- Berry picking 季节性活动
- 每个标注: 车程时间、最佳季节、推荐年龄

### 按年龄推荐专题页
- [ ] **0-2 岁宝宝** — 安全、有围栏、适合爬行的地方
- [ ] **2-5 岁幼儿** — 互动性强、有想象力空间的地方
- [ ] **5-8 岁儿童** — STEM、运动、探险
- [ ] **8-12 岁少年** — 挑战性活动、科技营、户外探险
- [ ] **全家出动** — 大人孩子都开心的地方
- [ ] **雨天备选** — 室内活动大全

**Verify:** 65+ places with complete data. Each has its own page. Filters work. Map shows all places.

---

## Phase 3: i18n 扩展 + Interactive Features (Iterations 46-60)

### i18n: 先完成 Core 5 Languages
- [ ] 完善 en.json (检查所有 key 都存在)
- [ ] 完善 zh.json (检查所有翻译准确)
- [ ] 新增 es.json (西班牙语 UI)
- [ ] 新增 ja.json (日语 UI)
- [ ] 新增 ko.json (韩语 UI)

### i18n: 新增 10 种语言 UI
- [ ] 新增: FR, DE, PT, IT, RU, AR, HI, TH, VI, ID
- [ ] AR 阿拉伯语 RTL 布局适配 (dir="rtl", CSS mirror)
- [ ] 语言切换器更新
- [ ] Sitemap 更新

### Search 搜索功能增强
- [ ] Client-side full-text search across all places
- [ ] Search results page with category/age/region filters
- [ ] Search autocomplete suggestions
- [ ] 搜索支持中英文

### 筛选功能
- [ ] 每个分类页有完整筛选:
  - 按区域: SF, East Bay, South Bay, North Bay, Peninsula
  - 按年龄: 0-2, 2-5, 5-8, 8-12, All
  - 按室内/户外
  - 按价格: Free, $, $$, $$$
  - 按特征: Stroller-friendly, Changing station, Dining on site
- [ ] 排序: 评分、距离、名字
- [ ] 地图视图 / 列表视图 切换

### 实用工具页面
- [ ] **周末计划器** — 选择区域 + 年龄 + 预算 → 推荐一日行程:
  - 上午: 活动/博物馆
  - 午餐: 附近亲子餐厅
  - 下午: 公园/户外
  - 自动生成可分享的行程卡片
- [ ] **食物过敏速查** — 哪些餐厅有无过敏原菜单
- [ ] **雨天活动指南** — 自动根据天气推荐室内活动
- [ ] **湾区亲子活动日历** — 季节性活动、节日活动 (hardcode)

**Verify:** Search works. Filters functional. 15 languages render correctly.

---

## Phase 4: SEO Nuclear Mode + i18n Final (Iterations 61-80)

### i18n: 最终 30 languages
- [ ] 新增 15 种语言 UI: TR, NL, PL, SV, DA, NB, FI, CS, HE, MS, TL, UK, RO, HU, EL
- [ ] HE 希伯来语 RTL 布局适配
- [ ] 语言切换器支持全部 30 种语言（分组显示或搜索）
- [ ] Sitemap 更新: 30 locales x all pages
- [ ] 验证所有 30 种语言页面可正常渲染

### SEO Deep Optimization
目标: Google 搜索 "Bay Area kids activities" / "湾区遛娃" 排名前列

- [ ] 每个 place 有独立 URL slug 页面 (已实现)
- [ ] 每个详情页有独立 JSON-LD:
  - Place → LocalBusiness + GeoCoordinates
  - Activity → Event
  - Article → Article + datePublished + author
  - FAQ → FAQPage
- [ ] **内链策略**: 同区域 places 互链、附近餐厅 ↔ 活动互链
- [ ] 每页独特 H1 含关键词
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **SEO 长文章** (每篇 1500+ 字):
  - "Best Indoor Play Spaces for Kids in the Bay Area (2026)"
  - "Top 10 Kid-Friendly Restaurants in San Francisco"
  - "Bay Area STEM Camps for Kids: Complete Guide"
  - "Rainy Day Activities with Kids in the Bay Area"
  - "Best Day Trips from SF with Toddlers"
  - "湾区遛娃必去的20个地方"
  - "旧金山亲子餐厅推荐"
- [ ] 每个分类页有 300+ 字 SEO 介绍文本
- [ ] Google Search Console 验证文件
- [ ] 每篇详情页底部 "Related Places" 推荐

### 差异化 (为什么用我们不用 Yelp/Google)
- [ ] 按年龄段筛选 — Yelp 没有
- [ ] 中文原生支持 — Yelp/Google 不够好
- [ ] Stroller-friendly / Changing station 标注 — Yelp 没有
- [ ] 一日行程规划器 — Yelp 没有
- [ ] 雨天活动推荐 — Yelp 没有
- [ ] 30 种语言 UI — 独一无二

**Verify:** Build passes. Check JSON-LD with Google Rich Results Test. Check sitemap completeness.

---

## Phase 5: Performance, Polish & Ship (Iterations 81-100)

### Performance
- [ ] Lighthouse > 90 all categories
- [ ] Image optimization (next/image, proper sizes, blur placeholders)
- [ ] Code splitting — lazy load maps
- [ ] Minimize bundle size
- [ ] Preload critical resources
- [ ] Font optimization

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Proper heading hierarchy
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation
- [ ] Color contrast AA
- [ ] Skip-to-content link
- [ ] Screen reader testing

### 社区感 (无后端实现)
- [ ] **"Family of the Week"** — 首页展示一个湾区家庭故事 (hardcode, 手动更新)
- [ ] **"Submit a Spot"** — Google Form 链接，让家长推荐新地点
- [ ] **社群入口** — 微信群二维码、Facebook Group 链接、WhatsApp 群链接
- [ ] **Instagram embed** — 嵌入 #kidsbayarea 标签的帖子

### Final Polish
- [ ] Review EVERY page in EVERY language
- [ ] Fix ALL visual inconsistencies
- [ ] Mobile experience perfect on all pages
- [ ] All external links verified working
- [ ] Consistent spacing, typography, colors
- [ ] No placeholder text remaining
- [ ] No TODO comments in code
- [ ] Print-friendly pages for key content

### Ship
- [ ] README.md with project overview, tech stack, setup, deploy guide
- [ ] Git commit all changes
- [ ] Push to GitHub
- [ ] Document deployment steps for Vercel

**When ALL complete:** `<promise>KIDSBAYAREA_COMPLETE</promise>`

---

## Competitive Research (每轮迭代都要做)

**每次迭代开始时，花 10% 的时间做竞品研究：**

### 标杆网站 (随机挑一个研究)
1. **RedTri.com** — 家庭活动推荐、内容策略
2. **SFKids.org** — SF 亲子资源、分类设计
3. **MommyPoppins.com** — 活动日历、年龄筛选
4. **LittlePassports.com** — 儿童探索、互动性
5. **AllTrails.com** — 筛选器、地图、卡片设计
6. **Yelp.com** — 评分、列表设计、本地搜索
7. **TripAdvisor.com** — 家庭旅行、评论设计
8. **NationalGeographic.com/family** — 内容质量、教育性
9. **BayAreaParent.com** — 本地亲子资源
10. GitHub: "kids activity finder", "family guide", "playground map"

### 学什么 & 立即应用
- UI/UX 最佳实践 → 立即改进一个组件
- SEO 策略 → 立即应用到一个页面
- 内容结构 → 立即改进一个数据模板
- 记录在 `RESEARCH_LOG.md`

---

## Randomness: 每轮迭代引入随机性

1. **随机选一个竞品研究** — 不要每次看同一个网站
2. **随机选改进方向** — 不连续 3 轮做同一类任务:
   - UI 改了 → 下轮做内容或 SEO
   - 内容加了 → 下轮做功能或视觉
   - 功能做了 → 下轮做打磨或研究
3. **随机挑一个页面深度打磨** — 不要总从首页开始
4. **偶尔做惊喜功能**:
   - "Random Adventure" 按钮
   - 天气 widget 嵌入
   - 动态季节 banner (已有, 增强)
   - Easter egg (Konami code → 彩蛋动画)
   - "离我最近" 排序 (Geolocation API)
   - 亲子活动倒计时 (下一个节假日)
   - 适龄打分系统

---

## Self-Verification: 每轮必须验证

### 1. Build
```bash
npm run build
```
零错误，否则修复。

### 2. 浏览器视觉检查
用浏览器打开以下页面并检查:
- `http://localhost:3000/en` — 英文首页
- `http://localhost:3000/zh` — 中文首页
- `http://localhost:3000/ar` — 阿拉伯语首页 (检查 RTL 布局)
- `http://localhost:3000/en/play` — 玩乐页面
- `http://localhost:3000/en/eat` — 美食页面
- `http://localhost:3000/en/learn` — 学习页面
- 随机抽查 2-3 种其他语言
- 随机抽查 2-3 个 place detail 页面
- 本轮修改过的页面

检查: 渲染正确、布局无误、文字无乱码、响应式正常、RTL 语言方向正确。

### 3. 链接验证
新增的外部链接必须可访问。

### 4. 多语言验证 (30 languages)
- 切换语言后内容正确更新
- 每轮至少验证 5 种不同语言（包括 1 种 RTL 语言）
- 语言切换器能正确列出所有已支持的语言
- URL 结构正确: `/fr/play`, `/de/eat`, `/ar/shop` etc.

**发现问题 → 立即修复 → 再 commit。**

---

## Rules for Every Iteration

1. `npm run build` — 每轮结束必须零错误
2. 浏览器打开验证 — 不能只看代码
3. Commit progress — 每个重要功能完成后提交
4. Read before write — 先读现有代码再改
5. **30 种语言同步** — EN 改了 message key，所有其他语言也要同步更新。RTL 语言 (AR, HE) 需要特殊布局处理
6. 真实数据 — 真实地名、真实地址、真实链接、真实年龄范围
7. 链接必须可用 — 不要 placeholder 链接
8. 不要过度工程 — 简单、干净、能用
9. 卡住 5 轮 → 换方向 — 记录 blocker 去做别的
10. Mobile-first — 先做手机布局
11. SEO 每页必做 — title, description, structured data
12. 竞品研究 — 每轮开始搜索学习
13. 记录学习 — RESEARCH_LOG.md
14. 随机性 — 不要每轮做同样的事
15. **纯前端** — 零新后端、零登录、零数据库 (已有 contact API 除外)
16. **年龄是核心维度** — 每个地点都必须标注适合年龄段
17. **安全第一** — 标注 stroller-friendly, changing station, safety tips

## If stuck after 90 iterations:
- 在 `TODO.md` 记录未完成的任务
- 列出尝试过的方法和失败原因
- 如果 80%+ 完成，仍然输出 completion promise
