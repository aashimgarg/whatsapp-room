import React from 'react'
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';
import db from './firebase';
import { Link } from 'react-router-dom';

function SidebarChat({ addNewChat, id, name }) {
    const [seed, setSeed] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    
    React.useEffect(()=>{
        if(id){
            db.collection("rooms")
            .doc(id)
            .collection('messages')
            .orderBy('timestamp','desc')
            .onSnapshot(snapshot => (
              setMessages(snapshot.docs.map((doc) => doc.data()))
            ))
        }
      }, [id]);

    const createRoom = () => {
        const roomName = prompt(" Please enter the room name ");

        if (roomName) {
            db.collection("rooms").add({
                name: roomName,
            })
        }
    };

    return !addNewChat ? (
        <Link style={{outline:'none'}}to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h3 className="sidebarChat__roomName" >{name}</h3>
                    <p className="sidebarChat__roomName" > {messages[0]?.message}</p>
                </div>
                <hr className="sidebarChat__roomN" />
            </div>
        </Link>
    ) : (
            <div onClick={createRoom}
                className="sidebarChat__newChat">
                Add a new chat
            </div>
        )
}

export default SidebarChat
