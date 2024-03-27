let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
//if the event is in the localStorage then it will show it, otherwise it will give back an empty Array
//now we are going to set some permanent costant
const calendar = document.getElementById('calendar');
//like this i can always reference the calendar by writing calendar
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'];
//weekdays is an Array that we are going to use to determine the number of padding days


function openModal(date){
  clicked = date;

  const eventForDay =events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
   
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}
//function load is going to be a reuseble function, so insteed to rewritting the line of code over and over again we can do like this
function load() {
  const dt = new Date();
//creating a date object

if (nav !== 0){
dt.setMonth(new Date().getMonth() + nav);
}
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  //selecting exactly what object we want to get
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date (year, month + 1, 0).getDate();
  //by putting zero we are selecting the last day of the previous month

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
   weekday: 'long',
   year: 'numeric',
   month: 'numeric',
   day: 'numeric',
   //to display the week day, year, month and day
  });
  const paddingDays = weekdays.indexOf(dateString.split(',')[0]);

  document.getElementById('monthDisplay').innerText = 
  `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;


  calendar.innerHTML ='';

  for(let i = 1; i <= paddingDays + daysInMonth; i++){
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;


    if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;

        const eventForDay =events.find(e => e.date === dayString);

        if (i - paddingDays === day && nav === 0) {
          daySquare.id = 'currentDay';
        }

        if (eventForDay) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerText = eventForDay.title;
          daySquare.appendChild(eventDiv);
        }

        daySquare.addEventListener('click', () => openModal(dayString));
    } else {
        daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
}

}

function closeModal() { 
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';  
  eventTitleInput.value = ''; // Clear the input value
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value
    });

    localStorage.setItem('events', JSON.stringify(events));

   closeModal();

  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtond(){
  document.getElementById('nextButton').addEventListener('click', () =>{
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () =>{
    nav--;
    load();
  });
 

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);  
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtond();
load();

