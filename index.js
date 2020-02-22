
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 3197 });

wss.on('connection', function connection(ws) {
	ws.roomId = "";
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		try{
			const data = JSON.parse(message);
			if(data.type === "connect"){
				ws.roomId = data.Id;
				ws.send(JSON.stringify({'type': 'meta', 'msg': 'connected.'}));
				wss.clients.forEach(client => {
					if(client !== ws && client.readyState === WebSocket.OPEN && ws.roomId === client.roomId){
						client.send(JSON.stringify({'type': 'require'}));
					}
				});
			}else if(data.type === "signaling"){
				wss.clients.forEach(client => {
					if(client !== ws && client.readyState === WebSocket.OPEN && ws.roomId === client.roomId){
						client.send(JSON.stringify({'type': 'signal', 'data': data.SDP}));
					}
				});
			}else if(data.type === "icecandi"){
				wss.clients.forEach(client => {
					if(client !== ws && client.readyState === WebSocket.OPEN && ws.roomId === client.roomId){
						client.send(JSON.stringify({'type': 'icecandi', 'data': data.SDP}));
					}
				});
			}
		}catch(e){
			console.warn(e);
		}
	});
});