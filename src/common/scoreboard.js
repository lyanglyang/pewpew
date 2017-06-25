import React from 'react';

export default class Scoreboard extends React.Component {

  render() {
    let scores = this.props.scores || [];
    return (
      <div className="score-board">
        <table>
          <tbody>
          {
            scores.map((score, index) => {
              return (
                <tr key={index}>
                  <td>{score.owner}:</td>
                  <td>{score.value}</td>
                </tr>)
            })
          }
          </tbody>
        </table>
      </div>
    )
}
}
