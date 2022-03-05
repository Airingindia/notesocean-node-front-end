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
          localStorage.removeItem("token");
          localStorage.removeItem("userinfo");
          localStorage.removeItem("userdata");
          window.location = "/session-expire";
        }
      },
      error: function (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");
        localStorage.removeItem("userdata");
        window.location = "/session-expire";
      },
    });
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("userdata");
    window.location = "/session-expire";
  }

  $(".logout-btn").click(function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("userdata");
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

  $("aside button").each(function () {
    $(this).click(function () {
      if ($(window).width() < 769) {
        $(this).html(`<i class="fa fa-spinner fa-spin text-danger"> </i>`);
      }
      let url = $(this).attr("route");
      window.location = url;
    });
  });

  // button active function
  let path = window.location.pathname;
  $("aside button[route='" + path + "']").addClass("active");


  // add new notes notes button function

  $(".add-new-notes-btn").click(function () {
    $(".modal").modal("show");
  });
});
