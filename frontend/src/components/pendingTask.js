import { Component } from 'react';
import axios from 'axios';

export default class PendingTask extends Component {
  constructor(props) {
    super(props);

    this.getTask = this.getTask.bind(this);

    this.state = {
      title: '',
      description: '',
      status: '',
    };
  }

  componentDidMount() {
    this.getTask(this.props.id);
  }

  getTask = async () => {
    try {
      const res = await axios.get(`/api/tasks/${this.props.id}`);
      console.log(res.data);
      this.setState({
        title: res.data.title,
        description: res.data.description,
        status: 'PENDING',
      });
    } catch (e) {
      console.log(e.response);
      this.setState({
        title: 'Unexpected Error:',
        description: 'Please Try Again.',
        status: '',
      });
    }
  };

  accept = async () => {
    const token = `Bearer ${window.localStorage.getItem('token')}`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    try {
      await axios.patch(`/api/tasks/assign/${this.props.id}`, {}, config);
    } catch (e) {
      console.log(e.response);
    }
  };

  render() {
    return (
      <tr style={{ color: 'green' }}>
        <td>{this.state.title}</td>
        <td>{this.state.description}</td>
        <td>{this.state.status}</td>
        <td>
          <a href="/tasks" style={{ color: 'green' }} onClick={this.accept}>
            ACCEPT
          </a>
          |
          <a href="/tasks" style={{ color: '#ff4c00' }}>
            DECLINE
          </a>
        </td>
      </tr>
    );
  }
}
