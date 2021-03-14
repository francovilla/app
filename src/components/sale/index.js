import {React, Component, Fragment} from 'react'
import './style.css'
import {ProgressBar} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import SaleIf from '../../contracts/HawkSale.json'
import Web3 from 'web3'
import Transactions from './components/transaction'

class Sale extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            balance: 0,
            inputValue: 0,
            tokenCost: 1000,
            loading: false,
            maxAmount: 500,
            bnbRaised: 0,
            userBuyed: 0,
            purchases: [],
            toStart: 0,
            currentBlock: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.buyTokens = this.buyTokens.bind(this)
    }

    handleChange(e){
        this.setState({inputValue: e.target.value * (10 ** 18)})
    }
    loadingButton(text){
        return <div>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> {text}
        </div>
    }

    button(text, icon=undefined){
        return <div>
            
           <i className={icon}></i> {text}
        </div>
    }

    async buyTokens(){
        this.setState({loading: true})
        try {
            const sale = window.sale
            await sale.methods.buyTokens().send({from: this.props.address, value: this.state.inputValue})
            this.setState({loading: false})
        } catch (error) {
            console.log(error)
            this.setState({loading: false})
        }
        
    }

    async loadSale(){
        try {
            const web3 = window.web3
            const networkID = await web3.eth.net.getId()
            const saleData = SaleIf.networks[networkID]
            if(saleData){
                const sale =  new web3.eth.Contract(SaleIf.abi, saleData.address)
                window.sale = sale
                console.log(`Sale loaded: ${saleData.address}`)
            }   
            this.loadData()
        } catch (error) {
            console.log(error)
        }  
    }
   
    async loadWeb3(){
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
           await this.loadSale()
        } else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
           await this.loadSale()
        } 
    }

    async events(){
           //Load all the past buyers
           try {
            await window.sale.getPastEvents('TokensPurchased',{
                fromBlock:0,
                toBlock: 'latest'
            }, (error, events)=>{
            this.setState({purchases: events.reverse()})
         })
           } catch (error) {
               console.log(error)
           } 
    }

    async loadData(){ //Load PreSale Data
        try {
            let sale = window.sale
            let bnbRaised = (await sale.methods._bnbRaised().call()) / 1e18
            let userBuyed = (await sale.methods.userBuyed(this.props.address).call()) / 1e18
            let balance = await window.web3.eth.getBalance(this.props.address)
            let toStart = await window.farm.methods.startBlock().call()
            let currentBlock = await window.web3.eth.getBlockNumber()
            this.setState({bnbRaised, userBuyed, balance, toStart, currentBlock})
            
        } catch (error) {
            console.log(error)
        }
    }

    async mainLoop(){
        setInterval(async ()=>{
            await this.events()
            await this.loadData()
        }, 3000)
        
    }

    async componentDidMount(){
        await this.loadWeb3()
        await this.mainLoop()
    }

     blockCountDown() {
        return <Fragment>
            <div className="d-flex justify-content-center">
            <h3>{this.state.toStart - this.state.currentBlock}</h3>
            </div>
            <div className=" d-flex justify-content-center ">
            <p style={{fontSize:12}}>Blocks to Farm</p>
            </div>
        </Fragment>
        
    }

    blockCountFinished(){
        return <Fragment>
        <h3>Farm Already Start!</h3>
    </Fragment>
    }

 
    render(){
        return <div className="d-flex row justify-content-center">
            <div  className="sale h-100">
                <h4><img style={{width:40}} src={window.location.origin + '/images/haw.png'}></img> Hawk Token</h4>
            <div style={{marginTop:4, marginBottom: 10}}>
                <div className='d-flex justify-content-center'>
                    <p><font style={{color: 'rgb(0, 110, 255)'}}>{this.state.bnbRaised.toFixed(1)}</font> / <font style={{fontSize: 12.6}}>{this.state.maxAmount} BNB</font> </p>
                </div>
                <ProgressBar striped animated label={this.state.bnbRaised / this.state.maxAmount * 100 + '% complete'} className="probar" now={this.state.bnbRaised / this.state.maxAmount * 100} /> 
            </div>
            <p style={{fontSize:17}}><i className="fas fa-flag-checkered"></i> Price: 0.001 <font style={{color: 'rgb(253, 238, 21)'}}>BNB</font>/HAW</p>
            <p style={{fontSize:13}}><i className="fas fa-exchange-alt"></i> Max buy amount: 10 <font style={{color: 'rgb(253, 238, 21)'}}>BNB</font></p>
            <p style={{fontSize:13}}><i className="fas fa-layer-group"></i> Your Bnb Spend: {this.state.userBuyed.toFixed(1)} <font style={{color: 'rgb(0, 110, 255)'}}>BNB</font></p>
            <button onClick={()=>{this.setState({modal:!this.state.modal})}} className="btn copy">Spend BNB</button>
            </div>

            <div  className="sale-farm h-100">
            <div className=" ">
            {this.state.toStart  - this.state.currentBlock >= 0? this.blockCountDown() : this.blockCountFinished()}
            </div>
            <div style={{marginTop:8}} className="row">
                <div className="col-6 text-center">
                    <p><i className="fab fa-twitter"></i> Twitter</p>
                    <p style={{fontSize:15}}>@HFi2021</p>
                </div>
                <div className="col-6 text-center">
                    <p><i className="fab fa-telegram"></i> Telegram</p>
                    <p style={{fontSize:15}}>@HAWKDEFI_MAIN</p>
                </div>
                <div style={{marginTop:8}} className="col-12 text-center">
                    <p><i className="fas fa-map-marked"></i> Road Map</p>
                    <p style={{fontSize:15}}>PDF here</p>
                </div>
            </div>
            </div>
            
            <div  className="sale">
                <h4><i className="fas fa-exchange-alt"></i> Last 8 Transactions</h4>
                <div className="row p-2">
                    {this.state.purchases.slice(0,7).map((transaction)=>{
                        return <Transactions transaction={transaction}/>
                    })}
                </div>
            </div>

            

            <Modal size="sm" show={this.state.modal} onHide={()=>{this.setState({modal:!this.state.modal})}}>
            <div className="row ">
            <div className=" d-flex justify-content-center ">
            <h5 style={{marginBottom:4}}>Balance: {Math.trunc((this.state.balance / 1e18) * 1000) / 1000} <img style={{width:18}} src={window.location.origin + '/images/bnb.png'}></img> </h5>
            </div>
            <div className="input-group mb-1 d-flex justify-content-center">
                <input placeholder="BNB Amount..." onChange={this.handleChange} id="inputModal" type='number' className='from-control'></input>
                
            </div>
            <div className=" d-flex justify-content-center ">
            <i style={{color:'white', marginTop:5, fontSize:20,}} className="fas fa-arrow-down"></i> 
            </div>
            <div className=" d-flex justify-content-center ">
                <h5 style={{backgroundColor:'#121635', padding:8, borderRadius:6, marginTop:5}}>{((this.state.inputValue * this.state.tokenCost)/ (10 ** 18)).toFixed(2) } <img style={{width:20}} src={window.location.origin + '/images/haw.png'}></img></h5>
            </div>
            <div className="mt-2 d-flex justify-content-center ">
            <button  onClick={this.buyTokens} disabled={this.state.loading || !this.state.inputValue} className="btn btn-buyd"> {this.state.loading? this.loadingButton('Loading transaction...') : this.button('Spend BNB for tokens', 'fas fa-gavel')} </button>
            </div>
            
            </div>
            </Modal>
        </div>
    }
}

export default Sale;