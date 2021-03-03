import React ,{Component} from 'react'
import Chart from 'chart.js'
import './style.css'
class Statics extends Component{
    constructor(props){
        super(props)
    }
    componentDidUpdate(){
        this.loadStatics()
    }

   async loadStatics(){
      if(window.tokens){
          var balances = []
          var names = ['HAW-BNB', 'BUSD-BNB']
          var colors = ['rgb(0, 110, 255)', 'rgb(255, 208, 0)' ]
          for  (let i = 0; i < window.tokens.length; i++) {
              const token = window.tokens[i];
              console.log('One')
              var result = await token.methods.balanceOf('0x16433f1C0C3c77917B0e282A5B77fF1Eb0426c24').call()
              result = result / (10**18)
              balances.push(result)
          }
        
          var ctx = document.getElementById('pools')
          var chart = new Chart(ctx , {
              type: 'pie',
              data: {
                  datasets: [{
                      data: balances,
                      backgroundColor: colors
                  }],
                  labels: names
              },
              options:{
                  elements: {
                      arc: {
                          borderWidth: 0
                      }
                  }
              }
          })
         

      }
          
    }

    printPie(){}

   
render(){
   return  <div style={{marginTop:14}} className="d-flex justify-content-center">
        <div className="maindiv" >
        <canvas id="pools"></canvas>
        </div>
   </div>
}
}

export default Statics;