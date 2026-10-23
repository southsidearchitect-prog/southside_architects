const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),js=fs.readFileSync('app.js','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate HTML ids');
for(const m of js.matchAll(/\$\('#([A-Za-z][A-Za-z0-9_-]*)'\)/g)) assert(ids.includes(m[1]),'Missing fixed selector '+m[1]);
for(const name of ['app.js','style.css']) {assert(html.includes('"'+name+'"'));assert(fs.existsSync(name));}
assert(fs.existsSync('.nojekyll'));
assert(js.includes("section:'示例段'") && js.includes("district:'示例區'"),'Demo must use fictional placeholders');
assert(!/https?:\/\/[^\s"']+\.(js|css)/.test(html),'Unexpected CDN');
console.log('PASS static assets, selectors, relative paths and sample privacy checks');
