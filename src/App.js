import {io} from "socket.io-client"
import React from "react"
import './App.css';
import {useState,useEffect} from "react"
import Modal from './modal.js'
import icon from "./img/arrow.png"

const socket = io('http://localhost:3001/')

const listref = React.createRef();
const inputref = React.createRef();
const usernameref = React.createRef();
const roomName = React.createRef();

let username = "";

class UserList{

  

}


function App() {
  const [emitText,setEmitText] = useState("");
  const [chatData,setChatData] = useState([]);
  const [roomList,setRoomList] = useState([]);
  const [userList,setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoomList,setIsRoomList] = useState(true);
  const [isServerConnect,setIsServerConnect] = useState(false);

  useEffect(()=>{
    openModal();
    socket.on('connect', ()=>{
      setIsServerConnect(true);
      socket.on('disconnect', ()=>{
        setIsServerConnect(false);
        window.location.reload();
      })
      socket.on('msg', (username,msg)=>{
        putChatDataFront(username,msg,'msg');
        })
      socket.on('notice', (msg)=>{
        putChatDataFront('server',msg,'notice');
        })
      socket.on('room_data',(data)=>{
        setRoomList(data);
      })
      socket.on('userList',(data)=>{
        setUserList(data);
      })
    })
  },[])

  function sendEmitMsg(){
      if(emitText){
        socket.emit('msg',emitText);
        const newChatData = [username,emitText,"myChat"]
        setChatData(prev=>[newChatData,...prev]);
      };
      setEmitText("");
      inputref.current.value = "";
  }

  function putChatDataFront(username,msg,dataType){
        const newData = [username,msg,dataType]
        setChatData(prev => [newData,...prev])
      }

  function PressEnterSendEmitMsg(e){
    if(e.key == 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendEmitMsg();
    }
  }
  function enter(e){
    if(e.key == 'Enter' && !e.shiftKey){
      e.preventDefault();
      setIsRoomList(false);
      socket.emit('enter_room', roomName.current.value )
    }
  }
  function aa(e){
    setIsRoomList(false);
    socket.emit('enter_room', e.target.innerText );
  }

  function openModal(){
    setIsModalOpen(true);
  };
  function closeModal(){
    username = usernameref.current.value;
    if(!username){
      username = `annon-${socket.id.slice(0,5)}`
    }
    socket.emit('username',username);
    setIsModalOpen(false);
  };

  
  return (
    <div className="App">
    {isServerConnect && (isRoomList ? 
    <>
      <ul className="chatData">
        {roomList?.map((data,i) => <li key={`roomList_${i}`} onClick={aa}>{data}</li>)}
      </ul>
      <input type="text" ref={roomName} onKeyPress={enter}></input>
      <Modal open={isModalOpen} close={closeModal} header="modal heading">
        <input type="text" ref={usernameref}></input>
      </Modal>
    </>:
    <>
      <ul className="chatData">
        {chatData?.map((data) => {
          console.log(data);
          return <li key={`list_key${data.id}`} className={data[2]}>{`${data[0]}:${data[1]}`}</li>
        })}
      </ul>
      <ul className="userList">
        {userList?.map((data,i) => <li key={`userList_${i}`}>{data}</li>)}
      </ul>
      <div className="inputSection">
        <form>
          <textarea className="text-input" ref={inputref} onChange={(data)=>{
          setEmitText(data.target.value);
          }} onKeyPress={PressEnterSendEmitMsg}/>
          <input id="submitBtn" type="image" src={icon} alt="" onClick={(event)=>{
            event.preventDefault();
            sendEmitMsg();
          }}></input>
        </form>
        </div>
    </>
    )}
    </div>
    );
}

export default App;
