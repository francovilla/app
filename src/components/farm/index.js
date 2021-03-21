import TokenAbi from  './TokenAbi.json'
import React, { Component }  from 'react';
import './style.css'
import {Modal} from 'react-bootstrap'
const axios = require('axios').default;




class Farm extends Component {
  constructor(props) {
    super(props);
    this.state={
      pending: 0,
      lpStaked: 0,
      lpBalance: 0,
      apy: 0,
      lp: '',
      tokenBalance: 0,
      tokenDecimals: 0,
      tokenApproved: 0,
      hawkPerBlock: 0,
      modal: false,
      modalw: false,
      inputValue: '',
      loading: false,
      selector: true,
      tokenPrice: 0,
      poolHz: 0,
      linkPool: ''
    }
    //Render Functions
    this.maxButton = this.maxButton.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deposit = this.deposit.bind(this)
    this.whitdraw = this.whitdraw.bind(this)
    this.harvest = this.harvest.bind(this)
    this.approve = this.approve.bind(this)
    this.lpPrice = this.lpPrice.bind(this)
  }


  async componentDidMount() {
    setInterval(async() => {
      this.updatePool()
      
    }, 3000);}

  // eslint-disable-next-line react/sort-comp
  async updatePool() {
    try {
      const tokenId = this.props.farm.id 
      const token = window.tokens[tokenId]
      const farm = window.farm

      let tokenBalance = await token.methods.balanceOf(this.props.address).call()
      let lpBalance = await token.methods.balanceOf('0x0Bb9a456DF06676B8aA133503a9a74C0079FAbD3').call()
      let tokenApproved = await token.methods.allowance(this.props.address , '0x0Bb9a456DF06676B8aA133503a9a74C0079FAbD3').call()
      const tokenDecimals = await token.methods.decimals().call()
      const lpStaked = await farm.methods.deposited(tokenId).call({from: this.props.address})
      const pending = await farm.methods.pendingHawk(tokenId  , this.props.address).call()
      const totalAllocPoint = await farm.methods.totalAllocPoint().call()
      const hawkPerBlock = await farm.methods.hawkPerBlock().call()
      const allocPoint = await farm.methods.poolInfo(tokenId).call()
      const poolHz = hawkPerBlock / 1e18 * allocPoint[1] / totalAllocPoint
      this.lpPrice('0xE218a8F0FEC2938CedaA7E3c52b96342E1432625','0xe9e7cea3dedca5984780bafc599bd69add087d56')
      
      var tokenPrice = 0
      await axios.get('https://api.pancakeswap.com/api/v1/price')
        .then((response) => {
          // handle success
          tokenPrice = response.data;
        }).catch((error) => {
          // handle error
          console.log(error);
        })
        var lpPrice = await this.lpPrice(this.props.farm.lpAddress, 
          this.props.farm.tokens.one, 
          this.props.farm.tokens.two,
           tokenPrice)
           

           
      
  
        const usdReward = poolHz * tokenPrice.prices.HAW
        const usdPool = (lpBalance / 1e18) * lpPrice
        console.log(lpPrice)

      this.setState({
        pending,
        lpStaked,
        lpBalance: lpBalance * lpPrice ,
        tokenBalance,
        tokenDecimals,
        tokenApproved,
        hawkPerBlock,
        tokenPrice,
        poolHz,
        apy: (usdReward / usdPool) * 60 * 60 * 24 * 366
      })
    } catch (error) {
      console.log(`Error fund: ${error}`)
    }
  }

  async lpPrice(pairad, lp1ad,lp2ad, pricesObj){
    try {
      let web3 = window.web3
    var pair = new web3.eth.Contract(TokenAbi, pairad)
    let pairSupply = await pair.methods.totalSupply().call()
    let lp1 = new web3.eth.Contract(TokenAbi, lp1ad);
    let lp2 = new web3.eth.Contract(TokenAbi, lp2ad);
    let lp1Name = await lp1.methods.symbol().call()
    let lp2Name = await lp2.methods.symbol().call()
    let lp1Supply = await lp1.methods.balanceOf(pairad).call()
    let lp2Supply = await lp2.methods.balanceOf(pairad).call()
  
    let pairLp1 = (lp1Supply / pairSupply).toFixed(4)
    let pairLp2 = (lp2Supply / pairSupply).toFixed(4)
    let pairLp1Price = (pricesObj.prices[lp1Name])
    let pairLp2Price = (pricesObj.prices[lp2Name])
    return (pairLp1 * pairLp1Price) + (pairLp2 * pairLp2Price)
    } catch (error) {
      
    }
    
    
    
    
    
  }

  maxButton(type) {
    if(type != 'staked') {
      let value = this.state.tokenBalance / (10 ** this.state.tokenDecimals)
      document.getElementById('inputModal')
        .value = value.toFixed(4)
      this.setState({inputValue: value})
    } else {
      let value = (this.state.lpStaked / (10 ** this.state.tokenDecimals))
      document.getElementById('inputModal')
        .value = value.toFixed(4)
      this.setState({inputValue: value})
    }
  }

  handleChange(e) {
    this.setState({inputValue: e.target.value})
  }

  async deposit() {
    var value = this.state.inputValue * (10 ** this.state.tokenDecimals) - 1e10
    if(this.state.inputValue > 0) {
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

  async approve() {
    var value = this.state.inputValue * (10 ** this.state.tokenDecimals) * 5
    const tokenId = this.props.farm.id
    const token = window.tokens[tokenId]
    try {
      this.setState({loading: true})
      await token.methods.approve('0x0Bb9a456DF06676B8aA133503a9a74C0079FAbD3' , window.web3.utils.toBN(`${value}`))
        .send({from: this.props.address})
      this.setState({loading: false})
    } catch (error) {
      this.setState({loading: false}) 
      console.log(error)
    }
  }

  async whitdraw() {
    var value = this.state.inputValue * (10 ** this.state.tokenDecimals) - 1e8
    console.log(value)
    if(this.state.inputValue > 0) {
      const tokenId = this.props.farm.id
      const farm = window.farm
      try {
        this.setState({loading: true})
        await farm.methods.withdraw(tokenId , window.web3.utils.toBN(`${value}`))
          .send({from: this.props.address})
        this.setState({loading: false})
      } catch (error) {
        this.setState({loading: false}) 
        console.log(error)
      }
    }
  }
  loadingButton(text) {
    return <div>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> {text}
        </div>
  }

  button(text) {
    return <div>
            {text}
        </div>
  }

  depositDiv() {
    return <div className="col-12">
        <p style={{marginBottom:4}}>Balance: {(this.state.tokenBalance / (10 ** this.state.tokenDecimals)).toFixed(6)} LP    <button onClick={this.maxButton} className="btn  max">MAX</button></p>
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

        <div className="col-6">
        </div>
    </div>

    </div>
  }

  whitdrawDiv() {
    return <div className="col-12">
        <p style={{marginBottom:4}}>Staked: {(this.state.lpStaked / (10 ** this.state.tokenDecimals)).toFixed(6)} LP    <button onClick={()=>{this.maxButton('staked')}} className="btn  max">MAX</button></p>
    <div className="input-group mb-3 d-flex justify-content-center">
        <input onChange={this.handleChange} id="inputModal" type='number' className='from-control'></input>
    </div>
    <div className='row'>
        <div className="col-12">
        <button  onClick={this.whitdraw} className="btn stake-b" type="button" disabled={this.state.loading}>
            {this.state.loading ? this.loadingButton('Confirm please...') : this.button('Withdraw LP') }
            </button>
        </div>
        <div className="col-6">
        </div>
    </div>

    </div>
  }
  async harvest() {
    const tokenId = this.props.farm.id
    await window.farm.methods.withdraw(tokenId , 0).send({from: this.props.address})
  }

  active() {
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
        <h5 style={{margin:0}}>{(this.state.lpStaked / (10 ** this.state.tokenDecimals)).toFixed(5)}</h5>
        <p style={{fontSize: 7}}>LP Staked</p>
        </div>
        <div className="col-6 ">
            <button onClick={()=>{this.setState({modal:!this.state.modal})}}  className="btn harvest-b ">Stake LP</button>
            <button onClick={()=>{this.setState({modalw:!this.state.modalw})}}  className="btn harvest-br ">Withdraw</button>
        </div>
    </div>
        </div> 
  }

  stakeButton() {
    return <button  disabled={!this.props.login} onClick={()=>{this.setState({modal:!this.state.modal})}}  className="btn stake-b">Stake LP</button>
    
  }






  render() {
    return <div className="row farm d-flex justify-content-center ">
        <div style={{marginBottom:10}} className="col-12 row ">
            <div className="col-12 d-flex justify-content-center "> <img className="farmlogo" alt="" src={window.location.origin + this.props.farm.img}></img></div>
            <div className="col-12 d-flex justify-content-center"><h4> {this.props.farm.name}</h4></div>
            <div style={{marginBottom: 7, fontSize: 10}} className="col-12 text-center"><p>Deposit {this.props.farm.name} LP Earn HAW</p></div>

       {this.state.lpStaked > 1e8? this.active(): this.stakeButton()}
       <a  disabled={!this.props.login} href={this.props.farm.add}  className="btn add-b">Add LP</a>

        </div>
        <div className="col-12 row ">
             <div className="col-6"><p style={{fontSize: 12}}>Total Locked</p></div>
            <div className="col-6 "><p style={{fontSize: 12}} className="text-end" >{(this.state.lpBalance / 1e18).toFixed(2)} $</p></div>
            <div className="col-6"><p style={{fontSize: 12}}>APR</p></div>
            <div className="col-6 "><p  className="text-end" style={{color: 'yellowgreen', fontSize: 12}}>{this.state.apy.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%</p></div>
            <div className="col-6"><p style={{fontSize: 12}}>Pool Rate</p></div>
            <div className="col-6"><p className="text-end" style={{fontSize: 12}}>{this.state.poolHz.toFixed(1)} HAW/sec</p></div>
        </div>


        <Modal size="sm" show={this.state.modal} onHide={()=>{this.setState({modal:!this.state.modal})}}>
        <div className="row">
        {this.depositDiv()}
        </div>
        </Modal>

        <Modal size="sm" show={this.state.modalw} onHide={()=>{this.setState({modalw:!this.state.modalw})}}>
        <div className="row">
        {this.whitdrawDiv()}
        </div>
        </Modal>


    </div>
  }
}


export default Farm;
