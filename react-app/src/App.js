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
      return <p className="review"> (sorry no review available)</p>
    }
  }


  render() {
    return (
      <div className="App">
        
        <img align="left" src={this.state.json.poster} className="image"></img>

        <p className="title">{this.state.json.title} </p>

        <p className="synopsis">{this.state.json.synopsis} </p>

        <p className="review"> {this.renderMovieReview()}</p>

        <div className="link">
          <a>Link to IMDb:&nbsp;&nbsp;</a>
            <a href={this.state.json.link} >IMDb record</a>
        </div>
      </div>
    );

  }
}

export default App;
