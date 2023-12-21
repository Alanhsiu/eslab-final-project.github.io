import { useEffect, useState, useRef } from "react";
import $ from "jquery";

// ! Simulation for only one basket
export default function Simulation({
  acceleration,
  isStatic,
  setBucket,
  setFloor,
  mode,
}) {
  useEffect(() => {
    var radius = mode === "medium" ? 0.23 : mode === "easy" ? 0.4 : 0.16;

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

          var heightadjust = -3;

          // * Generate basketball court
          var court = box({
            pos: vec(0, heightadjust, 0),
            size: vec(7.5, 0.1, 7),
            color: color.white,
          });
          var center = (1)["-u"]()["*"](court.size.z)["/"](2);

          // * Generate basketball hoop and backboar
          var backboard = box({
            pos: vec(0, 3.5 + heightadjust, center + 1.2),
            size: vec(1.8, 1.2, 0.1),
            color: color.cyan,
          });

          var hoop = ring({
            pos: vec(0, 3.05 + heightadjust, backboard.pos.z + 0.23),
            axis: vec(0, 0.01, 0),
            radius: radius,
            thickness: 0.03,
            color: color.red,
          });
          hoop.pos.z += hoop.radius;

          //  * Generate paint area
          var paint1 = box({
            pos: vec(4.9 / 2 - 0.05, heightadjust, center + 5.8 / 2),
            size: vec(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint2 = box({
            pos: vec(-4.9 / 2 + 0.05, heightadjust, center + 5.8 / 2),
            size: vec(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint3 = box({
            pos: vec(0, heightadjust, 5.8 / 2 - 0.05 + center + 5.8 / 2),
            size: vec(4.9, 0.1, 0.1),
            color: color.red,
            opacity: 1,
          });

          // * Generate rod and pillar
          var rod = cylinder({
            pos: vec(0, 3.05 + heightadjust, backboard.pos.z + 0.05),
            axis: vec(0, 0, 0.18),
            radius: 0.03,
            color: color.red,
            opacity: 1,
          });
          var pillar = cylinder({
            pos: vec(0, heightadjust, backboard.pos.z - 0.2),
            axis: vec(0, 3.3, 0),
            radius: 0.2,
            color: color.cyan,
          });

          var basketball = sphere({
            pos: vec(0, 2.1 + heightadjust, 2.9 - 0.12),
            radius: 0.12,
            color: color.orange,
            make_trail: false,
          });
          basketball.mass = 0.62;
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
          scene.background = color.gray(0.1);
          scene.width = 800;
          scene.height = 700;

          // This is written in "callback" or "event-driven" style, in which the
          // function "move" is specified to be "called back" about 200 times per second.

          var heightadjust = -3;

          // * Generate basketball court
          var court = box({
            pos: vec(0, heightadjust, 0),
            size: vec(7.5, 0.1, 7),
            color: color.white,
          });
          var center = (1)["-u"]()["*"](court.size.z)["/"](2);

          // * Generate basketball hoop and backboar
          var backboard = box({
            pos: vec(0, 3.5 + heightadjust, center + 1.2),
            size: vec(1.8, 1.2, 0.1),
            color: color.white,
          });

          var hoop = ring({
            pos: vec(0, 3.05 + heightadjust, backboard.pos.z + 0.23),
            axis: vec(0, 0.01, 0),
            radius: radius,
            thickness: 0.03,
            color: color.red,
          });
          hoop.pos.z += hoop.radius;

          //  * Generate paint area
          var paint1 = box({
            pos: vec(4.9 / 2 - 0.05, heightadjust, center + 5.8 / 2),
            size: vec(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint2 = box({
            pos: vec(-4.9 / 2 + 0.05, heightadjust, center + 5.8 / 2),
            size: vec(0.1, 0.1, 5.8),
            color: color.red,
            opacity: 1,
          });
          var paint3 = box({
            pos: vec(0, heightadjust, 5.8 / 2 - 0.05 + center + 5.8 / 2),
            size: vec(4.9, 0.1, 0.1),
            color: color.red,
            opacity: 1,
          });

          // * Generate rod and pillar
          var rod = cylinder({
            pos: vec(0, 3.05 + heightadjust, backboard.pos.z + 0.05),
            axis: vec(0, 0, 0.18),
            radius: 0.03,
            color: color.red,
            opacity: 1,
          });
          var pillar = cylinder({
            pos: vec(0, heightadjust, backboard.pos.z - 0.2),
            axis: vec(0, 3.3, 0),
            radius: 0.2,
            color: color.cyan,
          });

          var basketball = sphere({
            pos: vec(0, 2.1 + heightadjust, 2.9 - 0.12),
            radius: 0.12,
            color: color.orange,
            make_trail: false,
          });
          basketball.mass = 0.62;
          basketball.velocity = vec(0, 7, -3);
          console.log(acceleration);
          var acc = vec(
            acceleration[1] * 0.001,
            acceleration[2] * -0.001,
            acceleration[0] * 0.001
          );
          basketball.velocity = basketball.velocity["+"](acc);
          var g = vec(0, -9.8, 0);

          var C_d = 0.53;
          var rho = 1.293;
          var S = basketball.radius ** 2 * pi;
          var k = 0.5 * C_d * rho * S;
          var dt = 0.001;
          var maxheight = 0;
          var maxtime = 100;
          var count = 0;
          var time = 0;
          var ptrHoopToBall, ringOfHoop, ringToBall, nBounce;

          while (true) {
            await rate(1 / dt); // execute the move function about 200 times per second
            time += dt;
            if (time > maxtime) {
              time = 0;
              basketball.pos = vec(0, 2.1 + heightadjust, 2.9 - 0.12);
              return;
            }

            ptrHoopToBall = vec(basketball.pos.x, 0, basketball.pos.z)["-"](
              vec(hoop.pos.x, 0, hoop.pos.z)
            );
            ptrHoopToBall = ptrHoopToBall["/"](
              Math.sqrt(
                ptrHoopToBall.x ** 2 +
                  ptrHoopToBall.z ** 2 +
                  ptrHoopToBall.y ** 2
              )
            )["*"](hoop.radius);

            ringOfHoop = hoop.pos["+"](ptrHoopToBall);
            ringToBall = basketball.pos["-"](ringOfHoop);
            nBounce = ringToBall["/"](
              Math.sqrt(
                ringToBall.x ** 2 + ringToBall.z ** 2 + ringToBall.y ** 2
              )
            );

            // * Check "out of bound"
            // if (
            //   basketball.pos.x > 3.75 ||
            //   basketball.pos.x < -3.75 ||
            //   basketball.pos.z > 3.5 ||
            //   basketball.pos.z < -3.5 + basketball.radius
            // ) {
            //   time = 0;
            //   basketball.pos = vec(0, 1.9 + heightadjust, 2.9 - 0.12);
            //   return;
            // }
            // * Start to check if the ball is bounced into the hoop

            if (
              Math.sqrt(
                ringToBall.x ** 2 + ringToBall.z ** 2 + ringToBall.y ** 2
              ) <=
              hoop.thickness + basketball.radius
            ) {
              basketball.velocity = basketball.velocity["+"](nBounce["*"](0.2));
            }
            var a = vec(basketball.pos.x, 0, basketball.pos.z)["-"](
              vec(hoop.pos.x, 0, hoop.pos.z)
            );
            // * Check if the ball pass through the hoop
            if (
              basketball.pos.y <= hoop.pos.y + 0.1 &&
              basketball.pos.y >= hoop.pos.y - 0.1 &&
              Math.sqrt(a.x ** 2 + a.z ** 2 + a.y ** 2) <=
                hoop.radius - basketball.radius - hoop.thickness &&
              basketball.velocity.y <= 0
            ) {
              // TODO: set busket to true

              console.log("successful");
              setBucket(true);
            }

            if (basketball.pos.y > maxheight) {
              maxheight = basketball.pos.y;
            }
            basketball.velocity = basketball.velocity["+"](g["*"](dt));

            // *If the ball is bumped into the ground, bounce
            if (
              basketball.pos.y < basketball.radius + heightadjust &&
              basketball.velocity.y < 0
            ) {
              basketball.velocity.y *= -0.5;
              if (count == 0) {
                console.log("floor");
                setFloor(true);
              }
              count++;
            }

            // * If the ball is bumped into the backboard, bounce
            if (
              basketball.pos.z <= backboard.pos.z + 0.05 + basketball.radius &&
              basketball.pos.z >= backboard.pos.z - 0.05 - basketball.radius &&
              basketball.pos.y <= backboard.pos.y + backboard.size.y / 2 &&
              basketball.pos.y >= backboard.pos.y - backboard.size.y / 2 &&
              basketball.velocity.z < 0
            ) {
              basketball.velocity.z *= -0.3;
              basketball.velocity.y *= 0.3;
            }

            basketball.pos.x = basketball.pos.x + basketball.velocity.x * dt;
            basketball.pos.y = basketball.pos.y + basketball.velocity.y * dt;
            basketball.pos.z = basketball.pos.z + basketball.velocity.z * dt;
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
