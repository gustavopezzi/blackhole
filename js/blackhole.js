$(document).ready(function() {
    window.onload = function() {
        var C = document.getElementById("canv");
        var ctx = C.getContext("2d");

        var num = 2000;
        var eventHorizonRadius = 50;
        var meals = 0;
        var holeRadius = (C.width + C.height) / 30;

        var R = [];
        var star = function(x, y, w, color, angle, orbitRadius, angularSpeed) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.color = color;
            this.angle = angle;
            this.orbitRadius = orbitRadius;
            this.angularSpeed = angularSpeed;
        };

        function init() {
            for (var i = 0; i < num; i++) {
                var x = C.width / 2;
                var y = C.height / 2;
                var w = Math.random() * 1.5;
                var color = "rgba(255, 255, 255, " + w / 1.5 + ")";
                var angle = Math.random() * (2 * Math.PI);
                var orbitRadius = (Math.random() * (C.width + C.height)) / 3 + eventHorizonRadius;
                var angularSpeed = (2 / 10) * Math.random() * (Math.PI / orbitRadius);
                
                R.push(new star(x, y, w, color, angle, orbitRadius, angularSpeed));
            }
        }

        function setCanvasSize() {
            C.width = window.innerWidth;
            C.height = window.innerHeight;
        }

        function setBG() {
            ctx.fillStyle = "rgb(20,25,30)";
            ctx.fillRect(0, 0, C.width, C.height);
        }

        function drawCenter() {
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.shadowColor = "rgb(255, 255, 255)";
            ctx.shadowBlur = holeRadius / 2;
            ctx.beginPath();
            ctx.arc(C.width / 2, C.height / 2, holeRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.shadowColor = "none";
            ctx.shadowBlur = 0;

            if (holeRadius <= (C.width + C.height) / 6) {
                holeRadius += 0.01;
            }
        }

        function goBack(star) {
            star.x = 10 * Math.random() * C.width;
            star.y = 10 * Math.random() * C.height;
            star.w = Math.random() * 1.5;
            star.angle = Math.random() * (2 * Math.PI);
            star.orbitRadius = (Math.random() * (C.width + C.height)) / 3 + eventHorizonRadius;
            star.angularSpeed = (2 / 10) * Math.random() * (Math.PI / star.orbitRadius);
        }

        function moveStar(star) {
            star.x = C.width / 2 + Math.cos(star.angle) * star.orbitRadius;
            star.y = C.height / 2 + Math.sin(star.angle) * star.orbitRadius;
            star.angle += star.angularSpeed;

            if (star.orbitRadius >= holeRadius) {
                star.orbitRadius -= (star.w * holeRadius) / star.orbitRadius;
            }
            else {
                goBack(star);
                meals++;
            }
        }

        function isVisible(star) {
            if (star.x > C.width || star.x + star.w < 0 || star.y > C.height || star.y + star.w < 0)
                return false;
            return true;
        }

        function drawStar(star) {
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.fillRect(star.x, star.y, star.w, star.w);
            ctx.closePath();
            ctx.fill();
        }

        function loop() {
            setBG();
            var star;

            for (var i = 0; i < R.length; i++) {
                star = R[i];         

                if (isVisible(star))
                    drawStar(star);
               
                moveStar(star);
            }
            
            drawCenter();
            requestAnimFrame(loop);
        }

        window.addEventListener("resize", function() {
            setCanvasSize();
            setBG();
        });

        setCanvasSize();
        setBG();
        init();
        loop();
    }

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
});