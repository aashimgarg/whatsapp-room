import React from 'react'
import { Avatar, IconButton } from '@material-ui/core';
import './Chat.css';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useParams } from 'react-router-dom';
import db from './firebase';
import { useStateProviderValue } from "./StateProvider";
import firebase from 'firebase';
import EmojiPicker from "emoji-picker-react";
import {
    Close,
} from "@material-ui/icons";
import SendIcon from "@material-ui/icons/Send";
import jsPDF from 'jspdf';

function Chat() {
    const [emojiOpen, setEmojiOpen] = React.useState(false);

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

    const handleEmojiClick = (e, emojiObject) => {
        setInput(input + emojiObject.emoji);
    };
  
    const jspPdfGenerator  = () => {
        var doc = new jsPDF('p' , 'pt');
        const nameRoom = "Room - " + roomName
        doc.text(20 , 30 , nameRoom);
        for (var i = 0; i < messages.length; i += 1) {
            const a = messages[i].name 
            const b = messages[i].message
            const c = a + " : " + b;
            const d=  35 + 30*(i+1);
            doc.text(20 , d , c)        
      }
        doc.setFont('courier');
        doc.save('backup.pdf')
    }
  
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
                    <button style={{width:'70px' , height:'25px' , borderRadius:'10px'}} onClick = {jspPdfGenerator} > Backup </button>
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
            <div
                className="chatWindow--emojiarea"
                style={{ height: emojiOpen ? "200px" : "0px" }}
            >
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
                />
            </div>
            <div className="chat__footer">
                {emojiOpen ?
                    <div
                        className="chatWindow--btn"
                        onClick={() => setEmojiOpen(false)}
                        style={{ width: emojiOpen ? 40 : 0 }}
                    >
                        <Close style={{ color: "#919191" }} />
                    </div>
                    : null
                }
                <div className="chatWindow--btn" onClick={() => setEmojiOpen(true)}>
                    <InsertEmoticonIcon
                        style={{ color: emojiOpen ? "#009688" : "#919191" }}
                    />
                </div>
                <form>
                    <input  value={input} onChange={e => setInput(e.target.value)} placeholder="Type your text here..." type="text" />
                    <button disabled={!input} onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <IconButton >
                    <SendIcon  onClick={sendMessage} />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
