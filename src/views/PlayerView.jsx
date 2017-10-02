import React from 'react';
import './PlayerView.scss';

export default props => {
  if (!isNaN(props.id)) {
    const classList = 'entity player';
    const { id, style } = props;
    const elmId = `player${id}`;
    let offsetStyle;
    let iconStyle;
    if (style) {
      offsetStyle = {
        top: style.top,
        left: style.left
      };
      iconStyle = {
        width: style.width,
        height: style.height
      };
    }

    return (
      <div className={classList} id={elmId} style={offsetStyle}>
        <div className='icon' style={iconStyle}></div>
      </div>
    );
  } else {
    return null;
  }
};
