(function() {
    $("#file-type-general").on("change", function () {
        if (this.value == "Video") {
          $("#file-type-minor").html(`
            <option>Video</option>
            <option selected>Movie</option>
            `);
        } else if (this.value == "Game" || this.value == "Application") {
          $("#file-type-minor").html(`
            <option selected>Windows</option>
            <option>Mac</option>
            <option>Linux</option>
            <option>Android</option>
            <option>iOS</option>
            `);
        } else if (this.value == "Music" || this.value == "Other") {
          $("#file-type-minor").html(`
            <option selected>None</option>
            `);
        }
    });
    
    $("#description").keypress(function(){
        $("#count").text($("#description").val().length+1);
    })
})();