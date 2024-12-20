$(function () {
    let tileData;

    // Load the JSON file
$.getJSON("js/pieces.json", function (data) {
    tileData = data;

     // Function to populate the rack with random tiles
    function populateRack() {
        const rack = $(".rack");
        rack.empty(); // Clear the rack before populating

        // Flatten the pool of tiles based on their amounts
        let tilePool = [];
        tileData.pieces.forEach(piece => {
            for (let i = 0; i < piece.amount; i++) {
                tilePool.push(piece);
            }
        });

        // Select 7 random tiles from the pool
        for (let i = 0; i < 7; i++) {                
            if (tilePool.length === 0) break; // No tiles left in the pool
            
            const randomIndex = Math.floor(Math.random() * tilePool.length);
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
    }
        // Call the function once to populate the rack
    populateRack();

    // Drag-and-drop functionality
    $(".tile").draggable({
        revert: "invalid"
    });
    $(".cell").droppable({
        accept: ".tile",
        drop: function (event, ui) {
            const tile = ui.draggable;
            const cell = $(this);

            const cellOffset = cell.offset();
            const cellCenterX = cellOffset.left + cell.width() / 2 - 2;
            const cellCenterY = cellOffset.top + cell.height() / 2 - 2;

            const tileWidth = tile.width();
            const tileHeight = tile.height();
            const newLeft = cellCenterX - tileWidth / 2;
            const newTop = cellCenterY - tileHeight / 2;

            tile.css({
                left: newLeft + "px",
                top: newTop + "px",
                position: "absolute"
            });
            tile.detach().appendTo(cell);
            tile.draggable("disable");
        }
    });
});
});
