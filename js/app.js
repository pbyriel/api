var earlierResult = false;

/*--- Helper functions go here ---*/

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorText = '<p>' + error + '</p>';
	return errorText;
};

// To validate userInput
var validateInput = function (userInput) {
    console.log("validateInput started");
    if (userInput === '') {
        newSearch(userInput);
    } else {
        alert("Please enter search terms");
    }
};
    
// To tell user that we are indeed searching
function displayMessage() {
    $('#response').text('Looking for vids ...');
    console.log("displayMessage ran");
}

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
    // then insert an h2 and set h2 equal to var title
    var title = video.title;
    // then insert image el and set src equal to var image
    var image = video.thumbnails.default.url;


// Function to  display + start a video that is clicked
// function playVideo();

/*--- Main search functions go here ---*/

// Search result is voided, and data gets sent to a function for getting vids
function newSearch(userInput) {
    hideResults();
    displayMessage();
	//getVidsResult(userInput);
}


var getVidsResult = function(userInput){
    console.log("getVidsResult finished");
    
    // WHAT DATA DO I NEED TO PASS IN HERE?
    // the parameters we need to pass in our request to YouTubes's API
	var result = $.ajax({
        var link = "https://gdata.youtube.com/feeds/api/users/"
        var postfix = "?v=2.1"	// not sure what it is
        var channelID = "UCsooa4yRKGN_zEE8iknghZA"
        url: link + channelID + userInput + postfix,
		data: {site: 'youtube'},
        part: 'snippet',
		dataType: "jsonp",
		type: "GET"
		})
    // what gets done with the result from our request
    .done(function(result){
        $.each(result.items, function(i, item) {
            var vid = displayVideo(item);
			$('#grid').append(vid);
		});
	})
    // if all else fails...
    .fail(function(jqXHR, error, errorThrown){
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
    var userInput = $('#input').val().trim();
    // What to do on submit by enter
	$('#input').keydown(function (event) {
        if (event.keyCode === 13) {
            console.log("Enter was pressed");
            validateInput(userInput);
            userInput.val('');
		}
    });
    // What to do when search button is clicked 
	$('#button').click(function () {
        console.log("Button was pressed");
        validateInput(userInput);
        userInput.val('');
	});
    
    //Function for what happens when user clicks on videoitem in the grid
    
// Final end brackets for document ready function
});



