import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }
  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance});

  }

  onSubmit = async (event) => {
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transcation...'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({message: 'You have Entered the Lottery Good LUCK!'})
  };

  onClick = async() =>{
      const accounts = await web3.eth.getAccounts();

      this.setState({message: 'Hold your heart beats'});

      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      this.setState({message: 'Check your MetaMask Account'});
  }

  render() {
    return (
      <div className="App">
       <h1> Lottery </h1>
       <div className="cards">
       {/* <h4>Manager Account= {this.state.manager}</h4> */}
         <h4>Current Number of Players= {this.state.players.length}</h4>
         <h3>Prize Pool= {web3.utils.fromWei(this.state.balance, 'ether')} Ether</h3>
         <form className="form" onSubmit={this.onSubmit}>
           <h2>Want To Try your Luck ?</h2>
           <div>
             <label>Amount of Ether to Enter: </label>
             <input
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
             />
           </div>
           <button className="btn">Enter</button>
         </form>
         <h4>Ready to Pick a Winner</h4>
         <button className="btn" onClick={this.onClick}>Go </button>
         <h3>{this.state.message}</h3>
       </div>
      </div>
    );
  }
}

export default App;
