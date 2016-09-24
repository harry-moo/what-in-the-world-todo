import React, { Component, PropTypes as T } from 'react';
import Tile from '../../components/Tile';

import { Link } from 'react-router';

export default class TodoListView extends Component {
  static propTypes = {
    params: T.object
  };
  state = {
    todos: [
      {
        title: 'Willy\'s Todo',
        user: {
          email: 'fishmoo@fishcheesemoo.com',
          name: 'Whacky Willy'
        }
      },
      {
        title: 'Off To The Mines',
        user: {
          email: 'miningguy@fishcheesemoo.com',
          name: 'Mine Guy'
        }
      }
    ]
  };
  constructor () {
    super();
  }

  renderTodos () {
    const { todos } = this.state;

    return todos.map(({title, user}) => {
      return (
        <Tile
          title={title}
          content={user && user.email} />
      );
    });
  }

  render () {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md'>
            List Of Todos Goes Here
            { this.renderTodos() }
          </div>
        </div>
      </div>
    );
  }
}

//TODO: Refactor Rendering function to be cleaner
//TODO: Add integration with data
//TODO: Cleanup Route logic
//TODO: Add LOTS of styles