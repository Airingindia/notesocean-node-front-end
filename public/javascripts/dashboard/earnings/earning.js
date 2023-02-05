$(document).ready(function () {
    // get user earnings
    app.getUserEarning().then((data) => {
        $(".avl-balance").html("&#x20B9; " + Number(data?.totalEarning ? data.totalEarning : 0).toFixed(2));
        // display withdrawal box when balance is greater than or equal to 50 
        if (data.totalEarning >= 50) {
            $(".withdrawl-cont").removeClass("d-none");
            $(".withdral-notice").addClass("d-none");
        } else {
            $(".withdrawl-cont").addClass("d-none");
            $(".withdral-notice").removeClass("d-none");
        }
    }).catch((err) => {
        app.alert("error", 400, "Failed to fetch earning");
    });

    // get user info

    app.getUserInfo().then((data) => {
        let fullName = data.firstName + " " + data.lastName;
        let phone = data.phone;
        let email = data.email;
        $("input[name='name']").val(fullName);
        $("input[name='phone']").val(phone);
        $("input[name='email']").val(email);
    }).catch((err) => {
        app.alert("error", 400, "Failed to fetch user info");
    });

    // initiate withdrawal
    $(".withdrawl-btn").click(function () {
        let name = $("input[name='name']").val();
        let phone = $("input[name='phone']").val();
        let email = $("input[name='email']").val();
        var form = new FormData();
        let json = {
            name: name,
            contact: phone,
            email: email
        }

        form.append("collections", new Blob([JSON.stringify(json)], { type: "application/json" }));

        $.ajax({
            url: app.getApi() + "/payouts",
            type: "POST",
            data: JSON.stringify(json),
            headers: {
                Authorization: app.getToken()
            },
            processData: false,
            contentType: "application/json",
            beforeSend: function () {
                $(".withdrawl-btn").html("Processing...");
            },
            success: function (data) {
                if (data.hasOwnProperty("shortUrl")) {
                    window.location.href = data.shortUrl;
                }
                $(".withdrawl-btn").html("Withdraw");
            },
            error: function (err) {
                app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
            }
        })
    });

    // get payout list use ajax
    $.ajax({
        type: "GET",
        url: app.getApi() + "/payouts?page=0&size=10",
        headers: {
            Authorization: app.getToken()
        },
        beforeSend: function () { },
        success: function (data) {
            let payoutList = data.requested;
            if (payoutList.length == 0) {
                $(".withdrawal-history-text").addClass("d-none");
                $(".withdrawal-history").addClass("d-none");
            } else {
                $(".withdrawal-history-text").removeClass("d-none");
                $(".withdrawal-history").removeClass("d-none");
            }
            $('.withdrawal-history').html("");
            for (let i = 0; i < payoutList.length; i++) {
                let payoutid = payoutList[i].id;
                let description = payoutList[i].description;
                //    amount in paise 
                let amount = payoutList[i].amount;
                let status = payoutList[i].status;
                let date = payoutList[i].updateTimestamp / 1000;
                let shortUrl = payoutList[i].shortUrl;
                // convert amount to rupees
                amount = amount / 100;
                $('.withdrawal-history').append(`
                    <div class="col-md-6 col-lg-4 my-2 payout-history">
                    <div class="card p-3 bg-white border-0 shadow h-100">
                      <div class="widthrawal-info-cont">
                      
                      <h1 class="${status == "issued" || status == "processing" ? "text-warning" : "text-notesocean"}">&#x20B9; ${amount}</h1>                    
                        <p class="text-muted">${description}</p>
                        <p> Payout Id  : ${payoutid}    </p>
                        <p class="text-muted"> Date : ${moment.unix(date).format("DD MMM YYYY")}</p>
                        <p class="text-dark">status: ${status}</p>
                        
                        <p class="text-notesocean"> ${status == "issued" || status == "processing" ? `<a href="${shortUrl}" target="_blank">Click here to complete your payout</a>` : ""}</p>
                        <p class="text-warning">${status == "issued" ? "payout in not processed you can continue again" : ""}</p>
                        <p class="text-warning">${status == "processing" ? "your payout is curently under processing , please wait sometimes" : ""}</p>
                        <p class="text-warning">${status == "pending" ? "your payout is pending , please wait sometimes" : ""}</p>
                        <p class="text-warning">${status == "failed" ? "your payout is failed , please try again" : ""}</p>
                        <p class="text-success">${status == "processed" ? "your payout is successfully paid" : ""}</p>
    
                        ${status == "issued" || status == "processing" || status == "pending" ? `<a href="/dashboard/earning/${payoutid}" class="btn btn-notesocean">Check Status</a>` : ""}
                      </div>
                    </div>
                  </div>
                    `);

            }
        },
        error: function (err) {
            app.alert(err.status, err?.responseJSON?.message ? err?.responseJSON?.message : "Something went wrong");
        }
    });

    // get user products

    // app.getSlefProducts().then((data) => {
    //     // get total views and likes of each product
    //     let totalViews = 0;
    //     let totalLikes = 0;
    //     data = data.requested;
    //     for (let i = 0; i < data.length; i++) {
    //         totalViews += data[i].views;
    //         totalLikes += data[i].likes;
    //     }
    //     // calculate earning
    //     // 1 likes = 0.5 rupees
    //     // 1 views = 0.40 rupees
    //     let totalEarning = Number((totalLikes * 0.5) + (totalViews * 0.40)).toFixed(2);
    //     $(".total-earning").html("&#x20B9; " + totalEarning);
    // }).catch((err) => {
    //     app.alert("error", 400, "Failed to fetch user products");
    // })
})