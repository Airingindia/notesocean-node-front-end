$(document).ready(function () {
    console.log(window.location.pathname.split("/")[3]);
    const public_notes_id = window.location.pathname.split("/")[3];
    $.ajax({
        type: "GET",
        url: sessionStorage.getItem("api") + "/products/" + public_notes_id,
        ContentType: "application/json",
        processData: false,
        headers: {
            Authorization: localStorage.getItem("token")
        },
        success: function (data) {
            if (data.length !== 0) {
                $(".loading-public-notes").addClass("d-none");
                $(".public-notes-details-container").removeClass("d-none");
                console.log(data);
                let id = data.id;
                let name = data.name;
                let thumbnails = data.thumbnails;
                let views = data.views;
                let dislikes = data.dislikes;
                let likes = data.likes;
                let timestamp = data.timestamp;

                $(".public-notes-title").html(name);
                $(".public-notes-likes-count").html(likes);
                $(".public-notes-dislikes-count").html(dislikes);
                $(".public-notes-views-count").html(formatViews(views));

            } else {
                $(".loading-public-notes").addClass("d-none");
                $(".notes-removed").removeClass("d-none");
                $(".public-notes-details-container").addClass("d-none");
            }
        },
        error: function (err) {
            $(".loading-public-notes").addClass("d-none");
            $(".notes-removed").removeClass("d-none");
            $(".public-notes-details-container").addClass("d-none");
        }
    });

    function dailyViews() {
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Day', 'Views', "Likes"],
                ['1 jan', 400, 1110],
                ['2 jan', 500, 20],
                ['3 jan', 600, 30],
                ['4 jan', 100, 100],
                ['5 jan', 800, 50],
                ['6 jan', 800, 60],
                ['7 jan', 00, 70],
                ['8 jan', 1200, 80],
                ['9 jan', 1400, 90],
                ['10 jan', 1500, 1100],
                ['11 jan', 1600, 10],
                ['12 jan', 1700, 5],
                ['13 jan', 400, 11],
                ['13 jan', 00, 134],
            ]);

            var options = {
                title: '',
                curveType: 'function',
                legend: { position: 'bottom' }
            };

            var chart = new google.visualization.LineChart(document.getElementById('daily-views'));

            chart.draw(data, options);
        }
    };
    dailyViews();

    const formatViews = n => {
        if (n < 1e3) return n;
        if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
        if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
        if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
        if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
    };
})