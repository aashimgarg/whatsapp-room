import React from 'react'
import './Sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import SidebarChat from './SidebarChat';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import db from './firebase';
import { useStateProviderValue } from "./StateProvider";

function Sidebar() {
    const [rooms, setRooms] = React.useState([]);
    const [filteredRooms, setfilteredRooms] = React.useState([]);
    const [search, setSearch] = React.useState("")
    const [checked, setChecked] = React.useState(false);

    const toggleChecked = () => {
      setChecked((prev) => !prev);
    };
    const [{ user }, dispatch] = useStateProviderValue();
    React.useEffect(() => {
        const unsubscribe = db
            .collection('rooms')
            .onSnapshot(snapshot => {
                setRooms(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })))
            })

        return () => {
            unsubscribe();
        }
    }, [])

    React.useEffect(() => {
        setfilteredRooms(rooms.filter(room => {
            return room.data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        }))
    }, [search])

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="sidebar__headerRight">
                   
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={checked} onChange={toggleChecked} />}
                                label="Change Theme"
                            />
                        </FormGroup>
                   

                </div>
            </div>
            <div className="sidebar__search">
                <SearchIcon />
                <input value={search} placeholder="Search or start" onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat />

                {
                        rooms.map(room => (
                            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                        ))
                }
                {
                        filteredRooms.map(room => (
                            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                        ))
                }

            </div>

        </div>
    )
}

export default Sidebar
