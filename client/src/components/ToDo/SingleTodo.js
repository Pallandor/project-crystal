import React, { Component, PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

class SingleTodo extends Component {
  constructor() {
    super();
    this.updateTodo = this.updateTodo.bind(this); 
  }

  updateTodo() {
    const { deleteTodo, todo } = this.props;
    // Allow animated checking
    setTimeout(deleteTodo.bind(this, todo.todo_id),200);
  }

  render() {
    const singleTodoStyle = {
      color: 'white',
    };
    const checkBoxStyle = {
      backgroundColor: 'white',
    };
    const { todo } = this.props;

    return ( <ListItem style = { singleTodoStyle }
        leftCheckbox = {
          <Checkbox
                  style={checkBoxStyle}
                  onCheck={this.updateTodo}
                />
        }
        primaryText = { todo.content }
        />
      );
  }
};

SingleTodo.propTypes = {
  todo: React.PropTypes.object.isRequired,
  deleteTodo: React.PropTypes.func.isRequired,
};

export default SingleTodo;