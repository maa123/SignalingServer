const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3197 });



wss.on('connection', function connection(ws) {
	ws.roomId = "";
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		try{
			const data = JSON.parse(message);
			if(data.type === "connect"){
				ws.roomId = data.Id;
				ws.send(JSON.stringify({'type': 'meta', 'msg': 'connected.'}));
				const targ = wss.clients.find(client => {
					if(client !== ws && client.readyState === WebSocket.OPEN && ws.roomId === client.roomId){
						return true;
					}return false;
				});
				if(targ){
					targ.send(JSON.stringify({'type': 'require'}));
				}
			}else if(data.type === "signaling"){
				const targ = wss.clients.find(client => {
					if(client !== ws && client.readyState === WebSocket.OPEN && ws.roomId === client.roomId){
						return true;
					}return false;
				});
				if(targ){
					targ.send(JSON.stringify({'type': 'signal', 'data': data.SDP}));
				}
			}
		}catch(e){
			console.warn(e);
		}
	});
	//ws.send('something');
});