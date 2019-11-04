import React from 'react';
// import logo from './logo.svg';
import './App.css';
import renderElapsedString from './helpers';
import newTimer from './helpers';
import uuid from "uuid";

//TimerDashboard
/*
  This component is the common owner of the states
  for TimerList, Timer and it's props.
*/
class TimerDashboard extends React.Component {
  
  state = {
    timers: [
      {
        title: 'Learn ReactJS',
        project: 'Frontend Development',
        id: uuid.v4(),
        elapsed: 5456099,
        runningSince: Date.now()
      },
      {
        title: 'Learn GraphQL',
        project: 'API Development',
        id: uuid.v4(),
        elapsed: 3890985,
        runningSince: null
      },
    ]
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  }

  createTimer = (timer) => {
    const t = newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });
  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="timerDashboard">
        <EditableTimerList 
          timers={this.state.timers}
        />
        <ToggleableTimerForm 
          onFormSubmit={this.handleCreateFormSubmit}
        />
      </div>
    );
  }
}

//EditableTimerList
class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer 
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        editFormOpen={timer.editFormOpen}
      />
    ))
    return (
      <div className="timerList">
        {timers}
      </div>
    );
  }
}

//EditableTimer
class EditableTimer extends React.Component {
  state = {
    editFormOpen: false
  };

  // constructor(props) {
  //   super(props);
  // }

  render() {
    /*
      This will render sub-component based on the props.
      
      In this case, it will be Timer or TimerForm based on the
      boolean value of editFormOpen.
    */
    if(this.state.editFormOpen) {
      return (
        <TimerForm 
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
        />
      );
    } 
    else {
      return (
        <Timer 
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
        />
      )
    }
  }
}

//Timer
class Timer extends React.Component {
  
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const elapsedString = renderElapsedString(this.props.elapsed);
    return (
      <div className="timer">
        <div className="header">
          <h3>{this.props.title}</h3>
          <p>{this.props.project}</p>
        </div>
        <div className="body">
          <h2>{elapsedString}</h2>
        </div>
        <div className="footer">
          <button className="btn start">Start</button>
          <div className="options">
            <button className="btn no-bg"><i className="fas fa-edit"></i></button>
            <button className="btn no-bg"><i className="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

//TimerForm
class TimerForm extends React.Component {

  state = {
    title: this.props.title || '',
    project: this.props.project || ''
  };

  // constructor(props) {
  //   super(props);
  // }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value});
  };

  handleProjectChange = (e) => {
    this.setState({project: e.target.value});
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project
    });
  }

  render() {
    const submitBtnText = this.props.id ? "Update" : "Create";
    return (
        <div className="timer timerForm">
          <div className="content">
            <div className="item">
              <label>Title</label>
              <input
                value={this.state.title} 
                type="text" 
                placeholder="Enter title"
                onChange={this.handleTitleChange}
              />
            </div>
            <div className="item">
              <label>Project</label>
              <input
                value={this.state.project} 
                type="text" 
                placeholder="Enter project name"
                onChange={this.handleProjectChange}
              />
            </div>
          </div>
          <div className="footer">
            <button 
              className="btn edit" 
              onClick={this.handleSubmit}
            >
              {submitBtnText}
            </button>
            <button 
              className="btn delete" 
              onClick={this.props.onFormClose}
            >
              Cancel
            </button>
          </div>
        </div>
    );
  }
}

//ToggleableTimerForm
class ToggleableTimerForm extends React.Component {
  
  state = {
    isOpen: false
  };

  handleFormOpen = () => {
    this.setState({isOpen: true});
  }

  handleFormClose = () => {
    this.setState({isOpen: false});
  }

  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.setState({isOpen: false});
  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    if(this.state.isOpen) {
      return (
        <TimerForm 
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    }
    else {
      return (
        <div className="timerToggle">
          <button 
            className="btn no-bg"
            onClick={this.handleFormOpen}
            >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      );
    }
  }
}

function App() {
  return (
    <div className="App">
      <h2>Time Tracking App</h2>
      <TimerDashboard />
    </div>
  );
}

export default App;
