(function() {
    // x
  // Steps to build

  // Separate note 

  // Picture by D Sharon Pruitt

  // Each note is given a binary value increasing by fifth.
  // The first note (in general C) is 0o1, the Fifth is 0o2, the 2nd is 0o4, etc.
  // Playing notes together adds them, and it ends up showing that 0o23 will be major,
  // while 0o1003, or 0o31, will be minor

  // --------- #
  // Variables #
  // --------- #
  var cords, cords2, currentChord, hexal, i, key, keyboard2notes, len, notal, note2oct, note2volume, noteEnd, noteStart, notes, oct2note, svgal, synth, synthJSON, value, volume;

  currentChord = 0x0; // All notes being played, regardless of octave

  synthJSON = {
    harmonicity: 1.5,
    modulationIndex: 1,
    envelope: {
      attack: 0.005,
      decay: .6,
      sustain: 0,
      release: 6
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
      decay: 0.1,
      sustain: 0.01,
      release: 6
    },
    portamento: .1
  };

  synth = new Tone.PolySynth(36, Tone.AMSynth, synthJSON).toMaster();

  notal = [440.000, 649.804, 479.823, 708.616, 523.251, 772.751, 570.609, 842.691, 622.254, 459.480, 678.573, 501.067, 739.989, 546.417, 806.964, 595.872];

  hexal = [0x0001, 0x0002, 0x0004, 0x0008, 0x0010, 0x0020, 0x0040, 0x0080, 0x0100, 0x0200, 0x0400, 0x0800, 0x1000, 0x2000, 0x4000, 0x8000];

  cords = [0x3, 0x5, 0x6, 0x9, 0xa, 0xc, 0x30, 0x50, 0x60, 0x90, 0xa0, 0xc0, 0x300, 0x500, 0x600, 0x900, 0xa00, 0xc00, 0x3000, 0x5000, 0x6000, 0x9000, 0xa000, 0xc000, 0x11, 0x12, 0x14, 0x18, 0x101, 0x102, 0x104, 0x108, 0x110, 0x120, 0x140, 0x180, 0x1001, 0x1002, 0x1004, 0x1008, 0x1010, 0x1020, 0x1040, 0x1080, 0x1100, 0x1200, 0x1400, 0x1800, 0x21, 0x22, 0x24, 0x28, 0x201, 0x202, 0x204, 0x208, 0x210, 0x220, 0x240, 0x280, 0x2001, 0x2002, 0x2004, 0x2008, 0x2010, 0x2020, 0x2040, 0x2080, 0x2100, 0x2200, 0x2400, 0x2800, 0x41, 0x42, 0x44, 0x48, 0x401, 0x402, 0x404, 0x408, 0x410, 0x420, 0x440, 0x480, 0x4001, 0x4002, 0x4004, 0x4008, 0x4010, 0x4020, 0x4040, 0x4080, 0x4100, 0x4200, 0x4400, 0x4800, 0x81, 0x82, 0x84, 0x88, 0x801, 0x802, 0x804, 0x808, 0x810, 0x820, 0x840, 0x880, 0x8001, 0x8002, 0x8004, 0x8008, 0x8010, 0x8020, 0x8040, 0x8080, 0x8100, 0x8200, 0x8400, 0x8800];

  cords2 = {};

  for (value = i = 0, len = cords.length; i < len; value = ++i) {
    key = cords[value];
    cords2[value] = "#C" + cords[value].toString(16);
  }

  svgal = ["#N0001", "#N0002", "#N0004", "#N0008", "#N0010", "#N0020", "#N0040", "#N0080", "#N0100", "#N0200", "#N0400", "#N0800", "#N1000", "#N2000", "#N4000", "#N8000"];

  volume = [[16 / 16, 1 / 16], [7 / 16, 10 / 16], [14 / 16, 3 / 16], [5 / 16, 12 / 16], [12 / 16, 5 / 16], [3 / 16, 14 / 16], [10 / 16, 7 / 16], [1 / 16, 16 / 16], [8 / 16, 9 / 16], [15 / 16, 2 / 16], [6 / 16, 11 / 16], [13 / 16, 4 / 16], [4 / 16, 13 / 16], [11 / 16, 6 / 16], [2 / 16, 15 / 16], [9 / 16, 8 / 16]];

  notes = notal;

  keyboard2notes = [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61];

  // --------- #
  // Functions #
  // --------- #
  noteStart = function(note) {
    var pitch, results;
    if (!note) {
      return;
    }
    pitch = note2oct[note];
    if (currentChord & pitch) {
      return;
    }
    currentChord = currentChord | pitch;
    $('#play').text(currentChord.toString(16));
    synth.triggerAttack(note * .25, "+0", note2volume[pitch][1]);
    synth.triggerAttack(note * .5, "+0", 1);
    synth.triggerAttack(note, "+0", note2volume[pitch][0]);
    $(svgal[notes.indexOf(note)]).css({
      "fill-opacity": '.5' //should be moved
    });
    results = [];
    for (key in cords) {
      value = cords[key];
      results.push($(cords2[key]).css({
        "opacity": value & currentChord ^ value ? '0.01' : "1"
      }));
    }
    return results;
  };

  noteEnd = function(note) {
    var pitch, results;
    if (!note) {
      return;
    }
    pitch = note2oct[note];
    currentChord = currentChord & (~pitch);
    $('#play').text(currentChord.toString(16));
    synth.triggerRelease(note * .25);
    synth.triggerRelease(note * .5);
    synth.triggerRelease(note);
    $(svgal[notes.indexOf(note)]).css({
      "fill-opacity": '.1' //should be moved
    });
    results = [];
    for (key in cords) {
      value = cords[key];
      results.push($(cords2[key]).css({
        "opacity": value & currentChord ^ value ? '0.01' : "1"
      }));
    }
    return results;
  };

  // Teaching

  // Recording

  // Replaying

  // Touch-based playing
  $(window).on("load", function() {
    var id;
// get notes & chords and give them data
    for (key in svgal) {
      id = svgal[key];
      $(id).data('note', notes[key]).css({
        "fill-opacity": ".1" //? Can I find another way?
      }).css({
        cursor: 'pointer' //? Can I find another way?
      }).mousedown(function() {
        return noteStart($(this).data('note'));
      }).mouseup(function() {
        return noteEnd($(this).data('note'));
      }).on('touchstart', function() {
        return noteStart($(this).data('note'));
      }).on('touchend', function() {
        return noteEnd($(this).data('note'));
      });
    }
    $('body').on('keydown', function(e) {
      if (keyboard2notes.indexOf(e.which != null)) {
        noteStart(notes[keyboard2notes.indexOf(e.which)]);
      }
      return null;
    });
    return $('body').on('keyup', function(e) {
      if (keyboard2notes.indexOf(e.which != null)) {
        noteEnd(notes[keyboard2notes.indexOf(e.which)]);
      }
      return null;
    });
  });

  // -------------------------------------------------------
  // -------------------------------------------------------
  // -------------------------------------------------------
  note2oct = {};

  for (key in notal) {
    value = notal[key];
    note2oct[value] = hexal[key];
  }

  oct2note = {};

  for (key in hexal) {
    value = hexal[key];
    oct2note[value] = notal[key];
  }

  note2volume = {};

  for (key in hexal) {
    value = hexal[key];
    note2volume[value] = volume[key];
  }

}).call(this);
