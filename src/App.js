import React, { Component }  from 'react';
import Nav from './components/nav'
import Farm from './components/farm';
import './style.css'
import TokenList from './components/farm/TokenList.json'
import Web3 from 'web3'
import FarmAbi from './contracts/Farm.json'
import TokenAbi from  './components/farm/TokenAbi.json'



class App extends Component {
    constructor(props) {
        super(props);
        this.state ={
            address: '0x0000',
            login: false,
            farm: ''
        }
    }

    async loadWeb3(){
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
            this.loadBlockchain()
        } else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
            this.loadBlockchain()
        } 
    }

    async loadBlockchain(){
        //Load address
        const web3 = window.web3
        let accounts = await web3.eth.getAccounts()
        //Address events
        window.ethereum.on('accountsChanged', async()=>{ //On change Address
            let accounts = await web3.eth.getAccounts()
            this.setState({address : accounts[0] , login: true})
            console.log(`Account changed: ${accounts[0]}`)
        })
        window.ethereum.on('disconnect', ()=>{ //On disconect
            this.setState({address : 0x0000 , login: false})
            console.log('sss')
        })
        this.setState({address:accounts[0] , login: true})
        console.log(`Account loged: ${accounts[0]}`)

        //Load Farm
        const networkID = await web3.eth.net.getId()
        const farmData = FarmAbi.networks[networkID]
        if(farmData){
            const farm =  new web3.eth.Contract(FarmAbi.abi, farmData.address)
            window.farm =  farm
            console.log(`Farm loaded: ${farmData.address}`)
        } 
        //Load LP
        const tokenList = TokenList.data
        window.tokens = []
        for (let i = 0; i < tokenList.length; i++) {
            const TokenAddress = tokenList[i].lpAddress
            window.tokens.push(new web3.eth.Contract(TokenAbi, TokenAddress))
        }

        this.forceUpdate() //Update the Web after load all 

        //window.farm.methods.deposit(100, 0).send({from: this.state.address})

    }

   

    componentDidMount(){
        this.loadWeb3()
    }
    
render(){
    return <div>
    <Nav address={this.state.address}/> 
    <h1 style={{marginBottom: 25, color:'transparent'}}>Test</h1>
    {/*Render farms from farms.jsonc */}
  
    <div className="row d-flex justify-content-center">
    {TokenList.data.map((farm) => {
       return <div key={farm.id} className="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center h-100">
        <Farm apy={farm.apy} login={this.state.login} address={this.state.address}  farm={farm}/>
        </div>   
    })}
    </div>
    
     
    </div>
  }
}


export default App;
