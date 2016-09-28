import React, { Component, PropTypes as T } from 'react';
import _                                    from 'lodash';

import InputBuffer from '../../components/InputBuffer';
import TodoItem    from './TodoItem'
import TodoService from '../../services/TodoService';

export default class TodoDetail extends Component {
  static propTypes = {
    params: T.object
  };
  state = {
    todo: {},
    buffer: {},
    edit: {}
  };

  constructor () {
    super();
    this.onResetBuffer = this.onResetBuffer.bind(this);
    this.onAddTodo = this.onAddTodo.bind(this);
    this.setState = this.setState.bind(this);
    this.onSaveTodo = this.onSaveTodo.bind(this);
  }

  componentWillMount () {
    this.fetchTodo();
  }

  /**
   * Calls fetch on the service
   */
  fetchTodo () {
    TodoService.fetchOne(this.props.params.id)
      .then(() => {
        this.setState({
          todo: TodoService.getSelected()
        })
      });
    this.refreshState();
  }
  /**
   * Sets a prop on the state model
   * @param prop
   * @param value
   */
  onSetProp (propPath, value) {
    const updated = {...this.state.todo.data};
    _.set(updated, propPath, value);

    const todoState = {
      ...this.state.todo,
      data: updated
    };

    this.setState({
      todo: todoState,
      buffer: updated,
      edit: {}
    });
  }

  /**
   * Resets the  buffer
   */
  onResetBuffer () {
    this.setState({
      buffer: {...this.state.todo.data},
      edit: {}
    });
  }

  /**
   * Sets the buffer state active
   * @param prop
   */
  editBuffer (prop) {
    const newState = {...this.state};
    newState.edit[prop] = true;
    this.setState(newState);
  }

  /**
   * Adds a todo item to the state
   */
  onAddTodo () {
    const todo = {...this.state.todo};
    todo.data.items.push({
      complete: false
    });

    this.setState({ todo });
  }

  /**
   * Toggle the todo item completion
   * @param idx
   */
  onToggleTodo (idx) {
    const todo = {...this.state.todo};
    const todoItem = todo.data.items[idx];

    todoItem.complete = !todoItem.complete;

    this.setState({
      todo: {...todo}
    });
  }

  /**
   * Handle removing an item from the todo
   * @param idx
   */
  onRemoveTodo (idx) {
    const todo = this.state.todo;

    const newItems = todo.data.items.filter((item, index) => idx !== index);
    this.setState({
      todo: {
        ...todo,
        data: {
          ...todo.data,
          items: newItems
        }
      },
      edit: {}
    })
  }

  /**
   * Refreshes the state
   * Uses between transitions and refetching the selected state
   */
  refreshState () {
    this.setState({
      todo: TodoService.getSelected()
    });
  }
  /**
   * Save Todo by sending to service
   */
  onSaveTodo () {

    TodoService.saveOne(this.state.todo.data)
      .then(() => {
        this.refreshState()
      });

    this.refreshState();
  }
  /**
   * Render todo item edit with InputBuffer
   * @param item
   * @param idx
   * @returns {XML}
   */
  renderTodoEdit (item, idx) {
    return (
      <InputBuffer
        name={`todo-item-${idx}`}
        placeholder='Enter the thing todo'
        className='form-control form-control input input--line-only'
        value={item.label || ''}
        onChange={(e) => {
          this.onSetProp(`items[${idx}].label`, e.target.value);
        }}
        onBlur={this.onResetBuffer}
      />
    )
  }
  /**
   * Renders the title and input
   * @returns {JSX}
   */
  renderTitle () {
    const { todo, edit } = this.state;
    const { data } = todo;
    //  Checks if title is in the edit state
    if (edit.title) {
      return (
        <InputBuffer
          name='title'
          placeholder='Enter Title of Cool Todo List'
          className='form-control form-control-lg input input--line-only'
          value={data.title || ''}
          onChange={(e) => {
            this.onSetProp('title', e.target.value)
          }}
          onBlur={this.onResetBuffer}/>
      );
    } else {

      //  Creates the title and edit icon
      const title = data.title ? data.title : 'Please Add A Title';
      return (
        <span>
          <i className='fa fa-pencil-square-o' onClick={() => this.editBuffer('title')} /> {title}
        </span>
      );
    }
  }

  //TODO: This is getting big, should be refactored into smaller chunks

  /**
   * Render the Todos
   * @returns {JSX}
   */
  renderTodo () {
    const todo = this.state.todo.data;

    let listState;

    //  Checks todos and renders the state of the list
    if (Array.isArray(todo.items) && todo.items.length) {
      const items = todo.items.map((item, idx) => {

        let todoItem = (
          <TodoItem
            todo={item}
            onToggle={() => this.onToggleTodo(idx)}
            onEdit={() => this.editBuffer(`Todo:${idx}`) }
            onRemove={() => this.onRemoveTodo(idx)}/>
        );

        //  Check if Todo is in edit state
        if (this.state.edit[`Todo:${idx}`]) {
          todoItem = this.renderTodoEdit(item, idx);
        }

        return (
          <li key={idx}>
            {todoItem}
          </li>
        );
      });

      listState =(
        <ul className='list'>
          {items}
        </ul>
      );
    } else {

      //  Sets empty state
      listState = (
        <div className='text-md-center m-y-1 text-muted'>
         <h1> <i className='fa fa-leaf fa-3 color-green' /></h1>
          <p className='p-x-4'>
            Hate to leaf you hangin', but it looks like you have nothing to do my friend.
            Try adding another item or mess with those fancy <i className='fa fa-toggle-off color-green' /> filter things.
          </p>
        </div>
      );
    }

    return (
      <div className='list-wrapper'>
        {listState}
      </div>
    );
  }

  renderActions () {
    const addItem = (
      <button
        key='add-item-btn'
        name='add-item'
        className='btn btn-main btn-block'
        onClick={this.onAddTodo}>
        <i className='fa fa-plus' /> Add Item
      </button>
    );
    const saveBtn = (
      <button
        key='save-btn'
        name='add-item'
        className='btn btn-green btn-block'
        onClick={this.onSaveTodo}>
        <i className='fa fa-save' /> Save Fancy List
      </button>
    );
    return [
      addItem,
      saveBtn
    ];
  }

  renderPane () {
    return (
      <div className='detail-pane'>
        <div className='row'>
          <div className='col-md'>
            <div className='panel panel--outline panel--outline-main'>
              <div className='panel-title bg-main color-white'>
                {this.renderTitle()}
              </div>
              <div className='panel-body'>
                {this.renderTodo()}
                {this.renderActions()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render () {
    const selectedTodo = TodoService.getSelected();

    if (selectedTodo.loading) {
      return <h3>Loading the Todo!</h3>;
    } else if (selectedTodo.updating) {
      return <h3>Updating the todo!</h3>;
    } else if (selectedTodo.init && selectedTodo.data) {
      return this.renderPane();
    } else {
      return <h3>There was an issue loading the todo</h3>;
    }
  }
}

//TODO: Refactor todo items into separte comp
//TODO: Refactor empty state to generic empty state comp for reuse
//TODO: Experimenting with view only state handling pattern thingy
//TODO: Reorganize functions by group
//TODO: Data store needs some work, makes some wonky implementation in View

//  Potential state issue with how it is tracked by array index
