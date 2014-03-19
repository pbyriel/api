var earlierResult = false, uinput;

/* TODO:
Add message if no videos returned that match ted-ed
// How to get back to searchresult? 
    Make a link under Video
    Store former searchresult in variable and display it again if link pressed?
When you go directly from grid to new search display is now = none
*/

/*--- Helper functions go here ---*/

// clears user input
var clearVal = function () {
    $("#input").val("");
};

// removes search message from screen
var clearMessage = function () {
    $('#response').text('');
};

// takes error string and turns it into displayable DOM element
var showError = function (error) {
	var errorText = '<p>' + error + '</p>';
	return errorText;
};

// To validate userInput
var validateInput = function (userInput) {
    console.log("validateInput started");
    if (userInput == '') {
        alert("Please enter search terms");
    } else {
        // Note to future self: actually this ought to return to 
        // the caller function which should then call newSearch
        newSearch(userInput);
    }
};

// To tell user that we are indeed searching
var displayMessage = function (userInput) {
    $('#response').text('Looking for vidoes on ' + userInput);
    console.log("displayMessage ran");
};

// To empty results from last search
function emptyResults() {
    console.log("emptyResult ran");
    if (earlierResult) {
        //clear current video or grid by resetting div
        var player = $('#player'), grid = $('#grid');
        player.empty();
        grid.empty();
        //delete last response
        $("#response").text('');
    }
    console.log("hideResults ran");
}

// Function to get title + set src of image
var showVideos = function (thisvideo) {
    // clears former (eventual) errormessage
    $("#error").empty();
    $('#grid').toggle();
    earlierResult = true;
    console.log("showVideos started");
    // set variables which will be encodes as data attributes
    var idNo = thisvideo.id, viewCount = thisvideo.viewCount, title = thisvideo.title;
    // first append a div and addClass("videoitem");
    $("#grid").append("<div>");
    // make it easy to refer to the last div
    var thisdiv = $("#grid").find("div").last();
    // sets class for the new div
    thisdiv.addClass("videoitem");
    // then insert an h2 and set h2 equal to var title
    thisdiv.append("<h2>" + title + "</h2>");
    // then insert image el and set src equal to var image
    var image = thisvideo.thumbnail.sqDefault; //link to image from api, also hqDefault
    thisdiv.append('<img src="" data-id="">');
    var imgurl = $("#grid").find("div").last().find("img");
    imgurl.attr({src: image,
                 "data-id": idNo,
                 "data-title": title,
                 "data-viewcount": viewCount
                });
};

// Function to  display + start a video that is clicked
var playVideo = function (video) {
    console.log("playVideo started");
    // hide grid with search results
    $("#player").toggle();
    // get data attributes
    var videoId = video.getAttribute("data-id");
    var videoTitle = video.getAttribute("data-title");
    var videoViewCount = video.getAttribute("data-viewcount");
    // iframe gets embedded in a variable
    var videoFrame = "<iframe width='640' height='385' src='http://www.youtube.com/embed/" +  videoId + "' frameborder='0' type='text/html'></iframe>";
    // the iframe gets embedded in the page
    var videoContent = "<div id='title'>" + videoTitle + "</div><div>" + videoFrame + "</div><div id='count'>" + videoViewCount + " views</div>";
    $("#player").html(videoContent);
};

/*--- Main search functions go here ---*/
// Search result is voided, and data gets sent to a function for getting vids
function newSearch(userInput) {
    emptyResults();
    displayMessage(userInput);
	getVidsResult(userInput);
}

// Function containing ajax-call
var getVidsResult = function (userInput) {
    console.log("getVidsResult started");
    // base link
    var tedEd = '+TED-ED';
    var apiversion = "&v=2";
    var link = 'https://gdata.youtube.com/feeds/api/videos?q=' + userInput + tedEd + apiversion + '&alt=jsonc';
    //The ajax function
    var result = $.ajax({
        url: link,
        part: 'snippet',
        dataType: "jsonp",
        type: "GET"
    })
        .done(function (result) {
            var resultset = result.data.items;
            console.log("done started");
            if (resultset.length > 0) {
                for (var i = 0; i < resultset.length; i++) {
                    console.log(resultset[i]);
                    // get id for every object
                    showVideos(resultset[i]);
                    // removes search message
                    clearMessage();
                    } 
            } else {
                        $("#error").html("<h2>No videos were found</h2>");
                    }
    })
    .fail(function (jqXHR, error, errorThrown) {
            var errorElem = showError(error);
            $('#top').append(errorElem);
        });
    // reached the end, tell it to the console
    console.log("getVidsResult finished");
};


/*--- Finally, the jquery function that starts the machine ---*/
$(document).ready(function () {
    console.log("page ready");
//when page is ready, focus to input
    $('#input').focus();
    // get value of user input
    uinput = $(this).val();
    // What to do on submit by enter
	$('#input').keydown(function (event) {
        uinput = $("#input").val();
        if (event.keyCode === 13) {
            console.log("Enter was pressed");
            validateInput(uinput);
            clearVal();
		}
    });
    // What to do when search button is clicked 
	$('#button').click(function () {
        uinput = $("#input").val();
        console.log("Button was pressed");
        validateInput(uinput);
        clearVal();
	});
    
    //Function for what happens when user clicks on videoitem in the grid
    $("#grid").on("click", "div img", function () {
        console.log("image div was pressed");
        $("#grid").toggle();
        playVideo(this);
    });
// Final end brackets for document ready function
});



