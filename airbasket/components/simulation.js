import { useEffect, useState, useRef } from "react";
import $ from "jquery";

// ! Simulation for only one basket
export default function Simulation({
  acceleration,
  isStatic,
  setBucket,
  setFloor,
  mode,
  level,
}) {
  useEffect(() => {
    var radius = mode === "medium" ? 0.4 : mode === "easy" ? 0.6 : 0.16;

    if (isStatic) {
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

          var heightadjust = -3;
          // This is written in "callback" or "event-driven" style, in which the
          // function "move" is specified to be "called back" about 200 times per second.

          // * Generate basketball court
          var court = box({
            pos: vec(0, heightadjust, 0),
            size: vec(15, 0.1, 14),
            color: color.white,
          });
          var z_boarder = -court.size.z / 2;
          var boardheight = 3.5;
          var hoopheight = 3.05;
          var d_fromboard = 0.23;
          var boardposition = 1.2;

          // * Generate basketball hoop and backboar
          var backboard = box({
            pos: vec(0, boardheight + heightadjust, z_boarder + boardposition),
            size: vec(1.8, 1.2, 0.1),
            color: color.white,
          });

          var hoop = ring({
            pos: vec(
              0,
              hoopheight + heightadjust,
              backboard.pos.z + d_fromboard
            ),
            axis: vec(0, 0.01, 0),
            radius: radius,
            thickness: 0.03,
            color: color.red,
          });
          hoop.pos.z += hoop.radius;

          // * Generate rod and pillar
          var rod = cylinder({
            pos: vec(
              0,
              hoopheight + heightadjust,
              backboard.pos.z + backboard.size.z / 2
            ),
            axis: vec(0, 0, 0.18),
            radius: 0.03,
            color: color.red,
            opacity: 1,
          });
          var pillar = cylinder({
            pos: vec(0, heightadjust, backboard.pos.z),
            axis: vec(0, 3.3, 0),
            radius: 0.2,
            color: color.cyan,
          });
          pillar.pos.z -= pillar.radius + backboard.size.z / 2;

          //  * Generate paint area
          var boardthickness = backboard.size.z / 2;
          var paintlength = 5.8;
          var paintwidth = 4.57;
          var paintleft = box({
            pos: vec(
              paintwidth / 2,
              heightadjust,
              z_boarder + paintlength / 2 + boardposition / 2
            ),
            size: vec(0.1, 0.1, paintlength + boardposition),
            color: color.red,
            opacity: 1,
          });
          var paintright = box({
            pos: vec(
              -paintwidth / 2,
              heightadjust,
              z_boarder + paintlength / 2 + boardposition / 2
            ),
            size: vec(0.1, 0.1, paintlength + boardposition),
            color: color.red,
            opacity: 1,
          });
          var freethrowline = box({
            pos: vec(0, heightadjust, paintlength + z_boarder + boardposition),
            size: vec(paintwidth, 0.1, 0.1),
            color: color.red,
            opacity: 1,
          });

          //  繪製三分線
          // var three_point_line = curve({ color: color.red, radius: 0.08 });
          // for (const x of Array(180).keys()) {
          //   // 繪製半圓形的三分線
          //   var x = 7.24 * cos(radians(angle));
          //   var y = heightadjust;
          //   var z = 7.24 * sin(radians(angle)) + hoop.pos.z;
          //   three_point_line.push(vec(x, y, z));
          // }

          // define the distance between the ball and the hoop
          var dist_2_point = z_boarder + paintlength + boardposition;

          // 三分線的距離
          var dist_3_point = 7.5 + hoop.pos.z;
          var shootheight = 1.9;
          var ball_radius = 0.12;
          var basketball_pos =
            level === 0
              ? vec(0, shootheight + heightadjust, dist_2_point - ball_radius)
              : vec(0, shootheight + heightadjust, dist_3_point - ball_radius);
          var basketball_v = level === 0 ? vec(0, 8, -3) : vec(0, 9, -4);

          var basketball = sphere({
            pos: basketball_pos,
            radius: ball_radius,
            color: color.orange,
            make_trail: false,
          });
          basketball.velocity = basketball_v;
          var acc = vec(
            acceleration[1] * 0.0005,
            acceleration[2] * -0.0005,
            acceleration[0] * 0.0005
          );
          basketball.velocity = basketball.velocity["+"](acc);
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

          var heightadjust = -3;
          // This is written in "callback" or "event-driven" style, in which the
          // function "move" is specified to be "called back" about 200 times per second.

          // * Generate basketball court
          var court = box({
            pos: vec(0, heightadjust, 0),
            size: vec(15, 0.1, 14),
            color: color.white,
          });
          var z_boarder = -court.size.z / 2;
          var boardheight = 3.5;
          var hoopheight = 3.05;
          var d_fromboard = 0.23;
          var boardposition = 1.2;

          // * Generate basketball hoop and backboar
          var backboard = box({
            pos: vec(0, boardheight + heightadjust, z_boarder + boardposition),
            size: vec(1.8, 1.2, 0.1),
            color: color.white,
          });

          var hoop = ring({
            pos: vec(
              0,
              hoopheight + heightadjust,
              backboard.pos.z + d_fromboard
            ),
            axis: vec(0, 0.01, 0),
            radius: radius,
            thickness: 0.03,
            color: color.red,
          });
          hoop.pos.z += hoop.radius;

          // * Generate rod and pillar
          var rod = cylinder({
            pos: vec(
              0,
              hoopheight + heightadjust,
              backboard.pos.z + backboard.size.z / 2
            ),
            axis: vec(0, 0, 0.18),
            radius: 0.03,
            color: color.red,
            opacity: 1,
          });
          var pillar = cylinder({
            pos: vec(0, heightadjust, backboard.pos.z),
            axis: vec(0, 3.3, 0),
            radius: 0.2,
            color: color.cyan,
          });
          pillar.pos.z -= pillar.radius + backboard.size.z / 2;

          //  * Generate paint area
          var boardthickness = backboard.size.z / 2;
          var paintlength = 5.8;
          var paintwidth = 4.57;
          var paint1 = box({
            pos: vec(
              paintwidth / 2,
              heightadjust,
              z_boarder + paintlength / 2 + boardposition / 2
            ),
            size: vec(0.1, 0.1, paintlength + boardposition),
            color: color.red,
            opacity: 1,
          });
          var paint2 = box({
            pos: vec(
              -paintwidth / 2,
              heightadjust,
              z_boarder + paintlength / 2 + boardposition / 2
            ),
            size: vec(0.1, 0.1, paintlength + boardposition),
            color: color.red,
            opacity: 1,
          });
          var freethrowline = box({
            pos: vec(0, heightadjust, paintlength + z_boarder + boardposition),
            size: vec(paintwidth, 0.1, 0.1),
            color: color.red,
            opacity: 1,
          });

          //  繪製三分線
          // var three_point_line = curve({ color: color.red, radius: 0.08 });
          // for (const x of Array(180).keys()) {
          //   // 繪製半圓形的三分線
          //   var x = 7.24 * cos(radians(angle));
          //   var y = heightadjust;
          //   var z = 7.24 * sin(radians(angle)) + hoop.pos.z;
          //   three_point_line.push(vec(x, y, z));
          // }
          var dist_2_point = z_boarder + paintlength + boardposition;

          // 三分線的距離
          var dist_3_point = 7.5 + hoop.pos.z;
          var shootheight = 1.9;
          var ball_radius = 0.12;
          var basketball_pos =
            level === 0
              ? vec(0, shootheight + heightadjust, dist_2_point - ball_radius)
              : vec(0, shootheight + heightadjust, dist_3_point - ball_radius);
          console.log(basketball_pos);
          var basketball_v = level === 0 ? vec(0, 8, -3) : vec(0, 9, -4);
          var basketball = sphere({
            pos: basketball_pos,
            radius: ball_radius,
            color: color.orange,
            make_trail: false,
          });

          basketball.velocity = basketball_v;
          var acc = vec(
            acceleration[1] * 0.0005,
            acceleration[2] * -0.0005,
            acceleration[0] * 0.0005
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
            scene.camera.pos = basketball.pos["+"](
              vec(30 * ball_radius, 0, 55 * ball_radius)
            );
            scene.camera.axis = vec(-1, 0, -2);
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
              console.log("successful");
              setBucket(true);
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
              basketball.pos.z <=
                backboard.pos.z + boardthickness + basketball.radius &&
              basketball.pos.z >=
                backboard.pos.z - boardthickness - basketball.radius &&
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
