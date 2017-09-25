import React from 'react';
import './GameMenuView.scss';

export default props => {
  return <div className='game-menu'>
    <div className="menu-block">{ props.children[0].map((menu, index) => (
      <div className="item" key={ index }>
        <h2>{ menu.title }</h2>
        { menu.buttons }
      </div>
    )) }</div>
    <div className="menu-block">{ props.children[1].map((menu, index) => (
      <div className="menu-item" key={ index }>
        <h2>{ menu.title }</h2>
        { menu.buttons }
      </div>
    )) }</div>

  </div>;
};
