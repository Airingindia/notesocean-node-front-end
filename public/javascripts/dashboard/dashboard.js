$(document).ready(function () {
  // return false;
  $(".add-new-notes-btn").click(function () {
    $(".modal").modal("show");
  });
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function showUserPic() {
    if (localStorage.getItem('userInfo') !== null) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo.profileImage !== null && userInfo.profileImage !== undefined) {
        const profilePic = userInfo.profileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in/fit-in/25x25");
        if (profilePic !== null) {
          $(".navbar-user-pic").attr("src", profilePic);
        } else {
          $(".navbar-user-pic").attr("src", "/images/user.jpg");
        }
      } else {
        $(".navbar-user-pic").attr("src", "/images/user.jpg");
      }

    }
  }

  showUserPic();
  function getUserInfo() {
    if (localStorage.getItem("userInfo") == null || localStorage.getItem("userInfo") === undefined) {
      $.ajax({
        type: "GET",
        url: app.getApi() + "/users/" + app.getCurrentUserid(),
        headers: {
          Authorization: getCookie("token")
        },
        success: function (data) {
          localStorage.setItem("userInfo", JSON.stringify(data));
          showUserInfo(data);
        }
      })
    }
  };
  getUserInfo();

  dash.getTotalProductsCount().then((data) => {
    $(".total-notes-dash").html(data.userProductsCount);
  }).catch(err => {
    app.alert(err.resposeJSON.message, "danger");
  });

  dash.getTotalReactCount().then((data) => {
    $(".total-likes-dash").html(data.userReactsLikeCount);
  }).catch(err => {
    app.alert(err.resposeJSON.message, "danger");
  })

  dash.getUserTotalViews().then((data) => {
    $(".total-views-dash").html(data.userProductsViewsCount);
  }).catch(err => {
    app.alert(err.resposeJSON.message, "danger");
  });


  app.getUserEarning().then((data) => {
    $(".total-earning-dash").html(data.totalEarning);
  }).catch(err => {
    app.alert(err.resposeJSON.message, "danger");
  })



  //   get total notes and views
  app.getSlefProducts().then((data) => {
    let totalNotes = data.requested.length;

    //   get product by views
    let productByViews = data.requested.sort((a, b) => { return b.views - a.views });
    let topViews = productByViews.slice(0, 5);
    let topViewsData = [["Element", "Likes", "views", { role: "style" }]];
    for (let i = 0; i < topViews.length; i++) {
      let name = topViews[i].name;
      let views = topViews[i].views;
      let likes = topViews[i].likes;
      topViewsData.push([name, likes, views, "blue"]);
    }
    if (totalNotes > 0) {
      topNotes(topViewsData);
    } else {
      $("#barchart_values").html("<div class='d-flex justify-content-center align-items-center p-3'>  No Notes Found! </div>");
    }


    // get recent notes
    let recentNotesData = data.requested.sort((a, b) => { return b.timestamp - a.timestamp });
    let recentNotes = recentNotesData.slice(0, 5);
    let recentNotesChartData = [["Element", "Likes", "views", { role: "style" }]];
    for (let i = 0; i < recentNotes.length; i++) {
      let name = recentNotes[i].name;
      let views = recentNotes[i].views;
      let likes = recentNotes[i].likes;
      recentNotesChartData.push([name, likes, views, "blue"]);
    }
    if (totalNotes > 0) {
      recentNotesChart(recentNotesChartData);
    } else {
      $("#recentNotesChart").html("<div class='d-flex justify-content-center align-items-center p-3'>  No Notes Found! </div>");
    }
  }).catch(err => {
    console.log(err);
  })
});


function topNotes(notesData) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(notesData);
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
      bar: { groupWidth: "100%" },
      legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
    chart.draw(view, options);
  }
}

function recentNotesChart(notesData) {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(notesData);

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
      bar: { groupWidth: "100%" },
      legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("recentNotesChart"));
    chart.draw(view, options);
  }
}
