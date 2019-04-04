//Global Variables upon start of gamme
let player;    // player Object
let enemy;     // enemy Object
let charArray = [];   //empty array that will store all of the characters
let charSelected = false;       // A checker to see if user has picked a character
let enemySelected = false;      // A checker to see if user has picked an enemy to fight
let baseAttack = 0;     //Base attack strength is 0 for all characters until we set it for each character

// Stats for each character (Constructor)
function char(name, hp, atk, returnDmg, img) {
    this.name = name;
    this.health = hp;
    this.attack = atk;
    this.counterAtk = returnDmg;
    this.image = img;
}

// Each character's total attack is their attack strength + base attack. Each char is an object so we use .prototype on our char object so that character function aren't created for EACH character.
// prototype allows us to associate function or property for each char from the SAME char function - also allows you to create your own methods!
char.prototype.totalAttack = function () {
    this.attack += baseAttack;     // current attack + last attack
}

// When the user attacks
char.prototype.attack = function(obj) {
    obj.health -= this.attack;          // health - damage dealt from current attack
    $("#message").html("You attacked " + obj.name + "and dealt " + this.attack + " damage.");
    this.totalAttack(); // increases character's total attack, or damage dealt
}

// The enemy's return damage onto the user
char.prototype.returnDamage = function (obj) {
    obj.health -= this.returnDmg; // health - damage dealth from enemy
    $("#message").append("<br>" + this.name + " attacked you for " + this.counterAttackPower + " damage.");
}

// Call this function to initialize each character and their stats
function charInitialize() {
    let lukeSkywalker = new char("Luke Skywalker", 120, 20, 5, "assets/images/LukeSkywalker.jpg");
    let darthVader = new char("Darth Vader", 250, 50, 20, "assets/images/DarthVader.jpg");
    let R2D2 = new char("R2D2", 80, 75, 40, "assets/images/R2D2.jpg");
    let kyloRen = new char("Kylo Ren", 150, 15, 5, "assets/images/KyloRen.jpg");
    charArray.push(lukeSkywalker, darthVader, R2D2, kyloRen);
}

// Initialized character's base attack power becomes their set attack power
function initializeCharAttack(obj) {
    baseAttack = obj.attack;
}

// If player is alive or not
function alive(obj) {
    if (obj.health > 0) {
        return true;
    };
    return false;
};

// If player has won or lost
function winOrlose() {
    if (charArray.length == 0 && player.health > 0) {     // when you select a character, there are 3 enemies left in the array. If you kill all enemies, then the array length becomes 0
        return true;
    } else {
        return false;
    };
};

// The cards will get initialized below the #game ID
function charCards(gameID) {
    $(gameID).children().remove(); // removes all potential #game children
    for (var i = 0; i < charArray.length; i++) {   // For each character...
        $(gameID).append("<div/>"); // Creates a new div element within #game that's NOT added to the DOM unless you DON'T append it to any DOM element
        $(gameID + " div:last-child").addClass("card"); // Adding Bootstrap "card" class <div> element that is last child of #game ID div
        $(gameID + " div:last-child").append("<img/>"); // Appends image tag - Everything underneath is within image tag
        $(gameID + " img:last-child").attr("id", charArray[i].name);    // ID of the character in the card
        $(gameID + " img:last-child").attr("class", "card-img-top");   // Bootstrap class
        $(gameID + " img:last-child").attr("src", charArray[i].image);      // Image file
        $(gameID + " img:last-child").attr("width", 150);         // Card width
        $(gameID + " img:last-child").addClass("img-thumbnail");         // Bootstrap image thumbnail
        $(gameID + " div:last-child").append(charArray[i].name + "<br>");       // Add character name in thumbnail
        $(gameID + " div:last-child").append("Health: " + charArray[i].health);      // Add character health in thumbnail
    };
};

//Updates the pictures after you pick character cards
function updateCards(gameDiv, enemiesLeft) {
    $(gameDiv).children().remove();
    for (var i = 0; i < charArray.length; i++) {
        $(enemiesLeft).append("<img />");
        $(enemiesLeft + " img:last-child").attr("id", charArray[i].name);
        $(enemiesLeft + " img:last-child").attr("src", charArray[i].image);
        $(enemiesLeft + " img:last-child").attr("width", 150);
        $(enemiesLeft + " img:last-child").addClass("img-thumbnail");
    }
}

//Change from first screen to second screen
function firstTosecond() {
    $("#first").hide();
    $("#second").show();
};

//Change from second screen to win screen
function secondTowin() {
    $("#second").hide();
    $(".win-screen").show();
};

//Change from second screen to lose screen
function secondTolose() {
    $("#second").hide();
    $(".lose-screen").show();
};


/////////////////////* ON-CLICK FUNCTIONALITY */////////////////////////

$(document).on("click", "img", function() {
    if (charSelected && !enemySelected && (this.id != player.name)) {   // If user HAS selected character, enemy has NOT been selected, AND id matches with character's name
        for (var x = 0; x<charArray.length; x++) {  // For every element in char array
            if (charArray[x].name === (this).id) {      
                enemy = charArray[x];       // Enemy object becomes that enemy in the char Array
                charArray.splice(x,1);      // Remove enemy from char array
                enemySelected = true;
                $("#message").html("Attack your enemy!");    
            };
        };
        $("#enemyDiv").append(this); // appends the selected defender to the div 
        $("#enemyDiv").append("<br>" + enemy.name);  // appends enemy name to the div
        $("#enemyHealth").append("HP: " + enemy.health);
    };
    if (!charSelected) {     // If the user has NOT selected a character
        for (var i = 0; i< charArray.length; i++) {   // For each character in the array...
            if (charArray[i].name === (this).id) {  // If that character's name is the same as the name that was set for it's id...
                player = charArray[i]; // Player object becomes that Character
                initializeCharAttack(player); // Generate the user's attack power
                charArray.splice(i,1);  // Removes that character from the array
                charSelected = true;  
                firstTosecond(); // transition from first to second page
                $("#message").text("Choose your foe."); // PROBLEM -> Code is not rendering because this class is from another html DOC!
            };
        };
        updateCards("#game", "#enemiesLeft");       
        $("#player").append(this); // appends the selected player to the div
        $("#player").append(player.name);    // appends player name to the player id div
        $("#playerHealth").append("HP: " + player.health); //
    };
});

// Attack Button Onclick Event
$(document).on("click", "#attackBtn", function() {
    if(charSelected && enemySelected) {    // if the player and enemy has been selected
        if (alive(player) && alive(enemy)) {       // if player and enemy are BOTH alive
            player.attack(enemy);        // Player attacks the enemy
            enemy.returnDmg(player);      // Enemy returns damage onto the player
            $("#playerHealth").html("Health: " + player.health);       // Underneath player, new HP shows up
            $("#enemyHealth").html("Health: " + defender.health);      // Underneath enemy, new HP shows up
            if (!alive(enemy)) {       // if the enemy is not alive
                $("#playerHealth").html("You have defeated the enemy.");      // display under the player that you have defeated the enemy
                $("#message").html("Pick another enemy to battle!");       // display under the player that you can now pick another enemy to battle
            }
            if (!isAlive(player)) {     // if the player is not alive
                $("#playerHealth").html("You have been defeated.");     // player has lost the game
                secondTolose();    // shifts to lose screen
                $(document).on("click", "#attackBtn", function () { // restarts game
                    location.reload();
                });
            }
        }
        if (!alive(enemy)) {     //if there are no more enemies alive
            $("#enemyDiv").children().remove();     // remove all child elements from enemy div
            $("#enemyDiv").html("");      
            $("#enemyHealth").html("");
            enemySelected = false;       // no enemy selected
            if (winOrlose()) {    // if winOrlose = true
                secondTowin();     // shift to win screen
            };
        };
    };
});

// Runs when you load the webpage
$(document).ready(function () {
    $("#second").hide();
    $(".win-screen").hide();
    $(".lose-screen").hide();
    charInitialize();
    charCards("#game");
});



