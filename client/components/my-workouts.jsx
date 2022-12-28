import React from 'react';
import WorkoutCard from './cards/workout-card';
import TextInput from './inputs/text-input';
import NetworkError from './network-error';
import LoadingSpinner from './loading-spinner';
import { AppContext } from '../lib';

export default class MyWorkouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workoutData: [],
      fetchingData: false,
      networkError: false
    };
    this.deleteWorkout = this.deleteWorkout.bind(this);
  }

  componentDidMount() {
    this.setState({
      fetchingData: true
    }, () => {
      const { user } = this.context;
      const req = {
        method: 'GET',
        headers: {
          'X-Access-Token': localStorage.getItem('runningfuze-project-jwt')
        },
        user
      };
      fetch('/api/workouts', req)
        .then(response => response.json())
        .then(result => {
          this.setState({
            workoutData: result,
            fetchingData: false
          });
        })
        .catch(error => {
          console.error('There was an error!', error);
          this.setState({
            networkError: true
          });
        });
    });
  }

  deleteWorkout(workoutId) {
    this.setState({
      fetchingData: true
    }, () => {
      const { user } = this.context;
      const { workoutData } = this.state;
      const req = {
        method: 'DELETE',
        headers: {
          'X-Access-Token': localStorage.getItem('runningfuze-project-jwt')
        },
        user
      };
      fetch('/api/workouts/' + workoutId, req)
        .then(response => response.json())
        .then(result => {
          const indexToRemove = workoutData.findIndex(workoutData => workoutData.workoutId === workoutId);
          const newWorkoutData = Array.from(workoutData);
          newWorkoutData.splice(indexToRemove, 1);
          this.setState({
            workoutData: newWorkoutData,
            fetchingData: false
          });
        })
        .catch(error => {
          console.error('There was an error!', error);
          this.setState({
            networkError: true
          });
        });
    });
  }

  render() {
    if (this.state.networkError) {
      return <NetworkError />;
    }
    if (this.state.fetchingData) {
      return <LoadingSpinner />;
    }
    const { workoutData } = this.state;
    const { deleteWorkout } = this;
    return (
      <>
        <header>
          <h1 className="text-2xl font-lora font-medium mb-4">My Workouts</h1>
          <TextInput placeholder="Search by title, description, distance-type, or date..." type="text" name="searchbar" id="searchbar"/>
        </header>
        <section>
          {
            workoutData.length === 0
              ? <p className="text-center italic">No workouts found... Add a run using the &quot;+&quot; button in the bottom right.</p>
              : <div className="md:grid md:grid-cols-2 gap-6 md:gap-8 flex flex-col mb-4"> { workoutData.map((workout, index) => { return <WorkoutCard key={workout.workoutId} data={workout} deleteWorkout={deleteWorkout} />; })} </div>
          }
        </section>
      </>
    );
  }
}
MyWorkouts.contextType = AppContext;
