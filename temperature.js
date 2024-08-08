// 파일 경로를 지정합니다.
const filePath = 'data.txt';

// Fetch API를 사용하여 파일 내용을 가져옵니다.
fetch(filePath)
    .then(response => response.text())
    .then(data => {
        // 파일 내용을 출력합니다.
        // document.getElementById('file-content').textContent = data;
        const dailyData = parseData(data);
        setChartData(dailyData);
    })
    .catch(error => {
        console.error('파일을 읽는 중 오류가 발생했습니다:', error);
    });

const ctx = document.getElementById('myChart');


function setChartData(dailyData) {
    console.log(dailyData);
    const testDate = '2024-8-8';


    const datasets = [
        {
            label: 'cozy',
            data: dailyData[testDate]?.map((state) => { return {x: state.time, y: state.c_temp} }),
        },
        {
            label: 'livingRoom',
            data: dailyData[testDate]?.map((state) => { return {x: state.time, y: state.l_temp} }),
        }
    ]
    //chart
    // const labels = dailyData[testDate]?.map((state) => state.getOnlyTimeString());
    // const datapoints = dailyData[testDate]?.map((state) => state.c_temp);
    // console.log(labels);
    // console.log(datapoints);
    // const data = {
    //     labels: labels,
        // datasets: [
        //     {
        //         label: 'Cubic interpolation (monotone)',
        //         data: datapoints,
        //         borderColor: 'red',
        //         fill: false,
        //         cubicInterpolationMode: 'monotone',
        //         tension: 0.4
        //     },
        // {
        //     label: 'Cubic interpolation',
        //     data: datapoints,
        //     borderColor: "blue",
        //     fill: false,
        //     tension: 0.4
        // },
        // {
        //     label: 'Linear interpolation (default)',
        //     data: datapoints,
        //     borderColor: "green",
        //     fill: false
        // }
        // ]
    // };
    const data2 = {
        datasets: datasets
    };

    const config = {
        type: 'line',
        data: data2,
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
                        unit: 'hour'
                    }
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

    new Chart(ctx, config);
}


const parseData = (data) => {
    const dailyData = {};
    const units = data.split('현재시간');
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

}

const testState = new State('2024. 8. 8. 오전 12:42', '30°C', '50%', '30°C', '50%');
console.warn(testState.time)