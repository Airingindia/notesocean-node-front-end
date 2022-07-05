$(document).ready(function () {
  var token = getCookie("token");
  if (token !== undefined) {
    var userId = token.split(".")[1];
    userId = JSON.parse(atob(userId)).userId;
    amplitude.getInstance().setUserId(userId);
    $.ajax({
      type: "GET",
      url: atob(getCookie("api")) + "/validate",
      headers: {
        Authorization: getCookie("token")
      },
      success: function (data) {
        if (data == false) {
          clearAllBrowserData();
        }
      },
      error: function (error) {
        if (error.status == 429) {
          $(".second-side").html(`
            <div class="tomanyaction">
                <div class="row"> 
                  <div class="col-md-6"> 
                    <img src="/images/illustrations/serverdown.svg" class="w-100"> 
                  </div>
                  <div class="col-md-6"> 
                    <h1> To many action  </h1>
                    <p>  our have performed to many action within a minutes , plese wait until timer ends  </p>
                    <h6 class="mt-5"> Please wait ... 
                      <span id="time" class="text-danger"> </span>
                      <span class="mx-2"> Minutes </span>
                    </h6>
                  </div>
                </div>
            </div>
          `);

          var fiveMinutes = 60 * 1,
            display = document.querySelector('#time');
          startTimer(fiveMinutes, display);
        }
        console.log(error);
        // window.location = "/session-expire";
      }
    })
  } else {
    clearAllBrowserData();
  }

  $(".logout-btn").click(function () {
    clearAllBrowserData();
    $.ajax({
      type: "GET",
      url: atob(getCookie("api")) + "/authenticate/logout",
      headers: {
        Authorization: token,
      },
      success: function (data) {
        $.ajax({
          type: "GET",
          url: atob(getCookie("api")) + "/logout",
          headers: {
            Authorization: token,
          },
          success: function (data) {
            clearAllBrowserData();
          },
          error: function (err) {
            window.location = "/login";
          },
        });
      },
      error: function (err) {
        window.location = "/login";
      },
    });
  });

  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        window.location = window.location.href;
      }
    }, 1000);

  }

  // aide routes

  $(".dash-aside button").each(function () {
    $(this).click(function () {
      if ($(window).width() < 769) {
        $(this).html(`<i class="fa fa-spinner fa-spin text-danger"> </i>`);
      }
      let url = $(this).attr("route");
      window.location = url;
    });
  });



  // button active function

  function Dashroute() {
    const path = window.location.pathname;
    $(".dash-aside button[route='" + path + "']").addClass("active");
  }

  Dashroute();



  // add new notes notes button function

  $(".add-new-notes-btn").click(function () {
    $(".modal").modal("show");
  });

  // swipe left right
  if ($(window).width() < 769) {
    const swipeableEl = document.getElementsByClassName('second-side')[0];
    // hammertime.get('pinch').set({ enable: true });

    this.hammer = Hammer(swipeableEl)
    this.hammer.on('pinchout', () => {
      window.location = "/";
    });

    this.hammer.on('swipeleft', () => {
      // left 
      nextRoute();

    })
    this.hammer.on('swiperight', () => {
      // right
      prevRoute();
    })
  };

  function nextRoute() {
    $("aside button").each(function () {
      if ($(this).hasClass("active")) {
        const next = $(this).parent().next();
        $(next).find("button").click();
      } else {
        let path = window.location.pathname.split("/");
        if (path.length == 4) {
          const location = "/" + path[1] + "/" + path[2];
          window.location = location;
        }
      }
    });
  }

  function prevRoute() {
    $("aside button").each(function () {
      if ($(this).hasClass("active")) {
        const prev = $(this).parent().prev();
        $(prev).find("button").click();
      } else {
        let path = window.location.pathname.split("/");
        if (path.length == 4) {
          const location = "/" + path[1] + "/" + path[2];
          window.location = location;
        }
      }
    });
  }

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }


  // set user profilepic
  function showuserPic() {
    if (localStorage.getItem('userdata') !== null) {
      const userdata = JSON.parse(localStorage.getItem("userdata"));
      const profilepic = userdata.profileImage.replace("https://s3.ap-south-1.amazonaws.com/profiles.notesocean.com", "https://profiles.ncdn.in/fit-in/25x25");
      if (profilepic !== null) {
        $(".navbar-user-pic").attr("src", profilepic);
      } else {
        $(".navbar-user-pic").attr("src", "/images/dummy/user_dummy.jpg");
      }
    }
  }

  showuserPic();

  function clearAllBrowserData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("userdata");
    document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location = "/login";
  }

});
