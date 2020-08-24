import React from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import './Chat.css';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useStateProviderValue } from "./StateProvider";
import firebase from 'firebase';

function Chat() {
    const [seed, setSeed] = React.useState('');
    const [input, setInput] = React.useState('');
    const [roomName, setRoomName] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const [{ user }] = useStateProviderValue();
    const { roomId } = useParams();

    React.useEffect(() => {
        if (roomId) {
            db
                .collection("rooms")
                .doc(roomId)
                .onSnapshot(snapshot => {
                    setRoomName(snapshot.data().name)
                })

            db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) =>
                    setMessages(snapshot.docs.map((doc) => doc.data()))
                )

            setSeed(Math.floor(Math.random() * 5000))
        }
    }, [roomId])

    const sendMessage = (event) => {
        event.preventDefault();

        db.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .add({
                name: user.displayName,
                message: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setInput("");
    };


    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3 style={{ margin: '0' }}>{roomName}</h3>
                    <h4 style={{ margin: '0', fontWeight: '400' }}>
                        Last seen{" "}
                        {new Date(
                            messages[messages.length - 1]?.
                                timestamp?.toDate()
                        ).toUTCString()}</h4>
                </div>
                <div className="chat__headerRight">
                    <IconButton >
                        <SearchIcon />
                    </IconButton>
                    <IconButton >
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton >
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">

                {messages.map((message) => (
                    <p className={`chat__message ${message.name === user.displayName
                        && "chat__reciever"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}

            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your text here..." type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat
