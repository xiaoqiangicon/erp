const hasClass = (el, className) => {
  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`);
  return reg.test(el.className);
};

const addClass = (el, className) => {
  if (hasClass(el, className)) {
    return;
  }

  if (el.className === '') {
    el.className += className;
  } else {
    const newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
  }
};

const removeClass = (el, className) => {
  if (hasClass(el, className)) {
    const reg = new RegExp(`(^|\\s)${className}(\\s|$)`);
    el.className = el.className.replace(reg, '');
  }
};

const setHtmlNoScroll = () => {
  const $html = document.getElementsByTagName('html')[0];
  addClass($html, 'html-no-scroll');
};

const recoverHtmlScroll = () => {
  const $html = document.getElementsByTagName('html')[0];
  removeClass($html, 'html-no-scroll');
};

export { hasClass, addClass, removeClass, setHtmlNoScroll, recoverHtmlScroll };
