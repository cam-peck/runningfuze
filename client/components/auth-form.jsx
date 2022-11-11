import React from 'react';
import FloatingInput from './floating-input';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      displayName: '',
      dateOfBirth: '',
      profilePhoto: 'example.png',
      signInWasInvalid: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  resetState() {
    this.setState({
      email: '',
      password: '',
      displayName: '',
      dateOfBirth: '',
      profilePhoto: 'example.png',
      signInWasInvalid: false
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/auth/${action}`, req)
      .then(response => response.json())
      .then(result => {
        if (action === 'sign-up') {
          this.resetState();
          window.location.hash = 'sign-in';

        } else if (result.user && result.token) {
          this.resetState();
          this.props.onSignIn(result);
          window.location.hash = '#';
        } else {
          this.setState({ signInWasInvalid: true });
        }
      });

  }

  render() {
    const { action } = this.props; // either sign-in or sign-out
    const { handleChange, handleSubmit } = this;
    const { email, password, displayName, dateOfBirth, signInWasInvalid } = this.state;
    const formButton = action === 'sign-in'
      ? 'Log in'
      : 'Create Account';
    const registerAccountInputs = action === 'sign-in'
      ? ''
      : <>
        <FloatingInput type="text" name="displayName" placeholder="Display Name" value={displayName} onChange={handleChange} />
        <FloatingInput type="date" name="dateOfBirth" placeholder="Date of Birth" value={dateOfBirth} onChange={handleChange} />
      </>;
    const invalidSignIn = signInWasInvalid
      ? <p className="text-red-500 text-xs italic -mt-2.5 mb-4 ml-6">Invalid username or password</p>
      : '';
    return (
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <FloatingInput type="email" name="email" placeholder="Email Address" value={email} onChange={handleChange}/>
          <FloatingInput type="password" name="password" placeholder="Password" value={password} onChange={handleChange} />
          {registerAccountInputs}
          {invalidSignIn}
          <div className="pl-4 pr-4">
            <button className="w-full bg-blue-500 transition ease-in-out duration-300 hover:bg-blue-600 text-white p-3 rounded-lg font-bold text-lg">{formButton}</button>
          </div>
        </form>
      </div>
    );
  }
}
