const http = require("http");

const proxy = http.createServer((req, res) => {
	if (req.method === "OPTIONS") {
		// 处理 OPTIONS 请求
		res.writeHead(204, {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		});
		res.end();
	} else {
		// 设置响应头以允许跨域请求
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS"
		);
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);

		const options = {
			host: "127.0.0.1",
			port: 8080,
			path: req.url,
			// method: "POST",
			method: req.method,
			headers: req.headers,
		};
		const proxyReq = http.request(options, (proxyRes) => {
			// 接收目标服务器的响应并转发给客户端
			res.writeHead(proxyRes.statusCode, proxyRes.headers);
			proxyRes.pipe(res);
		});

		// 将客户端的请求数据发送给目标服务器
		req.pipe(proxyReq);
	}
});

// 监听代理服务器的端口号
const port = 3000;
proxy.listen(port, () => {
	console.log(`Proxy server is running on port ${port}`);
});
