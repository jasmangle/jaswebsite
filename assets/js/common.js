const email = "VUVkRloyRklTbXhhYWpCcFlsZEdjR0pJVW5aUGJYQm9Zekl4Y0dKdFZrRlpWelZ1WWtkVmRWcEhWakpKYWpWeFdWaE9kR0ZYTld4UlIwWjFXako0YkV4dFVteGthbmQyV1ZRMFBRPT0=";
document.getElementById('show-email').addEventListener('click',function(event) {
  event.preventDefault();
  document.getElementById('email-contents').innerHTML = atob(atob(atob(email)));
});
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
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  tooltip.style.left = (e.clientX + tooltip.clientWidth + 15 < vw)
    ? (e.clientX + 10 + "px") : (e.clientX - tooltip.clientWidth + "px");
  tooltip.style.top = (e.clientY - tooltip.clientHeight - 5 > 0)
    ? (e.clientY - tooltip.clientHeight + "px") : (e.clientY + 10 + "px");
}
var links = document.querySelectorAll('a');
for(var i = 0; i < links.length; i++) {
  const tltp = links[i];
  if (tltp.host !== window.location.host)
    tltp.addEventListener('mousemove', mkTooltip);
}
