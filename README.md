# 南岸基地前期評估工具 — GitHub-ready 原型

純靜態繁體中文工具。無建置步驟、無執行期外部套件、無 API key、無後端。此包只交付程式，**尚未建立或推送 GitHub repo，也未發布網站**。

## 先了解限制

這是 **人工官方查詢與證據整理工具**，不是自動土地法規查詢服務。點官方連結不代表完成查詢；不繞過驗證碼、登入或權限限制。已核實只代表填齊必要欄位與使用者覆核，不是法律保證或核准。沒有資料不能視為符合或免辦。

雲端已通過 17 項純 JS 測試、語法與靜態檢查；**尚未完成真實瀏覽器端到端、附件視覺、手機版及 PDF 列印驗收**，當時測試環境阻擋瀏覽器啟動。請先依下方驗收清單測試再正式使用。沒有偽造預覽截圖。

## 開啟

下載 ZIP 並解壓縮，雙擊 `index.html`，用近期 Chrome／Edge 開啟。保持 `index.html`、`app.js`、`style.css` 在同一層。可離線填表，官方網站查詢需連網。

瀏覽器對 `file://` 儲存支援不同，正式使用建議固定 HTTPS 網址。開發者也可在本機此目錄執行 `python -m http.server 8000 --bind 127.0.0.1`，再開 `http://127.0.0.1:8000/`。此步驟非必要，不會自動發布到網際網路。

## 放進自己的 GitHub

1. 自行建立空白 repo，先決定公開或私有；不要上傳案件資料。
2. 解壓後進入包含 `index.html` 的資料夾，將裡面的檔案放在 repo 根目錄（不是再包一層）。
3. GitHub 網頁上傳請包含 `.nojekyll`、`.gitignore` 與 `.github/workflows/test.yml`。也可自行執行：

```sh
git init -b main
git add .
git status  # 先核對沒有案件、截圖、備份或憑證
git commit -m "Add land assessment prototype"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPO.git
git push -u origin main
```

以上只供使用者操作；工具沒有 GitHub token、不會代推送。若自己原本已有 repo，先備份並人工合併，不要覆蓋既有內容。

## GitHub Pages（自行選擇發布）

在 repo 的 **Settings → Pages → Build and deployment**：Source 選 **Deploy from a branch**，Branch 選 `main`，目錄選 `/(root)`，Save。等待 GitHub 顯示實際網址，通常為 `https://YOUR_ACCOUNT.github.io/YOUR_REPO/`。相對路徑支援 repo 子目錄；`.nojekyll` 保留在發布根目錄。GitHub 方案／組織政策可能限制私有 repo 的 Pages；不要為部署自行公開私人資料。

此網站沒有登入保護；發布網址及程式視 Pages 權限可能供他人存取，**不能把私人證據放進 repo 或發布目錄**。現有 CI 僅跑測試，不會發布；Pages 的分支部署由 GitHub 設定控制，不能假設 CI 綠燈是上線前閘門。若要嚴格部署審核，另行設定分支保護及部署流程。

官方依據（2026-10-23 查閱）：[設定 Pages 來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[建立 Pages 網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 資料保存與隱私（重要）

- 按「儲存」才寫入此瀏覽器 localStorage；不會同步到 GitHub、Google Drive 或其他裝置。它不是加密保險箱。
- 儲存依 **origin（協定＋網域＋埠號）** 隔離。換 `http`／`https`、網域、埠號、瀏覽器或裝置不會自動帶資料；`file://` 行為依瀏覽器而異。
- 同一 `username.github.io` 下不同 repo 路徑屬同一 origin；本工具使用相同儲存鍵，部署多份可能共用案件清單。不要把同 origin 視為資料隔離界線。
- 上線、搬家、清快取或更新前，**逐案匯出 JSON** 到自己安全的位置。JSON 包含案件內容及證據縮圖，不可提交 Git 或寄給不該接收者。
- 在新網址匯入 JSON 後核對並儲存。匯入的「已核實」會降為部分核實，需重新確認。
- 私密模式、儲存容量不足或清除網站資料可能使資料遺失。儲存錯誤時依畫面指示立即匯出；不要只依賴 localStorage。
- 無自動遠端上傳，只有使用者按官方連結才開外部網站。不要在不信任的同源網站存放機密資料。

## 功能

16 項：逐筆定位、計畫範圍／版本、分區、建蔽容積、土管、都審、騎樓退縮法空、建築線、山坡地、地質敏感、液化、領照前許可、出流、環評、交評、自治條例。已知官方連結供另開人工查詢，其餘依原表提供。

每項可填來源、日期、版本、頁碼、結論、條件、逐筆覆蓋；狀態為待確認／部分核實／已核實／受阻。不適用應記理由，不是空白自動判定。修改基本資料或證據會降低已核實狀態。

圖片支援 PNG/JPG、每張上限 10MB，每項最多 4 張，縮為最長邊 1600px JPEG。原圖請自行保存。點圖加紅點、雙擊或按鈕清除，標記只是位置示意，**不是精確地籍界**。報告可用瀏覽器列印或另存 PDF。本版不回寫或改動原 Excel。

示例「示例區／示例段／0001-1、0001-2」是虛構教學占位，不可當成真實基地或直接送官方查詢。本包無真實案件、私人圖片或帳號秘密。

## 測試與驗收

需 Node.js 20 以上（CI 用 22），無套件安裝／secret：

```sh
npm test
# 或
node --check app.js
node test-core.cjs
node test-static.cjs
```

CI 為 `push`／`pull_request` 執行唯讀權限檢查；GitHub Actions 是否有額度與可用性由你的帳號政策決定。本包不購買服務。

瀏覽器手動驗收清單：
- [ ] 新增測試案→儲存→重新整理→切換案件，資料保留。
- [ ] 缺來源不得已核實；改基地後已核實降級。
- [ ] PNG/JPG 上傳、點標記、清除與刪除正常。
- [ ] 匯出→新 origin 匯入→核對資料→儲存；匯入已核實降級。
- [ ] 錯誤 JSON、錯誤網址、容量不足有合理錯誤訊息。
- [ ] 中文報告16項完整、圖與位置點清楚，PDF不裁切。
- [ ] 手機螢幕可操作；刪除取消不丟資料。

## 檔案與權利

`index.html`／`style.css`／`app.js` 是程式，`test-*.cjs` 是無外部依賴檢查，`TEST_REPORT.txt` 記先前原型測試狀態。

本包 **未指定開源授權（UNLICENSED）**，不自行授予第三人重製、修改或散布權利。是否公開及採用何種授權由權利人另行決定；公開 repo 不等同選定開源授權。官方圖資與上傳圖片各有其原權利規範，不因工具可使用就可任意再散布。
