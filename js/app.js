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

// To validate that userInput is not empty string
var validateInput = function (userInput) {
    console.log("validateInput started");
    if (userInput == '') {
        alert("Please enter search terms");
    } else {
        /* Note to future self: actually this ought to return to 
           the caller function which should then call newSearch
           Flagged: "Don't care much" by user current_Byriel */
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

// Function to to display grid with vids + get title + set src of image
var buildGrid = function (thisvideo) {
    // clears former (eventual) errormessage
    $("#error").empty();
    // if gridvalue is display none, then toggle)
    if ($('#grid').css({display: "none"})) {
        $('#grid').toggle(); }
    earlierResult = true;
    console.log("buildGrid started");
    // set variables which will be encodes as data attributes
    var idNo = thisvideo.id, viewCount = thisvideo.viewCount, title = thisvideo.title;
    // first append a div ;
    $("#grid").append("<div>");
    // make it easy to refer to the last div
    var thisdiv = $("#grid").find("div").last();
    // sets class for the new div
    thisdiv.addClass("videoitem");
    // then insert an h2 and set h2 equal to var title
    thisdiv.append("<p>" + title + "</p>");
    // then insert img element and set src equal to var image
    var image = thisvideo.thumbnail.sqDefault; //link to image from api, also hqDefault
    thisdiv.append('<img src="" data-id="">');
    var imgurl = $("#grid").find("div").last().find("img");
    // encode data with image
    imgurl.attr({src: image,
                 "data-id": idNo
                });
};

// Function to  display + start a video that is clicked
var playVideo = function (video) {
    var player = $("#player");
    console.log("playVideo started");
    // hide grid with search results
    $("#grid").toggle();
    player.toggle();
    // get data id to identify which video to display
    var videoId = video.getAttribute("data-id");
    // iframe gets embedded in a variable
    var videoFrame = "<iframe src='http://www.youtube.com/embed/" +  videoId + "' frameborder='0' type='text/html' scale='aspect'></iframe>";
    // the iframe gets embedded in the page
    var videoContent = "<div>" + videoFrame + "</div>";
    player.html(videoContent);
    player.append("<p id='back'>Back to result</p>");
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
            var vidsArray = [];
            var resultset = result.data.items;
            console.log("done started");
            if (resultset.length > 0) {
                for (var i = 0; i < resultset.length; i++) {
                    // checks to see if ted-ed also equals uploader
                    if (resultset[i].uploader == "tededucation") {
                        vidsArray.push(resultset[i]);
                    } 
                }
                //criteria to order by is vidsarray[i].ratingCount
                var sortedArray = _.sortBy(vidsArray, "ratingCount");
                // get json object from array and put it into the grid function
                // At the same time, remove so array is emptied
                for (var i = 0; i < sortedArray.length; i++) {
                    buildGrid(sortedArray.pop());
                }
                // removes search message
                clearMessage();
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
        playVideo(this);
    });
    
    //Function for getting from video back to search result
    $("#player").on("click", "#back", function () {
        console.log("back was was clicked");
        $("#player").empty().toggle();
        $("#grid").toggle();
    });
    
    //Function for what happens when user clicks home icon
    $("#home").on("click", "img", function () {
        console.log("home was was clicked");
        document.reload();
    });
    
    //Function for what happens when mouse hovers over home icon
    $("#home").mouseover(function () {
        var img = $("#home").find("img");
        img.attr({src: "img/homeBlack.png"});
    });
    
    //Function for what happens when mouse leaves home icon
    $("#home").mouseout(function () {
        var img = $("#home").find("img");
        img.attr({src: "img/homeGrey.png"});
    });
// Final end brackets for document ready function
});



