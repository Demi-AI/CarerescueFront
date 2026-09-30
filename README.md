# CareRescue 前端

- 六個可操作頁面與班次詳細路由、找不到頁面處理。
- 今日缺口優先排序、資料同步動線。
- 新增請假、延誤、停服、送醫、需求變更事件。
- 規則篩選資格、性別、工時、前後班次及交通，展示排除原因。
- 規則模板方案說明，接受／改選候選人／拒絕，保存操作人與原因。
- 保存前後安排與站內模擬通知、回覆／失敗狀態。
- 從資料計算補位率、處理時間與補班分布。
- 瀏覽器 localStorage 保留資料，設定頁可還原示範。
- 共用元件、共用設計 token、CSS Modules、單一資料來源。

## 維護位置

- src/types/index.ts：所有資料格式。
- src/data/seed.ts：初始合成資料。
- src/services/rescueEngine.ts：補班規則與排序。
- src/context/AppContext.tsx：共用資料、保存與決策操作，未來後端介接點。
- src/config/navigation.ts：側欄選單。
- src/components：共用按鈕、標題、標籤、卡片與確認視窗。
- src/layouts：共用側欄與內容版型。
- src/pages：六個功能頁面。
- src/styles/tokens.css：全站顏色與圓角。
- src/styles/global.css：表單、表格、面板等共用排版。
- 每個 *.module.css：該元件專用樣式。
