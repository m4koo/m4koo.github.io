window.onload = function(){
    var minutes = 00;
    var seconds = 00;
    var tens = 00; //tens = ten milliseconds
    var setTens = document.getElementById("tens");
    var setSeconds = document.getElementById("seconds");
    var setMinutes = document.getElementById("minutes");

    var buttonStart = document.getElementById('button-start');
    var buttonStop = document.getElementById('button-stop');
    var buttonReset = document.getElementById('button-reset');

    var Interval;

    buttonStart.onclick = function() {
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);
    }

    buttonStop.onclick = function() {
        clearInterval(Interval);
    }

    buttonReset.onclick = function() {
        clearInterval(Interval);
        tens = "00";
        seconds = "00";
        minutes = "00";

        setTens.innerHTML = tens;
        setSeconds.innerHTML = seconds;
        setMinutes.innerHTML = minutes;
    }

    function startTimer(){
        tens++;

        if (tens <= 9){
            setTens.innerHTML = "0" + tens;
        }
        if (tens > 9){
            setTens.innerHTML = tens;
        }
        if (tens > 99){
            seconds++;
            setSeconds.innerHTML = "0" + seconds;
            tens = 0;
            setTens.innerHTML = "0" + tens;
        }
        if(seconds > 9){
            setSeconds.innerHTML = seconds
        }
        if (seconds > 59) {
            minutes++;
            setMinutes.innerHTML = "0" + minutes;
            seconds = 0
            setSeconds.innerHTML = seconds;
        }
        if (minutes > 9){
            setMinutes.innerHTML = minutes;
        }

    }


}
