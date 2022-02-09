import logo from './logo.svg';
import {io} from "socket.io-client"
import './App.css';

const socket = io('http://localhost:3000/')

socket.on('msg', (data)=>{
  console.log(data);
})

function App() {
  return (
    <div className="App">
    <button onClick={()=>{
      console.log("click");
      socket.emit('msg',"rararara");
    }}>
    클릭
    </button>
    </div>
  );
}

export default App;
