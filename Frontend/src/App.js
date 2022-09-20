import logo from './logo.svg';
import './App.css';
import { socket } from './methods/Socket';
import {useState} from 'react'
import sha256 from 'sha256'




function App() {

  const [data, setdata] = useState(null)

  const getName=()=>{
      let name = document.getElementById('name').value
      setdata({name:name,blocks:0})
      socket.emit('register',name)
  }
  
  socket.off('getTime').on('getTime',(time)=>{
    console.log(time)
    setTimeout(() => {
      
      socket.emit('timeComplete')
    }, time*1000);

  })

  socket.off('getBlock').on('getBlock',(timestamp,data1,previousHash)=>{
    data1.minedBy = data.name
    data1.timestamp = new Date()
    console.log(timestamp,data1,previousHash)
    
    socket.emit('receiveBlock',timestamp,data1,previousHash,sha256(previousHash+timestamp+JSON.stringify(data1)))
  })

  socket.off('successMine').on('successMine',()=>{
    setdata({...data,blocks:data.blocks+1})
  })

  return (
    <div className="App">
      <div className='Container'>

      
     <div class="form-group w-50 m-3">
    <div className="m-2">Name</div>
    <input type="text" class="form-control" id='name' placeholder="Name"/>
    <button className='btn btn-success my-2' onClick={getName}>Submit</button>
    </div>
    {data != null?
    <div className="card">
      <h4><b>{data.name}</b></h4>
      <h6>Blocks Mined :{data.blocks}</h6>
  
    </div>:""}
  </div>
    </div>
  );
}

export default App;
