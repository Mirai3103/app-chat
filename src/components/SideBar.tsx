import * as React from 'react';
import sidebarStyle from '../css/sidebar.module.css';
import { AuthContext } from '../contexts/AuthContext';
import Server from '../core/CallServer';
import { Room } from './ChatWindow';
import Toast from './Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
interface SideBarProps {
    currentRoom: number;
    setCurrentRoom: (roomId: number) => void;
    listRoom: Room[];
    className?: string;
    id?: string;
}

const SideBar: React.FC<SideBarProps> = ({ currentRoom, setCurrentRoom, listRoom, className, id }) => {
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
    const handleCloseSidebar = () => {
        const sidebar = document.getElementById('sidenav');
        if (sidebar) {
            sidebar.classList.remove('width-50');
            sidebar.classList.add('width-0');
        }
    }
    return (<div id={id} className={`${sidebarStyle['side-bar']} card ${className}`}>

        <div className="card-header">
            <img alt='avt' src='https://unsplash.it/50' style={{ borderRadius: '50%', float: 'left' }}></img>
            <div style={{ marginTop: '1em', marginLeft: '0.5em', float: 'left' }}>{user?.fullName}</div>
            <div style={{ float: 'right' }}>
                <input type="button" onClick={handleLogout} style={{ marginLeft: '0.5em', marginTop: '0.2em', marginRight: '3em' }} className="paper-btn btn-small btn-primary" value="Logout" />
                <span id="close"><FontAwesomeIcon size='2x' icon={faClose} onClick={handleCloseSidebar} /></span>
            </div>
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