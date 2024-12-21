# Homework 5: Drop & Drag Scrabble

This assignment uses jQuery UI to create a drag-and-drop Scrabble game for GUI Programming I. 
The game includes a single-row board with seven slots where players can place tiles and a rack containing seven tiles available for use. 
As players interact with the game, it dynamically updates to display the current word being formed, the score for the current word, the total game score, and the number of tiles remaining in the "tile pool." 
The game provides four input options: Submit Word, Mulligan Tiles, Recall Tiles, and Reset Game, each designed to manage different aspects of gameplay.

The Submit Word feature allows the player to submit the word they have formed. While the game does not validate the word, it updates the total score by adding the current word's score. The tiles used to form the word are removed from the board, and the rack is then refilled with new tiles drawn from the tile pool, mimicking standard Scrabble mechanics. 

Mulligan Tiles returns all seven tiles from the rack to the pool and draw a completely new set. This was implemented in order avoid the rapidly depleting the tile pool and simply because this method stands out against the examples provided in the write up.

The Recall Tiles feature is a simple solution for repositioning tiles, as it returns all tiles placed on the board back to the rack. However, this was the last tested of the features and there is a high potential for bugs.

The Reset Game option restores the game to its initial state as it was when the page first loaded. This includes resetting the rack, pool, board, and both the current and total scores, offering a clean slate for a new game session.

Despite its functionality, the game has some limitations. A significant drawback is the lack of a word dictionary for validation. Although plans were made to integrate a word dictionary API, time constraints prevented its implementation. Additionally, the project was initially intended to include a full-sized Scrabble board for a more authentic gameplay experience. However, given the work on this project coincided with final exams, such a inclusion was impractical, thus the single-row board was implemented as a happy compromise. Another limitation lies in the organization of the script, as plans to refactoring the JavaScript code into multiple files to improve readability.

Website: https://codeaustin.github.io/Homework5/

## References:
Note that a large portion of this assignment was trial and error for me, so some references to code in this section may be incomplete.

###  W3Schools References for Random and Splicing: https://www.w3schools.com/js/js_random.asp
###  W3Schools References for Random and Splicing: https://www.w3schools.com/jsref/jsref_splice.asp
### jQuery between table and container: https://stackoverflow.com/questions/14308290/jquery-draggable-and-droppable-between-two-containers-and-sortable
First major breakthrough in the drag and drop, as centering the tiles in relation to the cells was difficult.
### jQuery Draggable Revert: https://api.jqueryui.com/draggable/#option-revert
My inital attempt to return tiles to the board, worked only sometimes.
### MDN find() Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
Helpful for handling the tilePool array.
### MDN === vs == Site: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
Unsure but this helped to fix a bug comparing the letter from tile to that of the json data. I am too scared to touch it anymore 