import {io} from "socket.io-client"
import React from "react"
import './App.css';
import {useState,useEffect} from "react"
import UserNameModal from './userNameModal.js'
import RoomNameModal from './roomNameModal.js'
import icon from "./img/arrow.png"
import {AiOutlineMenu} from "react-icons/ai"
import {BiMessageAdd} from "react-icons/bi";

const socket = io('http://localhost:3001/')

const listref = React.createRef();
const inputref = React.createRef();
const usernameref = React.createRef();
const roomName = React.createRef();

let username = "";


function App() {
  const [emitText,setEmitText] = useState("");
  const [chatData,setChatData] = useState([]);
  const [roomList,setRoomList] = useState([]);
  const [userList,setUserList] = useState([]);
  const [userCount,setUserCount] = useState();
  const [currentRoomName,setCurrentRoomName] = useState("");
  const [isDropDownUserList,setIsDropDownUserList] = useState(false);
  const [isRoomModalOpen,setIsRoomModalOpen] = useState(false);
  const [isUserNameModalOpen, setIsUserNameModalOpen] = useState(false);
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
      socket.on('room_data',(data,roomName,userCount)=>{
        setRoomList(data);
        setCurrentRoomName(roomName);
        setUserCount(userCount);
        console.log(userCount);
      })
      socket.on('userList',(data)=>{
        setUserList(data);
      })
    })
  },[])

  function getRoomList(){
    socket.emit('roomList');
  }

  function sendEmitMsg(){
      if(emitText){
        socket.emit('msg',emitText);
        const newChatData = [username,emitText,"myChat"];
        setChatData(prev=>[newChatData,...prev]);
      };
      setEmitText("");
      inputref.current.value = "";
  }

  function putChatDataFront(username,msg,dataType){
    const newData = [username,msg,dataType]
    setChatData(prev => [newData,...prev])
  }


  function pressEnter(e,func){
    if(e.key == 'Enter' && !e.shiftKey){
      e.preventDefault();
      func();
    }
  };

  function enterRoom(){
    setIsRoomList(false);
    socket.emit('enter_room', roomName.current.value );
  };

  function clickEnterRoom(e){
    setIsRoomList(false);
    socket.emit('enter_room', e.target.innerText );
  };


  function openModal(){
    setIsUserNameModalOpen(true);
  };

  function userNameCloseModal(){
    username = usernameref.current.value;
    if(!username){
      username = `annon-${socket.id.slice(0,5)}`
    }
    socket.emit('username',username);
    setIsUserNameModalOpen(false);
  };

  function roomNameCloseModal(){
    enterRoom();
    setIsRoomModalOpen(false);
  }
  

  function toggleDropDownUserList(){
    setIsDropDownUserList(prev => !prev);
  }
  function cancelDropDown(){
    if(isDropDownUserList){
      setIsDropDownUserList(false);
    }
  }
  function goChoiceRoom(){
    socket.emit("leave_room");
    setChatData([]);
    getRoomList();
    setIsRoomList(true);
  }
  
  return (
    <div className="App" onClick={cancelDropDown}>
    
    {isServerConnect && (isRoomList ? 
    <>
    <div className="menubar roomSelect">
      <BiMessageAdd className="icon" onClick={()=>setIsRoomModalOpen(true)} />
    </div>
      <ul className="chatData" ref={listref}>
        {roomList?.map((data,i) => <li key={`roomList_${i}`} onClick={clickEnterRoom}>{data}</li>)}
      </ul>

      <UserNameModal open={isUserNameModalOpen} close={userNameCloseModal} header="닉네임을 설정해주세요">
        <input type="text" ref={usernameref}></input>
      </UserNameModal>
      <RoomNameModal open={isRoomModalOpen} close={roomNameCloseModal} header="만드실 방의 이름을 적으세요">
        <input 
        type="text" 
        className="inputRoomName" 
        ref={roomName} 
        onKeyPress={(e)=>pressEnter(e,enterRoom)}
        placeholder="방 이름을 넣으세요">
        </input>
      </RoomNameModal>
    </>:
    <>
    <div className="menubar enterRoom">
    <div className="roomName">{`${currentRoomName}( ${userCount} )`}</div>
    <AiOutlineMenu onClick={toggleDropDownUserList} className="icon"/>
    </div>
      <ul className="chatData">
        {chatData?.map((data,index) => {
          return <li key={`list_key${index}`} className={data[2]}>{`${data[0]}:${data[1]}`}</li>
        })}
      </ul>
      <ul className={`userList ${isDropDownUserList?"open":""}`}>
        {userList?.map((data,i) => <li key={`userList_${i}`}>{data}</li>)}
      </ul>
      <div className="inputSection">
        <form>
          <textarea className="text-input" ref={inputref} onChange={(data)=>{
          setEmitText(data.target.value);
          }} onKeyPress={(e)=>pressEnter(e,sendEmitMsg)}/>
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
