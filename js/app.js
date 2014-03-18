var earlierResult = false, uinput;

/*--- Helper functions go here ---*/

// clears user input
var clearVal = function () {
    $("#input").val("");
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
    $('#response').text('Looking for vids ...');
    console.log("displayMessage ran");
};

// To hide results from last search
function hideResults() {
    if (earlierResult) {
        //stop current video by resetting attributes
        $('#videoframe').attr("src", ""); // or will it be "href"
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
var displayVideo = function (video) {
    // first append a div and addClass("videoitem");
    $("#grid").append("div").addClass("videoitem");
    // make it easy to refer to the last div
    var thisdiv = $("#grid").find("div").last();
    // then insert an h2 and set h2 equal to var title
    var title = video.title;
    thisdiv.append("<h2>" + title + "</h2>");
    // then insert image el and set src equal to var image
    var image = video.thumbnails.default.url; //link to image from api
    //thisdiv.append(WHAT).attr("src", image);
};

// Function to  display + start a video that is clicked
// function playVideo();
/* Dummy code below
http://www.youtube.com/embed/VIDEO_ID
<iframe id="ytplayer" type="text/html" width="640" height="390"
  src="http://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com"
  frameborder="0"/>
  */

/*--- Main search functions go here ---*/

// Search result is voided, and data gets sent to a function for getting vids
function newSearch(userInput) {
    hideResults();
    displayMessage();
	//getVidsResult(userInput);
}

// WHAT DATA DO I NEED TO PASS IN HERE?
var link = "https://gdata.youtube.com/feeds/api/users/";
var channelID = "UCsooa4yRKGN_zEE8iknghZA";
var postfix = "?v=2.1";	// not sure what it should be

// Function containing ajax-call
var getVidsResult = function (userInput) {
    console.log("getVidsResult started");
    //The ajax-function
    var result = $.ajax({
        url: link + channelID + userInput + postfix,
        data: {site: 'youtube'},
        part: 'snippet',
        dataType: "jsonp",
        type: "GET"
    })
    // what gets done with the result
        .done(function (result) {
            $.each(result.items, function (i, item) {
                var vid = displayVideo(item);
                $('#grid').append(vid);
            });
        })
    // if all else fails...
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
    uinput = $("#input").val();
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
    $("grid div").click(function () {
        console.log("image div was pressed");
        //playVideo($(this));
    });
// Final end brackets for document ready function
});



