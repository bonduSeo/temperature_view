// 파일 경로를 지정합니다.
const filePath = 'data.txt';

// Fetch API를 사용하여 파일 내용을 가져옵니다.
fetch(filePath)
    .then(response => response.text())
    .then(data => {
        // 파일 내용을 출력합니다.
        // document.getElementById('file-content').textContent = data;
        parseData(data);
    })
    .catch(error => {
        console.error('파일을 읽는 중 오류가 발생했습니다:', error);
    });

const ctx = document.getElementById('myChart');


//chart
const DATA_COUNT = 24;
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
    labels.push(i.toString());
}
const datapoints = [0, 20, 20, 60, 60, 120, NaN, 180, 120, 125, 105, 110, 170];
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Cubic interpolation (monotone)',
            data: datapoints,
            borderColor: 'red',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        },
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
    ]
};
const config = {
    type: 'line',
    data: data,
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
                display: true,
                title: {
                    display: true
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value'
                },
                suggestedMin: 0,
                suggestedMax: 50
            }
        }
    },
};

new Chart(ctx, config);


const parseData = (data) => {
    const units = data.split('현재시간');
    console.log(units);
    units.forEach((unit, index) => {
        if(index == 0) return;
        const lines = unit.split('\n');

    });

};