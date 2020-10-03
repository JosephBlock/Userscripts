import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap";
export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
            <p>
                <h1>Easy userscript management</h1>
                Features coming soon:
                <ListGroup>
                    <ListGroup.Item>Api userscript creation and updates</ListGroup.Item>
                    <ListGroup.Item>Delete your own script (contact for manual removal)</ListGroup.Item>
                    <ListGroup.Item>Many more</ListGroup.Item>
                </ListGroup>
            </p>
      </div>
    );
  }
}
