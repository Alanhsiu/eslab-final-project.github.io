import { useEffect, useState, useRef } from "react";
import $ from "jquery";

// ! Simulation for only one basket
export default function Simulation({
  velocity,
  isStatic,
  setBucket,
  setFloor,
}) {
  useEffect(() => {
    if (isStatic) {
      (function () {
        async function __main__() {
          ("use strict");
          var version = ["3.2", "glowscript"];
          Array.prototype.toString = function () {
            return __parsearray(this);
          };
          var scene = canvas();
          scene.background = color.white;
          scene.width = 800;
          scene.height = 700;

          // This is written in "callback" or "event-driven" style, in which the
          // function "move" is specified to be "called back" about 200 times per second.

          var decay = 0.7;
          var heightadjust = -3;
          var court_length = 7;
          var center = (1)["-u"]()["*"](court_length)["/"](2);
          var g = vector(0, -9.8, 0);

          var court = box({
            pos: vec(0, heightadjust, 0),
            size: vec(7.5, 0.1, court_length),
            color: color.white,
          });
          var backboard = box({
            pos: vector(0, 3.5 + heightadjust, center + 1.2),
            size: vector(1.8, 1.2, 0.1),
            color: color.white,
          });
          var hoop = ring({
            pos: vector(0, 3.05 + heightadjust, backboard.pos.z + 0.45),
            axis: vector(0, 0.01, 0),
            radius: 0.23,
            thickness: 0.03,
            color: color.red,
          });

          var paint1 = box({
            pos: vector(4.9 / 2 - 0.05, heightadjust, center + 5.8 / 2),
            size: vector(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint2 = box({
            pos: vector(-4.9 / 2 + 0.05, heightadjust, center + 5.8 / 2),
            size: vector(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint3 = box({
            pos: vector(0, heightadjust, 5.8 / 2 - 0.05 + center + 5.8 / 2),
            size: vector(4.9, 0.1, 0.1),
            color: color.red,
            opacity: 1,
          });
          var rod = cylinder({
            pos: vector(0, 3.05 + heightadjust, backboard.pos.z + 0.05),
            axis: vector(0, 0, 0.18),
            radius: 0.03,
            color: color.red,
            opacity: 1,
          });
          var pillar = cylinder({
            pos: vector(0, heightadjust, backboard.pos.z - 0.2),
            axis: vector(0, 3.3, 0),
            radius: 0.2,
            color: color.cyan,
          });

          var basketball = sphere({
            pos: vector(0, 1.9 + heightadjust, 2.9 - 0.12),
            radius: 0.12,
            color: color.orange,
            trail_color: color.white,
          });
          basketball.mass = 0.62;
          basketball.velocity = vector(velocity[0], velocity[1], velocity[2]);

          var C_d = 0.5;
          var rho = 1.293;
          var S = basketball.radius ** 2 * pi;
          var k = 0.5 * C_d * rho * S;
          var dt = 0.001;
          var run = true;
        }
        $(function () {
          window.__context = {
            glowscript_container: $("#glowscript").removeAttr("id"),
          };
          __main__();
        });
      })();
    } else {
      (function () {
        async function __main__() {
          ("use strict");
          var version = ["3.2", "glowscript"];
          Array.prototype.toString = function () {
            return __parsearray(this);
          };
          var scene = canvas();
          scene.background = color.white;
          scene.width = 800;
          scene.height = 700;

          // This is written in "callback" or "event-driven" style, in which the
          // function "move" is specified to be "called back" about 200 times per second.

          var decay = 0.7;
          var heightadjust = -3;
          var court_length = 7;
          var center = (1)["-u"]()["*"](court_length)["/"](2);
          var g = vector(0, -9.8, 0);

          var court = box({
            pos: vec(0, heightadjust, 0),
            size: vec(7.5, 0.1, court_length),
            color: color.white,
          });
          var backboard = box({
            pos: vector(0, 3.5 + heightadjust, center + 1.2),
            size: vector(1.8, 1.2, 0.1),
            color: color.white,
          });
          var hoop = ring({
            pos: vector(0, 3.05 + heightadjust, backboard.pos.z + 0.45),
            axis: vector(0, 0.01, 0),
            radius: 0.23,
            thickness: 0.03,
            color: color.red,
          });

          var paint1 = box({
            pos: vector(4.9 / 2 - 0.05, heightadjust, center + 5.8 / 2),
            size: vector(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint2 = box({
            pos: vector(-4.9 / 2 + 0.05, heightadjust, center + 5.8 / 2),
            size: vector(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint3 = box({
            pos: vector(0, heightadjust, 5.8 / 2 - 0.05 + center + 5.8 / 2),
            size: vector(4.9, 0.1, 0.1),
            color: color.red,
            opacity: 1,
          });
          var rod = cylinder({
            pos: vector(0, 3.05 + heightadjust, backboard.pos.z + 0.05),
            axis: vector(0, 0, 0.18),
            radius: 0.03,
            color: color.red,
            opacity: 1,
          });
          var pillar = cylinder({
            pos: vector(0, heightadjust, backboard.pos.z - 0.2),
            axis: vector(0, 3.3, 0),
            radius: 0.2,
            color: color.cyan,
          });

          var basketball = sphere({
            pos: vector(0, 1.9 + heightadjust, 2.9 - 0.12),
            radius: 0.12,
            color: color.orange,
            trail_color: color.white,
          });
          basketball.mass = 0.62;
          basketball.velocity = vector(velocity[0], velocity[1], velocity[2]);

          var C_d = 0.5;
          var rho = 1.293;
          var S = basketball.radius ** 2 * pi;
          var k = 0.5 * C_d * rho * S;
          var dt = 0.001;
          var run = true;

          scene.bind("click", (ev) => {
            run = false;
            console.log(ev.event, ev.which, ev.canvas.wrapper);
          });
          var count = 0;
          while (run) {
            await rate(1000); // execute the move function about 200 times per second
            basketball.pos.x = basketball.pos.x["+"](
              basketball.velocity.x["*"](dt)
            );
            basketball.pos.y = basketball.pos.y["+"](
              basketball.velocity.y["*"](dt)
            );
            basketball.pos.z = basketball.pos.z["+"](
              basketball.velocity.z["*"](dt)
            );
            // if (
            //   basketball.pos.y <= hoop.pos.y &&
            //   Math.abs(basketball.pos - hoop.pos) <=
            //     hoop.radius - basketball.radius
            // ) {
            //   console.log("in");
            //   break;
            // }
            if (
              basketball.pos.y < basketball.radius + heightadjust &&
              basketball.velocity.y < 0
            ) {
              basketball.velocity.y = (1)["-u"]()["*"](basketball.velocity.y);
              basketball.velocity = basketball.velocity["*"](decay);
              if (count == 0) {
                setFloor(true);
              }
              count++;
            }
            if (
              basketball.pos.z <=
                backboard.pos.z + 0.05 + basketball.radius + 0.05 &&
              basketball.pos.y <= backboard.pos.y + backboard.size.y / 2 &&
              basketball.pos.y >= backboard.pos.y - backboard.size.y / 2 &&
              basketball.velocity.z < 0
            ) {
              basketball.velocity.z = (1)["-u"]()["*"](basketball.velocity.z);

              basketball.velocity = basketball.velocity["*"](decay);
            }
            basketball.velocity = basketball.velocity["+"](g["*"](dt));
          }
        }
        $(function () {
          window.__context = {
            glowscript_container: $("#glowscript").removeAttr("id"),
          };
          __main__();
        });
      })();
    }
    // END JAVASCRIPT
  }, []); // Empty dependency array to run the effect only once on mount

  return <div id="glowscript" className=" glowscript"></div>;
}
