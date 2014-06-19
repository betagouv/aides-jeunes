var url = document.location.href;
if (url.lastIndexOf('/') !== url.length - 1) {
  url += '/';
}
document.write('<base href="' + url + '">');
