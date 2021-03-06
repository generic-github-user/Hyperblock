// "use strict";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

var data = {
      "settings": {
            "zoom": 25,
            "offset": {
                  "x": 0,
                  "y": 0
            },
            "follow": true
      },
      "input": {
            "keyboard": {
                  "up": false,
                  "down": false,
                  "left": false,
                  "right": false
            },
            "mouse": {
                  "x": 0,
                  "y": 0
            }
      },
      "world": {
            "player": {
                  "health": 100,
                  "speed": 1,
                  "velocity": {
                        "x": 0,
                        "y": 0
                  },
                  "location": {
                        "x": 0,
                        "y": 0
                  },
                  "getPoints": function() {
                        var x = this.location.x;
                        var y = this.location.y;
                        var points = [
                              {
                                    "x": x,
                                    "y": y - 1
                              },
                              {
                                    "x": x + 1,
                                    "y": y
                              },
                              {
                                    "x": x,
                                    "y": y + 1
                              },
                              {
                                    "x": x - 1,
                                    "y": y
                              }
                        ];

                        return points;
                  }
            },
            "blocks": [],
            "projectiles": [],
            "time": 0
      }
};

function sameSign(num1, num2) {
      if ((num1 * num2) >= 0) {
            return true;
      }
      else {
            return false;
      }
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	var a1, a2, b1, b2, c1, c2;
	var r1, r2 , r3, r4;
	var denom, offset, num;

	// Compute a1, b1, c1, where line joining points 1 and 2
	// is "a1 x + b1 y + c1 = 0".
	a1 = y2 - y1;
	b1 = x1 - x2;
	c1 = (x2 * y1) - (x1 * y2);

	// Compute r3 and r4.
	r3 = ((a1 * x3) + (b1 * y3) + c1);
	r4 = ((a1 * x4) + (b1 * y4) + c1);

	// Check signs of r3 and r4. If both point 3 and point 4 lie on
	// same side of line 1, the line segments do not intersect.
	if ((r3 !== 0) && (r4 !== 0) && sameSign(r3, r4)){
		return 0; //return that they do not intersect
	}

	// Compute a2, b2, c2
	a2 = y4 - y3;
	b2 = x3 - x4;
	c2 = (x4 * y3) - (x3 * y4);

	// Compute r1 and r2
	r1 = (a2 * x1) + (b2 * y1) + c2;
	r2 = (a2 * x2) + (b2 * y2) + c2;

	// Check signs of r1 and r2. If both point 1 and point 2 lie
	// on same side of second line segment, the line segments do
	// not intersect.
	if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))){
		return 0; //return that they do not intersect
	}

	//Line segments intersect: compute intersection point.
	denom = (a1 * b2) - (a2 * b1);

	if (denom === 0) {
		return 1; //collinear
	}

	// lines_intersect
	return 1; //lines intersect, return true
}

var collide;
function checkCollision(shapes) {
      collide = false;
      var lines = [[], []];
      for (var i = 0; i < 2; i ++) {
            for (var j = 0; j < shapes[i].length - 1; j ++) {
                  lines[i].push([shapes[i][j], shapes[i][j + 1]]);
            }
            var len = shapes[i].length - 1;
            lines[i].push([shapes[i][len], shapes[i][0]]);
      }

      for (var i = 0; i < lines[0].length; i ++) {
            for (var j = 0; j < lines[1].length; j ++) {
                  var linesCollide = intersect(
                        lines[0][i][0].x,
                        lines[0][i][0].y,
                        lines[0][i][1].x,
                        lines[0][i][1].y,
                        lines[1][j][0].x,
                        lines[1][j][0].y,
                        lines[1][j][1].x,
                        lines[1][j][1].y,
                  );
                  if (linesCollide) {
                        collide = true;
                  }
            }
      }

      return collide;
}

// Function for selecting a random number between given minimum and maximum values
function random(min, max) {
      // Return the random number: the minimum value plus a random number from 0 to the difference of the minimum and maximum values
      return min + (Math.random() * (max - min));
}

// When a key is pressed, update the stored keyboard input information
// Set the onkeydown event listener to a function with the event as the only parameter
document.onkeydown = function (event) {
      // Check if the key pressed is w or the up arrow
      if (event.key == "w" || event.key == "ArrowUp") {
            data.input.keyboard.up = true;
      }
      // Check if the key pressed is s or the down arrow
      else if (event.key == "s" || event.key == "ArrowDown") {
            data.input.keyboard.down = true;
      }
      // Check if the key pressed is a or the left arrow
      else if (event.key == "a" || event.key == "ArrowLeft") {
            data.input.keyboard.left = true;
      }
      // Check if the key pressed is d or the right arrow
      else if (event.key == "d" || event.key == "ArrowRight") {
            data.input.keyboard.right = true;
      }
};

// When a key is released, update the stored keyboard input information
// Set the onkeyup event listener to a function with the event as the only parameter
document.onkeyup = function (event) {
      // Check if the key released is w or the up arrow
      if (event.key == "w" || event.key == "ArrowUp") {
            data.input.keyboard.up = false;
      }
      // Check if the key released is s or the down arrow
      else if (event.key == "s" || event.key == "ArrowDown") {
            data.input.keyboard.down = false;
      }
      // Check if the key released is a or the left arrow
      else if (event.key == "a" || event.key == "ArrowLeft") {
            data.input.keyboard.left = false;
      }
      // Check if the key released is d or the right arrow
      else if (event.key == "d" || event.key == "ArrowRight") {
            data.input.keyboard.right = false;
      }
};

// document.removeEventListener("mousemove", mouseMove, false);
// Detect the user's mouse moving and update the stored mouse position input data
function mouseMove(event) {
      // Update the mouse coordinates
      data.input.mouse.x = event.clientX;
      data.input.mouse.y = event.clientY;
};

// Create a mousemove event listener so that the mouseMove() function is called every time the mouse is moved
document.addEventListener("mousemove", mouseMove, false);

// Function that allows the player to shoot projectiles
function shoot() {
      // Add a new projectile to the projectiles array
      data.world.projectiles.push(
            // Projectile object
            {
                  // Separate strength and health?
                  "strength": random(2000, 2500),
                  "velocity": {
                        "x": (((data.input.mouse.x + data.settings.offset.x) / data.settings.zoom) - data.world.player.location.x) * random(10, 10),
                        "y": (((data.input.mouse.y + data.settings.offset.y) / data.settings.zoom) - data.world.player.location.y) * random(10, 10)
                  },
                  "location": {
                        "x": data.world.player.location.x,
                        "y": data.world.player.location.y
                  },
                  "getPoints": function() {
                        var x = this.location.x;
                        var y = this.location.y;
                        var points = [
                              {
                                    "x": x - 0.2,
                                    "y": y - 0.2,
                              },
                              {
                                    "x": x + 0.2,
                                    "y": y - 0.2
                              },
                              {
                                    "x": x + 0.2,
                                    "y": y + 0.2
                              },
                              {
                                    "x": x - 0.2,
                                    "y": y + 0.2
                              }
                        ];

                        return points;
                  }
            }
      );
}

// Create a mousedown event listener so that the shoot() function is called every time the mouse is pressed
document.addEventListener("mousedown", shoot, false);

// Generate 1000 random blocks
for (var i = 0; i < 1000; i ++) {
      // Add a new block to the world blocks array
      data.world.blocks.push(
            {
                  // New blocks have a strength value in between 10000 and 12500
                  "strength": random(10000, 12500),
                  // Location for new blocks is a 2D integer coordinate between 0 and 50
                  "location": {
                        "x": Math.round(random(0, 50)),
                        "y": Math.round(random(0, 50))
                  },
                  // Function to get coordinates of points for a block
                  "getPoints": function() {
                        // Get base coordinates of this block
                        var x = this.location.x;
                        var y = this.location.y;
                        // Create a new array to store the list of points
                        var points = [
                              // Upper left corner
                              {
                                    "x": x - 0.5,
                                    "y": y - 0.5,
                              },
                              // Upper right corner
                              {
                                    "x": x + 0.5,
                                    "y": y - 0.5
                              },
                              // Lower right corner
                              {
                                    "x": x + 0.5,
                                    "y": y + 0.5
                              },
                              // Lower left corner
                              {
                                    "x": x - 0.5,
                                    "y": y + 0.5
                              }
                        ];

                        // Return points array
                        return points;
                  }
            }
      );
}

function update() {
      // Set canvas dimensions to match window dimensions
      // Canvas width
      canvas.width = window.innerWidth;
      // Canvas height
      canvas.height = window.innerHeight;

      // Clear the screen
      // Set canvas fill style to white (the background color of the game)
      context.fillStyle = "rgba(255, 255, 255, 1)";
      // Fill the entire screen
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Camera follows player's movements so that player icon remains roughly in the center of the screen, similar to a side-scroller
      // Check if camera following player is enabled in the game settings
      if (data.settings.follow) {
            // Set camera offset to match the location of the player, scaled to the camera zoom level, with half of the canvas width and height subtracted so that the player remains in the center of the screen
            data.settings.offset.x = -(canvas.width / 2) + (data.world.player.location.x * data.settings.zoom);
            data.settings.offset.y = -(canvas.height / 2) + (data.world.player.location.y * data.settings.zoom);
      }

      // Update projectile motion information
      data.world.projectiles.forEach(
            (projectile) => {
                  // Change projectile location based on the projectile's velocity
                  projectile.location.x += projectile.velocity.x * 0.001;
                  projectile.location.y += projectile.velocity.y * 0.001;

                  // Slow projectile slightly due to friction
                  projectile.velocity.x *= random(0.999, 1);
                  projectile.velocity.y *= random(0.999, 1);
            }
      );

      for (var i = 0; i < data.world.projectiles.length; i ++) {
            projectile = data.world.projectiles[i];
            projectile.strength -= Math.random();

            // Check for collision between projectiles and blocks
            for (var j = 0; j < data.world.blocks.length; j ++) {
                  // Store current block in a variable to increase readability and compactness
                  var block = data.world.blocks[j];

                  var shapes = [
                        projectile.getPoints(),
                        block.getPoints()
                  ];
                  if (checkCollision(shapes)) {
                        var blockStrength = block.strength;
                        block.strength -= projectile.strength;
                        projectile.strength -= blockStrength;
                  }
            }

            // Check for collision between projectiles and other projectiles
            for (var j = 0; j < data.world.projectiles.length; j ++) {
                  // Only check for a collision if the projectiles being checked are not the same; otherwise, projectiles can collide with themselves as soon as they are created
                  if (i !== j) {
                        // Store current main projectile and projectile to check against in a small array
                        var projectiles = [
                              projectile,
                              data.world.projectiles[j]
                        ];

                        // Get points for both projectiles
                        var shapes = [
                              // Get points for first projectile
                              projectiles[0].getPoints(),
                              // Get points for second projectile
                              projectiles[1].getPoints()
                        ];

                        // Check for collision between projectiles
                        if (checkCollision(shapes)) {
                              // Temporarily store strength value of first projectile
                              var projectileStrength = projectiles[0].strength;
                              projectiles[0].strength -= projectiles[1].strength;
                              projectiles[1].strength -= projectileStrength;
                        }
                  }
            }

            // If strength of projectile is 0 or less after collisions with blocks, other projectiles, or players, remove it from the projectiles array to save memory
            if (projectile.strength <= 0) {
                  // Use array.prototype.splice() to remove the current projectile from the projectiles array
                  data.world.projectiles.splice(i, 1);
            }
      }

      // Render projectiles
      data.world.projectiles.forEach(
            (projectile) => {
                  // Create opacity value by downscaling maximum projectile strength value to a 0 - 1 opacity value range
                  opacity = projectile.strength / 2500;
                  if (opacity > 1) {
                        opacity = 1;
                  }
                  else if (opacity < 0) {
                        opacity = 0;
                  }

                  l = projectile.getPoints();
                  l.forEach(
                        (point) => {
                              point.x *= data.settings.zoom;
                              point.y *= data.settings.zoom;
                              point.x -= data.settings.offset.x;
                              point.y -= data.settings.offset.y;
                        }
                  );

                  context.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                  context.beginPath();
                  context.moveTo(l[0].x, l[0].y);
                  context.lineTo(l[1].x, l[1].y);
                  context.lineTo(l[2].x, l[2].y);
                  context.lineTo(l[3].x, l[3].y);
                  context.fill();
            }
      );

      for (var i = 0; i < data.world.blocks.length; i ++) {
            var block = data.world.blocks[i];

            // Reduce block strength by a random amount from 0 to 1
            block.strength -= random(0, 1);
            // If block strength is less than or equal to 0, remove it from the blocks array to save memory
            if (block.strength <= 0) {
                  // Use array.prototype.splice() to remove the current block from the blocks array
                  data.world.blocks.splice(i, 1);
            }
      }

      // Render blocks
      data.world.blocks.forEach(
            (block) => {
                  // Create opacity value by downscaling maximum block strength value to a 0 - 1 opacity value range
                  var opacity = block.strength / 12500;
                  if (opacity > 1) {
                        opacity = 1;
                  }
                  else if (opacity < 0) {
                        opacity = 0;
                  }

                  // Set canvas fill style with black color and opacity corresponding to the block's strength
                  context.fillStyle = "rgba(0, 0, 0, " + opacity + ")";
                  // Use fillRect() to render the block; we could fill a path, as we can use block.getPoints() to generate the points of the block, but fillRect() is most likely more efficient for simple shapes
                  context.fillRect(
                        (block.location.x * data.settings.zoom) - (data.settings.zoom / 2) - data.settings.offset.x,
                        (block.location.y * data.settings.zoom) - (data.settings.zoom / 2) - data.settings.offset.y,
                        data.settings.zoom,
                        data.settings.zoom
                  );
            }
      );

      // if (data.world.player.velocity.x > 0) {
      //       data.world.player.velocity.x -= 0.001;
      // }
      // else if (data.world.player.velocity.x < 0) {
      //       data.world.player.velocity.x = 0;
      // }
      // if (data.world.player.velocity.y > 0) {
      //       data.world.player.velocity.y -= 0.001;
      // }
      // else if (data.world.player.velocity.y < 0) {
      //       data.world.player.velocity.y = 0;
      // }

      if (data.input.keyboard.up) {
            data.world.player.velocity.y -= data.world.player.speed;
      }
      if (data.input.keyboard.down) {
            data.world.player.velocity.y += data.world.player.speed;
      }
      if (data.input.keyboard.left) {
            data.world.player.velocity.x -= data.world.player.speed;
      }
      if (data.input.keyboard.right) {
            data.world.player.velocity.x += data.world.player.speed;
      }

      data.world.player.location.x += data.world.player.velocity.x * 0.001;
      data.world.player.location.y += data.world.player.velocity.y * 0.001;

      data.world.player.velocity.x *= random(0.98, 1);
      data.world.player.velocity.y *= random(0.98, 1);

      var collide = false;
      for (var i = 0; i < data.world.blocks.length; i ++) {
            var shapes = [
                  data.world.player.getPoints(),
                  data.world.blocks[i].getPoints()
            ];
            if (checkCollision(shapes)) {
                  // data.world.player.location.x -= data.world.player.velocity.x * 0.001;
                  // data.world.player.location.y -= data.world.player.velocity.y * 0.001;
                  // data.world.player.velocity.x *= -1;
                  // data.world.player.velocity.y *= -1;
                  // data.world.player.velocity.x *= 1.1;
                  // data.world.player.velocity.y *= 1.1;
                  // data.world.player.velocity.x *= 0.1;
                  // data.world.player.velocity.y *= 0.1;
                  // var velxtemp = data.world.player.velocity.x;
                  // data.world.player.velocity.x = data.world.player.velocity.y;
                  // data.world.player.velocity.y = -velxtemp;

                  // var slope =
                  // (data.world.blocks[i].location.y - data.world.player.location.y) /
                  // (data.world.blocks[i].location.x - data.world.player.location.x);
                  // var inverse = -1 / slope;
                  //
                  // data.world.player.velocity.x *= inverse;
                  // data.world.player.velocity.y *= inverse;

                  // Add side-based collision detection

                  // data.world.player.location.x -= data.world.player.velocity.x * 0.001;
                  // data.world.player.location.y -= data.world.player.velocity.y * 0.001;

                  collide = true;
            }
      }
      // If player is colliding with a block, reduce the player's speed
      // Check for collision
      if (collide) {
            data.world.player.velocity.x *= data.world.player.speed * 0.95;
            data.world.player.velocity.y *= data.world.player.speed * 0.95;
      }

      // Increase world time by 1
      data.world.time ++;

      // Render player
      l = data.world.player.getPoints();
      // Not technically needed
      l.forEach(
            (point) => {
                  // point.x += data.world.player.location.x * data.settings.zoom;
                  // point.y += data.world.player.location.y * data.settings.zoom;
                  point.x *= data.settings.zoom;
                  point.y *= data.settings.zoom;
                  point.x -= data.settings.offset.x;
                  point.y -= data.settings.offset.y;
            }
      );

      context.fillStyle = "rgba(150, 150, 150, 1)";
      context.beginPath();
      context.moveTo(l[0].x, l[0].y);
      context.lineTo(l[1].x, l[1].y);
      context.lineTo(l[2].x, l[2].y);
      context.lineTo(l[3].x, l[3].y);
      context.fill();

      var weight = (Math.sin(data.world.time / 25) + 10) / 100;
      var x = (((data.world.player.location.x * data.settings.zoom) - data.settings.offset.x) * (1 - weight)) + (data.input.mouse.x * weight);
      var y = (((data.world.player.location.y * data.settings.zoom) - data.settings.offset.y) * (1 - weight)) + (data.input.mouse.y * weight);
      // var size = (Math.sin(data.world.time / 10) + 5) * 2;
      var size = 10;

      context.fillStyle = "rgba(0, 0, 0, " + (Math.sin(data.world.time / 25) + 1) + ")";
      context.save();
      context.translate(x, y);
      context.rotate(data.world.time / 25);
      context.fillRect(-(size / 2), -(size / 2), size, size);
      context.restore();
}

// Update game on a 10-milisecond interval
window.setInterval(update, 10);
