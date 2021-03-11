import {React, Component} from 'react'

class Transaction extends Component{
    render(){
       return <div className="col-12 row mb-2">
           <div className="col-6 text-center">
           <p style={{fontSize: 14}}>{(this.props.transaction.returnValues.value / 1e18).toFixed(1)} BNB <img style={{width:20}} src={window.location.origin + '/images/bnb.png'}></img></p> 
           <h5 style={{fontSize: 13, color: 'yellowgreen'}}>Spend</h5>
           </div>
           <div className="col-6 text-center">
           <p style={{overflow: "hidden", textOverflow: 'ellipsis',}}> {this.props.transaction.returnValues.purchaser} </p>
           <h5 style={{fontSize: 13}}>Purchaser</h5>
           </div>
       </div> 
         
    }
}

export default Transaction;