importScripts('scramjet.code.js');
importScripts('scramjet.config.js');

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    const scope = self.location.origin + '/scramjet/';
    
    if (url.startsWith(scope)) {
        const path = url.substring(scope.length);
        
        // 静的ファイル（jsなど）でない場合のみプロキシ処理
        if (path && !path.endsWith('.js') && !path.endsWith('.config.js')) {
            const decodedUrl = self.__scramjet$config.decodeUrl(path);
            
            event.respondWith(
                (async () => {
                    try {
                        const response = await fetch(decodedUrl, {
                            redirect: 'follow',
                            headers: event.request.headers
                        });
                        
                        // レスポンスの加工（本来はもっと複雑な書き換えが必要）
                        return response;
                    } catch (err) {
                        return new Response('Proxy Error: ' + err.message, { status: 500 });
                    }
                })()
            );
        }
    }
});
