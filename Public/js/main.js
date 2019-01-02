$(document).ready(function() {
  $(".delete-article").on("click", function(e) {
    const id = $(e.target).attr("data-id");
    $.ajax({
      type: "DELETE",
      url: "/articles/delete/" + id,
      success: response => {
        alert(
          "article " + response.title + " has been deleted (closing in 1 sec)"
        );
        window.location.href = "/";
      },
      error: err => {
        console.log(err);
      }
    });
  });
});
