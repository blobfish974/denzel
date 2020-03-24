import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component{

  constructor(props){
    super(props)
    this.state={
      json:{}
    }
  }

  componentDidMount(){

    fetch('http://localhost:9292/movies')
    .then(response=>response.json())
    .then(res => {
      if(res){
        console.log(res);
        this.setState({json: res})
      }
      
    })
  }

  renderMovieReview(){
    if(this.state.json.review ){
      return  <p className="review">review: {this.state.json.review}</p>
    }
    else{
      return <p className="review"> no review available</p>
    }
  }


  render() {
    return (
      <div className="App">
        <p className="title">title: {this.state.json.title} </p>
        <p className="synopsis">synopsis: {this.state.json.synopsis} </p>
        
        <img src={this.state.json.poster}></img>
        <p> {this.renderMovieReview()}</p>
        <a href={this.state.json.link}>IMDb record</a>

      </div>
    );

  }
}

export default App;
