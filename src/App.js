import {io} from "socket.io-client"
import React from "react"
import './App.css';
import {useState,useEffect} from "react"

import icon from "./img/arrow.png"

const socket = io('http://localhost:3001/')

const listref = React.createRef();
const inputref = React.createRef();


function App() {
  const [emitText,setEmitText] = useState("");
  const [chatData,setChatData] = useState([]);

  useEffect(()=>{
    socket.on('msg', (data)=>{
      console.log(data)
      const newData = [data,false]
      setChatData(prev => [newData,...prev])
      })
  },[])

  const emitMsg = () => {
      if(emitText){
        socket.emit('msg',emitText);
        const newChatData = [emitText,true]
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
  
  return (
    <div className="App">
    <ul>
      {chatData?.map((data) => {
        return <li key={`list_key${data.id}`} className={data[1]?"abc":"bca"}>{data[0]}</li>
      })}
    </ul>
    <div className="inputSection">
      <form>
      <textarea className="text-input" ref={inputref} onChange={(data)=>{
      setEmitText(data.target.value);
      }} onKeyPress={onKeyPress}/>
      <input id="submitBtn" type="image" src={icon} alt="" onClick={(event)=>{
        event.preventDefault();
        emitMsg();
        }}></input>
      </form>
    </div>
    </div>
  );
}

export default App;
