// Pure JavaScript validation tests, no browser simulation claim.
const vm=require('vm'),fs=require('fs'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/app.js','utf8').replace('};init();','};');
const sandbox={window:{},console,URL,Date,Math,JSON,document:{querySelector:()=>null}};
vm.createContext(sandbox);vm.runInContext(src,sandbox);const api=sandbox.window.LandTool;const run=(code)=>vm.runInContext(code,sandbox);const out=[];
function test(name,fn){fn();out.push('PASS '+name)}
test('16個流程項目，ID唯一',()=>assert.equal(new Set(api.definitions.map(d=>d.id)).size,16));
test('所有新結果待確認且沒有法規預設值',()=>assert(Object.values(api.getCurrent().records).every(r=>r.status==='pending'&&!r.result)));
test('無資料不能核實',()=>assert(api.verificationErrors(api.getCurrent().records.locate,api.definitions[0]).length>=7));
run("Object.assign(current.base,{city:'高雄市',district:'示例區',section:'示例段',subsection:'示例小段',parcels:'0001-1\\n0001-2'});Object.assign(current.records.locate,{url:'https://urbangis.kcg.gov.tw/',date:'2026-10-23',version:'測試版本',result:'測試結果非正式查詢',conditions:'測試條件',coverage:true})");
test('空間查詢核實需要官方圖像',()=>assert(api.verificationErrors(api.getCurrent().records.locate,api.definitions[0]).includes('官方查詢結果圖片')));
run("current.records.locate.images=[{data:'data:image/png;base64,AAAA',name:'test'}]");
test('填齊欄位符合表單完整性（非內容正確性）',()=>assert.equal(api.verificationErrors(api.getCurrent().records.locate,api.definitions[0]).length,0));
test('未勾逐筆覆蓋不能核實',()=>{const r={...api.getCurrent().records.locate,coverage:false};assert(api.verificationErrors(r,api.definitions[0]).includes('逐筆地號覆蓋確認'))});
test('拒javascript網址',()=>{const r={...api.getCurrent().records.locate,url:'javascript:alert(1)'};assert(api.verificationErrors(r,api.definitions[0]).includes('有效官方來源網址'))});
test('多筆地號按換行與逗號分割',()=>{assert.equal(run("parcels().length"),2)});
test('匯入已核實一律退回部分核實',()=>{let c=JSON.parse(JSON.stringify(api.getCurrent()));c.records.locate.status='verified';assert.equal(api.normalizeCase(c).records.locate.status,'partial')});
test('匯入拒絕錯誤schema',()=>assert.throws(()=>api.normalizeCase({schema:2})));
test('匯入丟棄HTML/SVG圖像',()=>{let c=JSON.parse(JSON.stringify(api.getCurrent()));c.records.locate.images=[{data:'data:image/svg+xml,<svg onload=alert(1)>',marker:null}];assert.equal(api.normalizeCase(c).records.locate.images.length,0)});
test('標記座標限制0到1',()=>{let c=JSON.parse(JSON.stringify(api.getCurrent()));c.records.locate.images=[{data:'data:image/png;base64,AAAA',marker:{x:100,y:2}}];assert.equal(api.normalizeCase(c).records.locate.images[0].marker,null)});
test('匯入最多每項4圖',()=>{let c=JSON.parse(JSON.stringify(api.getCurrent()));c.records.locate.images=Array(10).fill({data:'data:image/png;base64,AAAA'});assert.equal(api.normalizeCase(c).records.locate.images.length,4)});
test('未知／原型鏈狀態不能通過',()=>{let c=JSON.parse(JSON.stringify(api.getCurrent()));c.records.locate.status='constructor';assert.equal(api.normalizeCase(c).records.locate.status,'pending')});
test('HTML字串輸出會跳脫',()=>assert.equal(run("esc('<script>\"&')"),'&lt;script&gt;&quot;&amp;'));
test('不允許file和data網址成可點來源',()=>{assert.equal(run("validURL('file:///etc/passwd')"),'');assert.equal(run("validURL('data:text/html,hello')"),'')});
test('不改分區基準與門檻成常數判定',()=>assert(api.definitions.find(d=>d.id==='outflow').guide.includes('不得只以1公頃')));
const report='純JavaScript邏輯檢查，2026-10-23\n'+out.join('\n')+'\n\n另已通過 node --check app.js。\n未完成：真實瀏覽器操作、LocalStorage端到端、圖片上傳/標記視覺、匯入下載、PDF列印及手機版視覺驗收。\n原因：雲端Chromium啟動socket被沙箱拒絕；正常測試執行環境初始化失敗；雲端瀏覽器file://被網址政策拒絕。未繞過限制。\n這是可開啟的原型程式，不應稱正式驗收完成。未執行真實地號查詢，未串接官方API。\n';fs.writeFileSync(__dirname+'/TEST_REPORT.txt',report);console.log(report);
