import React from 'react';

interface MessageProps {
    message: string;
    sender: string;
    timestamp: string;
    avatarURL?: string;
    isClientUser?: boolean;
    senderId?: string;
}

const Message: React.FC<MessageProps> = (props) => {

    if (props.isClientUser) {
        return (<div style={{ display: 'flex', justifyContent: 'flex-end' }} >
            <div>
                <h5 style={{ textAlign: 'end' }} className="card-subtitle">{props.sender}</h5>
                <p className="card-text">{props.message}</p>

            </div>
        </div>);
    }
    return (<div >
        <img style={{ margin: '0.2rem 0.5rem 1rem 0', borderRadius: '50%' }} src="https://unsplash.it/50" className="float-left" alt='avt' />
        <h5 className="card-subtitle">{props.sender}</h5>
        <p className="card-text">{props.message}</p>
    </div>);
}
export default Message;
