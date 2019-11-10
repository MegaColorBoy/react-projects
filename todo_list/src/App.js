import React from 'react';
import uuid from 'uuid';
import './App.scss';

//The main todo-list application
class TodoListApp extends React.Component {
  
  state = {
    tasks: [
      {
        id: uuid.v4(),
        title: "Learn ReactJS",
        checked: false,
      },
      {
        id: uuid.v4(),
        title: "Read an article",
        checked: false,
      },
      {
        id: uuid.v4(),
        title: "Try not to fall asleep",
        checked: false,
      },
      {
        id: uuid.v4(),
        title: "Begin QA for the product",
        checked: false,
      },
      {
        id: uuid.v4(),
        title: "Go for a walk",
        checked: false,
      },
    ],
  }

  changeTaskStatus = (attrs) => {
    // console.log(attrs);
    this.setState({
      tasks: this.state.tasks.map((task) => {
        if(task.id === attrs.id) {
          return Object.assign({}, task, {
            checked: attrs.checked
          });
        }
        else {
          return task;
        }
      })
    });
  }

  createTask = (attrs) => {
    const task = {
      id: uuid.v4(),
      title: attrs.title,
      checked: false
    };

    this.setState({
      tasks: this.state.tasks.concat(task)
    });
  }

  editTask = (attrs) => {
    this.setState({
      tasks: this.state.tasks.map((task) => {
        if(task.id === attrs.id) {
          return Object.assign({}, task, {
            title: attrs.title
          })
        }
        else {
          return task;
        }
      })
    });
  }

  deleteTask = (taskId) => {
    this.setState({
      tasks: this.state.tasks.filter(t => t.id !== taskId)
    });
  }

  handleCreateTask = (attrs) => {
    this.createTask(attrs);
  }

  handleDeleteTask = (taskId) => {
    this.deleteTask(taskId);
  }

  handleTaskStatus = (attrs) => {
    this.changeTaskStatus(attrs);
  }

  handleEditTask = (attrs) => {
    this.editTask(attrs);
  }

  render() {
    return (
      <div className="appWrapper">
        <h2>Today's Goals</h2>
        <EditableTaskList 
          tasks={this.state.tasks}
          onClick={this.handleTaskStatus}
          onFormSubmit={this.handleEditTask}
          onDeleteTask={this.handleDeleteTask}
        />
        <ToggleableTaskForm 
          onFormSubmit={this.handleCreateTask}
        />
      </div>
    );
  }
}

//This component contains a list of tasks
class EditableTaskList extends React.Component {
  
  handleCheckbox = (attrs) => {
    // console.log(attrs);
    this.props.onClick(attrs);
  }

  handleDeleteClick = (taskId) => {
    this.props.onDeleteTask(taskId);
  }

  handleEditClick = (attrs) => {
    this.props.onFormSubmit(attrs);
  }

  render() {
    const tasksComponents = this.props.tasks.map((item) => (
        <EditableTask 
          key={item.id}
          id={item.id}
          title={item.title}
          isChecked={item.checked}
          handleCheckbox={this.handleCheckbox}
          onFormSubmit={this.handleEditClick}
          onDeleteClick={this.handleDeleteClick}
        />
      ));

    return (
      <div className="taskList">
          {tasksComponents}
      </div>
    );
  }
}

// Toggleable Task Form Component
class ToggleableTaskForm extends React.Component {
  
  state = {
    isOpen: false
  };

  handleOpenForm = () => {
    this.openForm(); 
  }

  handleCloseForm = () => {
    this.closeForm();
  }

  openForm = () => {
    this.setState({
      isOpen: true
    });
  }

  closeForm = () => {
    this.setState({
      isOpen: false
    });
  }

  handleSubmit = (attrs) => {
    this.props.onFormSubmit(attrs);
    this.closeForm();
  }

  render() {
    if(this.state.isOpen) {
      return (
        <TaskForm 
          onFormClose={this.handleCloseForm}
          onFormSubmit={this.handleSubmit}
        />
      );
    }
    else {
      return(
        <button
          className="button no-bg toggleButton"
          onClick={this.handleOpenForm}
        >
          <i className="fas fa-plus"></i>
        </button> 
      );
    }
  }
}

class TaskForm extends React.Component {

  state = {
    title: this.props.title || ''
  };

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
    });
  }

  keyPressed = (e) => {
    if(e.which === 13) {
      this.handleSubmit();
    }
  }

  render() {
    const submitText = this.props.id ? 'check-circle' : 'plus-circle';
    return (
      <div className="taskForm">
        <div className="flex-row">
          <input 
            type="text"
            value={this.state.title}
            placeholder="What do you want to do?"
            onChange={this.handleTitleChange}
            onKeyPress={this.keyPressed}
          />
          <div className="buttonGroup">
            <button 
              onClick={this.handleSubmit}
            >
              <i className={"fas fa-" + submitText}></i>
            </button>
            <button 
              onClick={this.props.onFormClose}
            >
              <i className="far fa-times-circle"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class EditableTask extends React.Component {
  state = {
    isEditFormOpen: false,
  }

  openEditForm = () => {
    this.setState({
      isEditFormOpen: true,
    });
  }

  closeEditForm = () => {
    this.setState({
      isEditFormOpen: false,
    });
  }

  handleFormClose = () => {
    this.closeEditForm();
  }

  handleEditClick = () => {
    this.openEditForm();
  }

  handleSubmit = (attrs) => {
    this.props.onFormSubmit(attrs);
    this.closeEditForm();
  }

  render() {
    if(this.state.isEditFormOpen) {
      return (
        <TaskForm 
          id={this.props.id}
          title={this.props.title}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    }
    else {
      return (
        <Task 
          id={this.props.id}
          title={this.props.title}
          handleCheckbox={this.props.handleCheckbox}
          onEditClick={this.handleEditClick}
          onDeleteClick={this.props.onDeleteClick}
        />
      );
    }
  }
}

class Task extends React.Component {
  
  state = {
    isChecked: false,
  }

  toggleCheckboxChange = () => {
    this.setState({
      isChecked: !this.state.isChecked
    });

    this.props.handleCheckbox({id: this.props.id, checked: !this.state.isChecked});
  }

  handleDeleteClick = () => {
    this.props.onDeleteClick(this.props.id);
  }

  handleEditClick = () => {
    this.props.onEditClick();
  }

  render() {
    return (
      <label className="task">
        <div className="content">
          <div>
            <input 
              id={this.props.id}
              type="checkbox"
              onChange={this.toggleCheckboxChange} 
              checked={this.state.isChecked}
            />
            <span className="checkmark"></span>
          </div>
          <div>
            <p>{this.props.title}</p>
          </div>
        </div>
        <div className="buttonGroup">
          <button onClick={this.handleEditClick}><i className="far fa-edit"></i></button>
          <button onClick={this.handleDeleteClick}><i className="far fa-trash-alt"></i></button>
        </div>
      </label>
    );
  }
}

function App() {
  return (
    <div className="App">
      <TodoListApp />
    </div>
  );
}

export default App;