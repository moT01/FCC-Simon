$(document).ready(function () {
    'use strict';
    
    var interval, interval2, interval3, cpuindex = 0, playerindex = 0, redo = false, poweron = false, gamestarted = false, strict = false, computerdone = false, count = 0, sequence = [],
        sound = ["", new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
            new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")];

    function computerplay() {
        if (cpuindex < sequence.length) {
            setTimeout(function () {
                sound[sequence[cpuindex]].play();
                $("#" + sequence[cpuindex]).addClass("pushed");
            }, 300);

            setTimeout(function () {
                $("#" + sequence[cpuindex]).removeClass("pushed");
                cpuindex += 1;
            }, 600);
        } else {
            clearInterval(interval3);
            computerdone = true;
            playerindex = 0;
            redo = false;
        }
    } //end computerplay()
    
    function computerstart() {
        cpuindex = 0;
        if (!redo) { //do this if its not a redo -- set in $(".btn").click area based on conditions
            count += 1;
            $(".lcd").html(count);
            sequence.push(1 + Math.floor(Math.random() * 4));
        }
        interval3 = setInterval(computerplay, 900);
    } //end computerstart()

    function intro() { //some random patterns of lights when the power is turned on
        $("#1, #2, #3, #4").removeClass("pushed");
        var random = 1 + Math.floor(Math.random() * 3), random2 = 200 + Math.floor(Math.random() * 800);
        
        function intro1() {
            if ($("#1").hasClass("pushed")) {
                $("#1, #2, #3, #4").removeClass("pushed");
                $("#2, #3").addClass("pushed");
            } else {
                $("#1, #2, #3, #4").removeClass("pushed");
                $("#1, #4").addClass("pushed");
            }
        } //end intro1

        function intro2() {
            if ($("#1").hasClass("pushed")) {
                $("#1, #2, #3, #4").removeClass("pushed");
            } else {
                $("#1, #2, #3, #4").addClass("pushed");
            }
        } //end intro2()
        
        function intro3() {
            if ($("#1").hasClass("pushed")) {
                $("#1, #2, #3, #4").removeClass("pushed");
                $("#2").addClass("pushed");
            } else if ($("#2").hasClass("pushed")) {
                $("#1, #2, #3, #4").removeClass("pushed");
                $("#4").addClass("pushed");
            } else if ($("#4").hasClass("pushed")) {
                $("#1, #2, #3, #4").removeClass("pushed");
                $("#3").addClass("pushed");
            } else {
                $("#1, #2, #3, #4").removeClass("pushed");
                $("#1").addClass("pushed");
            }
        } //end intro3()
        
        switch (random) {
        case 1:
            clearInterval(interval2);
            interval2 = setInterval(intro1, random2);
            break;
        case 2:
            clearInterval(interval2);
            interval2 = setInterval(intro2, random2);
            break;
        case 3:
            clearInterval(interval2);
            interval2 = setInterval(intro3, random2);
            break;
        default:
            break;
        } //end switch(random)
    } //intro()
    
    $(".power-switch").click(function () { //turns power on and off
        $(".power-switch").toggleClass("margin-toggle");
        if (!poweron) { //power on -- start it up
            poweron = true;
            $(".wrapcolors").css("box-shadow", "0 0 20vmin white");
            $(".lcd").html("--");
            intro();
            interval = setInterval(intro, 8000);
        } else { //power off -- reset all
            clearInterval(interval);
            clearInterval(interval2);
            clearInterval(interval3);
            strict = false;
            poweron = false;
            gamestarted = false;
            computerdone = false;
            count = 0;
            sequence = [];
            $("#1, #2, #3, #4").removeClass("pushed");
            $(".start-button, .strict-button").removeClass("button-on");
            $(".wrapcolors").css("box-shadow", "0 0 8vmin #999");
            $(".lcd").empty();
        }
    }); //end actual-switch.click (power switch)
    
    $(".start-button").click(function () { //starts a game
        if (poweron && !gamestarted) { //button only works when power is on, and game not started yet
            gamestarted = true;
            clearInterval(interval);
            clearInterval(interval2);
            $("#1, #2, #3, #4").removeClass("pushed");
            $(".start-button").addClass("button-on");
            computerstart();
        }
    }); //end start-button.click
    
    $(".strict-button").click(function () { //toggles strict mode
        if (poweron) {
            $(".strict-button").toggleClass("button-on");
            if (strict) {
                strict = false;
            } else {
                strict = true;
            }
        }
    }); //end strict-button.click
    
    $(".btn").mousedown(function () {
        var id = $(this).attr("id");
        if (poweron && gamestarted && computerdone) { //can't use buttons when cpu is going or other conditions not met
            $(this).addClass("pushed");
            if (id == sequence[playerindex]) { //means it is the right button
                sound[id].play();
                if (playerindex === 19) { //player reached winning length - game won
                    gamestarted = false;
                    computerdone = false;
                    strict = false;
                    count = 0;
                    sequence = [];
                    $(".lcd").html("--");
                    $(".start-button, .strict-button").removeClass("button-on");
                    intro();
                    interval = setInterval(intro, 8000);
                    alert("YOU WIN!");
                }
            } else { //wrong button clicked
                sound[1].play();
                sound[2].play();
                sound[3].play();
                sound[4].play();
                console.log("mousedown wrongbutton");
                if (strict) { //wrong button and strict === true
                    $("#1, #2, #3, #4").addClass("pushed");
                    count = 0;
                    sequence = [];
                } else { //wrong button and strict === false
                    $("#1, #2, #3, #4").addClass("pushed");
                    redo = true;
                } //end wrong button and strict === false
            } //end wrong button clicked
        } //end if (poweron && gamestarted && computerdone)
    }).mouseup(function () { //end .mousedown
        var id = $(this).attr("id");
        if (poweron && gamestarted && computerdone) { //can't use buttons when cpu is going or other conditions not met
            $("#1, #2, #3, #4").removeClass("pushed");
            if (id == sequence[playerindex]) { //means right button was clicked
                if (playerindex == sequence.length - 1) { //right button clicked and turn is over
                    computerdone = false;
                    computerstart();
                } else { //sequence length not reached, this turn is not over
                    playerindex += 1;
                }
            } else { //end right button clicked -- means wrong button was clicked
                if (strict) { //wrong button and strict === true
                    gamestarted = false;
                    computerdone = false;
                    strict = false;
                    $(".lcd").html("--");
                    $(".start-button, .strict-button").removeClass("button-on");
                    intro();
                    interval = setInterval(intro, 8000);
                    alert("YOU LOSE!");
                } else { //wrong button and strict === false
                    computerdone = false;
                    computerstart();
                } //end wrong button and strict === false
            } //end wrong button clicked
        }
    }); //end .mouseup
}); //end document.ready