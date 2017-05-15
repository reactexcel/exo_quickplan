import React from 'react';
import { PT } from 'proptypes-parser';


const propTypes = PT`{
  isExpanded: Boolean!
  collapse: Function!
  expand: Function!
  className: String
}`;


const CollapseExpandButton = ({
  isExpanded,
  collapse,
  expand,
  className = 'mdi little'
}) => (<a
  href='#/'
  onClick={(e) => {
    e.preventDefault();

    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  }}
>
  <i
    className={[
      'grey-text text-darken-4',
      className,
      `mdi-chevron-${isExpanded ? 'down' : 'up'}`
    ].join(' ')}
  />
</a>);


CollapseExpandButton.propTypes = propTypes;


export default CollapseExpandButton;
