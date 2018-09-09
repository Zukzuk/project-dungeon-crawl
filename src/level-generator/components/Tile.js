import React from 'react';

class Tile extends React.PureComponent {
  render() {
    let title = undefined;
    const classes = ["tile"];
    const props = this.props;
    if( props.visible )
      classes.push("visible");
    if ( props.bright )
      classes.push("bright");
    if ( props.highlight ) {
      if( props.highlight == 2 )
        classes.push("cursor");
      else if( props.highlight > 0 )
        classes.push("highlight" + props.highlight);
      else
        classes.push("strikeThrough" + props.highlight * -1);
    }
    if ( props.monster ) {
      title = props.monster;
      classes.push("monster");
    }
    const style = {
      width: props.size,
      height: props.size,
      display: "inline-block"
    };
    return <div className={classes.join(" ")} style={style} title={title}>{props.textContent}</div> ;
  }
}

export {Tile as default};
