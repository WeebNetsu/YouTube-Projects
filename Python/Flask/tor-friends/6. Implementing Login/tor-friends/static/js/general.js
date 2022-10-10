$(document).ready(() => {
  // added button event to show details of item in page
  $(".show-details").click(function () {
    let text = $(this).text();
    const TORRENT_ID =
      "#" + text.substr(text.indexOf("for:") + 4, 99).trim();

    if ($(TORRENT_ID).hasClass("hidden")) {
      $(TORRENT_ID).removeClass("hidden");
      $(TORRENT_ID).addClass("show");
    } else {
      $(TORRENT_ID).removeClass("show");
      $(TORRENT_ID).addClass("hidden");
    }
  });

  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
});