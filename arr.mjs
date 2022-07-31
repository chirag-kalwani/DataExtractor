import fs from 'fs';
import fetch from "node-fetch";

let arr = fs.readFileSync('data.txt', 'utf-8');
arr = arr.split(/\n+/);

function parsesData(data, product) {
    if (!data['data'])
        return;
    let tweets = Object.keys(data['data']);
    for (let i in tweets) {
        try {
            let temp = data['data'][i]['entities']['urls'][0]['display_url']
            if (data['data'][i]['entities']['urls'][0]['display_url']) {
                let trimmed = temp.split('.');
                if (trimmed[1] === 'twitter') {
                    console.log(temp);
                    product = product.toString().replace(/ /g, "");
                    fs.appendFileSync('store.txt', product + " " + temp + '\n', 'utf-8');
                    return;
                }
            }
        } catch (e) {
            console.log('error ' + e);
        }
    }
}

const fetchyCount = async (product) => {
    let headers = {
        'authorization': 'bearer AAAAAAAAAAAAAAAAAAAAAERKewEAAAAANfdJSplnNyFHXEjWOz0ExUok6vA%3DxWumttIKommQlNNlvqwcpD29cBOcdodNa5TaEWLiY2N6fBLgTB'
    }
    let response = await fetch(
        "https://api.twitter.com/2/tweets/search/recent?max_results=100&query=" + product.split(':')[0] + "&tweet.fields=attachments,author_id,created_at,entities,id,source", {
            method: 'get',
            headers: headers
        }
    );
    let res = await response.json();
    parsesData(res, product);
}

const fetchCount = async (product) => {
    let headers = {
        'authorization': 'bearer AAAAAAAAAAAAAAAAAAAAAERKewEAAAAANfdJSplnNyFHXEjWOz0ExUok6vA%3DxWumttIKommQlNNlvqwcpD29cBOcdodNa5TaEWLiY2N6fBLgTB'
    }
    let response = await fetch(
        "https://api.twitter.com/2/tweets/counts/recent?query=" + product.split(':')[0], {
            method: 'get',
            headers: headers
        }
    );
    let res = await response.json();
    if (res['data'] !== undefined) {
        let tc = 0;
        for (let d of res['data']) {
            tc += d['tweet_count'];
        }
        product = product.toString().replace(/ /g, "");
        fs.appendFileSync('store.txt', product + " " + tc.toString() + "\n", 'utf-8');
    }
};

let fetchNewData = () => {
    fs.writeFileSync('store.txt', "", "utf-8");
    arr.forEach(async (ele) => {
        await fetchCount(ele);
        await fetchyCount(ele);
    });
}
// fetchNewData();
let map = new Map();
let store = fs.readFileSync('store.txt', 'utf-8');
arr = store.split(/\n+/);
for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].split(/[:\s]+/);
    if (map.has(arr[i][0]))
        map.get(arr[i][0]).push(arr[i][3]);
    else {
        map.set(arr[i][0], [arr[i][1]]);
        map.get(arr[i][0]).push(arr[i][2]);
        map.get(arr[i][0]).push(arr[i][3]);
    }
}
map = new Map([...map.entries()].sort((a, b) => {
    return b[1][2] - a[1][2];
}));

export default map;
export {fetchNewData};

