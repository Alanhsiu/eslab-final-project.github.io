function () {
  var ρσ_modules = {};
  ρσ_modules.pythonize = {};

  (function () {
    function strings() {
      var string_funcs, exclude, name;
      string_funcs = set(
        "capitalize strip lstrip rstrip islower isupper isspace lower upper swapcase center count endswith startswith find rfind index rindex format join ljust rjust partition rpartition replace split rsplit splitlines zfill".split(
          " "
        )
      );
      if (!arguments.length) {
        exclude = (function () {
          var s = ρσ_set();
          s.jsset.add("split");
          s.jsset.add("replace");
          return s;
        })();
      } else if (arguments[0]) {
        exclude = Array.prototype.slice.call(arguments);
      } else {
        exclude = null;
      }
      if (exclude) {
        string_funcs = string_funcs.difference(set(exclude));
      }
      var ρσ_Iter0 = string_funcs;
      ρσ_Iter0 =
        typeof ρσ_Iter0[Symbol.iterator] === "function"
          ? ρσ_Iter0 instanceof Map
            ? ρσ_Iter0.keys()
            : ρσ_Iter0
          : Object.keys(ρσ_Iter0);
      for (var ρσ_Index0 of ρσ_Iter0) {
        name = ρσ_Index0;
        (ρσ_expr_temp = String.prototype)[
          typeof name === "number" && name < 0
            ? ρσ_expr_temp.length + name
            : name
        ] = (ρσ_expr_temp = ρσ_str.prototype)[
          typeof name === "number" && name < 0
            ? ρσ_expr_temp.length + name
            : name
        ];
      }
    }
    if (!strings.__module__)
      Object.defineProperties(strings, {
        __module__: { value: "pythonize" },
      });

    ρσ_modules.pythonize.strings = strings;
  })();
  async function __main__() {
    "use strict";
    var display = canvas;
    console.log(canvas);
    var scene = canvas();

    var version,
      print,
      arange,
      __name__,
      type,
      ρσ_ls,
      g,
      side,
      decay,
      court,
      backboard,
      rod,
      pillar,
      paint1,
      paint2,
      paint3,
      hoop,
      C_d,
      rho,
      S,
      k,
      heightadjust,
      basketball,
      court_length,
      center,
      dt;
    version = ρσ_list_decorate(["3.2", "glowscript"]);
    Array.prototype["+"] = function (r) {
      return this.concat(r);
    };
    Array.prototype["*"] = function (r) {
      return __array_times_number(this, r);
    };
    window.__GSlang = "vpython";
    print = GSprint;
    arange = range;
    __name__ = "__main__";
    type = pytype;
    var strings = ρσ_modules.pythonize.strings;

    strings();
    ("7");
    decay = 0.7;
    ("9");
    heightadjust = -3;
    ("10");
    court_length = 7;
    ("11");
    center = (1)["-u"]()["*"](court_length)["/"](2);
    ("12");
    g = vector(0, -9.8, 0);

    ("13");
    court = ρσ_interpolate_kwargs.call(this, box, [
      ρσ_desugar_kwargs({
        pos: vector(0, heightadjust, 0),
        size: vector(7.5, 0.1, court_length),
        color: color.white,
      }),
    ]);
    ("14");
    backboard = ρσ_interpolate_kwargs.call(this, box, [
      ρσ_desugar_kwargs({
        pos: vector(0, 3.5 + heightadjust, center + 1.2),
        size: vector(1.8, 1.2, 0.1),
        color: color.white,
      }),
    ]);
    ("16");
    hoop = ρσ_interpolate_kwargs.call(this, ring, [
      ρσ_desugar_kwargs({
        pos: vector(0, 3.05 + heightadjust, backboard.pos.z + 0.45),
        axis: vector(0, 0.01, 0),
        radius: 0.23,
        thickness: 0.03,
        color: color.red,
      }),
    ]);
    ("18");

    paint1 = ρσ_interpolate_kwargs.call(this, box, [
      ρσ_desugar_kwargs({
        pos: vector(4.9 / 2 - 0.05, heightadjust, center + 5.8 / 2),
        size: vector(0.1, 0.1, 5.8),
        color: color.red,
        opacity: 1,
      }),
    ]);
    ("19");
    paint2 = ρσ_interpolate_kwargs.call(this, box, [
      ρσ_desugar_kwargs({
        pos: vector(-4.9 / 2 + 0.05, heightadjust, center + 5.8 / 2),
        size: vector(0.1, 0.1, 5.8),
        color: color.red,
        opacity: 1,
      }),
    ]);
    ("20");
    paint3 = ρσ_interpolate_kwargs.call(this, box, [
      ρσ_desugar_kwargs({
        pos: vector(0, heightadjust, 5.8 / 2 - 0.05 + center + 5.8 / 2),
        size: vector(4.9, 0.1, 0.1),
        color: color.red,
        opacity: 1,
      }),
    ]);
    ("21");

    rod = ρσ_interpolate_kwargs.call(this, cylinder, [
      ρσ_desugar_kwargs({
        pos: vector(0, 3.05 + heightadjust, backboard.pos.z + 0.05),
        axis: vector(0, 0, 0.18),
        radius: 0.03,
        color: color.red,
        opacity: 1,
      }),
    ]);
    ("22");
    pillar = ρσ_interpolate_kwargs.call(this, cylinder, [
      ρσ_desugar_kwargs({
        pos: vector(0, heightadjust, backboard.pos.z - 0.2),
        axis: vector(0, 3.3, 0),
        radius: 0.2,
        color: color.cyan,
      }),
    ]);

    ("23");

    basketball = ρσ_interpolate_kwargs.call(this, sphere, [
      ρσ_desugar_kwargs({
        pos: vector(0, 1.9 + heightadjust, 2.9 - 0.12),
        radius: 0.12,
        color: color.orange,
        trail_color: color.white,
      }),
    ]);
    ("24");
    basketball.mass = 0.62;
    ("25");
    basketball.velocity = vector(velocity[0], velocity[1], velocity[2]);
    console.log(basketball.velocity, basketball.pos);
    ("26");
    // # parameters for the ball
    C_d = 0.5;
    ("27");
    rho = 1.293;
    ("28");
    S = basketball.radius ** 2 * pi;
    ("29");
    k = 0.5 * C_d * rho * S;
    ("30");
    dt = 0.001;
    ("31");
    while (!end) {
      console.log(end);
      ("32");
      await rate(1000);
      ("33");
      basketball.pos.x = basketball.pos.x["+"](basketball.velocity.x["*"](dt));
      basketball.pos.y = basketball.pos.y["+"](basketball.velocity.y["*"](dt));
      basketball.pos.z = basketball.pos.z["+"](basketball.velocity.z["*"](dt));
      ("34");
      if (
        basketball.pos.y < basketball.radius + heightadjust &&
        basketball.velocity.y < 0
      ) {
        ("35");
        basketball.velocity.y = (1)["-u"]()["*"](basketball.velocity.y);
        ("36");
        basketball.velocity = basketball.velocity["*"](decay);
      }
      if (
        basketball.pos.z <= backboard.pos.z + 0.05 + basketball.radius + 0.05 &&
        basketball.pos.y <= backboard.pos.y + backboard.size.y / 2 &&
        basketball.pos.y >= backboard.pos.y - backboard.size.y / 2 &&
        basketball.velocity.z < 0
      ) {
        ("37");
        basketball.velocity.z = (1)["-u"]()["*"](basketball.velocity.z);

        ("38");
        basketball.velocity = basketball.velocity["*"](decay);
      }

      ("39");
      basketball.velocity = basketball.velocity["+"](g["*"](dt));
    }
  }
  if (!__main__.__module__)
    Object.defineProperties(__main__, {
      __module__: { value: null },
    });

  $(function () {
    window.__context = {
      glowscript_container: $("#glowscript").removeAttr("id"),
    };
  });
}
