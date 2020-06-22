import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: '',
      uniqueNames: [] 
    };
  }
  parseText = () => {
    let text = this.state.textValue;
    let convo = text.split('\n');
    // console.log(convo);
    convo = convo.filter(line => line.includes(' AM') || line.includes(' PM'));
    convo = convo.filter(line => line.length < 50);
    convo = convo.filter(line => !line.includes('?') && !line.includes(','));
    // console.log(convo); 

    let namesList = [];
    convo.forEach(line => {
      let lineArr = line.split(' ');
      lineArr[0] = lineArr[0].indexOf(':') > 0 ?
        lineArr[0].substring(0, lineArr[0].indexOf(':')) :
        lineArr[0];
      lineArr[1] = lineArr[1].indexOf(':') > 0 ?
        lineArr[1].substring(0, lineArr[1].indexOf(':')) :
        lineArr[1];

      if (isNaN(lineArr[0][0]) && lineArr[0][0] !== '@' && lineArr[0] !== 'Ended' && lineArr[0] !== 'ZoomAPP' && lineArr[0] !== 'Slackbot') namesList.push(lineArr[0] + ' ' + lineArr[1]);
    });
    // console.log(namesList);
    let uniqueNames = new Set(namesList);
    uniqueNames = [...uniqueNames];
    uniqueNames = uniqueNames.sort();
    uniqueNames = uniqueNames.map(name => {
      let checkList = {};
      checkList['name'] = name;
      checkList['checked'] = true;
      return checkList;
    })
    this.setState({ uniqueNames });
  }
  addTextToState = (e) => {
    let textValue = e.target.value;
    this.setState({ textValue })
    this.parseText();
  }
  checkbox = (e) => {
    let i = isNaN(e.target.id) ? e.target.id.substring(4) : e.target.id;
    let uniqueNames = this.state.uniqueNames;
    let checked = !uniqueNames[i].checked
    let name = uniqueNames[i].name
    uniqueNames[i] = {name ,checked};

    this.setState({ uniqueNames })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className={this.state.uniqueNames.length > 0 ? 'side-by-side' : ''}>
            <h1>Slack Parser</h1>
            <textarea
              id='long-text'
              onChange={this.addTextToState}
              onBlur={this.parseText}
            ></textarea>
          </div>
          <div className={this.state.uniqueNames.length > 0 ? 'side-by-side name-list' : ''}>
            {this.state.uniqueNames.length > 0 && <h3>Names List ({this.state.uniqueNames.filter(user => user.checked).length})</h3>}
            {this.state.uniqueNames.length > 0 && this.state.uniqueNames.map((user,index) => <div key={'div-' + user.name}><input onChange={this.checkbox} checked={!!user.checked} type='checkbox' key={'checkbox-' + user.name} id={index}/><label onClick={this.checkbox} id={'lab-'+index} key={'label-' + user.name} className={user.checked ? '' : 'strike'}>{user.name}</label></div>)}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
