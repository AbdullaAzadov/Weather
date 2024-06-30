const API = "824449c03ff00555f1063ad1f9235c97";

class Widget  {
    city = '';
    data = [];
    Date = new Date();
    currentDay = this.Date.getDate();
    currentWeekDay = this.Date.getDay();
    currentHour = this.Date.getHours();
    

    _days = document.querySelector(".days")
    _schedule = document.querySelector('.schedule')
    
    _target_city = document.querySelector('#target-city');
    _target_icon = document.querySelector('#target-icon');
    _target_temp = document.querySelector("#target-temp");
    _target_desc = document.querySelector("#target-desc");
    
    _target_date = document.querySelector('#target-date');
    _target_date_desc = document.querySelector('#target-date-desc');


    constructor(city){
        this.city = city;
        const bigData = getWeatherByName(city);
        let currentDate = 0;
        let weekDay = this.currentWeekDay;
        
        bigData.then(r => {

            console.log(r);

            r.list.forEach(w => {
                const day = w.dt_txt.slice(8, 10);
                const month = w.dt_txt.slice(5, 7);
                const hour = w.dt_txt.slice(11, 13);

                if (currentDate != day) {
                    currentDate = day;
                    this.data.push({
                        day: day,
                        weekDay: weekDay,
                        month: month,
                        city: r.city.name,
                        hours: []
                    })
                    weekDay = this.increaseWeekDay(weekDay);
                }

                
                if (this.data.slice(-1)[0].day == day) {
                    this.data.slice(-1)[0].hours.push({
                        hour: hour,
                        temp: Math.round(Number(w.main.temp)),
                        humidity: w.main.humidity,
                        wind: w.wind.speed, 
                        icon_id: w.weather[0].id,
                        weather_title: w.weather[0].main,
                        weather_desc: w.weather[0].description

                    })
                }
            });
            this.setDays()

        })
        console.log(this.data);
        this.setDays();
    }


    setInfoData(weather, weatherHour){

        console.log(this._target_city);
        this._target_city.innerHTML = weather.city;
        this._target_icon.src = this.getWeatherIcon(weatherHour.icon_id);
        this._target_temp.innerHTML = this.getTemp(weatherHour.temp)
        this._target_desc.innerHTML = weatherHour.weather_desc[0].toUpperCase() + weatherHour.weather_desc.slice(1);


        if (this.currentDay == weather.day) {
            this._target_date.innerHTML = "Сегодня";
        }
        else{
            this._target_date.innerHTML = `${Number(weather.day)} ${this.getMonthName(weather.month)}`;
        }

        this._target_date_desc.innerHTML = `${this.getWeekDayName(weather.weekDay, true)}<br>
        Влажность: ${weatherHour.humidity}%<br> 
        Ветер: ${weatherHour.wind} м/с`


    }

    setSchedule(weather){

        this.clearSchedule(true);

        let activatedCurrent = false;
        weather.hours.forEach(wHour => {

            const _element = document.createElement('div');
            const _element_hour = document.createElement('p');
            const _element_icon = document.createElement('img');
            const _element_temp = document.createElement('p');

            if(!activatedCurrent){
                const delta = this.currentHour - Number(wHour.hour);

                if (this.currentDay == weather.day && delta < 3 && delta >= 0) {
                    _element.setAttribute('class', 'schedule-element current');
                    _element_hour.innerHTML = 'Сейчас';
                    this.setInfoData(weather, wHour);
                    activatedCurrent = true;
                }
                else if(this.currentDay != weather.day){
                    _element.setAttribute('class', 'schedule-element current');
                    _element_hour.innerHTML = wHour.hour + ":00";
                    this.setInfoData(weather, wHour);
                    activatedCurrent = true;
                }
                else{
                    _element.setAttribute('class', 'schedule-element');
                    _element_hour.innerHTML = wHour.hour + ":00";
                }
            }
            else{
                _element.setAttribute('class', 'schedule-element');
                _element_hour.innerHTML = wHour.hour + ":00";
            }

            _element_icon.src = this.getWeatherIcon(wHour.icon_id);
            _element_temp.innerHTML = this.getTemp(wHour.temp);

            _element.onclick = () => {

                this.clearSchedule(false);
                _element.setAttribute('class', 'schedule-element current')
                this.setInfoData(weather, wHour);
            }


            _element.appendChild(_element_hour);
            _element.appendChild(_element_icon);
            _element.appendChild(_element_temp);
            this._schedule.appendChild(_element)
        })

    }

    setDays(){
        let selected = false;
        
        this.data.forEach(w =>{

            let _day = document.createElement('div')

            if (!selected && this.currentDay == w.day) {
                selected = true;
                _day.setAttribute('class', 'day selected')
                this.setSchedule(w);
            }
            else{
                _day.setAttribute('class', 'day');
            }

            _day.onclick = () => {
                console.log("clicked on", _day);

                const __days = document.querySelectorAll('.day')
                for (const __day of __days) {
                    __day.setAttribute('class', 'day');
                }

                _day.setAttribute('class', 'day selected');
                
                this.setSchedule(w);
            }

            _day.innerHTML = `<p>${this.getWeekDayName(w.weekDay, false)}</p>
            <h3>${w.day}</h3>`

            this._days.appendChild(_day);  
        })
    }

    getTemp(temp){
        let res;
        if (temp == 0) {
            res = '0°';
        }
        else if(temp > 0){
            res = `+${temp}°`;
        }
        else{
            res = `-${temp}°`;
        }
        return res;
    }

    clearSchedule(Erase){
        document.querySelectorAll('.schedule-element').forEach(e =>{
            if (Erase) {
                this._schedule.removeChild(e);
            }
            else{
                e.setAttribute('class', 'schedule-element');
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

    getWeekDayName(weekDay, isLong){
        let resA;
        let resB;
        switch (weekDay) {
            case 1:
                resA = 'ПН'
                resB = "Понедельник"
                break;
            case 2:
                resA = 'ВТ'
                resB = "Вторник"
                break;
            case 3:
                resA = 'СР'
                resB = "Среда"
                break;
            case 4:
                resA = 'ЧТ'
                resB = "Четверг"
                break;
            case 5:
                resA = 'ПТ'
                resB = "Пятница"
                break;
            case 6:
                resA = 'СБ'
                resB = "Суббота"
                break;
            case 7:
                resA = 'ВС'
                resB = "Воскресенье"
                break;
            default:
                resA = 'ВС'
                resB = "Воскресенье"
                break;
        }

        if (isLong) {
            return resB;
        }
        return resA;
    }

    getMonthName(month){
        
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
                month = "Декабря"
                break;
        }
        return month;
    }

    ElementInArray(e, a){
        for (let i = 0; i < a.length; i++) {
            if (e == a[i]) {
                return true
            }
        }
        return false;
    }

    clearAll(){
        document.querySelectorAll('.day').forEach(e => {e.remove()})
        document.querySelectorAll('.schedule-element').forEach(e => {e.remove()})

    }

}







let input = document.querySelector('#input');
let button = document.querySelector('#send');


button.onclick = async () => {
    weatherWidget.clearAll();
    weatherWidget = '';
    weatherWidget = new Widget(input.value);
    input.value = '';
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
