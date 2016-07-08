import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './todoAction';
import Header from '../App/Header';
import Footer from '../App/Footer';
import TodoAdd from './TodoAdd';
import './todo.css';
import Spinner from '../App/Spinner'; 
import { List } from 'material-ui/List';
import SingleTodo from './SingleTodo'; 

class TodoList extends Component {
  componentWillMount() {
    this.props.getTodos(this.props.user.data.couple_id);
  }

  render(){
    if (!this.props.todos) {
      return <Spinner />;
    }
    return (
      <div>
        <Header />
        <div className="todo">
          <div className="todo__overlay">
          <h3 className="todo__mainTitle">Shared to-do's never felt so good</h3>          
          <div style={{ padding: "20px 300px" }}>
            <TodoAdd />
            <List>
              {this.props.todos.map(todo =>
                <SingleTodo
                  key={todo.todo_id}
                  todo={todo}
                  deleteTodo={this.props.deleteTodo}
                />
              )}
            </List>
          </div> 
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

import { getLastFiveTodos } from './todoReducer';  
import { getUser } from '../Authentication/authReducer';

const mapStateToProps = state => ({
  todos: getLastFiveTodos(state),
  user: getUser(state),
});

export default connect(mapStateToProps, actions)(TodoList);
