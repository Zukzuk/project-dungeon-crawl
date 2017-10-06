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
    const style = {
      width: this.props.size,
       height: this.props.size,
      display: "inline-block"
    };
    return <div className={classes.join(" ")} style={style}>{this.props.textContent}</div>
  };
};

export {Tile as default};
