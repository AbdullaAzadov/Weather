const API = "824449c03ff00555f1063ad1f9235c97";

class Widget  {
    city = ''
    days = [];
    data;
    currentDate = new Date();

    _days = document.querySelector(".days")
    _schedule = document.querySelector('.schedule')
    _left = document.querySelector('.left-block')
    _right = document.querySelector('.right-block')


    constructor(city){
        this.city = city;
        this.data = getWeatherByName(city)
        console.log(this.data, "DATA PARSED");
    }

    setMainData(){
        const _name = document.querySelector('target-city');
        const _weather_icon = document.querySelector('target-icon')
        const _weather_temp = document.querySelector("target-temp")

        _name.innerHTML = this.city;





    }

    setInfoData(Month=0, Date=0, WeekDay, humidity, wind){
        
        const __today = document.querySelector('#target-date');
        const __today_info = document.querySelector('#target-date-desc');

        if (Month == 0 && Date == 0) {
            __today.innerHTML = "Сегодня";
        }
        else{
            __today.innerHTML = `${Number(Date)} ${Month}`;
        }

        __today_info.innerHTML = `${WeekDay}<br>
        Влажность: ${humidity}%<br> 
        Ветер: ${wind} м/с`


    }


    setSchedule(targetDate, targetWeekDay, targetMonth){

        let _els = document.querySelectorAll('.schedule-element');
        for (let i = 0; i < _els.length; i++) {
            this._schedule.removeChild(_els[i])
        }

        this.data.then((response) => {

            const currentHour = this.currentDate.getHours()
            let activatedCurrent = false;
            for(let i = 0; i < response.list.length; i++){

                let date = response.list[i].dt_txt.slice(8, 10);
                if (targetDate == date) {
                    
                    const _element = document.createElement('div');
                     
                    let hour = response.list[i].dt_txt.slice(11, 13)
                    const _hour = document.createElement('p');

                    
                    if(!activatedCurrent){
                        if (targetDate == this.currentDate.getDate() && (currentHour - Number(hour) < 3 && currentHour - Number(hour) >= 0)) {
                            _element.setAttribute('class', 'schedule-element current');
                            _hour.innerHTML = 'Сейчас';
                            let _data = this.getDataByDate(targetDate, hour, response.list)
                            this.setInfoData(0, 0, targetWeekDay, _data.main.humidity, _data.wind.speed)
                            this.setMainData();
                        }
                        else{
                            _element.setAttribute('class', 'schedule-element current');
                            _hour.innerHTML = hour + ":00";
                            let _data = this.getDataByDate(targetDate, hour, response.list)
                            this.setInfoData(targetMonth, targetDate, targetWeekDay, _data.main.humidity, _data.wind.speed)
                            this.setMainData()

                        }

                        activatedCurrent = true;
                    }
                    else{
                        _element.setAttribute('class', 'schedule-element');
                        _hour.innerHTML = hour + ":00";
                    }
                    
                    
                    let weather_url =  this.getWeatherIcon(response.list[i].weather[0].id);
                    const _icon = document.createElement('img');
                    _icon.src = weather_url
                    
                    let temp = Math.round(response.list[i].main.temp)
                    if (temp == 0) {
                        temp = '0°';
                    }
                    else if(temp > 0){
                        temp = `+${temp}°`;
                    }
                    else{
                        temp = `-${temp}°`;
                    }
                    const _temp = document.createElement('p');
                    _temp.innerHTML = temp;

                    _element.onclick = () => {
                        let _els = document.querySelectorAll('.schedule-element');
                        for (let i = 0; i < _els.length; i++) {
                            _els[i].setAttribute('class', 'schedule-element')
                        }

                        _element.setAttribute('class', 'schedule-element current')

                        let _data = this.getDataByDate(targetDate, hour, response.list)
                        console.log(_data);
                        
                        
                        if (this.currentDate.getDate() == targetDate) {
                            this.setInfoData(0, 0, targetWeekDay, _data.main.humidity, _data.wind.speed)
                            this.setMainData()
                        } else {
                            this.setInfoData(targetMonth, targetDate, targetWeekDay, _data.main.humidity, _data.wind.speed)
                            this.setMainData()
                        }

                    }


                    _element.appendChild(_hour);
                    _element.appendChild(_icon);
                    _element.appendChild(_temp);
                    this._schedule.appendChild(_element)
                }

            }

        })

    }


    setDays(){
        let weekDay = this.currentDate.getDay();

        this.data.then((response) => {

            let cachedDate = 0;

            for(let i = 0; i < response.list.length; i++){

                let date = response.list[i].dt_txt.slice(8, 10);
                let month = response.list[i].dt_txt.slice(5, 7)

                if (i == 0 && this.currentDate.getDate() != date) {
                    continue;
                }


                if (cachedDate == 0 || cachedDate != date) {
                    cachedDate = date;
                    this.pushDate(weekDay, date, month);
                    weekDay = this.increaseWeekDay(weekDay);
                }    

            }
            
            let selected = false;
            for (let i = 0; i < this.days.length; i++) {

                let _day = document.createElement('div')

                if (!selected && this.currentDate.getDate() == this.days[i].date) {
                    selected = true;
                    _day.setAttribute('class', 'day selected')
                    this.setSchedule(this.days[i].date, this.days[i].weekDay, this.days[i].month);

                }else{
                    _day.setAttribute('class', 'day');
                }

                _day.onclick = () => {
                    console.log("clicked on", _day);
                    const __days = document.querySelectorAll('.day')
                    for (const __day of __days) {
                        __day.setAttribute('class', 'day');
                    }
                    _day.setAttribute('class', 'day selected');
                    this.setSchedule(this.days[i].date, this.days[i].weekDay, this.days[i].month);
                }

                _day.innerHTML = `<p>${this.days[i].day}</p>
                <h3>${this.days[i].date}</h3>`

                this._days.appendChild(_day);
            }

        })


    }

    getWeatherIcon(code){

        if (this.ElementInArray(code, [800])) {
            return 'https://openweathermap.org/img/wn/01d@2x.png'; 
        } 
        else if(this.ElementInArray(code, [801])){
            return 'https://openweathermap.org/img/wn/02d@2x.png';
        } 
        else if(this.ElementInArray(code, [802])){
            return 'https://openweathermap.org/img/wn/03d@2x.png';
        } 
        else if(this.ElementInArray(code, [803, 804])){
            return 'https://openweathermap.org/img/wn/04d@2x.png';
        }
        else if(this.ElementInArray(code, [300, 301, 302, 310, 311, 312, 313, 314, 321, 520, 521, 522, 531])){
            return 'https://openweathermap.org/img/wn/09d@2x.png';
        }
        else if(this.ElementInArray(code, [500, 501, 502, 503, 504])){
            return 'https://openweathermap.org/img/wn/10d@2x.png';
        }
        else if(this.ElementInArray(code, [200, 201, 202, 210, 211, 212, 221, 230, 231, 232])){
            return 'https://openweathermap.org/img/wn/11d@2x.png';
        }
        else if(this.ElementInArray(code, [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622])){
            return 'https://openweathermap.org/img/wn/13d@2x.png';
        }
        else if(this.ElementInArray(code, [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622])){
            return 'https://openweathermap.org/img/wn/13d@2x.png';
        }
        else{
            return 'https://openweathermap.org/img/wn/50d@2x.png';
        }


    }

    increaseWeekDay(day){
        if (day + 1 == 8) {
            return 1;
        }
        return ++day;
    }

    pushDate(day, date, month){
        let weekDay = '';
        switch (day) {
            case 1:
                day = 'ПН'
                weekDay = "Понедельник"
                break;
            case 2:
                day = 'ВТ'
                weekDay = "Вторник"
                break;
            case 3:
                day = 'СР'
                weekDay = "Среда"
                break;
            case 4:
                day = 'ЧТ'
                weekDay = "Четверг"
                break;
            case 5:
                day = 'ПТ'
                weekDay = "Пятница"
                break;
            case 6:
                day = 'СБ'
                weekDay = "Суббота"
                break;
            case 7:
                day = 'ВС'
                weekDay = "Воскресенье"
                break;
            default:
                break;
        }

        switch (month) {
            case '01':
                month = "Января"
                break;
            case '02':
                month = "Февраля"
                break;
            case '03':
                month = "Марта"
                break;
            case '04':
                month = "Апреля"
                break;
            case '05':
                month = "Мая"
                break;
            case '06':
                month = "Июня"
                break;
            case '07':
                month = "Июля"
                break;
            case '08':
                month = "Августа"
                break;
            case '09':
                month = "Сентября"
                break;
            case '10':
                month = "Октября"
                break;
            case '11':
                month = "Ноября"
                break;
            case '12':
                month = "Декабря"
                break;
            default:
                break;
        }


        this.days.push(
            {
             day: day,
             weekDay: weekDay,
             date: date,
             month: month
            }
        )
    }

    ElementInArray(e, a){
        for (let i = 0; i < a.length; i++) {
            if (e == a[i]) {
                return true
            }
        }
        return false;
    }

    getDataByDate(Day, Hour, Arr){
        
        for (let i = 0; i < Arr.length; i++) {
            if (Number(Arr[i].dt_txt.slice(8, 10)) == Day && Arr[i].dt_txt.slice(11, 13) == Hour) {
                return Arr[i];
            }            
        }
    }

}







let input = document.querySelector('#input');
let button = document.querySelector('#send');


button.onclick = async () => {
    getWeatherByName(input.value);
    input.value = '';

    console.log();

}

async function getWeatherByName(city){

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=45&units=metric&lang=ru&appid=${API}`

    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }catch(e){
        console.error(e);
    }

}

async function getCityCoords(city){

    const geo_url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${API}`

    try{
        const response = await fetch(geo_url);
        const data = await response.json()
        lat = data[0].lat;
        lon = data[0].lon;
    }

    catch (e){
        console.error(e);
    }

    return [lat, lon]
}

weatherWidget = new Widget('Almaty');
weatherWidget.setDays()
