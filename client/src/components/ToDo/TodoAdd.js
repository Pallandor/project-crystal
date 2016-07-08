import React, { PropTypes, Component } from 'react';
import * as actions from './todoAction';
import { connect } from 'react-redux';
import './todo.css';

class TodoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
    this.newTodo = this.newTodo.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  newTodo(todoText){
    this.props.postTodo({ content: todoText, couple_id: this.props.user.data.couple_id});
    this.setState({text: ''});
  }

  handleFormSubmit(e) {
    e.preventDefault();
    this.newTodo(this.state.text);
  }

    handleChange(e){
    this.setState({text: e.target.value});
  }
  
  
  render(){
    return (
      <div>
        <form className='todo__addForm' onSubmit={ this.handleFormSubmit }>
          <input 
            className='todo__input'
            onChange={this.handleChange}
            type="text" value={this.state.text}
            placeholder="new to-do" autoFocus={true}
            style={{color: "white"}}
          />
          <button className="todo__btn waves-effect waves-light btn" type="submit">Add to-do</button>
        </form>
      </div>
    );
  }
};

TodoAdd.PropTypes = {};

const mapStateToProps = state => {
  return { todos: state.todo.fetchTodos, user: state.auth.user };
}

export default connect(mapStateToProps, actions)(TodoAdd)