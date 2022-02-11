import {io} from "socket.io-client"
import React from "react"
import './App.css';
import {useState,useEffect} from "react"

const socket = io('http://localhost:3001/')

const listref = React.createRef();
const inputref = React.createRef();


function App() {
  const [emitText,setEmitText] = useState("");
  const [chatData,setChatData] = useState([]);

  useEffect(()=>{
    socket.on('msg', (data)=>{
      const newData = [data,false]
      setChatData(prev => [newData,...prev])
      })
  },[])
  
  return (
    <div className="App">
    <ul>
      {chatData?.map((data) => {
        return <li key={`list_key${data.id}`} className={data[1]?"abc":"bca"}>{data[0]}</li>
      })}
    </ul>
    <div className="inputSection">
      <form>
      <input ref={inputref} type="text" onChange={(data)=>{
      setEmitText(data.target.value);
      }}/>
      <input type="submit" value="클릭" onClick={(event)=>{
        event.preventDefault();
        if(emitText){
          socket.emit('msg',emitText);
          setEmitText("");
          inputref.current.value = "";
          const newChatData = [emitText,true]
          setChatData(prev=>[newChatData,...prev]);
        };
        }}/>
      </form>
    </div>
    </div>
  );
}

export default App;
