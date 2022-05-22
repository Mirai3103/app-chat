import * as React from 'react';
import SideBar from '../components/SideBar';
import ChatWindow from '../components/ChatWindow';
import Server from '../core/CallServer';
export interface Room {
    id: number;
    name: string;
}
const HomePage: React.FC = () => {
    const [currentRoom, setCurrentRoom] = React.useState<number>(-1);
    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [token, setToken] = React.useState<string>('');
    React.useEffect(() => {
        Server.getListRoom().then(res => {
            setRooms(res.data.rooms);
            if (res.data.rooms.length > 0) {
                setCurrentRoom(res.data.rooms[0].id);
            }

        }).catch(err => {
            console.log(err);
        });
    }, []);
    React.useEffect(() => {
        if (currentRoom !== -1) {
            Server.getChatToken(currentRoom).then(res => {
                setToken(res.data.ticket);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [currentRoom]);

    console.log(token)
    return (<div className='container-lg'>

        <div style={{ width: '20%', float: 'left' }}>
            <SideBar currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} listRoom={rooms} />
        </div>

        <div style={{ width: '80%', float: 'left' }}>
            <ChatWindow token={token} roomId={currentRoom} listRoom={rooms} />
        </div>

    </div >);
}

export default HomePage;