var echarts = require('echarts');
var axios = require('axios');
var php = require('locutus/php');

var myChart = echarts.init(document.getElementById('main'));
let url = php.url.parse_url(location.href);
var request = [];
php.strings.parse_str(url.query, request);
let data_url = 'http://localhost:63342/2019nCov-ProvincialMunicipalMonitoring/build.php?provincial='+request.provincial;
axios.get(data_url)
  .then(function (response) {
      // handle success
      let legend_data = response.data.legend_data;
      let date = response.data.date;
      let series = response.data.series;
      setMyChart(legend_data, date, series);
  })
  .catch(function (error) {
      // handle error
      console.log(error);
  })
  .finally(function () {
      // always executed
  });

function setMyChart(legend_data, date, series) {
    // 绘制图表
    
    myChart.setOption({
        title: {
            text: request.provincial
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legend_data
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value'
        },
        series: series
    });
}

