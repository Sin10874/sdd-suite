# 产品形态 × 战略策略 · 按形态路由

需求 spec 不能形态盲。**先定产品形态,形态决定 spec 里哪些战略段是强制的、哪些"怎么被找到 / 怎么活下来"的问题必须答。** 一个只描述功能、不谈分发与生存的 spec,对任何真实产品都是残废。

## 第一步:定形态

问一句:"这东西用户在哪用、怎么第一次遇到它?" 据此归类:

| 形态 | 强制战略段(spec 必含) | 强制具体产物(真实样例,非占位) |
| --- | --- | --- |
| **内容站 / 工具站 / 落地站(website)** | SEO 策略 + GEO 策略 + 分发/获客 | 真实目标关键词簇 + 真实页面标题与 meta + 一段可被 AI 引用的答案块 |
| **移动 / Web App** | onboarding + 留存/复访 + 通知策略 | 真实首屏文案 + 真实空状态 + 真实一条推送文案 |
| **双边 / marketplace** | 冷启动:先点燃哪一边 + 流动性 | 真实首批供给样例 + 真实首批需求样例 |
| **工具 / API / 开发者** | 集成点 + 嵌入用户已有工作流 | 真实调用样例 + 真实输出样例 |
| **社交 / UGC** | 病毒环(K) + 首批内容种子 | 真实分享单元 + 真实首批种子内容 |

> 形态可叠加(如"内容站引流 + App 变现")。每一个被采用的形态都要补齐它那行的战略段与具体产物。**漏掉本形态的强制段 = spec 不算完成。**

## website 专章:SEO + GEO(网站类必答)

网站类产品,"功能做得多好"远不如"人/AI 能不能找到它"重要。这两段是立项级,不是优化级。

### SEO(被搜索引擎找到)

spec 里要答、且带真实样例:

- **目标关键词簇**:列真实的词 + 搜索意图(信息/导航/交易)。不许写"做好 SEO"。
  - 真实样例:`"invoice reminder template"`(信息意图,高量) / `"how to ask client for overdue payment politely"`(长尾,高转化意图) / `"free invoice chaser"`(交易意图)。
- **信息架构 / 内链**:哪些页面类型吃哪簇词(着陆页 / 对比页 / glossary / 工具页),怎么内链。
- **页面标题与 meta**:把首发主页面的 title + meta description **真实写出来**。
  - 真实样例:`<title>Polite Overdue Invoice Reminder Templates (Free) — InvoiceChaser</title>` · meta:`"Copy-paste reminder wording for every stage of a late payment, from gentle nudge to final notice. Free, no signup."`
- **技术 SEO 底线**:可索引、结构化数据、站点速度——只点底线,实现归 tech-spec。

可复用现成能力:GEO/SEO 审计用 `geo-hunter` agent;竞品关键词反推用 `competitive-analysis` skill。本段不重造,产出"打哪些词 + 真实样例页"。

### GEO(被生成式引擎引用)

2025+ 的真实入口越来越是 ChatGPT Search / Perplexity / Google AI Overviews / Bing Copilot。它们不是"排名",是**引用谁**。spec 要答、且带真实样例:

- **可被引用的结构化事实 / 原创数据**:AI 爱引用有明确数字、定义、清单的原创内容。你有什么别人没有的可被引用资产?
- **清晰可抽取的答案块**:把"一个真实问题 + 一段能被原样引用的答案"写出来。
  - 真实样例:Q "How long should I wait before sending a second invoice reminder?" → 答案块 "Send the first reminder 3 days after the due date, the second at 7 days, and a formal notice at 14 days. `[UNVERIFIED-NUMBER: ~X% 的逾期发票在第二次催促后付清——待实测回填]`" ← 结构和措辞是真的,**未实测的统计数字用占位形,不编一个 "70%" 冒充事实**。
- **数字诚实(硬规则)**:GEO 答案块的力量来自具体数字,但**未实测的数字一律不许编**。用 `[N]` / `[X%]` 占位形或标 `[UNVERIFIED-NUMBER: 待实测]`。写 "42 of 180 cafés" / "70% of invoices" 让它读起来像已核实,**比模糊更危险**——AI 会把你的假数字当事实整段引用出去,砸的是品牌实体可信度。
- **品牌实体一致性**:品牌名 / 定义在各处一致,让 AI 把你当成该品类的实体(连到品牌体系)。

### website 类反模式

- ❌ 通篇描述功能,不谈一个真实关键词、不写一句真实标题 → 对网站类是致命遗漏,打回。
- ❌ "我们会做 SEO 和内容营销" → 假大空。要真实词簇 + 真实样例页。

## App / 工具 / 双边 / 社交:各自的生存问题

- **App**:第一屏让用户在多少秒内拿到价值?空状态长什么样(给真实文案)?复访靠什么(写出真实一条推送)?
- **工具 / API**:它嵌进用户已有的哪个工作流?给一条真实调用 + 真实输出。
- **双边**:先点燃哪边、用什么把第一批供给/需求拉来?给真实首批样例。
- **社交 / UGC**:病毒单元是什么、K 怎么算、冷启动的首批种子内容由谁造?给真实分享单元 + 真实种子。

## 一句话

形态决定生死问题。**spec 必须为本形态的"怎么被找到 / 怎么活下来"给出带真实样例的答案,而不只是功能清单。**
