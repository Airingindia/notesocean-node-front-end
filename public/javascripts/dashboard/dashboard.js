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
        } else {
          alert("Invalid token");
          window.location = "/account/login";
        }
      },
      error: function (err) {
        window.location = "/account/login";
      },
    });
  } else {
    window.location = "/account/login";
  }

  $(".logout-btn").click(function () {
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
