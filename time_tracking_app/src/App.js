import React from 'react';
// import logo from './logo.svg';
import './App.css';
import renderElapsedString from './helpers';
import uuid from "uuid";

//This method creates new props for timer
function newTimer(attrs = {}) {
    const timer = {
      title: attrs.title || 'Timer',
      project: attrs.project || 'Project',
      id: uuid.v4(),
      elapsed: 0,
    };

    return timer;
  }

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

  handleEditFormSubmit = (timer) => {
    this.updateTimer(timer);
  }

  handleDeleteClick = (timer) => {
    this.deleteTimer(timer);
  }

  handleStartClick = (timerId) => {
    this.startTimer(timerId);
  }

  handleStopClick = (timerId) => {
    this.stopTimer(timerId);
  }

  createTimer = (timer) => {
    const t = newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });
  }

  updateTimer = (attrs) => {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project
          });
        }
        else {
          return timer;
        }
      })
    });
  }

  deleteTimer = (timerId) => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    });
  }


  startTimer = (timerId) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now
          });
        }
        else {
          return timer;
        }
      })
    })
  }

  stopTimer = (timerId) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if(timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null
          });
        }
        else {
          return timer;
        }
      })
    })
  }

  render() {
    return (
      <div className="timerDashboard">
        <EditableTimerList 
          timers={this.state.timers}
          onFormSubmit={this.handleEditFormSubmit}
          onDeleteClick={this.handleDeleteClick}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
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
        onFormSubmit={this.props.onFormSubmit}
        onDeleteClick={this.props.onDeleteClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
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

  handleEditClick = () => {
    this.openForm();
  }

  handleDeleteClick = () => {
    this.props.onDeleteClick(this.props.id);
  }

  handleFormClose = () => {
    this.closeForm();
  }

  handleSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.closeForm();
  }

  closeForm = () => {
    this.setState({editFormOpen: false})
  }

  openForm = () => {
    this.setState({editFormOpen: true})
  }

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
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
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
          onEditClick={this.handleEditClick}
          onDeleteClick={this.handleDeleteClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
        />
      )
    }
  }
}

//TimerForm
class TimerForm extends React.Component {

  state = {
    title: this.props.title || '',
    project: this.props.project || ''
  };

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

//TimerAction Button
class TimerActionButton extends React.Component {
  render() {
    if(this.props.timerIsRunning) {
      return (
          <button 
            onClick={this.props.onStopClick} 
            className="btn stop"
          >
            Stop
          </button>
      )  
    }
    else {
      return (
          <button 
            onClick={this.props.onStartClick} 
            className="btn start"
          >
            Start
          </button>
      )
    }
  }
}

//Timer
class Timer extends React.Component {
  
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleStartClick = () => {
    this.props.onStartClick(this.props.id);
  }

  handleStopClick = () => {
    this.props.onStopClick(this.props.id);
  }

  render() {
    const elapsedString = renderElapsedString(this.props.elapsed, this.props.runningSince);
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
          <TimerActionButton 
            timerIsRunning={!!this.props.runningSince}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
          <div className="options">
            <button className="btn no-bg" onClick={this.props.onEditClick}><i className="fas fa-edit"></i></button>
            <button className="btn no-bg" onClick={this.props.onDeleteClick}><i className="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    );
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
