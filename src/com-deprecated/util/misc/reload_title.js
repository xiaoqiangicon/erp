export default title => {
  document.title = title;
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.setAttribute('src', '/favicon.ico');
  iframe.addEventListener('load', () => {
    setTimeout(() => {
      iframe.remove();
    }, 0);
  });
  document.body.appendChild(iframe);
};
