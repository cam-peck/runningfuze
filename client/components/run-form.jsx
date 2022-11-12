import React from 'react';
import FloatingInput from './floating-input';
import DistanceInput from './distance-input';
import DurationInput from './duration-input';

export default class RunForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      date: '',
      durationHours: '',
      durationMinutes: '',
      durationSeconds: '',
      distance: '',
      hasGpx: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    // console.log('State After: ', this.state);
    const { title, description, date, distance, durationHours, durationMinutes, durationSeconds } = this.state;
    const { handleChange, handleSubmit } = this;
    const durationObj = { durationHours, durationMinutes, durationSeconds };
    return (
      <div className="max-w-md mx-auto">
        <form className="mt-4" onSubmit={this.handleSubmit}>
          <h1 className="text-2xl font-lora font-medium pl-4 mb-4">Add Run</h1>
          <FloatingInput type="text" name="title" placeholder="Morning Sun Run" value={title} onChange={handleChange}/>
          <FloatingInput type="text" name="description" placeholder="Easy run with great weather -- nice recovery day" value={description} onChange={handleChange} />
          <img src="https://www.giantbomb.com/a/uploads/original/0/6087/2437347-pikachu.png" alt="" />
          <FloatingInput type="date" name="date" placeholder="" value={date} onChange={handleChange} />
          <DistanceInput value={distance} onChange={handleChange}/>
          <DurationInput value={durationObj} onChange={handleChange}/>
          <div className="pl-4 pr-4 mt-8">
            <button onClick={handleSubmit} className="w-full bg-blue-500 transition ease-in-out duration-300 hover:bg-blue-600 text-white p-3 rounded-lg font-bold text-lg">Add run</button>
          </div>
        </form>
      </div>
    );
  }
}
