var index = 0;
 
 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyC3vxr-7r_FQncqeCfXO89po285YqF0vMI",
    authDomain: "train-times-f103b.firebaseapp.com",
    databaseURL: "https://train-times-f103b.firebaseio.com",
    projectId: "train-times-f103b",
    storageBucket: "train-times-f103b.appspot.com",
    messagingSenderId: "591257551307"
  };
  firebase.initializeApp(config);

  console.log(config);

  var database = firebase.database();

  console.log(database);
  

  // ##############################  train ##########################

  $("#trainForm").on("submit", function (event) {
    event.preventDefault();

    var name = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim();
    var firstTime = $("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });

    // checking for values to be on the console.log
    console.log(name, destination, firstTime, frequency);

$("#trainName").val("");
$("#trainDestination").val("");
$("#firstTrainTime").val("");
$("#frequency").val("");

    return false;
});


database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

    var updateTrain = $("<button>").html("<span>Update</span>").addClass("updateTrain btn btn-primary").attr("data-index", index).attr("data-key", childSnapshot.key);
    var removeTrain = $("<button>").html("<span>Remove</span>").addClass("removeTrain btn btn-danger").attr("data-index", index).attr("data-key", childSnapshot.key);

  var firstTime = childSnapshot.val().firstTime;
  var tFrequency = parseInt(childSnapshot.val().frequency);
  var firstTrain = moment(firstTime, "hh:mm").subtract(1, "years");

    // my calculations
//testing moment () to see what I see
  var now = moment();
// formating the moment to years then taking it to an hour format
  var rightNow = moment().subtract(1, "years").format("hh:mm A");
  //the time the first train leaves
  var firstDeparture = moment(firstTrain).subtract(1, "years").format("hh:mm A");
  // diference between now and the first train that left in minutes
  var timeDiff = moment().diff(moment(firstTrain), "minutes");
  // time left between the time differcne and divided by the frequency of the train departures
  var timeLeft = timeDiff % tFrequency;
  // subtracting the time left from the frequency of the train, 60 minutes - 15 timeleft = 45 minutes left for the next train
  var minutesLeft = tFrequency - timeLeft;
    // the next departure will be now plus minutes left if its 5 pm and minutes left is 15 then the next departure will be 515pm
  var nextDeparture = moment().add(minutesLeft, "minutes").format("hh:mm A");
  console.log(rightNow + " is rightNow");
  console.log(now + " is Now");
  console.log(firstDeparture + " firstDeparture"); 
  console.log(timeDiff + " timeDiff");  
  console.log(timeLeft + " timeLeft");
  console.log(minutesLeft + " minutesLeft");
  console.log(nextDeparture + " nextDeparture");


    var newTrain = $("<tr>");
  newTrain.addClass("train-" + index);
    var td1 = $("<td>").append(updateTrain);
    var td2 = $("<td>").text(childSnapshot.val().name);
    var td3 = $("<td>").text(childSnapshot.val().destination);
    var td4 = $("<td>").text(childSnapshot.val().frequency + " min");
    var td5 = $("<td>").text(nextDeparture);
    var td6 = $("<td>").text(minutesLeft + " min");
    var td7 = $("<td>").append(removeTrain);

    newTrain
        .append(td1)
        .append(td2)
        .append(td3)
        .append(td4)
        .append(td5)
        .append(td6)
        .append(td7);

   $("#tableInfo").append(newTrain);

 index++;
    
}, function (error) {

    alert(error.code);

});

function removeTrain () {
    $(".train-" + $(this).attr("data-index")).remove();
    database.ref().child($(this).attr("data-key")).remove();
  };

 function editTrain () {
	 console.log("I am inside the removeTrain function");
	 // show edits on the form
	 $("#trainName").focus();
	 $("#submit").hide();
	 $(this).toggleClass("updateTrain").toggleClass("trainForm"); 

  };


function submitTrain () {
	
	//gather the values from the form
    var trainName = $("#trainName").val().trim();
    var trainDestination = $("#trainDestination").val().trim();
    var trainFrequency = $("#frequency").val().trim();

   //place on the html
    $(".train-" + $(this).attr("data-index")).children().eq(1).html(trainName);
    $(".train-" + $(this).attr("data-index")).children().eq(2).html(trainDestination);
    $(".train-" + $(this).attr("data-index")).children().eq(3).html(trainFrequency + " min");
	//place on the database
	database.ref().child($(this).attr("data-key")).child("name").set(trainName);
    database.ref().child($(this).attr("data-key")).child("destination").set(trainDestination);
    database.ref().child($(this).attr("data-key")).child("frequency").set(trainFrequency);
	
	//switch the class on the button
    $(this).toggleClass("updateTrain").toggleClass("trainForm");
	
  };


//my  button actions on click
$(document).on("click", ".updateTrain", editTrain);
$(document).on("click", ".trainForm", submitTrain);
$(document).on("click", ".removeTrain", removeTrain);