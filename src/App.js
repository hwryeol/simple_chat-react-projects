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


function App() {
  const [emitText,setEmitText] = useState("");
  const [chatData,setChatData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    username = usernameref.current.value;
    socket.emit('username',username);
    setModalOpen(false);
  };


  useEffect(()=>{
    openModal();
    socket.on('msg', (username,message)=>{
      const newData = [username,message,"msg"]
      setChatData(prev => [newData,...prev])
      })
    socket.on('notice', (data)=>{
      const newData = [data,"notice"]
      setChatData(prev => [newData,...prev])
      })
  },[])

  const emitMsg = () => {
      if(emitText){
        socket.emit('msg',emitText);
        const newChatData = [username,emitText,"myChat"]
        setChatData(prev=>[newChatData,...prev]);
      };
      setEmitText("");
      console.log(inputref)
      inputref.current.value = "";
  }

  const onKeyPress=(e)=>{
    if(e.key == 'Enter' && !e.shiftKey){
      e.preventDefault();
      emitMsg();
    }
  }
  const enter= (e)=>{
    if(e.key == 'Enter' && !e.shiftKey){
      e.preventDefault();
      socket.emit('enter_room', roomName.current.value )
    }
  }
  
  return (
    <div className="App">
    <ul>
      {chatData?.map((data) => {
        console.log(data);
        return <li key={`list_key${data.id}`} className={data[2]}>{`${data[0]},${data[1]}`}</li>
      })}
    </ul>
    <div className="inputSection">
      <form>
      <input type="text" ref={roomName} onKeyPress={enter}></input>
      <textarea className="text-input" ref={inputref} onChange={(data)=>{
      setEmitText(data.target.value);
      }} onKeyPress={onKeyPress}/>
      <input id="submitBtn" type="image" src={icon} alt="" onClick={(event)=>{
        event.preventDefault();
        emitMsg();
        }}></input>
      </form>
      <Modal open={modalOpen} close={closeModal} header="modal heading">
        <input type="text" ref={usernameref}></input>
      </Modal>
    </div>
    </div>
  );
}

export default App;
