importScripts('scramjet.code.js');
importScripts('scramjet.config.js');

// 簡易的なService Workerの実装
self.addEventListener('fetch', event => {
    const url = event.request.url;
    if (url.includes('/scramjet/')) {
        // ここで本来はBareサーバー経由でリクエストをプロキシする
    }
});
