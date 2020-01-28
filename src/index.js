var echarts = require('echarts');
var axios = require('axios');
var php = require('locutus/php');

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
let url = php.url.parse_url(location.href);
var request = [];
php.strings.parse_str(url.query, request);
// let url1 = 'http://lab.isaaclin.cn/nCoV/api/area?latest=0&province=%E5%AE%89%E5%BE%BD%E7%9C%81';
let url1 = 'http://localhost:63342/2019nCov-ProvincialMunicipalMonitoring/build.php?provincial='+request.provincial;
axios.get(url1)
  .then(function (response) {
      // handle success
      let legend_data = response.data.legend_data;
      let date = response.data.date;
      let series = response.data.series;
      this.setMyChart(legend_data, date, series);
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

