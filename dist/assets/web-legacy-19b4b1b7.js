System.register(["./index-legacy-b2dfbd27.js"],(function(t,e){"use strict";var r,i,o;return{setters:[t=>{r=t.W,i=t.y,o=t.E}],execute:function(){function e(t){const e=t.split("/").filter((t=>"."!==t)),r=[];return e.forEach((t=>{".."===t&&r.length>0&&".."!==r[r.length-1]?r.pop():r.push(t)})),r.join("/")}class s extends r{constructor(){super(...arguments),this.DB_VERSION=1,this.DB_NAME="Disc",this._writeCmds=["add","put","delete"],this.downloadFile=async t=>{const e=i(t,t.webFetchExtra),r=await fetch(t.url,e);let o;if(null==t?void 0:t.progress)if(null==r?void 0:r.body){const e=r.body.getReader();let i=0;const s=[],a=r.headers.get("content-type"),n=parseInt(r.headers.get("content-length")||"0",10);for(;;){const{done:r,value:o}=await e.read();if(r)break;s.push(o),i+=(null==o?void 0:o.length)||0;const a={url:t.url,bytes:i,contentLength:n};this.notifyListeners("progress",a)}const d=new Uint8Array(i);let c=0;for(const t of s)void 0!==t&&(d.set(t,c),c+=t.length);o=new Blob([d.buffer],{type:a||void 0})}else o=new Blob;else o=await r.blob();const s=URL.createObjectURL(o),a=document.createElement("a");return document.body.appendChild(a),a.href=s,a.download=t.path,a.click(),URL.revokeObjectURL(s),document.body.removeChild(a),{path:t.path,blob:o}}}async initDb(){if(void 0!==this._db)return this._db;if(!("indexedDB"in window))throw this.unavailable("This browser doesn't support IndexedDB");return new Promise(((t,e)=>{const r=indexedDB.open(this.DB_NAME,this.DB_VERSION);r.onupgradeneeded=s.doUpgrade,r.onsuccess=()=>{this._db=r.result,t(r.result)},r.onerror=()=>e(r.error),r.onblocked=()=>{console.warn("db blocked")}}))}static doUpgrade(t){const e=t.target.result;t.oldVersion,e.objectStoreNames.contains("FileStorage")&&e.deleteObjectStore("FileStorage"),e.createObjectStore("FileStorage",{keyPath:"path"}).createIndex("by_folder","folder")}async dbRequest(t,e){const r=-1!==this._writeCmds.indexOf(t)?"readwrite":"readonly";return this.initDb().then((i=>new Promise(((o,s)=>{const a=i.transaction(["FileStorage"],r).objectStore("FileStorage")[t](...e);a.onsuccess=()=>o(a.result),a.onerror=()=>s(a.error)}))))}async dbIndexRequest(t,e,r){const i=-1!==this._writeCmds.indexOf(e)?"readwrite":"readonly";return this.initDb().then((o=>new Promise(((s,a)=>{const n=o.transaction(["FileStorage"],i).objectStore("FileStorage").index(t)[e](...r);n.onsuccess=()=>s(n.result),n.onerror=()=>a(n.error)}))))}getPath(t,e){const r=void 0!==e?e.replace(/^[/]+|[/]+$/g,""):"";let i="";return void 0!==t&&(i+="/"+t),""!==e&&(i+="/"+r),i}async clear(){(await this.initDb()).transaction(["FileStorage"],"readwrite").objectStore("FileStorage").clear()}async readFile(t){const e=this.getPath(t.directory,t.path),r=await this.dbRequest("get",[e]);if(void 0===r)throw Error("File does not exist.");return{data:r.content?r.content:""}}async writeFile(t){const e=this.getPath(t.directory,t.path);let r=t.data;const i=t.encoding,o=t.recursive,s=await this.dbRequest("get",[e]);if(s&&"directory"===s.type)throw Error("The supplied path is a directory.");const a=e.substr(0,e.lastIndexOf("/"));if(void 0===await this.dbRequest("get",[a])){const e=a.indexOf("/",1);if(-1!==e){const r=a.substr(e);await this.mkdir({path:r,directory:t.directory,recursive:o})}}if(!i&&(r=r.indexOf(",")>=0?r.split(",")[1]:r,!this.isBase64String(r)))throw Error("The supplied data is not valid base64 content.");const n=Date.now(),d={path:e,folder:a,type:"file",size:r.length,ctime:n,mtime:n,content:r};return await this.dbRequest("put",[d]),{uri:d.path}}async appendFile(t){const e=this.getPath(t.directory,t.path);let r=t.data;const i=t.encoding,o=e.substr(0,e.lastIndexOf("/")),s=Date.now();let a=s;const n=await this.dbRequest("get",[e]);if(n&&"directory"===n.type)throw Error("The supplied path is a directory.");if(void 0===await this.dbRequest("get",[o])){const e=o.indexOf("/",1);if(-1!==e){const r=o.substr(e);await this.mkdir({path:r,directory:t.directory,recursive:!0})}}if(!i&&!this.isBase64String(r))throw Error("The supplied data is not valid base64 content.");void 0!==n&&(r=void 0===n.content||i?n.content+r:btoa(atob(n.content)+atob(r)),a=n.ctime);const d={path:e,folder:o,type:"file",size:r.length,ctime:a,mtime:s,content:r};await this.dbRequest("put",[d])}async deleteFile(t){const e=this.getPath(t.directory,t.path);if(void 0===await this.dbRequest("get",[e]))throw Error("File does not exist.");if(0!==(await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)])).length)throw Error("Folder is not empty.");await this.dbRequest("delete",[e])}async mkdir(t){const e=this.getPath(t.directory,t.path),r=t.recursive,i=e.substr(0,e.lastIndexOf("/")),o=(e.match(/\//g)||[]).length,s=await this.dbRequest("get",[i]),a=await this.dbRequest("get",[e]);if(1===o)throw Error("Cannot create Root directory");if(void 0!==a)throw Error("Current directory does already exist.");if(!r&&2!==o&&void 0===s)throw Error("Parent directory must exist");if(r&&2!==o&&void 0===s){const e=i.substr(i.indexOf("/",1));await this.mkdir({path:e,directory:t.directory,recursive:r})}const n=Date.now(),d={path:e,folder:i,type:"directory",size:0,ctime:n,mtime:n};await this.dbRequest("put",[d])}async rmdir(t){const{path:e,directory:r,recursive:i}=t,o=this.getPath(r,e),s=await this.dbRequest("get",[o]);if(void 0===s)throw Error("Folder does not exist.");if("directory"!==s.type)throw Error("Requested path is not a directory");const a=await this.readdir({path:e,directory:r});if(0!==a.files.length&&!i)throw Error("Folder is not empty");for(const n of a.files){const t=`${e}/${n.name}`;"file"===(await this.stat({path:t,directory:r})).type?await this.deleteFile({path:t,directory:r}):await this.rmdir({path:t,directory:r,recursive:i})}await this.dbRequest("delete",[o])}async readdir(t){const e=this.getPath(t.directory,t.path),r=await this.dbRequest("get",[e]);if(""!==t.path&&void 0===r)throw Error("Folder does not exist.");const i=await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)]);return{files:await Promise.all(i.map((async t=>{let r=await this.dbRequest("get",[t]);return void 0===r&&(r=await this.dbRequest("get",[t+"/"])),{name:t.substring(e.length+1),type:r.type,size:r.size,ctime:r.ctime,mtime:r.mtime,uri:r.path}})))}}async getUri(t){const e=this.getPath(t.directory,t.path);let r=await this.dbRequest("get",[e]);return void 0===r&&(r=await this.dbRequest("get",[e+"/"])),{uri:(null==r?void 0:r.path)||e}}async stat(t){const e=this.getPath(t.directory,t.path);let r=await this.dbRequest("get",[e]);if(void 0===r&&(r=await this.dbRequest("get",[e+"/"])),void 0===r)throw Error("Entry does not exist.");return{type:r.type,size:r.size,ctime:r.ctime,mtime:r.mtime,uri:r.path}}async rename(t){await this._copy(t,!0)}async copy(t){return this._copy(t,!1)}async requestPermissions(){return{publicStorage:"granted"}}async checkPermissions(){return{publicStorage:"granted"}}async _copy(t,r=!1){let{toDirectory:i}=t;const{to:s,from:a,directory:n}=t;if(!s||!a)throw Error("Both to and from must be provided");i||(i=n);const d=this.getPath(n,a),c=this.getPath(i,s);if(d===c)return{uri:c};if(function(t,r){t=e(t),r=e(r);const i=t.split("/"),o=r.split("/");return t!==r&&i.every(((t,e)=>t===o[e]))}(d,c))throw Error("To path cannot contain the from path");let h;try{h=await this.stat({path:s,directory:i})}catch(p){const t=s.split("/");t.pop();const e=t.join("/");if(t.length>0&&"directory"!==(await this.stat({path:e,directory:i})).type)throw new Error("Parent directory of the to path is a file")}if(h&&"directory"===h.type)throw new Error("Cannot overwrite a directory with a file");const l=await this.stat({path:a,directory:n}),u=async(t,e,r)=>{const o=this.getPath(i,t),s=await this.dbRequest("get",[o]);s.ctime=e,s.mtime=r,await this.dbRequest("put",[s])},y=l.ctime?l.ctime:Date.now();switch(l.type){case"file":{const t=await this.readFile({path:a,directory:n});let e;r&&await this.deleteFile({path:a,directory:n}),this.isBase64String(t.data)||(e=o.UTF8);const d=await this.writeFile({path:s,directory:i,data:t.data,encoding:e});return r&&await u(s,y,l.mtime),d}case"directory":{if(h)throw Error("Cannot move a directory over an existing object");try{await this.mkdir({path:s,directory:i,recursive:!1}),r&&await u(s,y,l.mtime)}catch(p){}const t=(await this.readdir({path:a,directory:n})).files;for(const e of t)await this._copy({from:`${a}/${e.name}`,to:`${s}/${e.name}`,directory:n,toDirectory:i},r);r&&await this.rmdir({path:a,directory:n})}}return{uri:c}}isBase64String(t){try{return btoa(atob(t))==t}catch(e){return!1}}}t("FilesystemWeb",s),s._debug=!0}}}));
