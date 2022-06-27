$(document).ready(function () {

    function top5notes() {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ["Element", "Likes", "views", { role: "style" }],
                ["Class 10th math chapter 1", 100, 1000, "blue"],
                ["class 12th chemistry chapter 2 notes", 200, 500, "blue"],
                ["Class 10th math chapter 1", 200, 600, "blue"],
                ["Class 10th math chapter 1", 100, 100, "blue"],
                ["software engineering notes", 300, 300, "blue"]
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "",
                width: "100%",
                height: 400,
                bar: { groupWidth: "50%" },
                legend: { position: "none" },
            };
            var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
            chart.draw(view, options);
        }
    }

    top5notes();

    function dailyupload() {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Day', 'Uploads'],
                [1, 3],
                [2, 5],
                [3, 2],
                [4, 8],
                [5, 3],
                [6, 5],
                [7, 2],
                [8, 8]
            ]);

            var options = {
                title: '',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            chart.draw(data, options);
        }
    }
    // dailyupload();

    function dailyEarning() {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Day', 'Rupees'],
                [1, 10],
                [2, 30],
                [3, 50],
                [4, 150],
                [5, 300],
                [6, 800],
                [7, 1000],
                [8, 1200]
            ]);

            var options = {
                title: '',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('daily_earning'));

            chart.draw(data, options);
        }
    }
    // dailyEarning();

    function dailyViews() {
        google.charts.load("current", { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ["Days", "views", { role: "style" }],
                ["Day-1", 100, "blue"],
                ["Day-2", 200, "blue"],
                ["Day-3", 300, "bluee"],
                ["Day-4", 400, "blue"]
            ]);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                {
                    calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation"
                },
                2]);

            var options = {
                title: "",
                width: "100%",
                height: 400,
                bar: { groupWidth: "15%" },
                legend: { position: "none" },
            };
            var chart = new google.visualization.ColumnChart(document.getElementById("dailyViews"));
            chart.draw(view, options);
        }
    }

    dailyViews();

    function profileStrength() {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Porfile Merit', 'Percentage'],
                ['Merit', 75],
                ["", 25]
            ]);

            var options = {
                pieHole: 1,
                pieSliceTextStyle: {
                    color: 'white',
                },
                legend: 'none',
                width: "100%",
                height: 400,
                slices: {
                    0: { color: 'red' },
                    1: { color: '#ccc' }
                }
            };

            var chart = new google.visualization.PieChart(document.getElementById('profile-strength'));

            chart.draw(data, options);
        }
    }

    profileStrength();

    $(window).resize(function () {
        profileStrength();
        dailyViews();
        top5notes();
    });
})