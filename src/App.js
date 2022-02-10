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
    setChatData(prev => [...prev, newData])
    })
  },[])
  
  return (
    <div className="App">
    <input ref={inputref} type="text" onChange={(data)=>{
     setEmitText(data.target.value);
    }}/>
    <button onClick={()=>{
      if(emitText){
        socket.emit('msg',emitText);
        setEmitText("");
        inputref.current.value = "";
        const newChatData = [emitText,true]
        setChatData(prev=>[...prev,newChatData]);
      };
      
      }}>클릭</button>
    <ul>
      {chatData?.map((data) => {
        console.log(`data:${data}`);
        return <li key={`list_key${data.id}`} className={data[1]?"abc":"bca"}>{data[0]}</li>
      })}
    </ul>
    </div>
  );
}

export default App;
