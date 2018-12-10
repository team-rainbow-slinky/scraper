const request = require('superagent');
const { parse } = require('node-html-parser');

const findLinks = html => {
  return html.querySelectorAll('.search-results td a');
};

const returnPaths = paths => {
  return paths.map(path => path.rawAttrs.replace('href="', '').replace('"', ''));
};

const arrestPageValueAt = (html, row) => {
  return html.querySelectorAll('#booking-detail table tr')[row].childNodes[3].text;
};

// const arrestPageDetails = (html) => {
//   return html.querySelectorAll('')
// };

const parseArrestPage = html => ({
  swisId: arrestPageValueAt(html, 0),
  name: arrestPageValueAt(html, 1),
  age: arrestPageValueAt(html, 2),
  gender: arrestPageValueAt(html, 3),
  race: arrestPageValueAt(html, 4),
  height: arrestPageValueAt(html, 5),
  weight: arrestPageValueAt(html, 6),
  hair: arrestPageValueAt(html, 7),
  eyes: arrestPageValueAt(html, 8),
  arrestingAgency: arrestPageValueAt(html, 9),
  bookingDate: arrestPageValueAt(html, 10),
  assignedFacility: arrestPageValueAt(html, 11),
  projectedReleaseDate: arrestPageValueAt(html, 12)
});

const requestArrest = path => {
  return request.get(`http://www.mcso.us${path}`)
    .then(res => res.text)
    .then(parse)
    .then(parseArrestPage);
};

request.post('http://www.mcso.us/PAID/Home/SearchResults')
  .type('form')
  .send(
    { FirstName: '',
      LastName: '',
      SearchType: 3 })
  .then(res => res.text)
  .then(parse)
  .then(findLinks)
  .then(returnPaths)
  .then(paths => {
    return Promise.all(paths.map(path => requestArrest(path)));
  })
  .then(console.log)
  .catch(console.error);
