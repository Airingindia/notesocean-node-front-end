$(document).ready(function () {
	dash
		.getUserNotesCount()
		.then((data) => {
			let count = data.userNotesCount;
			$(".total-notes").html(count);
		})
		.catch((err) => {
			app.alert(err.status, "faild to load notes count !");
		});
	// get all private notes
	var wow = new WOW({ scrollContainer: ".second-side" });
	wow.init();
	var next = 0;
	var prev = 0;
	var checked = false;
	var hit = false;
	var isSearched = false;
	function check() {
		$(".second-side").scroll(function () {
			// get last div element of .public-notes-container
			let lastDiv = $(".public-item").last();
			//    get visibility of last div
			let lastDivVisiblity = lastDiv.css("visibility");
			console.log(lastDivVisiblity);
			if (lastDivVisiblity == "visible") {
				if (!hit) {
					next += 1;
					hit = true;
					loaddata();
				}
			}
		});
	}
	function loaddata() {
		if (!isSearched) {
			$.ajax({
				type: "GET",
				url: app.getApi() + "/notes?page=" + next,
				headers: {
					Authorization: app.getToken(),
				},
				beforeSend: function () {
					$(".loading-private-notes").removeClass("d-none");
				},
				success: function (data) {
					$(".loading-private-notes").addClass("d-none");
					showData(data.requested);
				},
				error: function (err) {
					app.alert(
						err.status,
						err?.responseJSON?.message
							? err?.responseJSON?.message
							: "Something went wrong"
					);
				},
			});
		}
	}

	loaddata();

	function onContextmenu() {
		$(".note-item").each(function () {
			$(this).on("contextmenu", function (e) {
				let id = $(this).attr("data-id");
				let top = e.pageY;
				let left = e.pageX;
				$(".context-menu").css({
					top: top,
					left: left,
					"display": "block",
				});
				$(".context-menu").attr("data-id", id);
				e.preventDefault();
			});

			$(this).on("click", function () {
				$(".context-menu").css({
					"display": "none",
				});
				let id = $(this).attr("data-id");
				fileOpner(id);
			});


		});

		$(".second-side").on("click", function () {
			$(".context-menu").css({
				"display": "none",
			});
		})
	}

	$("span[context-menu-action='open']").click(function () {
		let id = $(".context-menu").attr("data-id");
		fileOpner(id);
		$(".context-menu").css({
			"display": "none",
		})
	});

	$("span[context-menu-action='delete']").click(function () {
		let id = $(".context-menu").attr("data-id");
		$(".context-menu").css({
			"display": "none",
		})
		deletePrivate(id);
	});

	$("span[context-menu-action='download']").click(function () {
		let id = $(".context-menu").attr("data-id");
		$(".context-menu").css({
			"display": "none",
		})
		download(id);
	})

	function showData(data) {
		if (data.length !== 0) {
			hit = false;
			loaderVisible(false);
			let adshow = 0;
			for (let i = 0; i < data.length; i++) {
				// adshow++;
				// if(adshow == 5){
				//     adshow = 0;
				//     $(".notes-container-row").append(`
				//     <div class="col-md-6 d-flex justify-content-center align-items-center">
				//     <ins class="adsbygoogle"
				//     style="display:inline-block;width:336px;height:280px"
				//     data-ad-client="ca-pub-3834928493837917"
				//     data-ad-slot="1394357315"></ins>
				//     </div>`);
				//     (adsbygoogle = window.adsbygoogle || []).push({});
				// }

				let name = data[i].name;
				if (name.length > 30) {
					name = name.substring(0, 30) + "...";
				}
				let fileType = data[i].fileType;
				let id = data[i].uuid;
				let size = data[i].size;
				let timestamp = data[i].timestamp;
				let ago_time = timeDifference(timestamp);
				let actual_size = bytesToSize(size);
				let url = data[i].file;
				let img = "/images/icons/" + fileType + ".png";
				let type = data[i].fileType;

				$(".notes-container-row").append(`
                <div class="col-12 col-lg-3 col-md-6 col-xs-12 mb-3 note-item" data-id="${id}">
                <div class="card card-details" data-id="${id}">
                  <div class='image-card-wrapper' data-id="${id}">
                  <img class="card-img-top  mx-auto mt-3 w-50" data-id="${id}" src="${img}" /> 
                      
                  </div>
                  <div class='info-card-container' data-id="${id}">
                      <div class='info-card-1' data-id="${id}">
                        <div class='infos data-id="${id}" '>${ago_time}</div>
                        <div class='infos data-id="${id}"'>&#x2022</div>
                        <div class='infos data-id="${id}" '>${actual_size}</div>
                      </div>
                      <div class='info-card-2' data-id="${id}">
                          <div class='info-name' data-id="${id}">${name}</div>
                      </div>
                  </div>
                  </div>
                  
                </div>

                
                
                `);
			}
			onContextmenu();
			fileOpner();
			if (!checked) {
				checked = true;
				check();
			}

		} else {
			if (checked) {
				$(".loading-private-notes").addClass + "d-none";
			} else {
				$(".no-private-notes").removeClass("d-none");
				$(".loading-private-notes").addClass("d-none");
			}
		}
	}

	$("input[type='search']").on("search", function () {
		if ($(this).val() == "") {
			isSearched = false;
			clearData();
			next = 0;
			loaddata();
		}
	});


	function clearData() {
		$(".notes-container-row").html("");
	}

	function loaderVisible(trueOrFalse) {
		if (trueOrFalse) {
			$(".loading-private-notes").removeClass("d-none");
		} else {
			$(".loading-private-notes").addClass("d-none");
		}
	}

	function timeDifference(previous) {
		const current = Date.now();
		var msPerMinute = 60 * 1000;
		var msPerHour = msPerMinute * 60;
		var msPerDay = msPerHour * 24;
		var msPerMonth = msPerDay * 30;
		var msPerYear = msPerDay * 365;

		var elapsed = current - previous;

		if (elapsed < msPerMinute) {
			return Math.round(elapsed / 1000) + " seconds ago";
		} else if (elapsed < msPerHour) {
			return Math.round(elapsed / msPerMinute) + " minutes ago";
		} else if (elapsed < msPerDay) {
			return Math.round(elapsed / msPerHour) + " hours ago";
		} else if (elapsed < msPerMonth) {
			return Math.round(elapsed / msPerDay) + " days ago";
		} else if (elapsed < msPerYear) {
			return Math.round(elapsed / msPerMonth) + " months ago";
		} else {
			return Math.round(elapsed / msPerYear) + " years ago";
		}
	}

	function bytesToSize(bytes) {
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if (bytes == 0) return "0 Byte";
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
	}


	function validate() {
		$(".action-note-input").on("input", function () {
			if ($(this).val().length > 10) {
				$(".action-note-input").addClass("is-valid");
				$(".action-note-input").removeClass("is-invalid");
			} else if ($(this).val().length == 0) {
				$(".action-note-input").addClass("is-invalid");
				$(".action-note-input").removeClass("is-valid");
				$(".invalid-name").html("Name can't be empty'");
				$(".notes-title").addClass("animate__heartBeat");
			} else {
				$(".action-note-input").addClass("is-invalid");
				$(".action-note-input").removeClass("is-valid");
				$(".invalid-name").html("Name should be at least 10 characters");
			}
		});
		$(".action-note-input").on("change", function () {
			if ($(this).val().length == 0) {
				$(".action-note-input").addClass("is-invalid");
				$(".action-note-input").removeClass("is-valid");
				$(".invalid-name").html("Name can't be empty'");
			}
		});

		$(".action-note-input").on("blur", function () {
			if ($(this).val().length == 0) {
				$(".action-note-input").addClass("is-invalid");
				$(".action-note-input").removeClass("is-valid");
				$(".invalid-name").html("Name can't be empty'");
			}
		});
	}
	validate();

	function fileOpner(id) {
		const note_id = id;
		// get note url
		$.ajax({
			type: "GET",
			url: app.getApi() + "/notes/" + note_id,
			headers: {
				Authorization: app.getToken(),
			},
			contentType: "application/json",
			processData: false,
			beforeSend: function () { },
			success: function (data) {
				showFile(data.name, data.type, data.file);
			},
			error: function (err) {
				app.alert(
					err.status,
					err?.responseJSON?.message
						? err?.responseJSON?.message
						: "Something went wrong"
				);
			},
		});

		function showFile(name, type, url) {
			$(".private-notes-moda-title").html(name);
			var src;
			if (
				type == "doc" ||
				type == "csv" ||
				type == "docx" ||
				type == "ppt" ||
				type == "pptx"
			) {
				src = `<iframe style="display:inline;width:100%;height:100%;" src="https://view.officeapps.live.com/op/embed.aspx?src=${url}" </iframe>`;
				$(".viewer").html(src);
			} else if (type == "png" || type == "jpeg" || type == "jpg") {
				src = `<img style="width:100px;height:100%" src="${url}" > `;
				$(".viewer").html(src);
			} else {
				src = `<iframe width="100%" height="100%" src="${url}" </iframe>`;
				$(".viewer").html(src);
			}

			$("#file-open-modal").modal("show");
			$(".private-notes-download").click(function () {
				download(note_id);
			});
		}
	}

	function download(note_id) {
		$.ajax({
			type: "GET",
			url: app.getApi() + "/notes/" + note_id,
			headers: {
				Authorization: app.getToken(),
			},
			contentType: "application/json",
			processData: false,
			beforeSend: function () { },
			success: function (data) {
				var link = document.createElement("a");
				link.setAttribute("download", data.name);
				link.setAttribute("href", data.file);
				link.style.display = "none";
				link.click();
				link.remove();
			},
			error: function (err) {
				app.alert(
					err.status,
					err?.responseJSON?.message
						? err?.responseJSON?.message
						: "Something went wrong"
				);
			},
		});
	}

	// search private notes
	$("form").submit(function (event) {
		event.preventDefault();
		const input = $("input").val();
		if (input.length !== 0) {
			isSearched = true;
			$.ajax({
				type: "GET",
				url: app.getApi() + "/notes/search/" + input,
				headers: {
					Authorization: app.getToken(),
				},
				beforeSend: function () {
					loaderVisible(true);
				},
				success: function (data) {
					if (data.size == 0) {
						new Noty({
							theme: "sunset",
							type: "error",
							text: "No results found",
							timeout: 4000,
						}).show();
						loaderVisible(false);
					} else {
						new Noty({
							theme: "sunset",
							type: "success",
							text: "Found " + data.size + " results",
							timeout: 4000,
						}).show();
						clearData();
						if (data.requested.length != 0) { showData(data.requested) };

					}
				},
				error: function (err) {
					app.alert(
						err.status,
						err?.responseJSON?.message
							? err?.responseJSON?.message
							: "Something went wrong"
					);
				},
			});
		} else {
			loaddata();
		}
	});

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
	}

	function deletePrivate(note_id) {
		// delete
		swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this Note! ",
			icon: "warning",
			buttons: ["Cancel", "Delete"],
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$.ajax({
					type: "DELETE",
					url: app.getApi() + "/notes/" + note_id,
					contentType: "application/json",
					processData: false,
					headers: {
						Authorization: app.getToken(),
					},
					beforeSend: function () {

					},
					success: function (data) {
						app.alert(200, "Note deleted successfully");
						$(".note-item[data-id=" + note_id + "]").remove();
					},
					error: function (err) {
						app.alert(
							err.status,
							err?.responseJSON?.message
								? err?.responseJSON?.message
								: "Something went wrong"
						);
					},
				});
			}
		});
	}


});


