window.onload = function () {
    getCoins();
}

const maxCoins = 100;
var listCoins = [];
var moreInfo = [];
var moreInfoCounter = 0;
var coinsSelector = [];
var moreInfo = [];
var coinsSelectorCounter = 0;
document.querySelector("#home").addEventListener('click', page);
document.querySelector("#LiveReports").addEventListener('click', page);
document.querySelector("#about").addEventListener('click', page);

const Actions = {
    Home,
    LiveReports,
    About
}

function Home(outlet) {
    getCoins();
}


function page() {
    let route = event.target.text;
    if (route == 'Home') {
        route = 'Home';
    }
    if (route == 'Live Reports') {
        route = 'LiveReports';
    }
    const outlet = document.querySelector("#main");
    Actions[route](outlet);
    event.preventDefault();
}

function getCoins() {
    var requestOptions =
    {
        method: 'GET'
    };
    fetch("https://api.coingecko.com/api/v3/coins/list", requestOptions)
        .then(response => response.json())
        .then(data => {
            listCoins = data;
            setCoins();
        }
        )
        .catch(error => console.log('error', error));
}

function setCoins() {
    var html = " ";
    html += `<div class="row">`;
    html += `<dialog id="dialog">
    </dialog>`;
    for (var m = 0; m < maxCoins; m++) {
        html += `<div class="col-sm-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${listCoins[m].symbol}</h5>
                    <label class="switch">`;
        if (checkIfChoice(listCoins[m].id) == 1) {
            html += `<input type="checkbox" checked id=${listCoins[m].id} onClick=checkSelector("${listCoins[m].id}")>
                                    `;
        }
        else {
            html += `<input type="checkbox" id=${listCoins[m].id} onClick=checkSelector("${listCoins[m].id}")>
                                    `;
        }
        html += `<span class="slider round" id=${listCoins[m].id}></span>
                    </label>
                    <p class="card-text">${listCoins[m].id}</p>                    
                    <button type="button" class="btn btn-info" data-toggle="collapse" data-target=${listCoins[m].id}   id=${listCoins[m].id}  onClick=getMoreInfoFunction("${listCoins[m].id}")>More Info</button>
                    <div id=${listCoins[m].id}class="collapse">
                    `;
        html += `<div id="moreInfo${listCoins[m].id}">
                    </div>`;
        html += `</div>
             </div>
            </div>
        </div>`;
    }
    html += `</div>`;
    document.querySelector("#main").innerHTML = html;
}

function getCoinsList(id) {
    for (var c = 0; c < maxCoins; c++) {
        if (listCoins[c].id == id) {
            return listCoins[c];
        }
    }
}

function checkSelector(id) {
    var radioAlreadyClicked = -1;
    var ss;
    for (let s = 0; s < coinsSelectorCounter; s++) {
        if (coinsSelector[s] == id) {
            radioAlreadyClicked = 1;
            ss = s;
        }
    }
    if (radioAlreadyClicked == 1) {
        document.getElementById(id).checked = false;
        coinsSelector.splice(ss, 1);
        coinsSelectorCounter--;
    }
    else {
        if (coinsSelectorCounter < 5) {
            coinsSelector[coinsSelectorCounter] = id;
            coinsSelectorCounter++;
        }
        else {
            document.getElementById(id).checked = false;
            showSelector();
        }
    }
}


function checkIfChoice(id) {
    for (let c = 0; c < coinsSelectorCounter; c++) {
        if (coinsSelector[c] == id) {
            return 1;
        }
    }
    return -1;
}




function getMoreInfoFunction(id) {
    var found = -1;
    for (var e = 0; e < moreInfo.length; e++) {
        if (moreInfo[e] == id) {
            found = e;
            break;
        }
    }
    var html = " ";
    if (found != -1) {
        moreInfo.splice(found, 1);
        moreInfoCounter--;
        document.querySelector(`#moreInfo${id}`).innerHTML = html;
    }
    if (!idExists(id, found)) {
        if (found == -1) {
            moreInfo[moreInfoCounter] = id;
            moreInfoCounter++;
            var requestOptions = {
                method: 'GET'
            };
            fetch(`https://api.coingecko.com/api/v3/coins/${id}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    html += `<img src="${data.image.small}"><br>`;
                    html += 'USD:';
                    html += data.market_data.current_price.usd;
                    html += '$<br>';
                    html += 'ILS:';
                    html += data.market_data.current_price.ils;
                    html += '₪<br>';
                    html += 'EUR:';
                    html += data.market_data.current_price.eur;
                    html += '€<br>';

                    let temp = {
                        id: id, time: new Date().getTime(), img: data.image.small,
                        usd: data.market_data.current_price.usd, eur: data.market_data.current_price.eur
                        , ils: data.market_data.current_price.ils
                    };
                    moreInfo.push(temp);
                    document.querySelector(`#moreInfo${id}`).innerHTML = html;
                }
                )
                .catch(error => console.log('error', error));
        }
    }
}

function showSelector() {
    var htm = " ";
    htm += `<div class="row" style="height: 100% ">`;
    htm += `<h3> Delete Some Coins:</h3>`;
    for (let s = 0; s < coinsSelectorCounter; s++) {
        let v = getCoinsList(coinsSelector[s]);
        htm += `<div class="col-sm-10">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${v.symbol}</h5>
                <label class="switch" >
                    <input type="checkbox" checked id=${v.id} onClick=listCoinsSelecter("${v.id}") >
                    <span class="slider round" id=${v.id}></span>
                </label>
            </div>
        </div>
        </div>`;
    }
    htm += `<button  class="btn btn-primary" onclick="closeDialog()">close</button>`;
    htm += `</div>`;
    document.getElementById("dialog").innerHTML = htm;
    window.dialog.showModal();
}

function listCoinsSelecter(id) {
    window.dialog.close();
    var ss;
    for (let s = 0; s < coinsSelectorCounter; s++) {
        if (coinsSelector[s] == id) {
            ss = s;
        }
    }
    document.getElementById(id).checked = false;
    coinsSelector.splice(ss, 1);
    coinsSelectorCounter--;
    setCoins();
}
function closeDialog() {
    window.dialog.close();
}


function idExists(idd, found) {
    if (found == -1) {
        var r;
        for (var e = 0; e < moreInfo.length; e++) {
            if (moreInfo[e] == idd) {
                r = e;
            }
        }
        if (r == -1) {
            moreInfo[moreInfoCounter] = idd;
            moreInfoCounter++;
        }
        return moreInfo.some(function (l) {
            if (l.id === idd) {
                let newPrice = 1000 * 60 * 2;
                let pastPrice = (new Date().getTime() - l.time < newPrice) ? false : true;
                if (pastPrice) {
                    return false
                } else {
                    let html = `<p>
                    <img src="${l.img}" class="imgg"> <br>
                    USD: ${l.usd}$<br>
                    ILS:${l.ils}₪
                    EUR: ${l.eur}€<br>
                 </p>`
                    document.querySelector(`#moreInfo${idd}`).innerHTML = html;
                    return true;
                }
            }
            return false;
        });
    }

    return true;
}



function LiveReports(outlet) {
    outlet.innerHTML = "<h1>Live Reports Page is working</h1>";
}
function About(outlet) {
    outlet.innerHTML = "<h1  id='aboutMeName'>Wisam Okkeh</h1><br><img id='myPhoto' src='/profile.jpg' style='height: 10%; width:10% ; '> <div id='aboutMeParagraph'> <p id='pp'>here we show the lastest prices for Coins</p></div>";
}

function searchMethodFunction() {
    var f = document.getElementById("searchInput").value;
    var html = " ";
    html += `<div class="row">`;
    html += `<dialog id="dialog">
    </dialog>`;
    for (var m = 0; m < maxCoins; m++) {
        if (f.localeCompare(listCoins[m].symbol) == 0) {
            html += `<div class="col-sm-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${listCoins[m].symbol}</h5>
                    <label class="switch">`;
            if (checkIfChoice(listCoins[m].id) == 1) {//with checked
                html += `<input type="checkbox" checked id=${listCoins[m].id} onClick=checkSelector("${listCoins[m].id}")>
                    `;
            }
            else {
                html += `<input type="checkbox" id=${listCoins[m].id} onClick=checkSelector("${listCoins[m].id}")>
                    `;
            }
            html += `<span class="slider round" id=${listCoins[m].id}></span>
                    </label>
                    <p class="card-text">${listCoins[m].id}</p>                    
                    <button type="button" class="btn btn-info" data-toggle="collapse" data-target=${listCoins[m].id}   id=${listCoins[m].id}  onClick=getMoreInfoFunction("${listCoins[m].id}")>More Info</button>
                    <div id=${listCoins[m].id}class="collapse">
                    `;
            html += `<div id="moreInfo${listCoins[m].id}">
                    </div>`;
            html += `</div>
             </div>
            </div>
        </div>`;
        }
    }
    html += `</div>`;
    document.querySelector("#main").innerHTML = html;
}
