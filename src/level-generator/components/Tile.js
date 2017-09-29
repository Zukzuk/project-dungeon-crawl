import React from 'react';

class Tile extends React.PureComponent {
  render() {
    const classes = ["tile"];
    if ( this.props.bright )
      classes.push("bright");
    if ( this.props.highlight ) {
      if( this.props.highlight == 2 )
        classes.push("cursor")
      else
        classes.push("highlight");
    }
    return <div className={classes.join(" ")} style={{width: this.props.size, height: this.props.size, display: "inline-block"}} />
  };
};

export {Tile as default};
