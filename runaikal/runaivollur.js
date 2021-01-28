(function() {
  var SVG, cX, cY, canvas, colors, ctx, currentChord, drag, drawTone, drawTones, e, findCoprimes, freqs, gradient, harmonics, k, keyboard, midfq, nearestValue, noteEnd, noteNames, noteStart, order, orders, playedNotes, points, primes, r, r2, r3, radius, shepard, synth, synthJSON, texts, texts2, tones, totalArc, updateOrder, v;

  midfq = 110;

  drag = false;

  order = 0;

  freqs = [];

  colors = [];

  e = function(e12, ebase = 12) {
    return Math.pow(2, e12 / ebase);
  };

  harmonics = {
    "u": 1,
    "𝄫2₂": 33 / 32,
    "𝄫2₃": 28 / 27,
    "♭2₅": 21 / 20,
    "♭2₇": 15 / 14,
    "𝄫2₁₃": 40 / 39,
    "♭2": e(1),
    "♭2₂": 17 / 16,
    "♭2₃": 25 / 24,
    "♭2₅": 16 / 15,
    "2₇": 16 / 14,
    "♭2₁₁": 12 / 11,
    "♭2₁₃": 14 / 13,
    "2": e(2),
    "2₂": 18 / 16,
    "2₃": 10 / 9,
    "2₅": 11 / 10,
    "♭3₇": 17 / 14,
    "♭3₁₁": 13 / 11,
    "2₁₃": 15 / 13,
    "♭3": e(3),
    "♭3₂": 19 / 16,
    "♭3₃": 7 / 6,
    "♭3₅": 12 / 10,
    "♯3₇": 18 / 14,
    "3₁₁": 14 / 11,
    "3₁₃": 16 / 13,
    "3": e(4),
    "3₂": 20 / 16,
    "♯3₂": 81 / 64,
    "3₃": 11 / 9,
    "♯3₅": 13 / 10,
    "4₇": 19 / 14,
    "4₁₁": 15 / 11,
    "4": e(5),
    "4₂": 22 / 16,
    "4₃": 4 / 3,
    "3₅": 13 / 10,
    "♭5₇": 20 / 14,
    "4₁₃": 17 / 13,
    "π4": 177147 / 131072,
    "♭5": e(6),
    "♭5₂": 23 / 16,
    "𝄫5₂": 45 / 32,
    "♯4₅": 14 / 10,
    "5₇": 21 / 14,
    "♭5₁₁": 16 / 11,
    "♯4₁₃": 18 / 13,
    "5": e(7),
    "5₂": 24 / 16,
    "5₅": 22 / 15,
    "♭6₇": 22 / 14,
    "♯5₁₁": 17 / 11,
    "5₁₃": 19 / 13,
    "♭6": e(8),
    "♭6₂": 26 / 16,
    "♭6₃": 14 / 9,
    "♭6₅": 16 / 10,
    "6₇": 23 / 14,
    "6₁₁": 18 / 11,
    "♯5₁₃": 20 / 13,
    "6": e(9),
    "6₂": 27 / 16,
    "6₃": 5 / 3,
    "6₅": 17 / 10,
    "♯6₇": 24 / 14,
    "♭7₁₁": 18 / 11,
    "6₁₃": 22 / 13,
    "♯6₁₃": 23 / 13,
    "♭7": e(10),
    "♯6₂": 28 / 16,
    "♭7₂": 29 / 16,
    "♭7₃": 16 / 9,
    "♭7₅": 18 / 10,
    "♭7₇": 25 / 14,
    "7₁₁": 20 / 11,
    "7₁₃": 24 / 13,
    "7": e(11),
    "7₂": 30 / 16,
    "7₃": 11 / 6,
    "7₅": 19 / 10,
    "7₇": 26 / 14,
    "♯7₁₃": 25 / 13,
    "π7": 243 / 128,
    "♯7": e(23, 24),
    "♯7₃": 35 / 18,
    "♯7₇": 27 / 14
  };

  noteNames = {};

  for (v in harmonics) {
    k = harmonics[v];
    noteNames[k] = v;
  }

  playedNotes = [];

  texts2 = [];

  tones = 12;

  ctx = null;

  cX = null;

  cY = null;

  r = 0;

  r2 = 0;

  r3 = 0;

  radius = null;

  totalArc = null;

  gradient = null;

  canvas = null;

  points = null;

  texts = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "+", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", '"', "⏎", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"];

  keyboard = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191, 32, 192];

  orders = {
    7: 2,
    8: 5,
    9: 2,
    10: 7,
    11: 2,
    12: 7,
    13: 5,
    14: 9,
    15: 11,
    16: 9,
    17: 12,
    18: 5,
    19: 7,
    20: 11,
    21: 13,
    22: 17,
    23: 16,
    24: 7,
    25: 22,
    26: 7,
    27: 22,
    28: 5,
    29: 12,
    30: 19,
    31: 19,
    32: 27,
    34: 9,
    35: 13,
    36: 11,
    37: 30,
    41: 12,
    46: 29,
    48: 5,
    50: 19,
    100: 39
  };

  primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

  findCoprimes = function(p) {
    var coprimes, i, ifPrime, j, l, len, max, prime, ref;
    coprimes = [];
    max = p > 40 ? 40 : p - 1;
    for (i = j = 0, ref = max; (0 <= ref ? j <= ref : j >= ref); i = 0 <= ref ? ++j : --j) {
      ifPrime = true;
      for (l = 0, len = primes.length; l < len; l++) {
        prime = primes[l];
        if (i % prime === 0 && p % prime === 0) {
          ifPrime = false;
          break;
        }
      }
      if (ifPrime) {
        coprimes.push(i);
      }
    }
    console.log(coprimes);
    return coprimes;
  };

  shepard = [];

  nearestValue = function(haystack, needle) {
    var curr;
    curr = null;
    for (k in haystack) {
      v = haystack[k];
      if (needle === v) {
        return k;
      }
      if (Math.abs(v - needle) < Math.abs(haystack[curr] - needle) || curr === null) {
        curr = k;
      }
    }
    return curr;
  };

  currentChord = 0x0; // All notes being played, regardless of octave

  synthJSON = {
    harmonicity: 1,
    modulationIndex: 1.3,
    envelope: {
      attack: 0.005,
      decay: .8,
      sustain: 1,
      release: .1
    },
    oscillator: {
      type: 'custom',
      partials: [1, .1, 0, 0, .01, .02]
    },
    // phase
    // type
    modulation: {
      type: 'sine'
    },
    modulationEnvelope: {
      attack: 0.05,
      decay: 0.01,
      sustain: 0.1,
      release: .1
    },
    portamento: .1
  };

  synth = new Tone.PolySynth(36, Tone.AMSynth, synthJSON).toMaster();

  noteStart = function(deg) {
    var freq, freq2;
    if (!freqs[deg]) {
      return null;
    }
    if (playedNotes[deg] === true) {
      return null;
    }
    playedNotes[deg] = true;
    freq = freqs[deg];
    freq2 = event.shiftKey ? freq * 2 : freq;
    synth.triggerAttack(freq2, "+0", .5);
    synth.triggerAttack(freq2 * 2, "+0", shepard[freq][0]);
    synth.triggerAttack(freq2 / 2, "+0", shepard[freq][1]);
    return $('#' + deg).attr('fill-opacity', '.8');
  };

  noteEnd = function(deg) {
    var freq;
    freq = freqs[deg];
    playedNotes[deg] = false;
    synth.triggerRelease(freq);
    synth.triggerRelease(freq * 2);
    synth.triggerRelease(freq / 2);
    return $('#' + deg).attr('fill-opacity', '.6');
  };

  SVG = function(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
  };

  drawTone = function(tones, freq, deg) {
    var color, degree;
    degree = deg / tones * 360;
    color = colors[deg] / tones * 360;
    //.attr 'text-decoration', if harmonics[texts2[deg]]==freq/midfq then "underline" else "none"
    $(SVG('text')).text(texts2[deg]).attr('x', radius).attr('y', r).attr('text-anchor', 'middle').attr('font-size', r).attr('fill', "white").attr('transform', 'rotate(' + degree + ', 50, 50)').appendTo(canvas);
    if (texts[deg]) {
      $(SVG('text')).text(texts[deg]).attr('x', radius).attr('y', 22).attr('text-anchor', 'middle').attr('font-size', r / 1.8).attr('fill', "white").attr('transform', 'rotate(' + degree + ', 50, 50)').appendTo(canvas);
    }
    return $(SVG('polygon')).attr('id', deg).attr('freq', freq).attr('fill', 'hsl(' + color + ',100%,50%)').attr('fill-opacity', '.6').attr('points', points).attr('transform-box', 'fill-box').attr('transform-origin', 'center').attr('transform', 'rotate(' + degree + ', 0, 0)').on('touchstart mousedown', function() {
      drag = true;
      return noteStart(deg);
    }).on('touchend mouseup', function() {
      drag = false;
      return noteEnd(deg);
    }).on('mouseout', function() {
      return noteEnd(deg);
    }).on('mouseover', function() {
      if (drag) {
        return noteStart(deg);
      }
    }).appendTo(canvas);
  };

  drawTones = function() {
    var deg, deg2, j, l, ref, ref1, results;
    canvas = $('#polytune');
    canvas.empty();
    cX = canvas.attr('width') / 2 || 50;
    cY = canvas.attr('height') / 2 || 50;
    radius = cX;
    r = cX * Math.tan(Math.PI / tones);
    r2 = r * Math.SQRT1_2 * Math.SQRT1_2;
    r3 = r * 1.8;
    r3 = 25;
    points = "";
    points += cX - r + ",0 ";
    points += cX + r + ",0 ";
    points += cX + r2 + "," + r3 + " ";
    points += cX - r2 + "," + r3;
    $(SVG('circle')).attr('cx', cX).attr('cy', cY).attr('r', radius - r3 / 2).attr('fill', 'black').attr('fill-opacity', '.1').attr('stroke', 'black').attr('stroke-width', r3).appendTo(canvas);
    freqs = [];
    texts2 = [];
    if (!order) {
      order = orders[tones];
    }
    for (deg = j = 0, ref = tones - 1; (0 <= ref ? j <= ref : j >= ref); deg = 0 <= ref ? ++j : --j) {
      deg2 = (deg * order) % tones;
      colors[deg2] = (deg * orders[tones]) % tones;
      freqs[deg2] = e(deg, tones) * midfq;
      shepard[freqs[deg2]] = [(tones - deg) / tones, deg / tones];
      texts2[deg2] = nearestValue(harmonics, freqs[deg2] / midfq);
    }
    results = [];
    for (deg = l = 0, ref1 = tones - 1; (0 <= ref1 ? l <= ref1 : l >= ref1); deg = 0 <= ref1 ? ++l : --l) {
      results.push(drawTone(tones, freqs[deg], deg));
    }
    return results;
  };

  updateOrder = function() {
    var j, len, noteOrderForm, noteOrders;
    $('form #noteNumbers').val(tones);
    noteOrderForm = $('form #noteOrder');
    noteOrderForm.empty();
    noteOrders = findCoprimes(tones);
    noteOrders.unshift(orders[tones]);
    for (v = j = 0, len = noteOrders.length; j < len; v = ++j) {
      k = noteOrders[v];
      noteOrderForm.append(new Option(k, k));
    }
    noteOrderForm.val(orders[tones]);
    return $('form #midfq').val(midfq);
  };

  $(window).on("load", function() {
    var url;
    url = new URLSearchParams(window.location.search);
    for (k in orders) {
      v = orders[k];
      $('form #noteNumbers').append(new Option(k, k));
    }
    updateOrder();
    drawTones();
    $('body').on('keydown', function(e) {
      if (keyboard.indexOf((e.which != null) > tones)) {
        return noteStart(keyboard.indexOf(e.which));
      }
    });
    $('body').on('keyup', function(e) {
      if (keyboard.indexOf((e.which != null) > tones)) {
        return noteEnd(keyboard.indexOf(e.which));
      }
    });
    $('form #noteNumbers').change(function() {
      tones = this.value;
      order = 0;
      updateOrder();
      drawTones();
      return canvas.focus();
    });
    return $('form #noteOrder').change(function() {
      order = this.value;
      console.log(order);
      drawTones();
      return canvas.focus();
    });
  });

}).call(this);
