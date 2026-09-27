const email = "VUVkRloyRklTbXhhYWpCcFlsZEdjR0pJVW5aUGJYQm9Zekl4Y0dKdFZrRlpWelZ1WWtkVmRWcEhWakpKYWpWeFdWaE9kR0ZYTld4UlIwWjFXako0YkV4dFVteGthbmQyV1ZRMFBRPT0=";
// try {
// document.getElementById('show-email').addEventListener('click',function(event) {
//   event.preventDefault();
//   document.getElementById('email-contents').innerHTML = atob(atob(atob(email)));
// });
// } catch {

// }
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
// document.getElementById('toggle-jas-font').addEventListener('click',function(event) {
//   event.preventDefault();
//   var result = document.documentElement.classList.toggle('no-jas-font');
//   localStorage.setItem("no-jas-font", result?"1":"0");
// })
function genTooltip(el) {
  var tltp = document.createElement('span');
  tltp.className = 'tltp';
  var nest = document.createElement('span');
  nest.className = 'tltp-fg';
  nest.textContent = el.host;
  tltp.appendChild(nest);
  el.appendChild(tltp);
  return tltp;
}
function mkTooltip(e) {
  var anchor = e.target.closest('a')
  var tooltip = anchor.classList.contains("tltp")
    ? anchor : anchor.querySelector(":scope .tltp");
  if (!tooltip) tooltip = genTooltip(anchor);

  // update: when parent display=relative and it has transform applied, fixed becomes absolute.
  const parentContainer = tooltip.offsetParent || document.body;
  const containerRect = parentContainer.getBoundingClientRect();
  const fixedX = e.clientX - containerRect.left;
  const fixedY = e.clientY - containerRect.top;

  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  tooltip.style.left = (e.clientX + tooltip.clientWidth + 15 < vw)
    ? (fixedX + 10 + "px") : (fixedX - tooltip.clientWidth + "px");
  tooltip.style.top = (e.clientY - tooltip.clientHeight - 5 > 0)
    ? (fixedY - tooltip.clientHeight + "px") : (fixedY + 10 + "px");
}
var links = document.querySelectorAll('a');
for(var i = 0; i < links.length; i++) {
  const tltp = links[i];
  if (tltp.host !== window.location.host)
    tltp.addEventListener('mousemove', mkTooltip);
}
if (localStorage.getItem("no-jas-font")=="1") {
  document.documentElement.classList.add("no-jas-font")
}

fetch("https://status.cafe/users/jasmangle/status.json")
  .then( r => r.json() )
  .then( r => {
    if (!r.content.length) {
      document.getElementById("statuscafe-content").innerHTML = "No status yet."
      return
    }
    document.getElementById("statuscafe-username").innerHTML = '<a href="https://status.cafe/users/jasmangle" target="_blank">' + r.author + '</a> ' + r.face + ' ' + r.timeAgo
    document.getElementById("statuscafe-content").innerHTML = r.content
  });

// makes a string like "X days ago"
function timeAgo(input) {
  const date = new Date(Date.UTC(1970, 0, 1, 0, 0, input));
  //const date = (input instanceof Date) ? input : new Date(input);
  const formatter = new Intl.RelativeTimeFormat('en');
  const ranges = {
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1
  };
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (let key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key);
    }
  }
}

// Scribbly scrobbly
const getTrack = async () => {
    const request = await fetch("https://lastfm-api.angle.dev/?name=ngl_");
    const json = await request.json();

    if (json.hasOwnProperty('error')) {
      document.getElementById("listening").innerHTML = `
        <div id="trackInfo">
        <p id="artistName">Oops, I encountered an error.</p>
        </div>
      `;
    }

    let isPlaying = json.data['@attr']?.nowplaying || false;

    // TODO add "x minutes/hours/days ago"
    var timeStr = '';
    if (isPlaying) {
      timeStr = '<p id="timeSincePlayed">Now Playing!</p>';
    } else {
      timeStr = `<p id="timeSincePlayed">${timeAgo(json.data.date.uts)}</p>`;
    }

    let trackName = json.data.name;
    let albumName = json.data.album['#text'];
    var albumStr = '';
    if (json.data.album['#text'] != trackName) {
      albumStr = `<p id="albumName">${albumName}</p>`
    }

    let container = document.getElementById("listening");
    container.href = json.data.url;
    document.getElementById("listening").innerHTML = `
    <img src="${json.data.image[1]['#text']}">
    <div id="trackInfo">
    <h3 id="trackName">${trackName}</h3>
    ${albumStr}
    <p id="artistName">${json.data.artist['#text']}</p>
    ${timeStr}
    </div>
    `
};
getTrack();
setInterval(() => { getTrack(); }, 45000);