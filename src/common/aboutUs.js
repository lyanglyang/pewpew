import React from 'react';

export default class Controls extends React.Component {

  render() {
    return (
      <div className="login-container">
        <h1 className="title">
          About Us
        </h1>
        <div>
          <ul className="game-list">
            <li><a href="https://www.linkedin.com/in/sudhir-shrestha-48412ab0/" target="_blank"
                   rel="noopener noreferrer"><h3>Sudhir</h3></a></li>
            <li><a href="https://www.linkedin.com/in/poudelprakash/" target="_blank"
                   rel="noopener noreferrer"><h3>Prakash</h3></a></li>
            <li><a href="https://www.linkedin.com/in/shirish-shikhrakar-332b15106/" target="_blank"
                   rel="noopener noreferrer"><h3>Shirish</h3></a></li>
            <li><a href="https://www.linkedin.com/in/joshianujo7/" target="_blank"
                   rel="noopener noreferrer"><h3>Anuj</h3></a></li>
          </ul>

          <button type="button" className="back-btn" onClick={this.props.goBack}> Back</button>
        </div>
      </div>)
  }
}
