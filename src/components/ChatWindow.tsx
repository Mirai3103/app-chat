import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import chatWindowStyle from '../css/chatwindow.module.css'
import Message from './Message';
import server from '../core/CallServer';
export interface Room {
    id: number;
    name: string;
}
interface ChatWindowProps {
    roomId: number;
    listRoom: Room[];
    token: string;
}
interface MessagePayload {
    userId: string;
    roomId: number;
    message: string;
    fullName: string;
}
interface oldMessage {
    "message": string;
    "user.fullName": string;
    userId: string;
}
const ChatWindow: React.FC<ChatWindowProps> = ({ roomId, listRoom, token }) => {
    const [clientUser] = React.useContext(AuthContext);
    const [userMessage, setUserMessage] = React.useState<string>('');
    const room = listRoom.find(room => room.id === roomId);
    const [messages, setMessages] = React.useState<MessagePayload[]>([]);
    const [listOldMessage, setListOldMessage] = React.useState<oldMessage[]>([]);
    const [user] = React.useContext(AuthContext);
    const [socket, setSocket] = React.useState<WebSocket | null>();
    React.useEffect(() => {
        if (token.length > 0 && !socket) {
            setSocket(new WebSocket(`ws://localhost:8081/ws?token=${token}`));
        }
        return () => {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [socket, token]);
    React.useEffect(() => {
        const sendButton = document.getElementById('send-button');
        if (socket) {
            socket.onopen = () => {
                console.log(token);
                console.log('connected');
            }
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                setMessages(messages => [...messages, message]);
            }
            socket.onclose = () => {
                console.log('disconnected');
            }
            const handleSendMessage = () => {

                const payload: MessagePayload = {
                    userId: (user as any).id,
                    roomId: roomId,
                    message: userMessage,
                    fullName: user?.fullName || 'unknow'
                }
                const payloadString = JSON.stringify(payload);
                socket.send(payloadString);
                setUserMessage('');
            }
            if (sendButton) {
                sendButton.addEventListener('click', handleSendMessage);
            }
            return () => {
                sendButton?.removeEventListener('click', handleSendMessage);
            }
        }
    }, [socket, userMessage, roomId, user, token]);

    React.useEffect(() => {
        if (roomId !== -1) {
            server.getAllMessage(roomId).then(res => {

                const old = res.data.messages.map((message: oldMessage) => {
                    return {
                        "message": message.message,
                        "user.fullName": message["user.fullName"],
                        userId: message.userId
                    }
                });
                console.log(old);
                setListOldMessage(old);
            }).catch(err => {
                console.log(err.response.data.message);
            });
        }
    }, [roomId]);

    return (<div className={`${chatWindowStyle['chatwindow']} card`}>
        <div className="card-header" ><span popover-right={'id: ' + room?.id}>{room?.name}</span></div>
        <div className="card-body" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
            {listOldMessage.map((message: oldMessage, index) => {
                return (<Message key={index} message={message.message} sender={message["user.fullName"]} isClientUser={clientUser?.id.endsWith(message.userId)} timestamp='13h30' />)
            })}
            {messages.map((message, index) => <Message key={index} isClientUser={clientUser?.id.endsWith(message.userId)} message={message.message} sender={message.fullName} timestamp='13h30' />)}
        </div>
        <div className="card-footer">
            <div className="form-group">
                <input type="text" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} style={{ display: 'inline', width: '80%' }} placeholder="message" />
                <input id='send-button' type="button" style={{ display: 'inline', width: '20%' }} className="btn-secondary-outline" value="Send" />
            </div>
        </div>
    </div>);
}
export default ChatWindow;