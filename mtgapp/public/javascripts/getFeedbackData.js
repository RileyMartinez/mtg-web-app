const fs = require('fs');

fs.readFile('./public/feedbackData.json', (err, data) => {
    if (err) throw err;
    let feedbackData = JSON.parse(data);
    console.log(feedbackData);
});