import React from 'react';
import './GameMenuView.scss';

export default props => {
  return <div className='game-menu'>
    {
      props.children.map((menu, index) => {
        return (
          <div className="menu-block" key={ index }>
            <h2>{ menu.title }</h2>
            { menu.buttons }
          </div>
        )
      })
    }
  </div>;
};
