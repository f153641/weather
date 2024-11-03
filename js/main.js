let data
let locationIndex = localStorage.getItem('locationIndex') || 0

axios({
    url: 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWA-1746BAEC-7FC4-45F8-B2DA-DE5CFB751EE7',
}).then(result => {
    data = result.data.records.locations[0].location
    getTodayWeather(data, locationIndex)
    getWeekWeather(data, locationIndex)
    getLocationName(data, locationIndex)
})

// 1. 渲染本日天氣資訊
const getTodayWeather = (data, locationIndex) => {

    const ws = data[locationIndex].weatherElement[4].time[0].elementValue[0].value
    const mint = data[locationIndex].weatherElement[8].time[0].elementValue[0].value
    const maxt = data[locationIndex].weatherElement[12].time[0].elementValue[0].value
    const uvi = data[locationIndex].weatherElement[9].time[0].elementValue[0].value
    const wx = data[locationIndex].weatherElement[6].time[0].elementValue[0].value
    const date = new Date(data[locationIndex].weatherElement[0].time[0].startTime).toLocaleDateString()
    const weekIndex = new Date(data[locationIndex].weatherElement[0].time[0].startTime).getDay()
    const weekArr = ['日', '一', '二', '三', '四', '五', '六']
    const todayWxImg = changeImg(wx)

    document.querySelector('.todayWeather').innerHTML = `
        <div class="pic"><img src=${todayWxImg} alt=""></div>
        <div class="todayinfo">
            <div class="today_left">
                <p class="info_item">${date} (${weekArr[weekIndex]})</p>
                <p class="info_item">${wx}</p>
            </div>  
            <div class="today_right">
                <p class="info_item">氣溫：${mint}°C ~ ${maxt}°C</p>
                <p class="info_item">最高風速：${ws + 'm/s'}</p>
                <p class="info_item">紫外線指數：${uvi}</p>
            </div>
        </div>
    `
}

// 2. 渲染一周天氣資訊
const getWeekWeather = (data, locationIndex) => {

    for (let i = 1; i < 7; i++) {
        let time = 2 * i + 1
        const mint = data[locationIndex].weatherElement[8].time[time].elementValue[0].value
        const maxt = data[locationIndex].weatherElement[12].time[time].elementValue[0].value
        const wx = data[locationIndex].weatherElement[6].time[time].elementValue[0].value
        const date = new Date(data[locationIndex].weatherElement[0].time[time].startTime).toLocaleDateString()
        const weekIndex = new Date(data[locationIndex].weatherElement[0].time[time].startTime).getDay()
        const weekArr = ['日', '一', '二', '三', '四', '五', '六']
        const weekWxImg = changeImg(wx)

        const str = `
            <li>
                <img class="info_item" src=${weekWxImg} alt="">
                <p class="info_item">${date} (${weekArr[weekIndex]})</p>
                <p class="info_item">${wx}</p>
                <p class="info_item">${mint}°C ~ ${maxt}°C</p>
            </li>
        `

        document.querySelector('.weekWeather').innerHTML += str
    }
}

// 3. 換圖片
const changeImg = wx => {
    if (wx === '多雲時晴' || wx === '晴時多雲') {
        return './image/2.png'
    } else if (wx === '多雲' || wx === '陰時多雲') {
        return './image/3.png'
    } else {
        return './image/5.png'
    }
}

// 4. 填充選項
const getLocationName = (locationName) => {
    document.querySelector('select').innerHTML =
        locationName.map((item, index) => {
            return `<option value="${index}">${item.locationName}</option>`
        }).join('')
    document.querySelectorAll('option')[locationIndex].selected = 'selected'
}

// 5. 更換地區(索引號)   6.保存至本地
document.querySelector('select').addEventListener('change', function () {
    document.querySelector('.todayWeather').innerHTML = ''
    document.querySelector('.weekWeather').innerHTML = ''
    localStorage.setItem('locationIndex', this.value)
    locationIndex = this.value
    getTodayWeather(data, locationIndex)
    getWeekWeather(data, locationIndex)
})