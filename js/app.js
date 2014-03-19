var earlierResult = false, uinput;

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
        newSearch(userInput);
    }
};

// To tell user that we are indeed searching HOW TO MAKE IT DISAPPEAR AGAIN
var displayMessage = function () {
    $('#response').text('Looking for vidoes ...');
    console.log("displayMessage ran");
};

// To hide results from last search
function hideResults() {
    if (earlierResult) {
        //stop current video by resetting div
        $('#container_vid').empty();
        //delete last response
        $("#response").text('');
        // Clear grid of pictures from last search
        $('#grid').empty();
        // Hide video frame if displayed
        $('#video').slideUp();
        earlierResult = false;
    }
    console.log("hideResults ran");
}

// Function to get title + set src of image
var showVideos = function (thisvideo) {
    // chech if function ran
    $(".videopart").toggle();
    console.log("showVideos started");
    // set variables which will be encodes as data attributes
    var idNo = thisvideo.id;
    var viewCount = thisvideo.viewCount;
    var title = thisvideo.title;
    // first append a div and addClass("videoitem");
    $("#grid").append("<div>").addClass("videoitem");
    // make it easy to refer to the last div
    var thisdiv = $("#grid").find("div").last();
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
    $('#grid').toggle();
    // get data attributes
    var videoId = video.getAttribute("data-id");
    var videoTitle = video.getAttribute("data-title");
    var videoViewCount = video.getAttribute("data-viewcount");
    // iframe gets embedded in a variable
    var videoFrame = "<iframe width='640' height='385' src='http://www.youtube.com/embed/" +  videoId + "' frameborder='0' type='text/html'></iframe>";
    // the iframe gets embedded in the page
    var videoContent = "<div id='title'>" + videoTitle + "</div><div>" + videoFrame + "</div><div id='count'>" + videoViewCount + " views</div>";
    $("#container_vid").html(videoContent);
};

/*--- Main search functions go here ---*/
// Search result is voided, and data gets sent to a function for getting vids
function newSearch(userInput) {
    hideResults();
    displayMessage();
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
        console.log("done started");
        for (var i = 0; i < result.data.items.length; i++) {
            console.log(result.data.items[i]);
            // get id for every object
            showVideos(result.data.items[i]);
            // removes search message
            clearMessage();
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
        playVideo(this);
    });
// Final end brackets for document ready function
});



