import {React, Component} from 'react'
import './style.css'
import {ProgressBar} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'
import SaleIf from '../../contracts/HawkSale.json'

class Sale extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            balance: 13.343 * (10 ** 18),
            inputValue: 0,
            tokenCost: 1000,
            loading: false
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

    buyTokens(){
        this.setState({loading: true})
        
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
        } catch (error) {
            console.log(error)
        }
        
    }
    componentDidUpdate(){
        this.loadSale()
    }

 
    render(){
        return <div className="d-flex row justify-content-center">
            <div  className="sale">
                <h4><img style={{width:40}} src={window.location.origin + '/images/haw.png'}></img> Hawk Token</h4>
            <div style={{marginTop:4, marginBottom: 10}}>
                <div className='d-flex justify-content-center'>
                    <p><font style={{color: 'rgb(0, 110, 255)'}}>43.35</font> / <font style={{fontSize: 12.6}}>100 BNB</font> </p>
                </div>
                <ProgressBar striped animated label={'60% complete'} className="probar" now={40} /> 
            </div>
            <p style={{fontSize:17}}><i className="fas fa-flag-checkered"></i> Price: 0.001 <font style={{color: 'rgb(253, 238, 21)'}}>BNB</font>/HAW</p>
            <p style={{fontSize:13}}><i className="fas fa-exchange-alt"></i> Max buy amount: 5 <font style={{color: 'rgb(253, 238, 21)'}}>BNB</font></p>
            <p style={{fontSize:13}}><i className="fas fa-layer-group"></i> Your Tokens Buyed: 500 <font style={{color: 'rgb(0, 110, 255)'}}>HAWK</font></p>
            <button onClick={()=>{this.setState({modal:!this.state.modal})}} className="btn copy">Spend BNB</button>
            </div>

            <div  className="sale col-6">
                <h4><i className="fas fa-exchange-alt"></i> Transactions</h4>
                <ul className="list-group">
                    <li className="list-group-item"> 1.50 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent </li>
                    <li className="list-group-item"> 0.20 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent </li>
                    <li className="list-group-item"> 3.22 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent </li>
                    <li className="list-group-item"> 4.00 BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img> spent </li>
                        
                </ul>
            </div>

            <Modal size="sm" show={this.state.modal}>
            <div className="row ">
            <div className=" d-flex justify-content-center ">
            <h5 style={{marginBottom:4}}>Balance: {Math.trunc((this.state.balance / (10 ** 18)) * 1000) / 1000} <img style={{width:18}} src={window.location.origin + '/images/bnb.png'}></img> </h5>
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
            <button  onClick={this.buyTokens} disabled={this.state.loading || !this.state.inputValue} className="btn btn-buyd"> {this.state.loading? this.loadingButton('Confirm transaction...') : this.button('Spend BNB for tokens', 'fas fa-gavel')} </button>
            
            </div>
            
            </div>
            </Modal>
        </div>
    }
}

export default Sale;