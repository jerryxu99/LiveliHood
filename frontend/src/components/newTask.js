import { Component } from 'react';
import axios from 'axios';

export default class NewTask extends Component {
  constructor(props) {
    super(props);

    this.getTask = this.getTask.bind(this);

    this.state = {
      title: '',
      description: '',
    };
  }

  componentDidMount() {
    const task = this.getTask(this.props.id);
    this.setState({
      title: task.title,
      description: task.description,
    });
  }

  getTask = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/tasks/${this.props.id}`,
      );
      console.log(res.data);
      this.setState({
        title: res.data.title,
        description: res.data.description,
      });
    } catch (e) {
      console.log(e.response);
      this.setState({
        title: 'Unexpected Error:',
        description: 'Please Try Again.',
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
      await axios.patch(
        `http://localhost:5000/tasks/assign/${this.props.id}`,
        {},
        config,
      );
    } catch (e) {
      console.log(e.response);
    }
  };

  render() {
    return (
      <tr>
        <td>{this.state.title}</td>
        <td>{this.state.description}</td>
        <td>
          <a href="/tasks" style={{ color: 'green' }} onClick={this.accept}>
            ACCEPT
          </a>
          /
          <a href="/tasks" style={{ color: '#ff4c00' }}>
            DECLINE
          </a>
        </td>
      </tr>
    );
  }
}
