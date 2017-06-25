import React from 'react';

export default class Scoreboard extends React.Component {

  render() {
    let scores = this.props.scores || [];
    console.log(scores);
    return (
      <table>
        <tbody>
        {
          scores.map((score) => {
            return (
              <tr>
                <td>{score.owner}</td>
                <td>{score.value}</td>
              </tr>)
          })
        }
        </tbody>
      </table>
    )
}
}
