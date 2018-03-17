  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyAwSIeRSarFgrKJ-wM0uzlUf4O8hoWdNuA",
      authDomain: "train-schedule-8b161.firebaseapp.com",
      databaseURL: "https://train-schedule-8b161.firebaseio.com",
      projectId: "train-schedule-8b161",
      storageBucket: "",
      messagingSenderId: "341836468219"
  };

  firebase.initializeApp(config);

  // Create a reference the database
  var database = firebase.database();

  var name = "";
  var destination = "";
  var firstTrain = 0;
  var frequency = 0;
  var minAway;
  var arrival;

  // on click event 
  // gets form data and pushes it to database
  $("#submit").on("click", function (event) {

    event.preventDefault();

    // gather user input from form
    name = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#firstTrain").val().trim();
    frequency = $("#frequency").val().trim();

    // push info to firebase
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });

    // Clear all input fields 
    $(this).closest('form').find("input[type=text], textarea").val('');

});

// database reference,
// checks for child added activity in database
// then adds data to form table
database.ref().on("child_added", function (snapshot) {

    console.log(snapshot.val());
    // console.log(snapshot.val().name);
    // console.log(snapshot.val().destination);
    // console.log(snapshot.val().firstTrain);
    // console.log(snapshot.val().frequency);

    // log object to the console.
    // console.log(snapshot.val());

    // First Time (pushed back 1 year to make sure it comes before current time)
    var initialTimeConverted = moment(snapshot.val().firstTrain, "hh:mm").subtract(1, "years");
    // console.log(initialTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Calculate time difference
    var diffTime = moment().diff(moment(initialTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time remaining
    var timeRemainder = diffTime % snapshot.val().frequency;
    // console.log("TIME REMAINDER = " + timeRemainder);

    // Next Train
    arrival = moment().add(minAway, "minutes");
    // arrival = moment(arrival).format("hh:mm");
    // console.log("ARRIVAL TIME: " + moment(arrival).format("hh:mm"));

    // Minutes Until Train
    minAway = snapshot.val().frequency - timeRemainder;
    // console.log("MINUTES UNTIL NEXT TRAIN: " + minAway);

    // train table 
    var trainInfo = $('<tr>');

    // Append train information table fields
    trainInfo.append(`<td>${snapshot.val().name}</td>`);
    trainInfo.append(`<td>${snapshot.val().destination}</td>`);
    trainInfo.append(`<td>${snapshot.val().frequency}</td>`);
    trainInfo.append(`<td>${arrival}</td>`);
    trainInfo.append(`<td>${minAway}</td>`);

    // Append new train fields to table row 
    $('#train-table').append(trainInfo);

    // console log errors
    }, function (errorObject) {

    console.log("ERRORS: " + errorObject.code);

    });
