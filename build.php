<?php

$province = isset($_GET['provincial']) ? $_GET['provincial'] : '安徽省';
$province = urlencode($province);
$url = "http://lab.isaaclin.cn/nCoV/api/area?latest=0&province={$province}";
$historical_data = file_get_contents($url);
$results = json_decode($historical_data, true)['results'];
$all_cities = [];
foreach ($results as $result) {
    $all_cities[] = array_column($result['cities'], 'cityName');
}
$legend_data = array_values(array_unique(call_user_func_array('array_merge', $all_cities + [[]])));
$city = [];
$results = array_reverse($results);
foreach ($results as $result) {
    $temp_results[date('Ymd', $result['updateTime'] / 1000)] = $result;
}
$results = array_reverse($temp_results);
foreach ($results as $result) {
    $temp_citys = array_column($result['cities'], 'cityName');
    $temp_confirmed_count = array_combine(array_column($result['cities'], 'cityName'), array_column($result['cities'], 'confirmedCount'));
    foreach ($legend_data as $city) {
        if (in_array($city, $temp_citys, false)) {
            $temp[$city][] = $temp_confirmed_count[$city];
        } else {
            $temp[$city][] = 0;
        }
    }
}
foreach ($legend_data as $city) {
    $series[] = [
        'name'  => $city,
        'type'  => 'line',
        'stack' => '总量',
        'data'  => $temp[$city],
    ];
}

$func = function ($value) {
    return date('Ymd', $value / 1000);
};
$date = array_map($func, array_column($results, 'updateTime'));
$reposion = [
    'date'        => array_map($func, array_column($results, 'updateTime')),
    'series'      => $series,
    'legend_data' => $legend_data,
];
header('Content-Type: application/json');
echo json_encode($reposion, JSON_UNESCAPED_UNICODE);