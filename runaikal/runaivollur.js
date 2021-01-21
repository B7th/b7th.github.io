(function() {
  var SVG, cX, cY, canvas, colors, ctx, currentChord, drag, drawTone, drawTones, e, freqs, gradient, h, keyboard, midfq, n, nearestValue, noteEnd, noteStart, order, orders, playedNotes, points, r, r2, r3, radius, shepard, synth, synthJSON, texts, texts2, tones, totalArc, updateOrder;

  midfq = 220;

  drag = false;

  order = 0;

  freqs = [];

  colors = [];

  e = function(e12, ebase = 12) {
    return Math.pow(2, e12 / ebase);
  };

  h = [81 / 64, 177147 / 131072, 11 / 8, 27 / 16, 243 / 128, 25 / 24, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8, e(1), e(2), e(3), e(4), e(5), e(6), e(8), e(9), e(10), e(11), e(7), 1];

  n = ["π3", "π4", "h4", "π6", "π7", "♮♭2", "♮2", "♮♭3", "♮3", "♮4", "♮♭5", "♮5", "♮♭6", "♮6", "♮♭7", "♮7", "♭2", "2", "♭3", "3", "4", "♭5", "♭6", "6", "♭7", "7", "5", "u"];

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

  keyboard = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191];

  orders = {
    7: [2, 3, 4, 5, 6],
    8: [5, 1, 3, 5, 7],
    9: [2, 1, 2, 4, 7, 8],
    10: [7, 1, 3, 7, 9],
    11: [2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    12: [7, 1, 5, 7, 11],
    14: [9, 1, 3, 5, 9, 11, 13],
    15: [11, 1, 2, 4, 8, 11, 13],
    16: [9, 1, 3, 5, 7, 9, 11, 13, 15],
    18: [5, 1, 5, 7, 11, 13, 17],
    20: [11, 1, 3, 7, 9, 11, 13, 17, 19],
    22: [17, 1, 3, 5, 7, 9, 13, 15, 17, 19, 21],
    26: [7, 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25],
    28: [25, 1, 3, 5, 9, 11, 13, 15, 17, 19, 23, 25, 27],
    30: [19, 1, 7, 11, 13, 17, 19, 23, 29],
    34: [21, 1, 3, 5, 7, 9, 11, 13, 15, 19, 21, 23, 25, 27, 29, 31, 33],
    13: [5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    17: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    19: [7, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    21: [8, 1, 2, 4, 5, 8, 10, 11, 13, 16, 17, 19],
    23: [16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    24: [7, 1, 5, 7, 11, 13, 17, 19, 23],
    25: [22, 1, 2, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24],
    27: [4, 1, 2, 4, 5, 7, 8, 10, 11, 13, 16, 17, 19, 22, 23, 25, 26],
    29: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    31: [19, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    41: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 32, 34, 35, 36, 37, 38, 39, 40],
    46: [29, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43]
  };

  shepard = [];

  nearestValue = function(haystack, needle) {
    var curr, k, v;
    curr = 0;
    for (k in haystack) {
      v = haystack[k];
      if (needle === v) {
        return k;
      }
      if (Math.abs(v - needle) < Math.abs(haystack[curr] - needle)) {
        curr = k;
      }
    }
    return curr;
  };

  currentChord = 0x0; // All notes being played, regardless of octave

  synthJSON = {
    harmonicity: .1,
    modulationIndex: 1,
    envelope: {
      attack: 0.005,
      decay: .6,
      sustain: 0,
      release: 1
    },
    oscillator: {
      type: 'custom',
      partials: [1]
    },
    // phase
    // type
    modulation: {
      type: 'sine'
    },
    modulationEnvelope: {
      attack: 0.05,
      decay: 0.01,
      sustain: 0.01,
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
    $(SVG('text')).text(texts[deg]).attr('x', radius).attr('y', r).attr('text-anchor', 'middle').attr('font-size', r).attr('font-weight', "bold").attr('fill', "white").attr('transform', 'rotate(' + degree + ', 50, 50)').appendTo(canvas);
    if (texts2[deg]) {
      $(SVG('text')).text(texts2[deg]).attr('x', radius).attr('y', 22).attr('text-anchor', 'middle').attr('font-size', r / 1.8).attr('fill', "white").attr('transform', 'rotate(' + degree + ', 50, 50)').appendTo(canvas);
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
    var deg, deg2, i, j, k, ref, ref1, results, v;
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
    for (deg = i = 0, ref = tones - 1; (0 <= ref ? i <= ref : i >= ref); deg = 0 <= ref ? ++i : --i) {
      deg2 = (deg * orders[tones][order]) % tones;
      colors[deg2] = (deg * orders[tones][0]) % tones;
      freqs[deg2] = e(deg, tones) * midfq;
      shepard[freqs[deg2]] = [(tones - deg) / tones, deg / tones];
    }
    texts2 = [];
    for (k in h) {
      v = h[k];
      texts2[nearestValue(freqs, v * midfq)] = n[k];
    }
    results = [];
    for (deg = j = 0, ref1 = tones - 1; (0 <= ref1 ? j <= ref1 : j >= ref1); deg = 0 <= ref1 ? ++j : --j) {
      results.push(drawTone(tones, freqs[deg], deg));
    }
    return results;
  };

  updateOrder = function() {
    var k, noteOrderForm, ref, v;
    $('form #noteNumbers').val(tones);
    noteOrderForm = $('form #noteOrder');
    noteOrderForm.empty();
    ref = orders[tones];
    for (k in ref) {
      v = ref[k];
      noteOrderForm.append(new Option((k === 0 ? "Order (" + v + ")" : v), k));
    }
    return noteOrderForm.val(order);
  };

  $(window).on("load", function() {
    drawTones();
    updateOrder();
    $('body').on('keydown', function(e) {
      if (keyboard.indexOf((e.which != null) > tones)) {
        noteStart(keyboard.indexOf(e.which));
      }
      return null;
    });
    $('body').on('keyup', function(e) {
      if (keyboard.indexOf((e.which != null) > tones)) {
        noteEnd(keyboard.indexOf(e.which));
      }
      return null;
    });
    $('form #noteNumbers').change(function() {
      tones = this.value;
      order = 0;
      updateOrder();
      $('form #noteOrder').val(0);
      drawTones();
      return canvas.focus();
    });
    return $('form #noteOrder').change(function() {
      order = this.value;
      drawTones();
      return canvas.focus();
    });
  });

}).call(this);
