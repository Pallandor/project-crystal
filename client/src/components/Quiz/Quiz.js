import React, { Component, PropTypes } from 'react';
import Header from '../App/Header';
import Footer from '../App/Footer';
import FirstQuestion from './FirstQuestion';
import SecondQuestion from './SecondQuestion';
import ThirdQuestion from './ThirdQuestion';
import FourthQuestion from './FourthQuestion';
import FifthQuestion from './FifthQuestion';
import CompletedMessage from './CompletedMessage';
import './quiz.css';

class Quiz extends Component {
  constructor(props) {
    super(props);

    // Pro tip: The best place to bind your member functions is in the component constructor
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.renderQuiz = this.renderQuiz.bind(this); 
    this.state = {
      page: 1,
    };
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  renderQuiz(){
    return(
       <div className={`background ${img}`}>
        <div className="hero__overlay">
          <div className="container">
        <div className="progress">
          <div className="determinate" style={{width: percent}}></div>
        </div>
        {page === 1 && <FirstQuestion onSubmit={this.nextPage}/>}
        {page === 2 && <SecondQuestion previousPage={this.previousPage} onSubmit={this.nextPage}/>}
        {page === 3 && <ThirdQuestion previousPage={this.previousPage} onSubmit={this.nextPage}/>}
        {page === 4 && <FourthQuestion previousPage={this.previousPage} onSubmit={this.nextPage}/>}
        {page === 5 && <FifthQuestion previousPage={this.previousPage} onSubmit={onSubmit}/>}
          </div>
          </div>
      </div>
      )
  }

  render() {
    // const { onSubmit } = this.props;
    // const { quiz } = this.props; // mock it BELOW
    const quiz = { completed: true}; 
    const { page } = this.state;
    const img = page === 1 ? "background--1" 
      : page === 2 ? "background--2"
      : page === 3 ? "background--3"
      : page === 4 ? "background--4"
      : "background--5";
    const percent = page === 1 ? "20%"
      : page === 2 ? "40%"
      : page === 3 ? "60%"
      : page === 4 ? "80%"
      : "100%";
    return (
      <div>
    <Header />
      <div className={`background ${img}`}>
        <div className="hero__overlay">
          <div className="container">
        <div className="progress">
          <div className="determinate" style={{width: percent}}></div>
        </div>
        {page === 1 && <FirstQuestion onSubmit={this.nextPage}/>}
        {page === 2 && <SecondQuestion previousPage={this.previousPage} onSubmit={this.nextPage}/>}
        {page === 3 && <ThirdQuestion previousPage={this.previousPage} onSubmit={this.nextPage}/>}
        {page === 4 && <FourthQuestion previousPage={this.previousPage} onSubmit={this.nextPage}/>}
        {page === 5 && <FifthQuestion previousPage={this.previousPage} onSubmit={onSubmit}/>}
          </div>
          </div>
      </div>
      <Footer />
    </div>
    )
  }
}

// will change to add check on quiz.completed etc props. 
Quiz.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Quiz;
