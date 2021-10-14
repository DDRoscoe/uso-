title = "uso!";

description = 
`
Click the circles,

   to the beat!
`;

const G = {
	WIDTH: 150,
	HEIGHT: 150,
};


options = {
	viewSize: { x: G.WIDTH, y: G.HEIGHT },
	isPlayingBgm: true,
	isReplayEnabled: true,
	seed: 42069,  // XD!!
	theme: "dark"
};


/**
 * @typedef {{
 * pos: Vector, radius: number, thickness: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;


/**
 * @type {{
 * pos: Vector, radius: number, thickness: number
 * }}
 */
 let circles;


 /**
 * @type {{
 * pos: Vector, radius: number, thickness: number
 * }}
 */
 let approachCircles;


/**
 * @type {{
 * pos: Vector, length: number, thickness: number, rotate: number
 * }}
 */
let healthBar;


/**
 * @type { number }
 */
let combo;
let posX;
let posY;
let circleNum;
let approachTicks;
let timingWindow;

let str;		// for circle nums

let hit;	// for hit boolean


function update() {
	if (!ticks) {
		timingWindow = ticks%60 == 0;
		player = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
			radius: 5,
			thickness: 1
		};
		circles = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5), 
			radius: 10, 
			thickness: 6, 
		};
		approachCircles = {
			pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5), 
			radius: 30,
			thickness: 2
		};
		healthBar = {
			pos: vec(G.WIDTH/2, 10),
			length: 100,
			thickness: 5,
			rotate: 0
		}
		circleNum = 0;
	}

	if (circleNum == 4)			// reset circle num at 4
		circleNum = 0;

	if (ticks%60 == 0) {		// spawn a new circle every second
		circleNum++;
		str = circleNum.toString();
		posX = rnd(25, G.WIDTH - 25);
		posY = rnd(30, G.HEIGHT - 30);
	}

	text(str, posX, posY);

	color("green")
	bar(healthBar.pos, healthBar.length, healthBar.thickness, healthBar.rotate);		// health bar

	color("black");
	arc(posX, posY, approachCircles.radius, approachCircles.thickness);		// approach circle
	color("yellow");
	arc(posX, posY, circles.radius, circles.thickness);			// normal circle

	approachCircles.radius -= 0.5		// shrink approach circle, reset if radius = 0
	if (approachCircles.radius == 0)
		approachCircles.radius = 30;

	// hit boolean: if the cursor is colliding with the hit circle and the approach circle is colliding with the hit circle, hit = true
	hit = arc(player.pos, player.radius, player.thickness).isColliding.rect["yellow"] && arc(posX, posY, circles.radius, circles.thickness).isColliding.rect["black"] && input.isJustPressed;

	if (hit) {
		play("hit");		// on successful hit, play sound and shoot particles
		color("black");
		particle(
			player.pos.x,
			player.pos.y,
			50,
			10
		);
		
		if (healthBar.length < 100) {		// add to health
			if (healthBar.length > 80)		// if the bar is greater than 80, add health only to max 100 HP
				healthBar.length += 100 - healthBar.length;
			else
				healthBar.length += 20		// otherwise add +20 HP
		}

		addScore(300);			// add 300 to score
	}

	healthBar.length -= 0.25;		// health drain
	
	if (healthBar.length < 0) {			// if the health bar length = 0, game over
		end();
	}
	
	player.pos = vec(input.pos.x, input.pos.y);		// mouse input control
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);		// limits character to canvas boundaries
	color(input.isPressed ? "purple" : "cyan");
	arc(player.pos, player.radius, player.thickness);

	if (input.isPressed) {			// extra cursor decor
		color("yellow");
		particle(
			player.pos.x,
			player.pos.y,
			3,
			2,
		);
	}
}
