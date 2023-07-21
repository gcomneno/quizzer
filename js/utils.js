/* eslint-disable require-jsdoc */

// Funzione per decodificare le entità HTML
function decodeHTMLEntities(text) {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent;
}

export {decodeHTMLEntities};
