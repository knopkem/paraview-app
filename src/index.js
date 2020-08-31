import vtkWSLinkClient from "vtk.js/Sources/IO/Core/WSLinkClient";
import vtkRemoteView from 'vtk.js/Sources/Rendering/Misc/RemoteView';
import SmartConnect from 'wslink/src/SmartConnect';
import { connectImageStream } from "vtk.js/Sources/Rendering/Misc/RemoteView";

document.body.style.padding = '0';
document.body.style.margin = '0';

function render(url, id)
{
    
    const divRenderer = document.createElement('div');
    
    divRenderer.style.position = 'relative';
    divRenderer.style.width = '50vw';
    divRenderer.style.height = '50vh';
    divRenderer.style.overflow = 'hidden';
    
    document.querySelector('body').appendChild(divRenderer);

    const config = { sessionURL: url };
    vtkWSLinkClient.setSmartConnectClass(SmartConnect);
    const clientToConnect = vtkWSLinkClient.newInstance();
    clientToConnect.onConnectionReady((validClient) => {
        console.log('connection ready');
        const session = validClient.getConnection().getSession();
        
        const viewStream = validClient.getImageStream().createViewStream(id);
        const remoteView = vtkRemoteView.newInstance({ session, viewStream });
        remoteView.setContainer(divRenderer);
        remoteView.render();
    });

    clientToConnect.onConnectionError(console.error);
    clientToConnect.onConnectionClose(console.error);
    clientToConnect.connect(config);
}
render('ws://localhost:9999/ws', -1);
render('ws://localhost:9998/ws', -1);

