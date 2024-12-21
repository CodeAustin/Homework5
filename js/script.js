/***
File: script.js
GUI Assignment: HW5
Austin Nguyen, UMass Lowell, austin_nguyen@student.uml.edu
Copyright (c) 2024. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.

Updated on December 20, 2024 by Austin Nguyen

This file contains the main functionality for the single row Scrabble game. It loads the JSON data 
from the "pieces.json" file, all 100 pieces, and generates the tiles for the game. 

The user can drag and drop tiles from the rack to the board, wher the score is calculated based on 
the cell type and tile value. Information displayed includes the current word, the current word 
score, total score for the game, and the number of remaining tiles. All this information is updated
dynamically as the user interacts in the game. 

The four other functions are for the reset button, the submit button, the new hand function, and recall
button. Reset will fully reset the tile pool, score, and board. Submit will submit the current word and
update the total score. New hand will return the current rack to the tile pool and draw 7 new tiles, updating the tile
pool. Recall will recall all tiles on the board back to the rack.
***/
$(function () {
    // Define the tile data and the current score
    let currentScore = 0;

    // Load the JSON file
    $.getJSON("js/pieces.json", function (data) {
        let tileData = data;
        let tilePool;

    /* 
    Main function to begin and reset the game, takes the data from the "pieces.json" file
    and generates the tiles for the game. The "tilePool" is created as an array that holds all the
    tiles in alphabetical order. The remaining tiles are displayed in the "remaining" div. The rack is
    cleared and 7 tiles are drawn to start the game.

    See the reset event handler for how the game is reset.
    */
    function initializeGame() {
            // Create a pool of tiles based on the JSON data
            tilePool = [];

            // Populate the tile pool with the pieces from the JSON
            tileData.pieces.forEach(piece => {
                for (let i = 0; i < piece.amount; i++) {
                    tilePool.push(piece);
                }
            });
             // Clear the debug rack
            $(".rack").empty(); 
            // Draw 7 tiles to start the game
            createTiles(7);
        }

    // Initialize the game
    initializeGame();

    /* 
    Four main event handlers exist, all with checks to ensure the game is in a valid state to perform
    regardless of the user's actions. 

    * Reset button: Clears the board, resets the game, and updates the current score.
    * New Hand or Mulligan button: Returns the current rack to the tile pool and draws 7 new tiles.
    * Recall button: Recalls all tiles on the board back to the rack.
    * Submit button: Submits the current word, updates the total score, and refills the rack.

    */

    // Event handler for the reset button
    $(".reset").on("click", function () {
        // Clear the board
        $(".board .cell .tile").remove();

        // Reinitialize the game
        initializeGame();

        // Reset the current score
        currentScore = 0;

        // Reset the total score and the word score
        $("#total-score").text(currentScore);

        $("#word-value").text(""); // Update the current word

        // Enable draggable functionality for the tiles
        $(".tile").draggable({
            revert: "invalid"
        });
    });

    // Event handler for the new hand button
    $(".new-hand").on("click", function () {
        // Case for if the tile pool is empty
        if (tilePool.length === 0) {
            console.warn("Tile pool is empty, cannot draw new tiles.");
            return; // Exit the function
        }
        // Case if there are tiles on the board
        else if ($(".board .cell .tile").length > 0) {
            console.warn("Tiles on the board, cannot draw new hand.");
            return; // Exit the function
        } else {
            // Return tiles to the pool
            mulligan();
        }
        $(".tile").draggable({
            revert: "invalid"
        });

    });

    // Event handler for the recall button
    $(".recall").on("click", function () {
        recallTiles();
    });

    // Event handler for the submit button
    $(".submit-word").on("click", function () {
        submitWord();
        $("#word-value").text(""); // Reset the current word display
    });

    /*  Helper function for the recall button */
    function recallTiles() {
        const rack = $(".rack"); // Select the rack where tiles will be placed

        $(".board .cell .tile").each(function () {
            const tile = $(this); // Select the current tile

            // Move the tile directly back to the rack
            rack.append(tile);

            // Reset the tile's CSS for proper alignment in the rack
            tile.css({
                top: "0px",
                left: "0px",
                position: "relative" // Ensure tiles respect the rack's flexbox layout
            });

            // Reinitialize draggable functionality for each tile
            tile.draggable("destroy").draggable({
                revert: "invalid",
                containment: ".game-container", // Optional: Limit dragging to game area
                stack: ".tile" // Ensure tiles stack correctly when dragged
            });
        });

        // Reset the score and word display
        score = 0; // Reset the score to 0
        $("#score-value").text(0); // Update the score after recalling the tiles
        $("#word-value").text(""); // Update the current word to empty
    }

    function refill() {
        const rack = $(".rack"); // Ensure rack is defined
        const tilesOnBoard = $(".board .cell .tile").length; // Count tiles currently on the board
        const rackTiles = rack.children(".tile").length; // Count tiles currently in the rack
        const missingTiles = 7 - (rackTiles + tilesOnBoard); // Calculate the number of tiles to draw
    
        if (missingTiles <= 0) {
            return; // No need to refill if there are already 7 tiles total
        }
    
        // Draw tiles only for the missing number
        createTiles(missingTiles);

        // Reinitialize draggable functionality for new tiles
        $(".tile").draggable({
            revert: "invalid"
        });
    }
    

    // Function for the score updates
    function updateScore() {
        let wordScore = calculateBoardScore(); // Calculate the score of the current board
        $("#score-value").text(wordScore); // Update the score display
    }

    function updateWord() {
        const cells = $(".board .cell"); // All board cells
        const word = []; // Initialize an empty array for the word
    
        // Build the word from the tiles on the board
        cells.each(function () {
            const tile = $(this).find(".tile");
            if (tile.length > 0) {
                word.push(tile.attr("id")); // Collect the letter ID
            }
        });
    
        // Join the letters into a string and update the current word display
        $("#word-value").text(word.join(""));
    }
    
    // Function to perform a mulligan: return rack tiles to the pool and replace them
    function mulligan() {
        const rack = $(".rack"); // Select the rack container

        // Return current tiles in the rack to the pool
        rack.children(".tile").each(function () {
            const tile = $(this); // Select the current tile
            const letter = tile.attr("id"); // Get the letter of the tile

            // Find the corresponding tile data
            const tileItem = tileData.pieces.find(piece => piece.letter === letter);

            if (tileItem) {
                // Add the tile back to the pool
                tilePool.push(tileItem);
            }

            // Remove the tile from the rack
            tile.remove();
        });

        // Draw 7 new tiles for the rack
        createTiles(7);

        // Update the UI to reflect the remaining tiles in the pool
        $(".remaining span").text(tilePool.length);

        // Reset the word and score displays
        $("#word-value").text("");
        $("#score-value").text(0);  
    }

    function submitWord() {
        const cells = $(".board .cell"); // All board cells
        const word = [];
        const wordScore = calculateBoardScore(); // Calculate the score of the current board
    
        // Build the word from the tiles on the board
        cells.each(function () {
            const tile = $(this).find(".tile");
            if (tile.length > 0) {
                word.push(tile.attr("id")); // Collect the letter ID
            }
        });
    
        // Update the total score
        currentScore += wordScore;
        $("#total-score").text(currentScore); // Update the total score display
    
        // Clear the board
        cells.each(function () {
            const tile = $(this).find(".tile");
            if (tile.length > 0) {
                tile.remove();
            }
        });
    
        // Restock new tiles on the rack
        refill();
    
        // Reinitialize draggable functionality for new tiles
        // Note, I have no idea why this works here but it does.
        $(".tile").draggable({
            revert: "invalid"
        });
        $("#score-value").text(0); // Reset the word score display
    }

    // Attach updateScore to the drop event
    $(".cell").on("drop", function () {
        updateScore();
        setTimeout(updateWord, 0); // Delay updateWord to ensure DOM is fully updated
    });
    
    // Drag-and-drop functionality
    $(".tile").draggable({
        revert: "invalid"
    });

    // Droppable functionality, has several conditions to check if the tile can be placed in the cell
    $(".cell").droppable({
        // Only accept tile elements
        accept: ".tile",

        // Drop event handler
        drop: function (event, ui) {
            const tile = ui.draggable; // Get the tile that was dragged
            const cell = $(this); // Get the cell where the tile was dropped
            const cellIndex = cell.index(); // Get the index of the current cell
            const cells = $(".board .cell"); // All cells on the board
            const rack = $(".rack"); // Tile rack
            let isValidPlacement = false; // Flag to check if the placement is valid
    
            // Get the number of tiles already placed on the board
            const placedTiles = $(".board .cell .tile");

            // Check if any tiles have been placed on the board
            if (placedTiles.length === 0) {
                // First tile must be placed in the leftmost, first cell
                if (cellIndex === 0) {
                    isValidPlacement = true;
                }
            } else {
                // For subsequent tiles, check adjacency rules.
                // NOTE: I was going to use this to expand the board, but I ran out of time.
                const adjacentCells = [
                    cells.eq(cellIndex - 1), // Left neighbor
                    cells.eq(cellIndex + 1), // Right neighbor
                ];
    
                // Validate placement by ensuring at least one adjacent cell contains a tile
                isValidPlacement = adjacentCells.some(adjacentCell => adjacentCell.find(".tile").length > 0);
            }
    
            // Case if the placement is valid, center the tile placed in the cell
            if (isValidPlacement) {
                // Get the center of the cell
                const cellOffset = cell.offset();
                const cellCenterX = cellOffset.left + cell.width() / 2;
                const cellCenterY = cellOffset.top + cell.height() / 2;
    
                // Calculate the new position for the tile
                const tileWidth = tile.width();
                const tileHeight = tile.height();
                const newLeft = cellCenterX - tileWidth / 2;
                const newTop = cellCenterY - tileHeight / 2;
    
                // Update the tile's position, fine tune the placement
                // Reference that showed me css positioning:
                // https://stackoverflow.com/questions/14308290/jquery-draggable-and-droppable-between-two-containers-and-sortable

                tile.css({
                    left: newLeft - 2 + "px" ,
                    top: newTop - 2 +"px",
                    position: "absolute"
                });
                tile.detach().appendTo(cell); // Move the tile into the cell
                tile.draggable("disable"); // Disable further dragging of the tile
                updateScore(); // Update the score after a successful drop

            // Case for invalid placement, must bounce the tile back to the rack
            } else {
                const rackIndex = tile.index(); // Get the tile's original index in the rack
                tile.animate({
                    top: "0px",
                    left: "0px"
                }, "slow", function () {
                    tile.css({ position: "relative" });
                    if (rackIndex === 0) {
                        // Place tile at the beginning if it was the first
                        rack.prepend(tile);
                    } else {
                        // Otherwise, place back in the correct order
                        rack.children().eq(rackIndex - 1).after(tile);
                    }
                });
            }
        }
    });

    /* Function to create tiles and append them to the rack */
    function createTiles(count) {
        const rack = $(".rack"); // Ensure rack is accessible
        if (!tilePool || tilePool.length === 0) {
            alert("Tile pool is empty or not initialized, json missing.");
            return; // Exit if the tile pool is not ready
        }
    
        // Draw tiles for the given count
        for (let i = 0; i < count; i++) {
            if (tilePool.length === 0) {
                alert("Tile pool is empty, cannot draw more tiles.");
                break; // No tiles left in the pool
            }

            // References for random and splicing:
            // https://www.w3schools.com/js/js_random.asp
            // https://www.w3schools.com/jsref/jsref_splice.asp

            // Randomly select a tile from the pool
            const randomIndex = Math.floor(Math.random() * tilePool.length);

            // Remove the selected tile from the pool
            const selectedTile = tilePool.splice(randomIndex, 1)[0];
    
            // Create a tile element
            const tileDiv = $("<div></div>")
                .addClass("tile")
                .attr("id", selectedTile.letter)
                .css({
                    "background-image": `url(${selectedTile.image})`,
                    "background-size": "contain",
                    "background-repeat": "no-repeat",
                    "background-position": "center",
                    "display": "inline-block",
                    "width": "65px",
                    "height": "70px",
                    "margin": "3px",
                });
    
            // Append the tile to the rack
            rack.append(tileDiv);
        }
        // Update the number of tiles remaining in the pool
        $(".remaining span").text(tilePool.length);
    }

    // Function to calculate the total score of the board
    function calculateBoardScore() {
        let totalScore = 0; // Initialize total score
    
        // Iterate over each cell in the board
        // NOTE: Probably could have used a NodeList but this works
        $(".board .cell").each(function () {
            const tile = $(this).find(".tile");
    
            // Check if a tile is present in the cell
            if (tile.length > 0) {
                const letter = tile.attr("id"); // Get the letter ID
                const cellType = $(this).attr("id"); // Get the cell type (e.g., blank, double-letter)
    
                // Find the corresponding tile data in the JSON
                // Reference for find method:
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
                const tileItem = tileData.pieces.find(piece => piece.letter == letter);
    
                // Adjust the score based on the cell type
                if (tileItem) {
                    // Get the value of the tile
                    let tileScore = tileItem.value;
    
                    // Case for double-letter cell
                    if (cellType === "double-letter") {
                        tileScore *= 2; // Apply double-letter multiplier
                        totalScore += tileScore // Add the score to the total

                    // Case for double-word cell
                    } else if (cellType === "double-word" && tileScore != 0) {
                        totalScore += tileScore; // Add the score to the total
                        totalScore *= 2; // Apply double-word multiplier

                    // Case for regular cell
                    } else {
                        totalScore += tileScore; // Add score normally
                    }
                }
            }
        });
        return totalScore; // Return the calculated total score
    }
    });
});
