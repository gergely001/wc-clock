import "../src/index.js";

export default {
  parameters: {
    /*layout: "centered"*/
  },
};

export const storyDefault = () => /*html*/`
  <wc-clock style="--clock-size:20em"></wc-clock>
`;

export const storyCustom = () => /*html*/`
  <style>
    wc-clock {
      --clock-size: 20em;
      --dial-fill: lightblue;
      --hour-hand-fill: navy;
      --minute-hand-fill: darkblue;
      --second-hand-fill: blue;
      --text-color: indigo;
      --frame-fill: dimgray;
      --marker-fill: gray;
    }
  </style>
  <wc-clock offset="0" digital></wc-clock>
`;


export const storyJS = () => {
  const clock = document.createElement('wc-clock');
  clock.style.setProperty( '--clock-size', '20em' );
  clock.style.setProperty( '--dial-fill', 'silver' );
  clock.setAttribute( 'digital', '' );
  clock.setAttribute( 'offset', '0' );
  return clock;
};
 