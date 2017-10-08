import React from 'react';

class Tile extends React.PureComponent {
  render() {
    const classes = ["tile"];
    if( this.props.visible )
      classes.push("visible");
    if ( this.props.bright )
      classes.push("bright");
    if ( this.props.highlight ) {
      if( this.props.highlight == 2 )
        classes.push("cursor");
      else if( this.props.highlight > 0 )
        classes.push("highlight" + this.props.highlight);
      else
        classes.push("strikeThrough" + this.props.highlight * -1);
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
