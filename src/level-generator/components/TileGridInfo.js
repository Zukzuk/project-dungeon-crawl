import React from 'react';

class TileGridInfo extends React.Component {
  render() {
    const items = [];
    const info = this.props.gridInfo();
    for( let key in info ) {
      if( info.hasOwnProperty(key) ) {
        items.push(<p key={key}>{key + ": " + info[key]}</p>)
      }
    }
    return <div id="tileGridInfo">{items}</div>
  }
}

export {TileGridInfo as default};
