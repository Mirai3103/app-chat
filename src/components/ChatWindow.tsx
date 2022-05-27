import * as React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import chatWindowStyle from '../css/chatwindow.module.css'
import Message from './Message';
import server from '../core/CallServer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Socket, io } from 'socket.io-client';
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
    message: string;
    roomId: number;
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
    const [socket, setSocket] = React.useState<Socket | null>();
    const userMessRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (token.length > 0 && !socket) {
            // setSocket(new WebSocket(`wss://realtimechatlaffy.herokuapp.com/ws?token=${token}`));
            const socketio = io(`https://realtimechatlaffy.herokuapp.com/`, {
                auth: {
                    token
                }
            })
            socketio.io.on('open', () => {
                console.log('connected');
                socketio.emit('join', roomId);
            });
            socketio.on("connect_error", (err) => {
                console.log(err.message); // prints the message associated with the error
            });
            setSocket(socketio);
        }
        return () => {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [roomId, socket, token]);
    const handleSendMessage = () => {
        const payload: MessagePayload = {
            userId: (user as any).id,
            message: userMessage,
            roomId: roomId,
            fullName: user?.fullName || 'unknow'
        }
        socket?.emit('message', payload);
        setUserMessage('');
    }
    const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserMessage(e.target.value);
    }
    React.useEffect(() => {
        if (socket) {
            console.log("hu")
            socket.on('message', (data: MessagePayload) => {
                console.log(data);
                setMessages(messages => [...messages, data]);
            });
            socket.io.on('close', () => {
                console.log('disconnected');
            });
        }
    }, [socket, roomId, user, token]);

    React.useEffect(() => {
        if (roomId !== -1) {
            setMessages([]);

            server.getAllMessage(roomId).then(res => {

                const old = res.data.messages.map((message: oldMessage) => {
                    return {
                        "message": message.message,
                        "user.fullName": message["user.fullName"],
                        userId: message.userId
                    }
                });
                setListOldMessage(old);
            }).catch(err => {
                console.log(err.response.data.message);
            });
        }
    }, [roomId]);
    const handleOpenSidebar = () => {
        const sidebar = document.getElementById('sidenav');
        if (sidebar) {
            sidebar.classList.remove('width-0');
            sidebar.classList.add('width-50');
        }
    }
    React.useEffect(() => {
        let element = document.getElementById("scrollableDiv");
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    });
    return (<div className={`${chatWindowStyle['chatwindow']} card`}>
        <div className="card-header" style={{ flexShrink: 0 }}>
            <span onClick={handleOpenSidebar} id='openbaricon'><FontAwesomeIcon size='2x' icon={faBars} /></span>

            <span popover-right={'id: ' + room?.id}>{room?.name}</span></div>
        <div className="card-body" id='scrollableDiv' style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>



            {listOldMessage.map((message: oldMessage, index) => {
                return (<Message key={index} message={message.message} sender={message["user.fullName"]} isClientUser={clientUser?.id.endsWith(message.userId)} timestamp='13h30' />)
            })}
            {messages.map((message, index) => <Message key={index} isClientUser={clientUser?.id.endsWith(message.userId)} message={message.message} sender={message.fullName} timestamp='13h30' />)}

        </div>
        <div className="card-footer" style={{ flexShrink: 0 }}>
            <div className="form-group">
                <input type="text" value={userMessage} ref={userMessRef} onChange={handleChangeMessage} style={{ display: 'inline', width: '80%' }} placeholder="message" />
                <input id='send-button' onClick={handleSendMessage} type="button" style={{ display: 'inline', width: '20%' }} className="btn-secondary-outline" value="Send" />
            </div>
        </div>
    </div >);
}
export default ChatWindow;