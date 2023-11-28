const template = document.createElement("template");
template.innerHTML = /*html*/`
  <style>
    #clock-dial {
      fill: var( --dial-fill, white );
    }
    #hour-hand {
      fill: var( --hour-hand-fill );
    }
    #minute-hand {
      fill: var( --minute-hand-fill );
    }
    #second-hand {
      fill: var( --second-hand-fill );
    }
    #clock-frame {
      fill: var( --frame-fill );
    }
    rect.marker {
      fill: var( --marker-fill );
    }
    #clock-container {
      width: var( --clock-size );
      height: var( --clock-size );
      margin: auto;
    }
    #time-text, #time-zone {
      font-family: monospace;
      font-weight: bold;
      stroke: var( --dial-fill, white );
      fill: var( --text-color );
      stroke-width: 0.25px;
    }
    #time-text{
      font-size: 10px;
    }
    #time-zone {
      font-size: 5px;
    }
    h4.label {
      text-align: center;
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
    .dial-number {
      font-family: monospace;
      font-weight: bold;
      font-size: 5px;
      stroke: var( --dial-fill, white );
      fill: var( --text-color );
      stroke-width: 0.25px;
    }
  </style>
  <div id="clock-container">
    <h4 class="label"><slot></slot></h4>
    <svg id="clock-case" viewBox="0 0 100 100">
      <circle id="clock-frame" cx="50" cy="50" r="50"></circle>
      <circle id="clock-dial" cx="50" cy="50" r="49"></circle>
      <circle cx="50" cy="50" r="4"></circle>
      <rect id="hour-hand" x="47" y="20" width="6" height="30" rx="3" transform="rotate(0, 50, 50)"></rect>
      <rect id="minute-hand" x="48" y="10" width="4" height="40" rx="2" transform="rotate(0, 50, 50)"></rect>
      <rect id="second-hand" x="49" y="6" width="2" height="44" rx="1" transform="rotate(0, 50, 50)"></rect>
      <text id="time-text" x="30", y="75" textLength="40"></text>
      <text id="time-zone" x="35", y="81" textLength="30"></text>
    </svg>
  </div>
`;

class Clock extends HTMLElement {
  
  static observedAttributes = ['digital', 'offset'];

  constructor() {
    super();
    this.attachShadow( { mode: "open" } );
    this.getAttributes();
  }

  getAttributes(){
    this.offset = parseInt( this.getAttribute( 'offset' ) );
    if ( isNaN( this.offset ) ) this.offset =  new Date().getTimezoneOffset() * -1;
    this.digital = this.hasAttribute( 'digital' );
    //console.log( 'digital: ' + this.digital );
  }

  attributeChangedCallback( name, oldValue, newValue ){

    this.getAttributes();

    if ( this.connected ){
      this.sync()
      if ( this.digital ){
        this.showTimeZone();
      } else {
        this.timeZone.textContent = '';
        this.timeText.textContent = '';
      }
    }
  }

  connectedCallback() {
    this.connected = true;
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
    this.hourHand = this.shadowRoot.getElementById('hour-hand');
    this.minuteHand = this.shadowRoot.getElementById('minute-hand');
    this.secondHand = this.shadowRoot.getElementById('second-hand');
    this.timeText = this.shadowRoot.getElementById('time-text');
    this.timeZone = this.shadowRoot.getElementById('time-zone');
    this.init()
    setInterval( this.sync.bind( this ), 1000 );
  }

  disconnectedCallback() {
    this.connected = false;
  }

  init(){
    this.drawMarks();
    this.sync();
    if ( this.digital ){
      this.showTimeZone();
    }
  }

  sync(){
      const currentDate = new Date();
      // currentDate.setMinutes( currentDate.getMinutes() + this.offset );
      currentDate.setMinutes( currentDate.getMinutes() + currentDate.getTimezoneOffset() + this.offset );

      // console.log( 'currentDate:', currentDate );

      const seconds = currentDate.getSeconds();
      const minutes = currentDate.getMinutes();
      const hours = currentDate.getHours();
      const secondRotation = seconds * 6;
      const minuteRotation = minutes * 6 + Math.floor( seconds / 10 );
      const hourRotation = ( hours % 12 ) * 30 + Math.floor( minutes / 2 );

      this.hourHand.transform.baseVal.getItem( 0 ).setRotate( hourRotation, 50, 50 );
      this.minuteHand.transform.baseVal.getItem( 0 ).setRotate( minuteRotation, 50, 50 );
      this.secondHand.transform.baseVal.getItem( 0 ).setRotate( secondRotation, 50, 50 );

      if ( this.digital ){
        this.timeText.textContent = 
          String( hours ).padStart( 2, '0' )
          + ':' + String( minutes ).padStart( 2, '0' ) 
          + ':' + String( seconds ).padStart( 2, '0' );
      }
  }

  showTimeZone(){
    const hours = Math.floor( Math.abs( this.offset ) / 60 );
    const minutes = Math.abs( this.offset ) % 60;

    this.timeZone.textContent = 
      'GMT' + ( this.offset < 0 ? '-' : '+' )
      + String( hours ).padStart( 2, '0' ) + ':' 
      + String( minutes ).padStart( 2, '0' );
  }

  drawMarks(){
    const markTemplate = document.createElementNS( 'http://www.w3.org/2000/svg', 'rect' );

    markTemplate.setAttribute( 'x', 49 );
    markTemplate.setAttribute( 'y', 2 );
    markTemplate.setAttribute( 'height', 2 );
    markTemplate.setAttribute( 'width', 2 );
    markTemplate.setAttribute( 'transform', 'rotate( 0, 50, 50)' );
    markTemplate.setAttribute( 'class', 'marker' );

    for ( let i = 0; i < 60; i++ ){
        let mark = markTemplate.cloneNode();
        mark.setAttribute( 'transform', `rotate( ${i * 6}, 50, 50)` );
        if ( i % 5 == 0 ) {
            mark.setAttribute( 'x', 48 );
            mark.setAttribute( 'height', 3 );
            mark.setAttribute( 'width', 4 );
        }
        this.shadowRoot.getElementById( 'clock-case' ).appendChild( mark );
    }
  }

}

customElements.define("wc-clock", Clock);
