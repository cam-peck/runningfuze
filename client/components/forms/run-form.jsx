import React from 'react';
import { calculatePace, AppContext } from '../../lib';
import TextInput from '../inputs/text-input';
import DatePicker from 'react-datepicker';
import { subYears } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import DistanceInput from '../inputs/distance-input';
import DurationInput from '../inputs/duration-input';
import UploadRunCard from '../cards/upload-run-card';
import LoadingSpinner from '../loading-spinner';
import NetworkError from '../network-error';

export default class RunForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      date: new Date(),
      durationHours: '',
      durationMinutes: '',
      durationSeconds: '',
      distance: '',
      distanceUnits: 'miles',
      hasGpx: false,
      fetchingData: false,
      networkError: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    const { route, user } = this.context;
    if (route.params.get('mode') === 'edit') {
      this.setState({
        fetchingData: true
      }, () => {
        const entryId = Number(route.params.get('entryId'));
        const req = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Access-Token': localStorage.getItem('runningfuze-project-jwt')
          },
          user
        };
        fetch(`/api/runs/${entryId}`, req)
          .then(response => response.json())
          .then(result => {
            const { title, description, date, duration, distance, distanceUnits, hasGpx } = result[0];
            const splitDuration = duration.split(':');
            const dt = new Date(date);
            const dtDateOnly = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
            this.setState({
              title,
              description,
              date: dtDateOnly,
              durationHours: splitDuration[0],
              durationMinutes: splitDuration[1],
              durationSeconds: splitDuration[2],
              distance,
              distanceUnits,
              hasGpx,
              fetchingData: false
            });
          })
          .catch(error => {
            console.error('An error occured!', error);
            this.setState({ networkError: true });
          });
      });

    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleDateChange(date) {
    this.setState({
      date
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      fetchingData: true
    }, () => {
      const { route, user } = this.context;
      const mode = route.params.get('mode');
      const req = {
        method: `${mode === 'add' ? 'POST' : 'PUT'}`,
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': localStorage.getItem('runningfuze-project-jwt')
        },
        user,
        body: JSON.stringify(this.state)
      };
      fetch(`${mode === 'add' ? '/api/runs' : '/api/runs/' + route.params.get('entryId')}`, req)
        .then(response => response.json())
        .then(result => {
          this.setState({
            title: '',
            description: '',
            date: '',
            durationHours: '',
            durationMinutes: '',
            durationSeconds: '',
            distance: '',
            distanceUnits: 'miles',
            hasGpx: false,
            fetchingData: false
          });
          window.location.hash = '#home?tab=activities';
        })
        .catch(error => {
          console.error('An error occured!', error);
          this.setState({ networkError: true });
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
    const { title, description, date, distance, distanceUnits, durationHours, durationMinutes, durationSeconds } = this.state;
    const { handleChange, handleSubmit, handleDateChange } = this;
    const durationObj = { durationHours, durationMinutes, durationSeconds };
    const pace = calculatePace(distance, distanceUnits, durationHours, durationMinutes, durationSeconds);
    const buttonText = this.context.route.params.get('mode') === 'add'
      ? 'Add Run'
      : 'Save Changes';
    return (
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="md:flex md:gap-6">
          <div className="md:w-2/4 w-full">
            <UploadRunCard />
          </div>
          <div className="md:w-2/4 w-full">
            <p className="font-lora font-md text-md font-medium pb-2" >Date</p>
            <DatePicker className="w-full rounded-lg px-3 py-3.5 border border-gray-300 focus:outline-blue-500 mb-4" selected={date} onChange={handleDateChange} dateFormat='MM/dd/yyy' maxDate={new Date()} minDate={subYears(new Date(), 80)} required/>
            <DistanceInput distanceValue={distance} distanceTypeValue={distanceUnits} onChange={handleChange}/>
            <DurationInput value={durationObj} onChange={handleChange}/>
            <TextInput type="pace" name="pace" placeholder="0:00 / mi" value={pace} showLabel={true} label="Pace" onChange={handleChange} />
          </div>
        </div>
        <TextInput type="text" name="title" showLabel={true} label="Title" placeholder="Morning Sun Run" value={title} onChange={handleChange} />
        <TextInput type="text" name="description" showLabel={true} label="Description" placeholder="Easy run with great weather -- nice recovery day" value={description} onChange={handleChange} />
        <div className="flex justify-end mt-2 mb-8">
          <button className="md:w-1/4 w-full bg-blue-500 transition ease-in-out duration-300 hover:bg-blue-600 text-white p-3 rounded-lg font-bold text-lg">{buttonText}</button>
        </div>
      </form>
    );
  }
}
RunForm.contextType = AppContext;
