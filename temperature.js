// 파일 경로를 지정합니다.
const filePath = 'data.txt';
let dailyData = {};
let datasets = [];
let chart;
const checkedDates = [];
const checkedRooms = ['c', 'l'];


// Fetch API를 사용하여 파일 내용을 가져옵니다.
fetch(filePath)
    .then(response => response.text())
    .then(data => {
        // 파일 내용을 출력합니다.
        // document.getElementById('file-content').textContent = data;
        dailyData = parseData(data);
        setChartData(dailyData);
    })
    .catch(error => {
        console.error('파일을 읽는 중 오류가 발생했습니다:', error);
    });

const ctx = document.getElementById('myChart');


function setChartData(dailyData) {
    console.log(dailyData);
    Object.keys(dailyData).forEach((date, index) => {
        const daysWrapper = document.getElementById('days');
        const day = document.createElement('input');
        day.type = 'checkbox';
        day.id = date;
        day.value = date;
        day.addEventListener('click', (e) => {
            // drawChart(dailyData, date);
            console.log(e.target.checked);
            
            if(e.target.checked) {
                checkedDates.push(e.target.value);
            } else {
                checkedDates.splice(checkedDates.indexOf(e.target.value), 1);
            }
            setDataSet(checkedDates);
        });
        if(index == Object.keys(dailyData).length - 1) {
            day.click();
        }
        const label = document.createElement('label');
        label.htmlFor = date;
        label.textContent = date;
        daysWrapper.appendChild(day);
        daysWrapper.appendChild(label);
    });


    setDataSet([Object.keys(dailyData).pop()]);

    const config = {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Chart.js Line Chart - Cubic interpolation mode'
                },
            },
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        

                    },
                    min: (new Date(0, 0, 0, 7, 0)).getTime(),
                    max: (new Date(0, 0, 0, 23, 0)).getTime(),
                },
                y: {
                    min: 28,
                    max: 37,
                }
            }
            // scales: {
            //     x: {
            //         display: true,
            //         title: {
            //             display: true
            //         }
            //     },
            //     y: {
            //         display: true,
            //         title: {
            //             display: true,
            //             text: 'Value'
            //         },
            //         suggestedMin: 0,
            //         suggestedMax: 50
            //     }
            // }
        },
    };

    chart = new Chart(ctx, config);
    



    
}


const parseData = (data) => {
    const dailyData = {};
    const units = data.split('--');
    units.forEach((unit, index) => {
        if (index == 0) return;
        const lines = unit.split('\n');

        const unit_state = new State(...lines);
        const date = unit_state.getDateString();
        if (dailyData[date] == undefined) {
            dailyData[date] = [];
        }
        dailyData[date].push(unit_state);

    });
    return dailyData;

};

class State {
    time;
    c_temp;
    c_hum;
    l_temp;
    l_hum;
    constructor(time, c_temp, c_hum, l_temp, l_hum) {
        this.timeString = time;
        this.c_temp = c_temp.replace('°C', '');
        this.c_hum = c_hum;
        this.l_temp = l_temp.replace('°C', '');
        this.l_hum = l_hum;

        this.time = this.setTime(time);
    }

    setTime(source) {
        const [year, month, day, timePart] = source.split('. ');

        const [amPm, time] = timePart.split(' ');
        let [hours, minutes] = time.split(':');

        if (amPm == '오후' && hours < 12) {
            hours = Number(hours) + 12;
        } else if (amPm == '오전' && hours == 12) {
            hours = 0;
        }
        const date = new Date(year, month - 1, day, hours, minutes);
        return date;
    }

    getDateString() {
        return `${this.time.getFullYear()}-${this.time.getMonth() + 1}-${this.time.getDate()}`;
    }
    getOnlyTimeString() {
        return `${this.time.getHours()}:${this.time.getMinutes()}`;
    }
    getTimeSameDay() {
        return new Date(0, 0, 0, this.time.getHours(), this.time.getMinutes());
    }

}

const setDataSet = (dates) => {
    datasets = [];
    dates.forEach((date) => {
        if(checkedRooms.includes('c')) 
            datasets.push({
                label: date + 'cozy',
                data: dailyData[date]?.map((state) => { return {x: state.getTimeSameDay(), y: state.c_temp} }),
            });

        if(checkedRooms.includes('l'))
            datasets.push({
                label: date + 'livingRoom',
                data: dailyData[date]?.map((state) => { return {x: state.getTimeSameDay(), y: state.l_temp} }),
            });
    });

    if(chart) {
        chart.data.datasets = datasets;
        chart.update();
    }
    

}
const changeRoom = (e) => {
    if(e.checked) {
        checkedRooms.push(e.value);
    } else {
        checkedRooms.splice(checkedRooms.indexOf(e.value), 1);
    }
    setDataSet(checkedDates);
}