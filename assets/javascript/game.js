// you can use a object constructor for all of these objects to DRY it up
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_a_constructor_function
function guardian(name, id, image, origHealth, health, origAttack, attack, counterAttack) {
  this.name = name;
  this.id = id;
  this.image = image;
  this.origHealth = origHealth;
  this.health = health;
  this.origAttack = origAttack;
  this.attack = attack;
  this.counterAttack = counterAttack;
}

starLord = new guardian("Star Lord", "0", "assets/images/character_1.png", 100, 100, 6, 6, 12);
drax = new guardian("Drax", "1", "assets/images/character_2.png", 140, 140, 5, 5, 10);
groot = new guardian("Groot", "2", "assets/images/character_3.png", 200, 200, 2, 2, 15);
gamora = new guardian("Gamora", "3", "assets/images/character_4.png", 75, 75, 11, 11, 20);
rocket = new guardian("Rocket", "4", "assets/images/character_5.png", 65, 65, 15, 15, 5);

var characters = [starLord, drax, groot, gamora, rocket];
var player = null;
var enemy = null;
// I was getting this attackBtn as undefined below, so declared it up here
var attackBtn;

//Play game
$(document).ready(function() {
    startGame();
})

function startGame() {
    //Load characters
    for(i=0; i<characters.length; i++) {
        
        //New div for each character
        var character = $("<div>");
        character.addClass("character");
        character.attr("id", characters[i].id);

        //Image for each character
        var image = $("<img>")
        image.attr("src", characters[i].image);
        character.append(image);
        image.addClass("characterImage")
        
        //Name for each character
        var name = $("<h2>");
        name.text(characters[i].name);
        name.addClass("text charName");
        character.append(name);

        //Health for each character
        var health = $("<h2>");
        health.text("HP: " + characters[i].origHealth);
        health.addClass("text charHealth");
        character.append(health);

        //Reset Health and Attack
        characters[i].health = characters[i].origHealth;
        characters[i].attack = characters[i].origAttack;

        //Add each char to character select div
        $("#characters").append(character);
    }

    //Wait until they select hero
    $(".character").click(function() {
        if (player === null) {
            player = characters[$(this).attr("id")];
            var playerDiv = $(this);
            playerSelected(playerDiv);
        }
    })
}

function playerSelected(playerDiv) {
    //Update HTML with selected hero
    $("#charSelect").text(player.name + " Selected!")
    playerDiv.css("margin", "0");
    playerDiv.css("margin-top", "0");
    playerDiv.css("border-color", "green")
    $("#playerDiv").append(playerDiv);

    //Wait for enemy select
    setTimeout(function() {
        $("#charSelect").text("Choose an Enemy");
        $(".character").click(function() {
            if (enemy === null && $(this).attr("id") !== player.id) {
                enemy = characters[$(this).attr("id")];
                var enemyDiv = $(this);
                enemySelected(enemyDiv);
            }
        }) 
    }, 300);
}

function enemySelected(enemyDiv) {
    //Update HTML with selected enemy
    $("#charSelect").text(player.name + " versus " + enemy.name + "!");
    enemyDiv.css("margin", "0");
    enemyDiv.css("margin-top", "0");
    $("#enemyDiv").append(enemyDiv);
    
    //Update HTML with attack button if it's the first enemy
    if ($("#characters").find(".character").length === 3) {
        attackBtn = $("<button>");
        attackBtn.text("Attack");
        $("#arena").append(attackBtn);
    }

    //Wait for attack
    setTimeout(function() {
        $("#charSelect").text("Enemies Remaining");
        attackBtn.click(function() {
            if (player.health > 0 && enemy !== null) {
                attack();
            }
        }) 
    }, 300);
}

function attack() {
    //Player attacks
    var preAttack = player.attack;
    // something strange is going on where the enemy is attacked multiple times
    // after the second character is picked. Take a look at the attack points vs
    // hp lost. You will see these statements print out twice when the second (or later)
    // character is being fought against. I couldn't figure it out in a quick glance through,
    // but I can help you debug this if you would like.
    console.log("player attack " + player.attack);
    console.log("enemy attack " + enemy.attack);
    console.log("enemy health before " + enemy.health);
    enemy.health -= player.attack;
    console.log("enemy health after " + enemy.health);
    player.attack += player.origAttack;
    $(enemyDiv).find(".charHealth").text("HP: " + enemy.health);

    //If enemy dies
    if (enemy.health <= 0) {
        $("#playerText").text("You attacked " + enemy.name + " for " + preAttack + " damage (fatal).");
        $("#enemyDiv").empty();
        enemy = null;

        //Choose a new enemy if there is one that remains
        if ($("#characters").find(".character").length > 0) {
            $("#enemyText").text("Choose your next target.");
            $(".character").click(function() {
                if (enemy === null && $(this).attr("id") !== player.id) {
                    enemy = characters[$(this).attr("id")];
                    var enemyDiv = $(this);
                    enemySelected(enemyDiv);
                }
            })
        } else {
            $("#enemyText").empty();
            $("#gameStatus").text("You Win! --Press the Reset Button to Play Again")
            $("#charSelect").text("All Enemies Defeated!");
            $("#arena").find("button").text("Reset");
            $("#arena").find("button").click(function() {
                resetGame();
            })
        }
    } else {
        $("#playerText").text("You attacked " + enemy.name + " for " + preAttack + " damage.");
        //Enemy attacks
        player.health -= enemy.counterAttack;
        $(playerDiv).find(".charHealth").text("HP: " + player.health);
        if (player.health <= 0) {
            $("#enemyText").text(enemy.name + " attacked you back for " + enemy.counterAttack + " damage (fatal).")
            $("#gameStatus").text("You Died.  --Press The Reset Button to Try Again--")
            $("#arena").find("button").text("Reset");
            $("#arena").find("button").click(function() {
                resetGame();
            })
        } else {
            $("#enemyText").text(enemy.name + " attacked you back for " + enemy.counterAttack + " damage.")
        }   
    }    
}

function resetGame() {
    player = null;
    enemy = null;
    $("#playerDiv").empty();
    $("#enemyDiv").empty();
    $("#characters").empty();
    $("#arena").find("button").remove();
    $("#playerText").empty();
    $("#enemyText").empty();
    $("#gameStatus").empty();

    startGame();
}
