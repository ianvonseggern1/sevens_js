import React from 'react';
import ReactDOM from 'react-dom';

export default class Remaining extends React.Component {
  static SIZE = 5;
  static PADDING = 2;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var divs = [];
    for(var i = 0; i < this.props.count; i += 1) {
      divs.push(<div key={i} style={{
        backgroundColor: "#333333",
        width: Remaining.SIZE,
        height: Remaining.SIZE,
        borderRadius: Remaining.SIZE / 2,
        margin: Remaining.PADDING,
        display: "inline-block"
      }} />);
    }

    return (
      <span>
        {divs}
      </span>
    );
  }
}
