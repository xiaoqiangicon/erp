export default function(content) {
  const regExp = / target=(_blank|"_blank"|'_blank')/gi;

  return content.replace(regExp, '');
}
