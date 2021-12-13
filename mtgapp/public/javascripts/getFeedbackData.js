const fs = require('fs');

fs.readFile('./public/feedbackData.json', (err, data) => {
    if (err) throw err;
    let club = JSON.parse(data);
    console.log(club);
});