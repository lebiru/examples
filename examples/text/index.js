import * as me from 'https://cdn.jsdelivr.net/npm/melonjs@10/dist/melonjs.module.min.js';

// the font test renderables object
class FontTest extends me.Renderable {

    constructor() {
        super(0, 0, me.video.renderer.getWidth(), me.video.renderer.getHeight());

        this.anchorPoint.set(0, 0);

        // a default white color object
        this.color = me.pool.pull("me.Color", 255, 255, 255);

        // define a tween to cycle the font color
        this.tween = new me.Tween(this.color)
            .to({
                g : 0,
                b : 0
            }, 2000)
            .repeat( Infinity )
            .yoyo(true)
            .start();

        // text font
        this.font = new me.Text(0, 0, {font: "Arial", size: 8, fillStyle: this.color});

        // bitmap font
        this.bFont = new me.BitmapText(0, 0, {font: "xolo12"});
        this.fancyBFont = new me.BitmapText(0, 0, {font: "arialfancy"});
    }

    // draw function
    draw(renderer) {
        var i = 0;
        var text = "";
        var baseline = 0;
        var xPos = 0;
        var yPos = 0;

        // black background
        renderer.clearColor("#202020");

        // font size test
        this.font.textAlign = "left";
        this.font.lineWidth = "2";
        this.font.setOpacity (0.5);
        for (i = 8; i < 48; i += 8) {
            this.font.setFont("Arial", i, this.color);
            this.font.draw(renderer, "Arial Text " + i + "px !" , 5 , yPos );
            yPos += this.font.measureText(renderer, "DUMMY").height;
        }
        // one more with drawStroke this time
        this.font.setFont("Arial", 48, this.color);
        this.font.strokeStyle.parseCSS("red");
        this.font.lineWidth = 3;
        this.font.draw(renderer, "Arial Text " + i + "px !" , 5 , yPos );
        this.font.lineWidth = 1;
        this.font.drawStroke(renderer, "Arial Text " + i + "px !" , 5 , yPos );

        // bFont size test
        yPos = 0;
        this.bFont.textAlign = "right";
        this.bFont.fillStyle.parseCSS("indigo");
        for (i = 1; i < 5; i++) {
            //this.bFont.setOpacity (0.1 * i);
            this.bFont.resize(i * 0.75);
            this.bFont.fillStyle.lighten(0.25);
            // call preDraw and postDraw for the tint to work
            // as the font is not added to the game world
            this.bFont.preDraw(renderer);
            this.bFont.draw(renderer, "BITMAP TEST", me.video.renderer.getWidth(), yPos );
            this.bFont.postDraw(renderer);
            yPos += this.bFont.measureText("DUMMY").height;
        }

        this.font.setOpacity(1);
        this.bFont.setOpacity(1);

        // font baseline test
        this.font.setFont("Arial", 16, "white");
        baseline = 200;

        // Draw the baseline
        me.video.renderer.setColor("red");
        me.video.renderer.setLineWidth(3);
        me.video.renderer.strokeLine(
            0, baseline + 0.5,
            me.video.renderer.getWidth(), baseline + 0.5
        );

        var baselines = [
            "bottom", "ideographic", "alphabetic", "middle", "hanging", "top"
        ];

        // font baseline test
        me.video.renderer.setColor("white");
        for (i = 0; i < baselines.length; i++) {
            text = baselines[i];
            this.font.textBaseline = baselines[i];
            this.font.draw(renderer, text, xPos, baseline);
            xPos += this.font.measureText(renderer, text + "@@@").width;
        }

        // restore default baseline
        this.font.textBaseline = "top";

        // ---- multiline testing -----

        // font text
        text = "this is a multiline font\n test with melonjs and it\nworks even with a\n specific lineHeight value!";
        this.font.textAlign = "center";
        this.font.lineHeight = 1.1;
        this.font.draw(renderer, text, 90, 210);


        text = "this is another web font \nwith right alignment\nand it still works!";
        this.font.textAlign = "right";
        this.font.lineHeight = 1.1;
        this.font.draw(renderer, text, 200, 300);

        // bitmapfonts
        // bFont  test
        this.fancyBFont.textAlign = "right";
        text = ["ANOTHER FANCY MULTILINE", "BITMAP TEXT USING AN ARRAY", "AND IT STILL WORKS"];
        this.fancyBFont.lineHeight = 1.2;
        this.fancyBFont.resize(1.5);
        this.fancyBFont.draw(renderer, text, 640, 230);
        this.fancyBFont.lineHeight = 1.0;

        this.bFont.textAlign = "center";
        text = "THIS IS A MULTILINE\n BITMAP TEXT WITH MELONJS\nAND IT WORKS";
        this.bFont.resize(2.5);
        this.bFont.draw(renderer, text,  me.video.renderer.getWidth() / 2, 400);

        // baseline test with bitmap font
        var xPos = 0;
        this.fancyBFont.textAlign = "left";
        var baseline = 375;

        // Draw the baseline
        me.video.renderer.setColor("red");
        me.video.renderer.strokeLine(
            0, baseline + 0.5,
            me.video.renderer.getWidth(), baseline + 0.5
        );

        // font baseline test
        me.video.renderer.setColor("white");
        this.fancyBFont.resize(1.275);
        for (var i = 0; i < baselines.length; i++) {
            text = baselines[i];
            this.fancyBFont.textBaseline = baselines[i];
            this.fancyBFont.draw(renderer, text, xPos, baseline);
            xPos += this.fancyBFont.measureText(text+"@").width;
        }


        // restore default alignement/baseline
        this.font.textAlign = "left";
        this.font.textBaseline = "top";
        this.bFont.textAlign = "left";
        this.bFont.textBaseline = "top";
        this.fancyBFont.textAlign = "left";
        this.fancyBFont.textBaseline = "top";
    }
};

/**
 * Initialize the application
 */
export default function onload() {

    // Initialize the video.
    if (!me.video.init(640, 480, {parent : "screen", scale : "auto", renderer: me.video.CANVAS, preferWebGL1 : false})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // set all ressources to be loaded
    me.loader.preload([
        { name: "xolo12", type:"image", src: "xolo12.png"},
        { name: "xolo12", type:"binary", src: "xolo12.fnt"},
        { name: "arialfancy", type:"image", src: "arialfancy.png"},
        { name: "arialfancy", type:"binary", src: "arialfancy.fnt"}],
        function () {
            me.game.world.reset();
            me.game.world.addChild(new FontTest(), 1);
        }
    );
};