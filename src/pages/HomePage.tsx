import * as React from 'react';
import SideBar from '../components/SideBar';
import ChatWindow from '../components/ChatWindow';
import Server from '../core/CallServer';
export interface Room {
    id: number;
    name: string;
}
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());

    React.useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

const HomePage: React.FC = () => {
    const [currentRoom, setCurrentRoom] = React.useState<number>(-1);
    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [token, setToken] = React.useState<string>('');
    const { height, width } = useWindowDimensions();
    console.log(height, width);
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

        <div id='left-screen' >
            <SideBar id={width < 700 ? 'sidenav' : ''} className={width < 700 ? 'sidenav' : ''} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} listRoom={rooms} />
        </div>

        <div id='right-screen' >
            <ChatWindow token={token} roomId={currentRoom} listRoom={rooms} />
        </div>

    </div >);
}

export default HomePage;