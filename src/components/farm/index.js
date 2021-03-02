import React, { Component }  from 'react';
import './style.css'
import {Modal , Button , Container , Row,Col} from 'react-bootstrap'




class Farm extends Component {
    constructor(props) {
        super(props);
        this.state={
            pending: 0,
            lpStaked: 0,
            apy: 0,
            lp: '',
            tokenBalance: 0,
            tokenDecimals: 0,
            tokenApproved: 0,
            modal: false,
            inputValue: '',
            loading: false,
            selector: true
        }
        //Render Functions
        this.maxButton = this.maxButton.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deposit = this.deposit.bind(this)
        this.harvest = this.harvest.bind(this)
        this.approve = this.approve.bind(this)

    }   
    

   async componentDidMount(){
    console.log('update')
    setInterval(async() => {
        this.updatePool()
    }, 2000);}

    async updatePool(){
        try {
            const tokenId = this.props.farm.id
            const token = window.tokens[tokenId]
            const farm = window.farm
            let tokenBalance = await token.methods.balanceOf(this.props.address).call()
            let tokenApproved = await token.methods.allowance(this.props.address , '0x16433f1C0C3c77917B0e282A5B77fF1Eb0426c24').call()
            const tokenDecimals = await token.methods.decimals().call()
            const lpStaked = await farm.methods.deposited(tokenId , this.props.address).call()
            const pending = await farm.methods.pending(tokenId , this.props.address).call()
            console.log(tokenApproved)
        
            this.setState({
                pending,
                lpStaked,
                tokenBalance,
                tokenDecimals,
                tokenApproved
            })  
        } catch (error) {
            console.log(`Error fund: ${error}`)
        }
        
    }

    maxButton(){
        let value = (this.state.tokenBalance / (10 ** this.state.tokenDecimals))
        document.getElementById('inputModal')
        .value = value.toFixed(4)
        this.setState({inputValue: value})
    }

    handleChange(e){
        this.setState({inputValue: e.target.value})
        console.log(e.target.value * (10 ** this.state.tokenDecimals))
    }

    async deposit(){
        var value = this.state.inputValue * (10 ** this.state.tokenDecimals)
        if(this.state.inputValue > 0){
            const tokenId = this.props.farm.id
            const farm = window.farm
            try {
                this.setState({loading: true})
                await farm.methods.deposit(tokenId , window.web3.utils.toBN(`${value}`))
            .send({from: this.props.address})
                this.setState({loading: false})    
            } catch (error) {
                this.setState({loading: false}) 
                console.log(error)
            }
        }  
    }

    async approve(){
        var value = this.state.inputValue * (10 ** this.state.tokenDecimals) * 5
        const tokenId = this.props.farm.id
        const token = window.tokens[tokenId]
            try {
                this.setState({loading: true})
                await token.methods.approve('0x16433f1C0C3c77917B0e282A5B77fF1Eb0426c24' , window.web3.utils.toBN(`${value}`))
            .send({from: this.props.address})
                this.setState({loading: false})    
            } catch (error) {
                this.setState({loading: false}) 
                console.log(error)
            }
    }
    loadingButton(text){
        return <div>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> {text}
        </div>
    }

    button(text){
        return <div>
            {text}
        </div>
    }

    depositDiv(){
        return <div className="col-12">
        <p style={{marginBottom:4}}>Balance: {(this.state.tokenBalance / (10 ** this.state.tokenDecimals)).toFixed(2)} LP    <button onClick={this.maxButton} className="btn  max">MAX</button></p>
    <div className="input-group mb-3 d-flex justify-content-center">
        <input onChange={this.handleChange} id="inputModal" type='number' className='from-control'></input>
    </div>
    <div className='row'>
        <div className="col-12">
        <button  
        onClick={this.state.tokenApproved >= this.state.inputValue * (10 ** this.state.tokenDecimals)? this.deposit : this.approve} 
        className="btn stake-b" type="button" disabled={this.state.loading}>
        {this.state.loading ? this.loadingButton('Confirm please...') : 
         this.state.tokenApproved >= this.state.inputValue * (10 ** this.state.tokenDecimals)? this.button('Deposit LP') :
         this.button('Approve LP Frist')  } 
        </button>
        </div>
    </div>

    </div>
    }

    whitdrawDiv(){
        return <div className="col-12">
        <p style={{marginBottom:4}}>Staked: {(this.state.tokenBalance / (10 ** this.state.tokenDecimals)).toFixed(2)} LP    <button onClick={this.maxButton} className="btn  max">MAX</button></p>
    <div className="input-group mb-3 d-flex justify-content-center">
        <input onChange={this.handleChange} id="inputModal" type='number' className='from-control'></input>
    </div>
    <div className='row'>
        <div className="col-12">
        <button  onClick={this.deposit} className="btn stake-b" type="button" disabled={this.state.loading}>
            {this.state.loading ? this.loadingButton('Confirm please...') : this.button('Whitdraw LP') } 
            </button>
        </div>
    </div>

    </div>
    }
    async harvest(){
         const tokenId = this.props.farm.id
         await window.farm.methods.withdraw(tokenId , 0).send({from: this.props.address})
    }

    active(){
        return<div>
            <div style={{marginTop: 7}} className="row">
        <div className="col-6">
        <h5 style={{margin:0}}>{(this.state.pending / (10 ** this.state.tokenDecimals)).toFixed(2)}</h5>
        <p style={{fontSize: 7}}>HAW Pending</p>
        </div>
        <div className="col-6 ">
            <button onClick={this.harvest}  className="btn harvest-b "><i className="fas fa-tractor"></i> Harvest</button>
        </div>
    </div>

    <div style={{marginTop: 7}} className="row">
        <div className="col-6">
        <h5 style={{margin:0}}>{(this.state.lpStaked / (10 ** this.state.tokenDecimals)).toFixed(2)}</h5>
        <p style={{fontSize: 7}}>LP Staked</p>
        </div>
        <div className="col-6 ">
            <button onClick={()=>{this.setState({modal:!this.state.modal})}}  className="btn harvest-b ">Stake LP</button>
            <button  className="btn harvest-br ">Whitdraw</button>
        </div>
    </div>
        </div> 
    }

    stakeButton(){
       return <button  disabled={!this.props.login} onClick={()=>{this.setState({modal:!this.state.modal})}}  className="btn stake-b">Stake LP</button>
    }


    



render(){
    return <div className="row farm d-flex justify-content-center ">
        <div style={{marginBottom:10}} className="col-12 row ">
            <div className="col-12 d-flex justify-content-center "> <img className="farmlogo" alt="" src={window.location.href + this.props.farm.img}></img></div>
            <div className="col-12 d-flex justify-content-center"><h4> {this.props.farm.name}</h4></div>
            <div style={{marginBottom: 7, fontSize: 10}} className="col-12 text-center"><p>Deposit {this.props.farm.name} LP Earn HAW</p></div>
            
       {this.state.lpStaked > 0? this.active(): this.stakeButton()}
        
        </div>
        <div className="col-12 row ">
             <div className="col-6"><p style={{fontSize: 12}}>Total Locked</p></div>
            <div className="col-6 "><p style={{fontSize: 12}} className="text-end" >300,321 USD</p></div>
            <div className="col-6"><p style={{fontSize: 12}}>APY</p></div>
            <div className="col-6 "><p  className="text-end" style={{color: 'yellowgreen', fontSize: 12}}>468%</p></div>
         
        </div>  

       
        <Modal size="sm" show={this.state.modal}>
        <div className="row">
        {this.depositDiv()}
        </div>
       
        </Modal>
         

    </div>
  }
}


export default Farm;
