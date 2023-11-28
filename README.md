# &lt;wc-clock&gt;
A vanilla JS web component to display a simple analog clock.

## Installation
- via NPM and serve your node_modules folder

        <script src="wc-./node_modules/wc-clock/index.js" type="module"></script>
- via CDN


## Usage

### [Demo](https://gergely001.github.io/wc-clock/)

### Examples

- HTML with default settings

        <wc-clock></wc-clock>

- HTML with custom settings

        <style>
            wc-clock {
                --clock-size: 15em;
                --dial-fill: lightblue;
                --hour-hand-fill: navy;
                --minute-hand-fill: darkblue;
                --second-hand-fill: blue;
                --text-color: indigo;
                --frame-fill: dimgray;
                --marker-fill: gray;
            }
        </style>
        <wc-clock digital offset="60"><i>Custom Label</i></wc-clock>

- JS

        <div id="clock-container"></div>
        <script>
            const clock = document.createElement('wc-clock');
            clock.style.setProperty( '--clock-size', '15em' );
            clock.style.setProperty( '--dial-fill', 'silver' );
            clock.style.setProperty( '--second-hand-fill', 'darkred' );
            clock.setAttribute( 'digital', '' );
            clock.setAttribute( 'offset', '0' );
            clock.innerHTML = `<i>JS Label</i>`
            document.getElementById( 'clock-container' ).appendChild( clock );
        </script>

### Content
The inner HTML of the &lt;wc-clock&gt; element becomes the label of the clock displayed above it.

### Styling
- **--clock-size** (default: -): The size of the clock, setting both the width and height. If not specified then the clock will fill the 100% of the parent element.
- **--dial-fill** (default: white): The color of the dial.
- **--hour-hand-fill** (default: black): The color of the hour hand.
- **--minute-hand-fill** (default: black): The color of the minute hand.
- **--second-hand-fill** (default: black): The color of the second hand.
- **--text-color** (default: black): The color of the text if the digital option is set.
- **--frame-fill** (default: black): The color of the frame.
- **--marker-fill** (default: black): The color of the markers.

### Attributes
- **digital** (default: no): If set, the time will be displayed with digits too.
- **offset** (default: the client's local time zone offset): UTC time offset.