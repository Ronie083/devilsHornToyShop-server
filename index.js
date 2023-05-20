const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Devils Horn toy shops data stored here')
})

app.listen(port, () => {
    console.log(`DevilsHorn server is running on port ${port}`)
})