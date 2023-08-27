import PropTypes from 'prop-types';
import React, { Component } from 'react'
import { DragSource } from 'react-dnd';
import Chip from 'material-ui/Chip';


/* drag sources */
let eventSource = {
  beginDrag(props) {
    return Object.assign({},
      {event: props.event},

      {anchor: 'drop'}
    )
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired
}

class DraggableSidebarEvent extends Component {


  render() {
    let {connectDragSource, isDragging, event} = this.props;
    //let EventWrapper = BigCalendar.components.eventWrapper;
    let {title} = event;


    return (
      <div event={event}>
        {connectDragSource(<div style={{opacity: isDragging ? 0.5 : 1}}>
          <Chip onClick={()=>{this.props.onClickEvent(event)}}
          >{title}</Chip>
        </div>)}
      </div>

    );
  }
}

DraggableSidebarEvent.propTypes = propTypes;


export default DragSource('event', eventSource, collectSource)(DraggableSidebarEvent);
