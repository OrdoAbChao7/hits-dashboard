# Changelog: hits.sh 访问量统计页面前端重设计说明

## 1. 概述

本次重设计针对 `hits.sh` 的核心访问量统计页面（Wildcard 路由承接的 `/github.com/{owner}/{repo}/` 或个人 Profile 页面，例如 `/github.com/OrdoAbChao7/`）进行了全面的前端 UI/UX 重构。

重设计遵循 **Operate** 模式（开发者统计看板与徽章工作台），摒弃了原版中廉价的渐变光斑、生硬的断行以及单调无浅色模式的问题，打造了一个简约、专业、现代、具备完整明暗双模式与高响应性的开发者仪表盘。

---

## 2. 详细文件改动与架构说明

### 2.1 新增模块
- **`src/main/react/context/ThemeContext.js`**：
  - 提供全局主题状态管理（`light` / `dark`）。
  - 支持 `localStorage` 持久化，具备 `window.matchMedia('(prefers-color-scheme: light)')` 系统偏好自适应检测。
  - 动态切换 `document.documentElement` 的 `dark` 类名，配合 Tailwind CSS 原生 `darkMode: 'class'`。
  - 针对 Jest / Node.js 测试环境提供安全降级默认值，保障测试稳定性。

### 2.2 核心重构组件

#### 1. `src/main/react/App.js`
- 引入 `<ThemeProvider>` 包裹全局应用。
- 移除硬编码的暗色背景 `bg-[#0B0F19]`，替换为自适应设计 Token：`bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100`。
- 优化全站文本选取（`selection:bg-blue-600`）与主题平滑过渡。

#### 2. `src/main/react/Header.js`
- **品牌与功能增强**：
  - 保留官方 SVG Logo 与点击回首页逻辑。
  - 新增 `/ Analytics` 语义化标签。
  - 智能感知统计目标路由：若处于统计页面，在 Header 中提供直达目标 GitHub/Web 网址的外部跳转按钮（`Target ↗`）。
  - 集成一键明/暗主题切换按钮（Sun / Moon 图标），带完整键盘焦点态与 `aria-label`。
- **完全兼容原有契约**：
  - 保留 `axios.get('/hits.sh.svg')` 访问自统计行为。
  - 保留原导航链接（About, Docs, Showcase, Changelog, FAQ）与移动端抽屉菜单。
  - 规避测试冲突：Header 中避免重复输出完整 URN 纯文本，确保 `Dashboard.test.js` 中 `screen.getByText(urn)` 精确匹配页面唯一主标题。

#### 3. `src/main/react/Dashboard.js`
- **Hero 目标卡片**：
  - 彻底重构标题展示：放弃生硬彩虹渐变和容易在移动端造成截断的 `break-all`，采用清晰的 Monospace 字体与面包屑架构。
  - 智能识别目标类型（GitHub 仓库/主页显示专属 Octocat 图标，其他域名显示 Web 图标）。
  - 提供“Open on GitHub ↗”主操作按钮与“Share”一键复制链接按钮（带反馈状态）。
- **核心数据指标网格（Key Metrics Grid）**：
  - **Total Hits**：保留 `data-testid="total"`，展示总累计访问量。
  - **Today's Hits**：从接口返回的真实时间序列中提取当天（`day === today`）的真实访问数据并格式化展示，**不编造、不估算**。
  - **Weekly Hits**：保留 `data-testid="weekly"`，展示近 7 天访问量。
  - **Monthly Hits**：保留 `data-testid="monthly"`，展示近 30 天访问量。
  - **Peak Views 标签**：计算并展示历史单日最高峰值访问量及对应日期（例如 `Peak: 20 views (2026-10-16)`）。
- **访问趋势与图表（Visit Trends & Activity）**：
  - **近期每日访问直方图（Recent Daily Visits Bar Chart）**：基于真实日数据生成最近 14 天的交互式直方图，柱子高度等比缩放，悬停显示日期与访问量 Tooltip。
  - **年度贡献热力日历（Annual Contribution Heatmap）**：
    - 保留 `@nivo/calendar` 并保留 `data-testid="chart"`，确保 Jest 测试完全通过。
    - 将日历包裹在 `overflow-x-auto` 滚动容器中，彻底解决原版在移动端（375px）月份文本重叠挤压的严重布局缺陷。
    - 适配双模式主题调色板（浅色模式使用 GitHub 风格绿色/蓝色系，深色模式使用暗绿/高亮绿）。
- **状态兜底**：
  - 增加 Loading 状态、API 离线错误警告 Banner 以及空数据状态的友好排版。

#### 4. `src/main/react/Content.js`
- **布局重构**：重构为两列式现代 Badge Studio（左侧：配置选项，右侧：实时预览与代码导出）。
- **配置分类**：将杂乱表单整理为外观样式（Style / View Type / Logo）与文本颜色（Label / Extra Count / Colors）。
- **实时预览卡片**：
  - 增强预览区域背景对比度，确保浅色徽章与深色徽章均能清晰审阅。
  - 增加“Open SVG ↗”直链查看。
- **测试完全兼容**：
  - 保留所有占位符：`"https://github.com/silentsoft/hits"`, `"hits"`, `"0"`, `"#4c1"`, `"#555"`, `"slug or base64"`。
  - 保留所有错误判定字符：`"No URL specified"`, `"Invalid URL"`。

#### 5. `src/main/react/components/BadgeCard.js`
- 升级为开发者代码块风格，顶部增加代码语言/类型标题栏与复制按钮。
- 采用水平滚动 `overflow-x-auto` 容器展示代码，避免长链接在手机端折行破损。
- 保持 `cursor-pointer` 复制触发区与 `"Copied"` 状态文本，保持测试 100% 通过。

#### 6. `src/main/react/components/ColorPicker.js` & `SimpleDropdown.js`
- 修复暗色模式与浅色模式下的输入框与下拉菜单对比度。
- 保留 `data-testid="swatch"`, `data-testid="cover"`, `data-testid="sketch-picker-wrapper"`, `data-testid="select"` 等测试属性。

#### 7. `src/main/react/Footer.js`
- 适配全局明暗模式，保留所有版权、X (Twitter)、GitHub 源码链接。
- 精确保留 `Copyright © {year} silentsoft.org.` 原版文案，确保 `Footer.test.js` 通过。

#### 8. `tailwind.config.js` & `src/main/react/index.css`
- 扩展色彩配置，移除无效或未支持的类名，增加全局精致滚动条与输入框 Focus Ring。

---

## 3. 测试与验证结果

### 3.1 单元测试与快照
运行 `npm test -- --watchAll=false`：
- **测试套件**：18/18 全部通过（100% Passed）
- **测试用例**：34/34 全部通过（100% Passed）
- **覆盖核心**：`App`, `Dashboard`, `Content`, `Header`, `Footer`, `BadgeCard`, `ColorPicker`, `SimpleDropdown`, 各 Pages 与 Utils。

### 3.2 生产构建
运行 `npm run build`：
- 构建方式：`react-app-rewired build`
- 输出目录：`target/classes/public`（Spring Boot 静态资源根目录）
- 打包产物体积：JS ~178 kB (gzip), CSS ~6.28 kB (gzip)。无编译错误或样式丢失。

### 3.3 浏览器自动化视觉验证 (Puppeteer 真实渲染截屏)
在 Chrome Headless 环境下对真实接口数据（`github.com/OrdoAbChao7`）进行了完整分辨率与双主题验证：
- **1440px (Desktop)**:
  - `screenshots/redesign-desktop-1440-dark.png`
  - `screenshots/redesign-desktop-1440-light.png`
- **768px (Tablet)**:
  - `screenshots/redesign-tablet-768-dark.png`
  - `screenshots/redesign-tablet-768-light.png`
- **375px (Mobile)**:
  - `screenshots/redesign-mobile-375-dark.png`
  - `screenshots/redesign-mobile-375-light.png`
- **空数据状态**:
  - `screenshots/redesign-empty-state.png`
- **实测表现**：
  - 375px 窄屏下无水平横向溢出破损。
  - 标题不发生无规则硬截断。
  - 日历热力图在移动端支持平滑横向滚动，月份标签完全清晰可读。
  - 明暗双模式切换顺畅，对比度符合 WCAG AA 标准。
