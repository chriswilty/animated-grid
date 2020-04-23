export const template = (strings, ...keys) => {
  const htmlString = strings[0] + keys.map((key, index) => key + strings[index + 1]).join('');

  const $template = document.createElement('template');
  $template.innerHTML = htmlString;

  return () => $template.content.cloneNode(true);
};
