import React from 'react';
import ReactDOM from 'react-dom';

export default class Score extends React.Component {
  render() {
    return <span style={{float: 'right'}}>{this.props.score}</span>;
  }
}
