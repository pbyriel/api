var earlierResult = false, uinput;

/*--- TO DO ---*/
// TEST CONNECTION TO ENDPOINT
// HOW TO PASS VIDEO (ID OR OBJECT) TO PLAYVIDEO
// WHEN TO RUN CLEARMESSAGE

/*--- Helper functions go here ---*/

// clears user input
var clearVal = function () {
    $("#input").val("");
};

// removes search message from screen
var clearMessage = function () {
    $('#response').text();
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
var displayVideo = function (thisvideo) {
    // first append a div and addClass("videoitem");
    $("#grid").append("div").addClass("videoitem");
    // make it easy to refer to the last div
    var thisdiv = $("#grid").find("div").last();
    // then insert an h2 and set h2 equal to var title
    var title = thisvideo.title;
    thisdiv.append("<h2>" + title + "</h2>");
    // then insert image el and set src equal to var image
    var image = thisvideo.thumbnails.default.url; //link to image from api
    //thisdiv.append(WHAT).attr("src", image);
};

// Function to  display + start a video that is clicked
var playVideo = function (thisvideo) {
    var video_id = thisvideo.id;
    var video_title = thisvideo.title;
    var video_viewCount = thisvideo.viewCount;
    // iframe gets embedded in a variable
    var video_frame = "<iframe width='640' height='385' src='http://www.youtube.com/embed/" +  video_id + "' frameborder='0' type='text/html'></iframe>";
    // the iframe gets embedded in the page
    var videocontent = "<div id='title'>" + video_title + "</div><div>" + video_frame + "</div><div id='count'>" + video_viewCount + " views</div>";
    $("#container_vid").html(videocontent);
};

/*--- Main search functions go here ---*/
// Search result is voided, and data gets sent to a function for getting vids
function newSearch(userInput) {
    hideResults();
    displayMessage();
	getVidsResult(userInput);
}

// Function containing ajax-call, end: &alt=json
var getVidsResult = function (userInput) {
    console.log("getVidsResult started");
    // base link
    var tedEd = '+TED-ED';
    var apiversion = "&v=2";
    var link = 'https://gdata.youtube.com/feeds/api/videos?q=' + userInput + tedEd + apiversion + '&alt=jsonc';
    //The ajax-function
    var result = $.ajax({
        url: link,
        part: 'snippet',
        dataType: "jsonp",
        type: "GET"
    })
    // what gets done with the result
        .done(function (result) {
            $.each(result.items, function (i, item) {
                console.log(item);
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
    $("grid div").click(function () {
        console.log("image div was pressed");
        //playVideo($(this)); // HOW PASS ID/VIDEOOBJECT
    });
// Final end brackets for document ready function
});



