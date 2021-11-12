export default _ => {
  return [/<img[^>]* src="([^"]*)"[^>]*>/gi, /url\(&quot;([^)]*)&quot;\)/gi];
};
