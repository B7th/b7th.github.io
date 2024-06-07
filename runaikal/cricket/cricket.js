(function() {
  var SVG, archive, cX, cY, changePolygon, cirdularMean, coord, cos, deg2rad, i, j, k, l, log440, logb, m, n, nice, play, playing, position, quartet, rad2deg, randStep, ref, ref1, sin, steps, synth,
    indexOf = [].indexOf;

  synth = {
    harmonicity: 1.5,
    modulationIndex: 1,
    envelope: {
      attack: 0.005,
      decay: .7,
      sustain: .7,
      release: .5
    },
    oscillator: {
      type: 'custom',
      partials: [1, .2, .9, .1, .3, .2, .1]
    },
    // phase
    // type
    modulation: {
      type: 'sine'
    },
    modulationEnvelope: {
      attack: 0.005,
      decay: 1,
      sustain: .1,
      release: .1
    },
    portamento: .1
  };

  quartet = {
    a: new Tone.Synth(synth).toDestination(),
    b: new Tone.Synth(synth).toDestination(),
    c: new Tone.Synth(synth).toDestination(),
    d: new Tone.Synth(synth).toDestination(),
    e: false
  };

  playing = new Float64Array([220 * 2 / 4, 220 * 6 / 4, 220 * 4 / 5, 220 * 12 / 5]);

  console.log(playing);

  playing.sort();

  SVG = function(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  };

  steps = [];

  for (i = k = 4; k <= 10; i = ++k) {
    for (j = l = -2; l <= 2; j = ++l) {
      steps.push((i + j) / i);
    }
  }

  nice = [];

  for (i = m = 3; m <= 9; i = ++m) {
    for (j = n = ref = Math.ceil(i / 3 * 2), ref1 = i * 2 + 2; (ref <= ref1 ? n <= ref1 : n >= ref1); j = ref <= ref1 ? ++n : --n) {
      nice.push(j / i);
    }
  }

  randStep = function(steps) {
    return steps[Math.floor(Math.random() * steps.length)];
  };

  //\sin\left(2\pi\log_{2}\left(\frac{x}{3.4375}\right)\right)\cdot x
  // For each sin cycle,
  // x is twice as large
  // which means that x has half the power to impact on the cycle
  //Find the barycentre of a chord and give the saturation and hue.
  logb = function(x, y) {
    return Math.log(y) / Math.log(x);
  };

  log440 = function(x) {
    return 360 * logb(2, x / 3.4375) % 360;
  };

  sin = function(x) {
    return Math.sin(2 * Math.PI * logb(2, x / 3.4375));
  };

  cos = function(x) {
    return Math.cos(2 * Math.PI * logb(2, x / 3.4375));
  };

  coord = function(x, cX, cY) {
    return (sin(x) * cX + cX) + "," + (cos(x) * cY + cY);
  };

  deg2rad = function(degrees) {
    return degrees * (Math.PI / 180);
  };

  rad2deg = function(rad) {
    return rad / (Math.PI / 180);
  };

  cirdularMean = function(degs) {
    var coss, deg, len, len1, o, q, rad, rads, sins;
    rads = [];
    for (o = 0, len = degs.length; o < len; o++) {
      deg = degs[o];
      rads.push(deg2rad(deg));
    }
    sins = 0;
    coss = 0;
    for (q = 0, len1 = rads.length; q < len1; q++) {
      rad = rads[q];
      sins += Math.sin(rad);
      coss += Math.cos(rad);
    }
    rad = Math.atan2(sins, coss);
    return rad2deg(rad);
  };

  archive = [];

  position = 0;

  cX = 0;

  cY = 0;

  changePolygon = function() {
    var canvas, chord, hue, hues, points, polygon, ref2, ref3;
    canvas = $('#quartet');
    chord = archive[position];
    polygon = [];
    hues = [log440(chord[0]), log440(chord[1]), log440(chord[2]), log440(chord[3])];
    hue = cirdularMean(hues);
    console.log(hue);
    polygon.push(coord(chord[0], cX, cY));
    if (chord[1] !== chord[0]) {
      polygon.push(coord(chord[1], cX, cY));
    }
    if ((ref2 = chord[2]) !== chord[0] && ref2 !== chord[1]) {
      polygon.push(coord(chord[2], cX, cY));
    }
    if ((ref3 = chord[3]) !== chord[0] && ref3 !== chord[1] && ref3 !== chord[2]) {
      polygon.push(coord(chord[3], cX, cY));
    }
    points = polygon.join(' ');
    return $('#poly').attr('fill', 'hsl(' + hue + 'deg,100%,50%)').attr('stroke', 'hsl(' + hue + 'deg,100%,30%)').attr('points', points);
  };

  play = function(p) {
    quartet.a.triggerAttack(p[0]);
    quartet.b.triggerAttack(p[1]);
    quartet.c.triggerAttack(p[2]);
    return quartet.d.triggerAttack(p[3]);
  };

  $(window).on("load", function() {
    var canvas;
    play(playing);
    archive[0] = playing;
    canvas = $('#quartet');
    cX = canvas.attr('width') / 2 || 50;
    cY = canvas.attr('height') / 2 || 50;
    $(SVG('circle')).attr('cx', cX).attr('cy', cY).attr('r', cX).attr('fill', 'white').attr('fill-opacity', '.4').attr('stroke', 'black').appendTo(canvas);
    $(SVG('polygon')).attr('id', 'poly').attr('fill-opacity', '.4').attr('stroke-width', '1').attr('points', '0,0 100,0 100,100 0,100').appendTo(canvas);
    changePolygon();
    return $('body').on('keydown', function(e) {
      var maxTrials, ref2, ref3, ref4, ref5, ref6, ref7, t;
      if (e.which === 39) {
        position++;
        if (archive[position] === void 0) {
          position--;
        }
        play(archive[position]);
        changePolygon();
      }
      if (e.which === 37) {
        position--;
        if (archive[position] === void 0) {
          position++;
        }
        play(archive[position]);
        changePolygon();
      }
      if (e.which === 32) {
        t = archive[position];
        position++;
        archive[position] = [];
        maxTrials = 10;
        j = 0;
        while (!(j++ > maxTrials)) {
          i = t[0] * randStep(steps);
          if ((80 < i && i < 1000)) {
            break;
          }
        }
        archive[position][0] = i;
        j = 0;
        while (!(j++ > maxTrials)) {
          i = t[1] * randStep(steps);
          if ((ref2 = i / t[0], indexOf.call(nice, ref2) >= 0) && (80 < i && i < 1000)) {
            break;
          }
        }
        archive[position][1] = i;
        j = 0;
        while (!(j++ > maxTrials)) {
          i = archive[position - 1][2] * randStep(steps);
          if ((ref3 = i / t[1], indexOf.call(nice, ref3) >= 0) && (ref4 = i / t[0], indexOf.call(nice, ref4) >= 0) && (80 < i && i < 1000)) {
            break;
          }
        }
        archive[position][2] = i;
        j = 0;
        while (!(j++ > maxTrials)) {
          i = archive[position - 1][3] * randStep(steps);
          if ((ref5 = i / t[1], indexOf.call(nice, ref5) >= 0) && (ref6 = i / t[2], indexOf.call(nice, ref6) >= 0) && (ref7 = i / t[0], indexOf.call(nice, ref7) >= 0) && (80 < i && i < 1000)) {
            break;
          }
        }
        archive[position][3] = i;
        archive[position] = new Float64Array(archive[position]);
        archive[position].sort();
        console.log(archive[position]);
        play(archive[position]);
        return changePolygon();
      }
    });
  });

}).call(this);
