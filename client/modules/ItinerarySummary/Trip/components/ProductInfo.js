import React from 'react';
import { compact } from 'lodash';


const ProductInfo = ({
  images,
  description,
  showImages,
  showDescriptions,
  title
}) => {
  const className = compact([
    showImages || showDescriptions ? 'mt-10' : '',
    showDescriptions ? 'z-depth-2' : '',
    'bold'
  ]).join(' ');
  return (<div
    className={className}
    style={{
      display: showImages || showDescriptions ? 'flex' : 'none',
      width: '75%'
    }}
  >
    {showImages
      ? images.reverse().map(({ url }) => (
        <img
          className='mr-10'
          role='presentation'
          style={{
            float: 'left',
            height: '100%'
          }}
          src={url}
        />))
      : ''
    }
    <div className='p-15'>
      {title && <div className='fs-14 pb-10'>
        {title}
      </div>}
      {showDescriptions
        ? description : ''
      }
    </div>
  </div>);
};

export default ProductInfo;
