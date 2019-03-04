var baseAttack = 0;
var charArray = [];
var player;
var defender;
var playerSelected = false;
var defenderSelected = false;

// Character
function Character(name, hp, ap, counter, pic) {
    this.name = name;
    this.healthPoints = hp;
    this.attackPower = ap;
    this.counterAttackPower = counter;
    this.pic = pic;
}

// Initialize all the characters
function initCharacters() {
    var link = new Character("Link", 125, 25, 75, "assets/images/link.gif");
    var majora = new Character("Majora", 200, 50, 80, "assets/images/majora.gif");
    var bokobolin = new Character("Bokobolin", 150, 25, 10, "assets/images/bokobolin.gif");
    var cucco = new Character("Cucco", 999, 1, 1, "assets/images/cucco.gif");

    charArray.push(link, majora, bokobolin, cucco);
}

// attack
Character.prototype.attack = function (Char) {
    Char.healthPoints -= this.attackPower;
    $("#textArea").html("<p> You hit " + Char.name + " for " + this.attackPower + " damage.</p>");
    this.increaseAttack();
};

// counterAttack
Character.prototype.counterAttack = function (Char) {
    Char.healthPoints -= this.counterAttackPower;
    $("#textArea").append("<p>" + this.name + " countered your attack for " + this.counterAttackPower + " damage points.</p>");
};

// "Save" the original attack value
function setBaseAttack(Char) {
    baseAttack = Char.attackPower;
}

// increaseAttack
Character.prototype.increaseAttack = function () {
    this.attackPower += baseAttack;
};

// Checks if character is alive
function isAlive(Obj) {
    if (Obj.healthPoints > 0) {
        return true;
    }
    return false;
}

// Checks if the player has won
function isWinner() {
    if (charArray.length == 0 && player.healthPoints > 0)
        return true;
    else return false;
}

// Create character divs / display info
function characters(charDiv) {
    $(charDiv).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(charDiv).append("<div />");
        $(charDiv + " div:last-child").append("<img class='clickCharacter' >");
        $(charDiv + " img:last-child").attr("id", charArray[i].name);
        $(charDiv + " img:last-child").attr("src", charArray[i].pic);
        $(charDiv + " div:last-child").append("<p>" + charArray[i].name + "<p>" + "<p>HP: " + charArray[i].healthPoints + "</p>");
    }
}

// Move characters
function moveChar(from, to) {
    $(from).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(to).append('<img class="flip clickCharacter" />');
        $(to + " img:last-child").attr("id", charArray[i].name);
        $(to + " img:last-child").attr("src", charArray[i].pic);
    }
}


// select character text
$("#select").html("Choose a character...")

// hide attack button, text area, and hr
$("#attackBtn").hide();
$("#textArea").hide();
$("#hr").hide();


// click on image...
$(document).on("click", ".clickCharacter", function () {

    // show hr
    $("#hr").show();

    // Adds random defender and remove from the charArray
    if (playerSelected && !defenderSelected) {
        for (var j = 0; j < charArray.length; j++) {
            if (charArray[j].name == (this).id) {
                defender = charArray[j]; // sets defender
                charArray.splice(j, 1);
                defenderSelected = true;
                $("#textArea").show();
                $("#textArea").html('<p>Click "ATTACK!" to start fighting!</p>');
            }
        }
        $("#defender").append(this);
        $("#defender").append("<h2>" + defender.name + "<h2>");
        $("#defenderHp").append("<p>HP: " + defender.healthPoints + "</p>");

        // shows attack button
        $("#attackBtn").show();

        // hide select text
        $("#select").hide();

        // hide #playerSelect
        $("#playerSelect").hide();
    }

    // Sets player and removes it from charArray
    if (!playerSelected) {
        for (var i = 0; i < charArray.length; i++) {
            if (charArray[i].name == (this).id) {
                player = charArray[i]; // sets current player
                setBaseAttack(player);
                charArray.splice(i, 1);
                playerSelected = true;
                $("#select").html("Pick an enemy to fight:");
            }
        }
        moveChar("#playerSelect", "#defendersRemaining");
        $("#player").append(this);
        $("#player").append("<h2>" + player.name + "</h2>");
        $("#playerHp").append("<p>HP: " + player.healthPoints + "</p>");
    }
});



// attackBtn functionality
$(document).on("click", "#attackBtn", function () {

    if (playerSelected && defenderSelected) {
        if (isAlive(player) && isAlive(defender)) {
            player.attack(defender);
            defender.counterAttack(player);
            $("#playerHp").html("<p>HP: " + player.healthPoints + "</p>");
            $("#defenderHp").html("<p>HP: " + defender.healthPoints + "</p>");
            if (!isAlive(player)) {
                $("#player").children().remove();
                $("#textArea").html("<h3> Game Over <br> <h2>" + defender.name + " wins!</h3>");
                $("#attackBtn").html("RESTART");
                //game restart button / loaction reload 
                $(document).on("click", "#attackBtn", function () {
                    location.reload();
                });
            }
        }
        if (!isAlive(defender)) {
            $("#defender").children().remove();
            $("#defender").html("");
            $("#defenderHp").html("");
            $("#select").show();
            $("#select").html("Pick an enemy to fight:");
            $("#attackBtn").hide();
            $("#textArea").hide()
            defenderSelected = false;
            if (isWinner()) {
                $("#p1").addClass('col-12').removeClass('col-6');
                $("#select").hide();
                $("#textArea").show();
                $("#textArea").html("<h3>" + player.name + " wins!</h3>");
                $("#textArea").prepend("<img src='assets/images/triforce.gif'>");
                $("#defender").hide();
                $("#defenderHp").hide();
                $("#attackBtn").show();
                $("#attackBtn").html("RESTART");
                $(document).on("click", "#attackBtn", function () {
                    location.reload();
                });
            }
        }
    }

});

// start
$(document).ready(function () {
    initCharacters();
    characters("#playerSelect");
});


