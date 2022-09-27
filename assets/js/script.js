//function for auto complete in input field
$(function () {
    var availableTags = [
        "Toronto",
        "TOKYO",
        "JAKARTA",
        "New York",
        "SEOUL",
        "MANILA",
        "Mumbai",
        "Sao Paulo",
        "MEXICO CITY",
        "Delhi",
        "Osaka",
        "CAIRO",
        "Los Angeles",
        "Shanghai",
        "MOSCOW",
        "BEIJING",
        "Guangzhou",
        "Shenzhen",
        "Istanbul",
        "Rio de Janeiro",
        "PARIS",
        "Karachi",
        "Nagoya",
        "Chicago",
        "Lagos",
        "LONDON",
        "BANGKOK",
        "KINSHASA",
        "TEHRAN",
        "LIMA",
        "Dongguan",
        "BOGOTA",
        "Chennai",
        "DHAKA",
        "Essen",
        "HONG KONG",
        "Taipei",
        "Lahore",
        "Saigon",
        "Vancouver",
        "Sydney",
    ];
    $("#search").autocomplete({
        source: availableTags
    });
});

//define luxon API variable
var DateTime = luxon.DateTime;

let now = DateTime.now().toISODate();
let histroyList = [];

//handle submition event
$("#searchForm").on("submit", function (e) {
    e.preventDefault();
    let city = $("#search").val()
    if (city == "") {
        alert("Please enter a city name");
        return;
    }
    currentStatus(city);
    fiveDayStatus(city);
    saveToLocal(city);
    renderHistory();
    $("#search").val("");
});

//function to display current date weather
function currentStatus(city) {
    let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=6799dd7ae6e0eccdfff553d7b932cb9f`;
    fetch(requestURL).then(function (response) {
        if (response.status == 404) {
            alert("Please enter a valid city name");
            return;
        }
        return response.json();
    })
        .then(function (data) {
            //extract data from response json object
            now = DateTime.now().toISODate();
            icon = data.weather[0].icon;
            temp = data.main.temp;
            wind = data.wind.speed;
            humi = data.main.humidity;
            //put data to corresponding field in html
            $("#iconCurrent").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
            $("#tempCurrent").eq(0).text(temp + " °C");
            $("#windCurrent").eq(0).text(wind + " m/s");
            $("#humiCurrent").eq(0).text(humi + " %");
            $("#city").text(city);
            $("#today").text(now)
            //set the information visible
            $("#mainContent").removeClass("invisible").addClass("container-fluid");
            
        });
}

//function to display 5-day weather
function fiveDayStatus(city) {
    let requestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=6799dd7ae6e0eccdfff553d7b932cb9f`;

    fetch(requestURL).then(function (response) {
        return response.json();
    })
        .then(function (data) {
            //iteration to get & show 5-day data
            let j = 1;
            for (let i = 0; i < 40; i = i + 8) {
                if (data.list[i].dt_txt.split(" ")[0] == DateTime.now().toISODate()) {
                    i = 1;
                }
                let date = data.list[i].dt_txt.split(" ")[0];
                let temp = data.list[i].main.temp;
                let wind = data.list[i].wind.speed;
                let humi = data.list[i].main.humidity;
                let icon = data.list[i].weather[0].icon;

                $(`#icon${j}`).attr("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
                $(`#icon${j}`).css({ "width": "50px", "height": "50px" });
                $(`#day${j}`).eq(0).text(date);
                $(`#d${j}temp`).eq(0).text(temp + " °C");
                $(`#d${j}wind`).eq(0).text(wind + " m/s");
                $(`#d${j}humi`).eq(0).text(humi + " %");
                j++;
            }
        });
}

//function to save histroy data to local storage
function saveToLocal(city) {
    if (histroyList.length >= 5) {
        let temp = histroyList.reverse();
        temp.pop();
        temp = temp.reverse();
        histroyList = temp;
    }
    histroyList.push(city);
    localStorage.setItem("history", JSON.stringify(histroyList))
}

//function to get data from local storage
function getFromLocal() {
    histroyList = JSON.parse(localStorage.getItem("history"));
    if (histroyList == null) {
        histroyList = [];
    }
}

//function to render searching history
function renderHistory() {
    getFromLocal();
    $("#history").children().remove();
    for (let i = histroyList.length - 1; i >= 0; i--) {
        let liEl = $("<li>").addClass("btn btn-secondary btn-block w-100").text(histroyList[i]);
        $("#history").append(liEl);

    }
}

//handle the click envet on button of search history
$("#history").on("click", ".btn-block", function (e) {
    e.preventDefault();
    let city = $(e.target).text();
    currentStatus(city);
    fiveDayStatus(city);
});

//call this function to initialize display to search history
renderHistory();