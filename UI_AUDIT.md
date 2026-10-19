# UI Audit: hits.sh 访问量统计页面前端审查与改进目标

## 1. 现状审查概览

- **目标页面**：`https://hits.sh/github.com/OrdoAbChao7/`
- **官方仓库**：`https://github.com/silentsoft/hits`
- **技术栈实测**：
  - 前端：React 17.0.2 + Tailwind CSS 3.0.23 + React Router DOM v6.2.1 + `@nivo/calendar` (v0.79.1) + Axios + `react-color`
  - 构建：`react-app-rewired` + `customize-cra`
  - 后端：Java 11+ / Spring Boot 2.x + Embedded Tomcat + SQLite/MySQL JPA
  - 测试：Jest + React Testing Library (18 套测试套件全部通过)

---

## 2. 页面信息架构与数据流分析

### 2.1 路由与组件映射
- Wildcard 路由：`App.js` 中 `<Route path="*" element={<Dashboard />} />` 负责承接所有类似 `/github.com/OrdoAbChao7/` 的统计页面请求。
- 统计数据请求：`Dashboard.js` 在挂载时请求 `GET /api/urns/{urn}`。
- 徽章预览请求：`Content.js` 请求 `GET /{urn}.preview?view=...&style=...`。
- 徽章计费/计次规则：`GET /{urn}.svg` 会记录并递增 hits；`GET /{urn}.preview` 仅返回当前 SVG 不递增计次。

### 2.2 真实后端数据契约 (`GET /api/urns/{urn}`)
实测后端接口返回结构如下：
```json
{
  "total": 176,
  "monthly": 176,
  "weekly": 65,
  "items": [
    {
      "from": "2026-09-29",
      "to": "2026-10-19",
      "data": [
        { "day": "2026-10-19", "value": 15 },
        { "day": "2026-10-18", "value": 3 },
        { "day": "2026-10-17", "value": 11 }
      ]
    }
  ]
}
```
**数据真实性发现**：
1. 真实数据包含：历史日颗粒度时间序列（`items[].data` 中每个日期的真实访问次数）、周访问量 `weekly`、月访问量 `monthly`、总访问量 `total`。
2. 原页面**遗漏展示了「今日访问量（Today's Hits）」**，而今天的数据在 `items[0].data` 中完全存在且真实有效（例如 2026-10-19 当天为 15 次）。
3. 后端接口不提供：独立访客数（UV）、跳出率、地理位置等；根据任务要求，**严禁伪造虚假数据**，必须基于真实接口数据设计。

---

## 3. 现存视觉与交互问题详查 (UI Defect Inventory)

### 3.1 主题与色彩系统 (Theme & Color)
- ❌ **无浅色模式（Light Mode）**：`App.js` 与 `Dashboard.js` 硬编码 `bg-[#0B0F19]`，整个应用被锁定在蓝黑背景中，完全不支持系统偏好或手动切换。
- ❌ **背景装饰过度**：页面使用了两条巨大的径向渐变光斑（Aurora background：`purple-600/30 blur-[128px]`），造成廉价炫光感，分散了开发者对核心统计数据的注意力。
- ❌ **缺乏统一的设计 Token**：各组件分散使用不同透明度的 slate、white、violet、emerald，缺乏一致的语义变量。

### 3.2 顶部 Header 与导航
- ❌ **缺少统计目标上下文**：Header 仅展示固定的 SVG 徽章与通用链接（About/Docs等），没有清晰标识「当前正在查看哪个目标的统计数据」。
- ❌ **缺少目标主页快捷跳转**：访问 `github.com/OrdoAbChao7` 统计页时，用户最自然的动作是点击跳转回目标 GitHub Profile，但原页面并未提供直接链接。
- ❌ **缺少主题切换开关**：用户无法在明/暗模式间自由切换。

### 3.3 统计目标标题与层级
- ❌ **排版粗糙与断行 Bug**：
  - 标题使用 `from-emerald-400 to-violet-600` 杂乱渐变。
  - 在移动端（375px），标题 `github.com/OrdoAbChao7` 因使用 `break-all` 发生非单词截断：`github.com/OrdoAbC` 与 `hao7` 强行折行，极度影响阅读体验。
- ❌ **缺少可访问的外部链接指示**与元信息徽章（例如 GitHub 标识、协议类型等）。

### 3.4 核心指标卡片 (Metrics Overview)
- ❌ **信息维度单一**：只展示了 3 个卡片（Weekly、Monthly、Total），未计算并展示高频关注的「Today's Hits」及「Daily Average」或「Peak Day」。
- ❌ **微交互与卡片边框杂乱**：三个卡片分别使用 emerald、violet、blue 三种不同的悬停边框与背景色，视觉语言不统一。

### 3.5 访问趋势与图表 (Visit Trends)
- ❌ **移动端严重布局溢出与文字重叠**：
  - 在 375px 宽度下，`@nivo/calendar` 的月份文字 `Jan Feb MarApr May Jun Jul Aug SepOct NovDec` 全部叠压挤在一起，完全无法辨认。
  - 热力图格子在小屏上缩小到几像素，无法悬停，手指根本无法点击或读取 tooltip。
- ❌ **缺少时间序列趋势展示**：
  - `@nivo/calendar` 只展示年历格子，但对于近 7 天 / 近 30 天的日常访问起伏没有直观的可视化（如直方图/趋势条）。
  - 没有视图切换能力（如「最近 14/30 天趋势条形图」与「全年月度热力日历」）。

### 3.6 徽章自定义与代码生成 (Badge Preview & Code)
- ❌ **预览区体验脱节**：
  - 徽章预览区固定高度小卡片，居中显示效果弱。
  - 颜色选择器（`ColorPicker`）弹窗在浅色/深色模式下缺乏统一容器，覆盖层可能遮挡操作。
- ❌ **代码复制反馈微弱**：仅有单次 1.5 秒图标变动，缺乏清晰状态指示，且代码块排版在移动端换行混乱。
- ❌ **选项输入控件样式简陋**：下拉菜单和输入框边缘对比度差。

### 3.7 状态反馈 (Loading, Empty, Error)
- ❌ 接口请求中时没有骨架屏（Skeleton Loading），页面瞬间闪烁白/黑。
- ❌ 当统计数据为 0 或接口失败时，只在 console 打印错误，卡片全显示 0，没有友好的空状态（Empty State）或错误引导。

---

## 4. 优化目标与改进方案

1. **全新设计风格**：
   - 采用 Minimalist + Developer-first Dashboard 风格。
   - 浅色模式：以纯净白色与中性灰（Slate-50 ~ 200）为主，文字清晰、对比度符合 WCAG AA。
   - 深色模式：以 Slate-900 / Zinc-900 为基底（非生硬纯黑），卡片采用柔和边框。
   - 强调色：采用克制而现代的科技蓝（Accent Blue: `#2563eb` / `#0ea5e9`），去除杂乱彩虹渐变。
2. **结构升级**：
   - **Header**：展示 Hits Analytics 品牌、当前跟踪目标 Pill、目标 GitHub 链接、明暗切换开关、响应式导航。
   - **Target Hero Banner**：面包屑式目标展示（如 `github.com` / `OrdoAbChao7`），集成一键复制链接、直达 GitHub 个人主页按钮。
   - **Key Metrics Grid**：展示 Total Hits、Monthly Hits、Weekly Hits、Today's Hits，以及基于真实数据计算的活跃指标。
   - **Interactive Trends Section**：
     - 保留并修复年历热力图（响应式容器、适配暗/亮模式配色、移动端横向滚动或紧凑月度分组）。
     - 增加「近 14 天日访问趋势条形图（Daily Trends）」，利用现有真实日数据呈现清晰波动。
   - **Refined Badge Studio**：
     - 实时预览卡片，支持放大预览与直接点击测试。
     - 整理 Option 表单，分组清晰（样式与外观、计数与标签）。
     - 代码生成卡片支持语法高亮风格、一键复制带 Tooltip、支持 Markdown / HTML / Raw URL。
   - **Footer**：整洁现代的开发者页脚，保留开源许可证、GitHub 仓库链接及项目说明。
3. **技术约束与兼容性**：
   - 保留原有 React 17 + Tailwind CSS 技术栈，利用 Tailwind 的 `darkMode: 'class'` 实现顺畅主题切换。
   - 100% 保持原有 Jest 测试通过（保留原有 testid 与关键 DOM 契约）。
   - 保留 SVG 徽章生成和访问计数的所有原生逻辑。
