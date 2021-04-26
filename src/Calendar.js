import React from 'react'
import { ReactComponent as Flash } from './Assets/flash.svg'
import { sprintDetails } from './sprint.js'
import { template5Day, template4Day, templateOnline } from './template.js'

// FullCalendar Library
// import FullCalendar, { formatDate, identity, preventDefault } from '@fullcalendar/react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'

// MaterialUI Library
import Modal from '@material-ui/core/Modal'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
// import Button from '@material-ui/core/Button'
// import TextField from '@material-ui/core/TextField'
// import Dialog from '@material-ui/core/Dialog'
// import DialogActions from '@material-ui/core/DialogActions'
// import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
// import DialogTitle from '@material-ui/core/DialogTitle'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// React-to-Print Library
import ReactToPrint from 'react-to-print'

let eventID = 0

export default class Calendar extends React.Component {

  calendarRef = React.createRef()
  clickInfo = ''
  selectInfo = ''

  state = {
    weekendsVisible: false,
    currentEvents: [],
    openModal: false,
    idModal: '',
    openEventModal: false,
    eventDetails: '',
    expanded: 'panel1'
  }

  render() {
    return (
      <div>
      <div className='navbar'>
      {this.renderNavbar()}
      </div>
      <div className='app'>
        <div className='app-main'>
          <FullCalendar
            ref={this.calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: 'prev title next',
              center: '',
              right: 'timeGridWeek,listWeek'
            }}
            initialView='timeGridWeek'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            slotDuration={'00:15:00'}
            slotLabelInterval={'01:00'}
            slotMinTime={'08:00:00'}
            slotMaxTime={'20:00:00'}
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            editable={true}
            droppable={true}
            dayHeaderFormat={{
                day: 'numeric',
                weekday: 'short',
                omitCommas: true }}
            firstDay='1'
          />
        </div>
        {this.renderSidebar()}
      </div>
      <div className='footer'>
      {this.renderFooter()}
      </div>
      </div>
    )
  }

  renderSidebar() {
    return (
      <div className='sidebar'>


        <div className='sidebar-section'>
          <h2>Design Sprint Templates</h2>
          {/* Pick amongst the most common Design Sprint templates below  */}
          <div id='templates'>
          <button onClick={() => {this.handleAddTemplate('5day')}} className='template-button'>5 DAY</button>
          <button onClick={() => {this.handleAddTemplate('4day')}} className='template-button'>4 DAY</button>
          <button onClick={() => {this.handleAddTemplate('online')}} className='template-button'>ONLINE 5 DAY</button>
        </div>
        </div>
        <div className='sidebar-section'>
        <ReactToPrint
          trigger={() => <button className='functionality-button'>Export PDF</button>}
          content={() => this.calendarRef.current}
        />
        </div>
        <div className='sidebar-section'>
          <h2>Stages</h2>
        </div>
        {/* Customize your own plan by dragging the events available or select a time on the calendar to create your own. If you want to know more about the activity, clicking on it will open up more infomation. */}
        {this.renderEvents()}

        <div className='sidebar-section'>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.weekendsVisible}
                onChange={this.handleWeekendsToggle}
                color="primary"
                name="Show Weekend"
                inputProps={{ 'aria-label': 'Weekends toggle' }}
              />
            }
            label="Show Weekend"
          />
          <button onClick={() => {this.handleDeleteEvents()}} className='functionality-button'>Clear</button>
        </div>
      </div>
    )
  }

  renderEvents() {
    return <div>
      <div id='external-events'>
      <Accordion square expanded={this.state.expanded === 'panel1'} onChange={this.handleAccChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div className='stage-title'>O PREPARE</div>
        </AccordionSummary>
          <div className='stage-description'>Prepare the participants and gather insights</div>
        <AccordionDetails>
          <div>
            <button onClick={() => {this.handleOnClick('Alignment')}} className='task-button prepare-stage' data-event='{ "title": "Alignment", "duration": "02:00", "color": "#1D3D5D" }'><b>Alignment</b><br/>2 hours</button>
			      <button onClick={() => {this.handleOnClick('Tech-check')}} className='task-button prepare-stage' data-event='{ "title": "Tech-check", "duration": "00:30", "color": "#1D3D5D" }'><b>Tech-check</b><br/>30 minutes</button>
			      <button onClick={() => {this.handleOnClick('Pre-flight Interviews')}} className='task-button prepare-stage' data-event='{ "title": "Pre-flight Interviews", "duration": "01:00", "color": "#1D3D5D" }'><b>Pre-flight Interviews</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('Set the Stage')}} className='task-button prepare-stage' data-event='{ "title": "Set the Stage", "duration": "01:00", "color": "#1D3D5D" }'><b>Set the Stage</b><br/>1 hour</button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={this.state.expanded === 'panel2'} onChange={this.handleAccChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
        <div className='stage-title'>1 UNDESTAND</div>
        </AccordionSummary>
          <div className='stage-description'>Problem frame and align the group</div>
        <AccordionDetails>
          <div>
            <button onClick={() => {this.handleOnClick('Start at the End')}} className='task-button understand-stage' data-event='{ "title": "Start at the End", "duration": "01:00", "color": "#EEB462" }'><b>Start at the End</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('Make a Map')}} className='task-button understand-stage' data-event='{ "title": "Make a Map", "duration": "01:00", "color": "#EEB462" }'><b>Make a Map</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('Ask the Experts')}} className='task-button understand-stage' data-event='{ "title": "Ask the Experts", "duration": "01:00", "color": "#EEB462" }'><b>Ask the Experts</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('How Might We')}} className='task-button understand-stage' data-event='{ "title": "How Might We", "duration": "01:00", "color": "#EEB462" }'><b>How Might We</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('Pick a Target')}} className='task-button understand-stage' data-event='{ "title": "Pick a Target", "duration": "00:30", "color": "#EEB462" }'><b>Pick a Target</b><br/>30 minutes</button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={this.state.expanded === 'panel3'} onChange={this.handleAccChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
        <div className='stage-title'>2 SKETCH</div>
        </AccordionSummary>
          <div className='stage-description'>Envision and sketch novel interpretations</div>
        <AccordionDetails>
          <div>
            <button onClick={() => {this.handleOnClick('Lightning Demos')}} className='task-button sketch-stage' data-event='{ "title": "Lightning Demos", "duration": "01:30", "color": "#CD7672" }'><b>Lightning Demos</b><br/>1.5 hours</button>
            <button onClick={() => {this.handleOnClick('Divide or Swarm')}} className='task-button sketch-stage' data-event='{ "title": "Divide or Swarm", "duration": "00:30", "color": "#CD7672" }'><b>Divide or Swarm</b><br/>30 minutes</button>
            <button onClick={() => {this.handleOnClick('Sketching Notes')}} className='task-button sketch-stage' data-event='{ "title": "Sketching Notes", "duration": "00:15", "color": "#CD7672" }'><b>Sketching Notes</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Sketching Ideas')}} className='task-button sketch-stage' data-event='{ "title": "Sketching Ideas", "duration": "00:30", "color": "#CD7672" }'><b>Sketching Ideas</b><br/>30 minutes</button>
            <button onClick={() => {this.handleOnClick('Crazy 8s')}} className='task-button sketch-stage' data-event='{ "title": "Crazy 8s", "duration": "00:15", "color": "#CD7672" }'><b>Crazy 8s</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Solution Sketch')}} className='task-button sketch-stage' data-event='{ "title": "Solution Sketch", "duration": "01:00", "color": "#CD7672" }'><b>Solution Sketch</b><br/>1 hour</button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={this.state.expanded === 'panel4'} onChange={this.handleAccChange('panel4')}>
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
        <div className='stage-title'>3 DECIDE</div>
        </AccordionSummary>
          <div className='stage-description'>Decide on the most suitable idea</div>
        <AccordionDetails>
          <div>
            <button onClick={() => {this.handleOnClick('Art Museum')}} className='task-button decide-stage' data-event='{ "title": "Art Museum", "duration": "00:30", "color": "#534666" }'><b>Art Museum</b><br/>30 minutes</button>
            <button onClick={() => {this.handleOnClick('Heat Map')}} className='task-button decide-stage' data-event='{ "title": "Heat Map", "duration": "00:15", "color": "#534666" }'><b>Heat Map</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Speed Critique')}} className='task-button decide-stage' data-event='{ "title": "Speed Critique", "duration": "00:45", "color": "#534666" }'><b>Speed Critique</b><br/>45 minutes</button>
            <button onClick={() => {this.handleOnClick('Straw Poll, Supervote')}} className='task-button decide-stage' data-event='{ "title": "Straw Poll, Supervote", "duration": "00:15", "color": "#534666" }'><b>Straw Poll, Supervote</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Compete or Combine')}} className='task-button decide-stage' data-event='{ "title": "Compete or Combine", "duration": "01:00", "color": "#534666" }'><b>Compete or Combine</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('Decide with Note-and-Vote')}} className='task-button decide-stage' data-event='{ "title": "Decide with Note-and-Vote", "duration": "01:00", "color": "#534666" }'><b>Decide with Note-and-Vote</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('User Test Flow')}} className='task-button decide-stage' data-event='{ "title": "User Test Flow", "duration": "01:30", "color": "#534666" }'><b>User Test Flow</b><br/>1.5 hours</button>
            <button onClick={() => {this.handleOnClick('Storyboarding')}} className='task-button decide-stage' data-event='{ "title": "Storyboarding", "duration": "01:30", "color": "#534666" }'><b>Storyboarding</b><br/>1.5 hours</button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={this.state.expanded === 'panel5'} onChange={this.handleAccChange('panel5')}>
        <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
        <div className='stage-title'>4 PROTOTYPE</div>
        </AccordionSummary>
          <div className='stage-description'>Create a tangible prototype</div>
        <AccordionDetails>
          <div className='stage-prototype'>
            <button onClick={() => {this.handleOnClick('Prototype')}} className='task-button prototype-stage' data-event='{ "title": "Prototype", "duration": "02:00", "color": "#138086" }'><b>Prototype</b><br/>2 hours</button>
            <button onClick={() => {this.handleOnClick('Stitch Together')}} className='task-button prototype-stage' data-event='{ "title": "Stitch Together", "duration": "01:00", "color": "#138086" }'><b>Stitch Together</b><br/>1 hour</button>
            <button onClick={() => {this.handleOnClick('Trial Run')}} className='task-button prototype-stage' data-event='{ "title": "Trial Run", "duration": "01:00", "color": "#138086" }'><b>Trial Run</b><br/>1 hour</button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={this.state.expanded === 'panel6'} onChange={this.handleAccChange('panel6')}>
        <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
        <div className='stage-title'>5 TEST</div>
        </AccordionSummary>
          <div className='stage-description'>Test the prototype</div>
        <AccordionDetails>
          <div>
            <button onClick={() => {this.handleOnClick('Set-up')}} className='task-button test-stage' data-event='{ "title": "Set up", "duration": "00:30", "color": "#DC8665" }'><b>Set-up</b><br/>30 minutes</button>
            <button onClick={() => {this.handleOnClick('Interview')}} className='task-button test-stage' data-event='{ "title": "Interview", "duration": "00:45", "color": "#DC8665" }'><b>Interview</b><br/>45 minutes</button>
            <button onClick={() => {this.handleOnClick('Testing Overview')}} className='task-button test-stage' data-event='{ "title": "Testing Overview", "duration": "00:30", "color": "#DC8665" }'><b>Testing Overview</b><br/>30 minutes</button>
            <button onClick={() => {this.handleOnClick('Wrap-up')}} className='task-button test-stage' data-event='{ "title": "Wrap-up", "duration": "00:30", "color": "#DC8665" }'><b>Wrap-up</b><br/>30 minutes</button>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion square expanded={this.state.expanded === 'panel7'} onChange={this.handleAccChange('panel7')}>
        <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
        <div className='stage-title'>6 ICE BREAKERS</div>
        </AccordionSummary>
          <div className='stage-description'>Something fun to add to your workshops</div>
        <AccordionDetails>
          <div>
            <button onClick={() => {this.handleOnClick('Warm-up Questions')}} className='task-button ice-breakers' data-event='{ "title": "Warm-up Questions", "duration": "00:15", "color": "#905E6C" }'><b>Warm-up Questions</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Two Truths and a Lie')}} className='task-button ice-breakers' data-event='{ "title": "Two Truths and a Lie", "duration": "00:15", "color": "#905E6C" }'><b>Two Truths and a Lie</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Significant Item')}} className='task-button ice-breakers' data-event='{ "title": "Significant Item", "duration": "00:15", "color": "#905E6C" }'><b>Significant Item</b><br/>15 minutes</button>
            <button onClick={() => {this.handleOnClick('Stretch and Share')}} className='task-button ice-breakers' data-event='{ "title": "Stretch and Share", "duration": "00:15", "color": "#905E6C" }'><b>Stretch and Share</b><br/>15 minutes</button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>

    {this.state.openModal === true &&
      <Modal
        open={this.state.openModal}
        onClose={this.handleClose}
        aria-labelledby="Activity information"
        aria-describedby="Includes title, subtitle, duration and description of an activity"
        className="modal"
      >
        <div className="paper">
          <button className="info-duration">{this.state.eventDetails[0].duration}</button>
          <div className="info-title">{this.state.eventDetails[0].title}</div>
          <div className="info-subtitle">{this.state.eventDetails[0].subtitle}</div>
          <hr class="solid"></hr>
          <div className="new-line info-content">{this.state.eventDetails[0].description}</div>
        </div>
      </Modal>
    }

    {/* this.state.openEventModal === true &&
      <div>
     <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={this.state.openEventModal} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleAddEvent(this.label, '2018-09-01T00:00:00', '2018-09-01T01:00:00', 'red')} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    */}
		</div>
  }

  componentDidMount() {
    new Draggable((document.getElementById('external-events')), {
      itemSelector: '.task-button',
    })
  }

  renderNavbar() {
    return (
      <div>
        <Flash /> Design Sprint Planner
      </div>
    )
  }

  renderFooter() {
    return (
      <div>
        © Neja Cesnik 2021<br/>
        Computing Science honours project, University of Dundee
      </div>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleAccChange = (panel) => (event, newExpanded) => {
    this.setState({
      expanded: (newExpanded ? panel : false)
    })
  }

  handleDateSelect = (selectInfo) => {
    // this.handleOpenEvent()
    // select title, description, start, end, backgroundColour
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection
    let title = prompt('Please enter a new title for your event')


    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        color: "#707070"
      })
    }
  }

  handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove()
    }
    // console.log(clickInfo.event.title)
    // this.setState({
    //   openEventModal: true,
    //   clickInfo: clickInfo
    // })
    // read from a json file
    // Open up modal with infobox of that id
    // this one should have a delete button as
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  handleOnClick = (id) => {
    let filtered = sprintDetails.filter(event => event.title === id)
    this.setState({
      openModal: true,
      idModal: id,
      eventDetails: filtered
    })
  }

  handleOpen = () => {
    this.setState({
      openModal: true
    })
  }

  handleOpenEvent = () => {
    this.setState({
      openEventModal: true
    })
  }

  handleClose = () => {
    this.setState({
      openModal: false,
      openEventModal: false
    })
  }

  handleAddTemplate = (template) => {
    if (this.state.currentEvents != null) {
      this.handleDeleteEvents()
    }

    if (template === "5day") {
      console.log("Template is 5 day")
      for (let i = 0; i < template5Day.length; ++i) {
        this.handleAddEvent(template5Day[i].title, this.templateDate(template5Day[i].day, template5Day[i].startTime), this.templateDate(template5Day[i].day, template5Day[i].endTime), template5Day[i].backgroundColor)
      }
    }
    else if (template === "4day") {
      console.log("Template is 4 day")
      for (let i = 0; i < template4Day.length; ++i) {
        this.handleAddEvent(template4Day[i].title, this.templateDate(template4Day[i].day, template4Day[i].startTime), this.templateDate(template4Day[i].day, template4Day[i].endTime), template4Day[i].backgroundColor)
      }
    }
    else if (template === "online") {
      console.log("Template is online")
      for (let i = 0; i < templateOnline.length; ++i) {
        this.handleAddEvent(templateOnline[i].title, this.templateDate(templateOnline[i].day, templateOnline[i].startTime), this.templateDate(templateOnline[i].day, templateOnline[i].endTime), templateOnline[i].backgroundColor)
      }
    }
  }

  templateDate = (day, time) => {
    let calendarApi = this.calendarRef.current.getApi()
    let activeStart = calendarApi.view.activeStart

    calendarApi.scrollToTime('09:00:00')

    let date = ("0" + (activeStart.getDate() + day)).slice(-2) 
    let month = ("0" + (activeStart.getMonth() + 1)).slice(-2)
    let year = (activeStart.getYear() - 100 + 2000)

    day = year + "-" + month + "-" + date
    return (day + time)
  }

  handleAddEvent = (title, start, end, color) => {
    let calendarApi = this.calendarRef.current.getApi()
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start,
      end,
      backgroundColor: color,
      borderColor: color
    })
  }

  handleDeleteEvents = () => {
    let calendarApi = this.calendarRef.current.getApi()
    calendarApi.removeAllEvents()
  }
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function createEventId() {
  return String(eventID++)
}
