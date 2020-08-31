import 'normalize.css';

import SmartConnect from 'wslink/src/SmartConnect';

import RemoteRenderer from 'paraviewweb/src/NativeUI/Canvas/RemoteRenderer';
import SizeHelper from 'paraviewweb/src/Common/Misc/SizeHelper';
import ParaViewWebClient from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';

document.body.style.padding = '0';
document.body.style.margin = '0';

function render(url) {
    const divRenderer = document.createElement('div');
    document.body.appendChild(divRenderer);

    divRenderer.style.position = 'relative';
    divRenderer.style.width = '50vw';
    divRenderer.style.height = '50vh';
    divRenderer.style.overflow = 'hidden';

    const config = { sessionURL: url };
    const smartConnect = SmartConnect.newInstance({ config });
    smartConnect.onConnectionReady((connection) => {
      console.log('connection ready');
      const pvwClient = ParaViewWebClient.createClient(connection, [
        'MouseHandler',
        'ViewPort',
        'ViewPortImageDelivery',
      ]);
      const renderer = new RemoteRenderer(pvwClient);
      renderer.setContainer(divRenderer);
      renderer.onImageReady(() => {
        console.log('We are good');
      });
      window.renderer = renderer;
      SizeHelper.onSizeChange(() => {
        renderer.resize();
      });
      SizeHelper.startListening();
    });
    smartConnect.connect();
}

render('ws://localhost:9999/ws');
render('ws://localhost:9998/ws');
