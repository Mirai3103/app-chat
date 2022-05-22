import * as React from 'react';
import sidebarStyle from '../css/sidebar.module.css';
import { AuthContext } from '../contexts/AuthContext';
import Server from '../core/CallServer';
import { Room } from './ChatWindow';
import Toast from './Toast';
interface SideBarProps {
    currentRoom: number;
    setCurrentRoom: (roomId: number) => void;
    listRoom: Room[];
}

const SideBar: React.FC<SideBarProps> = ({ currentRoom, setCurrentRoom, listRoom }) => {
    const [user] = React.useContext(AuthContext);
    const [joinRoomId, setJoinRoomId] = React.useState<number | undefined>(undefined);
    const handleLogout = () => {
        Server.logout().then(res => {
            window.location.reload();
        }).catch(err => {
            console.log(err);
        });
    }
    const handleJoinRoom = () => {
        if (joinRoomId) {
            Server.joinARoom(joinRoomId).then(res => {
                setJoinRoomId(undefined);
                window.location.reload();
            }).catch(err => {
                Toast.error(err.response.data.message);
            });
        }
    }

    const handleInputRoomId = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number.isInteger(Number(event.target.value))) {
            setJoinRoomId(Number(event.target.value));
        }
    }
    return (<div className={`${sidebarStyle['side-bar']} card`}>

        <div className="card-header">
            <img alt='avt' src='https://unsplash.it/50' style={{ borderRadius: '50%', float: 'left' }}></img>
            <div style={{ marginTop: '1em', marginLeft: '0.5em', float: 'left' }}>{user?.fullName}</div>
            <input type="button" onClick={handleLogout} style={{ float: 'right', marginLeft: '0.5em', marginTop: '0.2em' }} className="paper-btn btn-small btn-primary" value="Logout" />
        </div>
        <div className="card-body">
            <h4 className="card-title">List room</h4>
            <div className="listRoom tabs">
                <ul >
                    {listRoom[0] ? listRoom.map((room, index) => {
                        if (room.id === currentRoom) {
                            return (<li key={index} className={`${sidebarStyle.activate}`}>{room.name}</li>);
                        }
                        return <li onClick={() => setCurrentRoom(room.id)} key={index}>
                            {room.name}
                        </li>
                    }) : <div>khong co</div>}
                </ul>
            </div>
            <input required style={{ width: '100%' }} value={joinRoomId ? joinRoomId : ''} onChange={handleInputRoomId} name='joinRoomId' type="text" placeholder="Join a room with id" /><button onClick={handleJoinRoom}>Add Room</button>

        </div>
    </div >);
}

export default SideBar;