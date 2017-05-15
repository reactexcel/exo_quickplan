import React, { PropTypes, Component } from 'react';
import '../../initerary_summary.scss';

export default class CountryBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: true
    };
  }


  collapse = () => this.setState({ isExpanded: false });


  expand = () => this.setState({ isExpanded: true });


  render() {
    const {
      data,
      showCategoryAmounts,
      showLineAmounts,
      showImages,
      showDescriptions,
      showDayNotes,
      Header,
      Body
    } = this.props;

    const { isExpanded } = this.state;

    return (<div className='mb-30 z-depth-1 exo-colors modal-bgr1 p-1'>
      <Header
        isExpanded={isExpanded}
        data={data}
        collapse={this.collapse}
        expand={this.expand}
        showCategoryAmounts={showCategoryAmounts}
        showLineAmounts={showLineAmounts}
      />
      <hr />

      {
        isExpanded
          ?
            <div className='container-content  pb-17 pl-35 pr-18 pt-0'>
              <Body
                data={data}
                showLineAmounts={showLineAmounts}
                showImages={showImages}
                showDescriptions={showDescriptions}
                showDayNotes={showDayNotes}
              />
            </div>
          : ''
      }
    </div>);
  }
}
