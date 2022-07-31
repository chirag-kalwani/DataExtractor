import express from 'express';
import map, {fetchNewData} from './arr.mjs';

const app = express();
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.use('/static', express.static('static')); // FOR SERVING STATIC FILES
app.get('/', (req, res) => {
    res.status(200).render('index', {title: 'Hey First', urls: 'this'})
});
let printData = (req, res) => {
    let obj = {};
    let arr = Array.from(map.keys());
    for (let i = 0; i < 20; i++) {
        obj['name' + (i + 1)] = arr[i];
        obj['link' + (i + 1)] = map.get(arr[i])[3];
        obj['category' + (i + 1)] = map.get(arr[i])[0];
        obj['subcategory' + (i + 1)] = map.get(arr[i])[1];
        obj['count' + (i + 1)] = map.get(arr[i])[2];
    }
    res.status(200).render('index', obj);
}
app.post('/', printData);
app.post('/fetchdata', (req, res) => {
    fetchNewData();
    printData(req, res);
});
app.listen(3000, () => {
    console.log('server started');
});