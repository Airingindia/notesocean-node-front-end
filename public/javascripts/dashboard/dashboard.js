$(document).ready(function () {
  const token = localStorage.getItem("token");
  if (token !== null) {
    // check valid token
    $.ajax({
      type: "GET",
      url: sessionStorage.getItem("api") + "/validate",
      headers: {
        Authorization: token,
      },
      success: function (data) {
        if (data == true) {
          const userinfo = JSON.parse(atob(token.split(".")[1])).userId;
          sessionStorage.setItem("userid", userinfo);
          // console.log(userinfo);
          amplitude.getInstance().setUserId(userinfo);
        } else {
          clearAllBrowserData();
        }
      },
      error: function (err) {
        clearAllBrowserData();
      },
    });
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("userdata");
    setCookie("token", "", 0);
    window.location = "/session-expire";
  }

  $(".logout-btn").click(function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("userdata");
    setCookie("token", "", 0);
    $.ajax({
      type: "GET",
      url: sessionStorage.getItem("api") + "/authenticate/logout",
      headers: {
        Authorization: token,
      },
      success: function (data) {
        $.ajax({
          type: "GET",
          url: sessionStorage.getItem("api") + "/logout",
          headers: {
            Authorization: token,
          },
          success: function (data) {
            window.location = "/account/login";
          },
          error: function (err) {
            window.location = "/account/login";
          },
        });
      },
      error: function (err) {
        window.location = "/account/login";
      },
    });
  });

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

  // 
  // cookie expire
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }


  // set user profilepic
  function showuserPic() {
    if (localStorage.getItem('userdata') !== null) {
      const userdata = JSON.parse(localStorage.getItem("userdata"));
      const profilepic = userdata.profileImage;
      if (profilepic !== null) {
        $(".navbar-user-pic").attr("src", profilepic);
      } else {
        $(".navbar-user-pic").attr("src", "/images/dummy/user_dummy.jpg");
      }
    }
  }

  function clearAllBrowserData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("userdata");
    setCookie("token", "", 0);
    window.location = "/session-expire";
  }

});
