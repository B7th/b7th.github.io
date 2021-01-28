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
  var allChords, allColours, allNotes, chordMaker, chordName, chordOct, chords, colours, cords, currentChord, hexal, key, keyboard2notes, notal, note, note2oct, note2volume, noteEnd, noteStart, notes, oct, oct2colour, oct2note, svgal, synth, synthJSON, value, visuals, volume;

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
      partials: [1, 0, 0, 0, 0.1, 0, 0, 0.01, 0, 0, 0, 0.002]
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

  notal = ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"];

  hexal = [0x001, 0x002, 0x004, 0x008, 0x010, 0x020, 0x040, 0x080, 0x100, 0x200, 0x400, 0x800];

  colours = [0xff0000, 0xff8000, 0x808000, 0x80ff00, 0x00ff00, 0x00ff80, 0x008080, 0x0080ff, 0x0000ff, 0x8000ff, 0x800080, 0xff0080];

  colours = [0x100000, 0x100800, 0x101000, 0x081000, 0x001000, 0x001008, 0x001010, 0x000810, 0x000010, 0x080010, 0x100010, 0x100008];

  svgal = ['#N0001', '#N0002', '#N0004', '#N0010', '#N0020', '#N0040', '#N0100', '#N0200', '#N0400', '#N1000', '#N2000', '#N4000'];

  volume = [
    [
      12 / 12,
      1 / 12 //C
    ],
    [
      5 / 12,
      8 / 12 //G
    ],
    [
      10 / 12,
      3 / 12 //D
    ],
    [
      3 / 12,
      10 / 12 //A
    ],
    [
      8 / 12,
      5 / 12 //E
    ],
    [
      1 / 12,
      12 / 12 //B
    ],
    [
      6 / 12,
      7 / 12 //Gb
    ],
    [
      11 / 12,
      2 / 12 //Db
    ],
    [
      4 / 12,
      9 / 12 //Ab
    ],
    [
      9 / 12,
      4 / 12 //Eb
    ],
    [
      2 / 12,
      11 / 12 //Bb
    ],
    [
      7 / 12,
      6 / 12 //F
    ]
  ];

  notes = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

  keyboard2notes = [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61];

  cords = {
    0x003: "C_G",
    0x005: "C_D",
    0x009: "C_A",
    0x011: "C_E",
    0x021: "C_B",
    0x041: "C_Gb",
    0x081: "C_Db",
    0x101: "C_Ab",
    0x201: "C_Eb",
    0x401: "C_Bb",
    0x801: "C_F",
    0x006: "G_D",
    0x00A: "G_A",
    0x12: "G_E",
    0x22: "G_B",
    0x042: "G_Gb",
    0x082: "G_Db",
    0x102: "G_Ab",
    0x202: "G_Eb",
    0x402: "G_Bb",
    0x802: "G_F",
    0x00C: "D_A",
    0x014: "D_E",
    0x24: "D_B",
    0x044: "D_Gb",
    0x084: "D_Db",
    0x104: "D_Ab",
    0x204: "D_Eb",
    0x404: "D_Bb",
    0x804: "D_F",
    0x018: "A_E",
    0x028: "A_B",
    0x048: "A_Gb",
    0x088: "A_Db",
    0x108: "A_Ab",
    0x208: "A_Eb",
    0x408: "A_Bb",
    0x808: "A_F",
    0x030: "E_B",
    0x050: "E_Gb",
    0x090: "E_Db",
    0x110: "E_Ab",
    0x210: "E_Eb",
    0x410: "E_Bb",
    0x810: "E_F",
    0x060: "B_Gb",
    0x0A0: "B_Db",
    0x120: "B_Ab",
    0x220: "B_Eb",
    0x420: "B_Bb",
    0x820: "B_F",
    0x0C0: "Gb_Db",
    0x140: "Gb_Ab",
    0x240: "Gb_Eb",
    0x440: "Gb_Bb",
    0x840: "Gb_F",
    0x180: "Db_Ab",
    0x280: "Db_Eb",
    0x480: "Db_Bb",
    0x880: "Db_F",
    0x300: "Ab_Eb",
    0x500: "Ab_Bb",
    0x900: "Ab_F",
    0x600: "Eb_Bb",
    0xA00: "Eb_F",
    0xC00: "Bb_F"
  };

  chords = {
    0x001: " ",
    0x003: "5th",
    0x005: "2nd",
    0x007: "s2",
    0x009: "6th",
    0x00B: "s6",
    0x00F: "6/9no3",
    0x011: "M3rd",
    0x013: "Maj",
    0x015: "add2no5",
    0x017: "Madd2",
    0x019: "",
    0x01B: "6",
    0x01F: "6/9",
    0x021: "M7th",
    0x023: "sM7",
    0x025: "M7s2n5",
    0x027: "M9s2",
    0x031: "",
    0x033: "M7",
    0x035: "M9no5",
    0x037: "M9",
    0x041: "m5th",
    0x043: "s#4",
    0x045: "add9b5",
    0x047: "s2add#4",
    0x051: "",
    0x053: "Madd#4",
    0x055: "9b5",
    0x057: "add2#4",
    0x071: "M7b5",
    0x079: "",
    0x081: "m2nd",
    0x083: "sb2",
    0x085: "s2b2no5?",
    0x087: "s2addb2",
    0x089: "sb2add6no5",
    0x08B: "add6sb2",
    0x091: "",
    0x093: "Maddb2",
    0x0A1: "",
    0x0A3: "M7sb9",
    0x0C1: "",
    0x0C3: "sb2#4",
    0x101: "m6th",
    0x103: "sb6?",
    0x105: "9#5no3no7?",
    0x109: "6#5s",
    0x111: "aug",
    0x113: "Mb6",
    0x201: "m3rd",
    0x203: "min",
    0x205: "madd2no5",
    0x207: "madd2",
    0x049: "dim",
    0x20B: "m6",
    0x20F: "m6/9",
    0x211: "",
    0x213: "Maddb3",
    0x215: "Madd9addb3",
    0x221: "",
    0x223: "mM7",
    0x225: "",
    0x227: "mM9",
    0x241: "",
    0x243: "",
    0x245: "",
    0x249: "dim7",
    0x24B: "°75",
    0x24D: "°72",
    0x24F: "m6/9addb2",
    0x2A9: "dimM7addb2",
    0x4A5: " cluster",
    0x303: "mb6",
    0x305: "",
    0x309: "",
    0x401: "m7th",
    0x403: "s7",
    0x407: "9s2",
    0x409: "",
    0x40B: "13s",
    0x411: "+6",
    0x413: "7",
    0x415: "fr+6",
    0x417: "9",
    0x419: "13n5",
    0x41B: "13",
    0x441: "",
    0x443: "",
    0x449: "13b5s",
    0x451: "7b5",
    0x509: "13#5s",
    0x511: "aug7",
    0x601: "",
    0x603: "m7",
    0x605: "m9no5",
    0x607: "m9",
    0x609: "m13no5",
    0x60B: "m13",
    0x60F: "m9/13",
    0x611: "ge+6",
    0x621: "m7add7no5",
    0x801: "4th",
    0x803: "s4",
    0xa09: "°4",
    0x811: "add4no5",
    0x813: "add4",
    0x831: "M11no5",
    0x833: "M11",
    0xA01: "madd4no5",
    0xA03: "madd4",
    0xC03: "7s4",
    0xC11: "",
    0xC13: "11",
    0xE01: "4",
    0xE07: "m9/11"
  };

  ({
    scales: {
      0o0177: " lydian",
      0o4077: " ionian",
      0o6037: " myxolydian",
      0o7017: " dorian",
      0o7407: " aeolian",
      0o7603: " phrygian",
      0o7701: " locrian",
      0o6427: " myxolydian b6",
      0o2525: " whole tone scale",
      0o5057: " melodic minor scale",
      0o5447: " harmonic minor scale",
      0o5643: " neapolitan minor scale",
      0o5253: " neapolitan major scale",
      0o2761: " enigmatic scale"
    }
  });

  // --------- #
  // Functions #
  // --------- #
  chordMaker = function(key, name = "", over = "") {
    if (!name) {
      //TODO name = name # remove key from key
      key = key; // remove name from key
    }
    if (!over) {
      if (!over) { // sets the base as the key if no special over
        //TODO over = name # remove name from name if /
        //name = name # remove over from name if /
        return over = key;
      }
    }
  };

  
  // Playing (should analyze and dispatch work rather than work)
  visuals = function() {
    var colour, key, value;
    //retrieves the name for the chord played
    $('#play').text(allChords[currentChord] || (currentChord ? "?" : "..."));
// 1 layered loops, 144+12 elements, two checks (unless(A AND B XOR A) is fun!)
    for (key in note2oct) {
      value = note2oct[key];
      $('#' + key).css({
        "fill-opacity": currentChord & value ? ".9" : ".05"
      });
    }
    for (key in cords) {
      value = cords[key];
      $("#" + value).css({
        "stroke-opacity": !(key & currentChord ^ key) ? '.9' : ".00"
      });
    }
    if (!allColours[currentChord]) {
      colour = 0x808080;
      for (key in oct2colour) {
        value = oct2colour[key];
        if (currentChord & key) {
          colour += value;
        }
      }
      allColours[currentChord] = '#' + colour.toString(16);
    }
    return $("#colour").css({
      "fill": allColours[currentChord]
    });
  };

  noteStart = function(note) {
    var pitch;
    pitch = note2oct[note];
    if (currentChord & pitch) {
      return;
    }
    currentChord = currentChord | pitch;
    synth.triggerAttack(note + "2", "+0", note2volume[pitch][1]);
    synth.triggerAttack(note + "3", "+0", 1);
    synth.triggerAttack(note + "4", "+0", note2volume[pitch][0]);
    if (false) {
      $(svgal[notes.indexOf(note)]).css({
        "fill-opacity": '.8' //should be moved
      });
    }
    return visuals();
  };

  noteEnd = function(note) {
    var pitch;
    pitch = note2oct[note];
    currentChord = currentChord - pitch;
    synth.triggerRelease(note + "2");
    synth.triggerRelease(note + "3");
    synth.triggerRelease(note + "4");
    if (false) {
      $(svgal[notes.indexOf(note)]).css({
        "fill-opacity": "0"
      });
    }
    return visuals();
  };

  // Teaching

  // Recording

  // Replaying

  // Touch-based playing
  $(window).on("load", function() {
    var id, key;
    // get notes & chords and give them data
    $("#colour").css({
      "opacity": ".5"
    });
    for (key in svgal) {
      id = svgal[key];
      $(id).data('note', notes[key]).css({
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

  oct2colour = {};

  for (key in hexal) {
    value = hexal[key];
    oct2colour[value] = colours[key];
  }

  note2volume = {};

  for (key in hexal) {
    value = hexal[key];
    note2volume[value] = volume[key];
  }

  allColours = {};

  allChords = {};

  allNotes = {};

  for (oct in oct2note) {
    note = oct2note[oct];
    oct = notal.indexOf(note);
    for (chordOct in chords) {
      chordName = chords[chordOct];
      if (!chordName) {
        continue;
      }
      chordOct = (chordOct >> 12 - oct) + (chordOct << oct & 0o7777); // wheel work don't ask
      if (!allChords[chordOct]) {
        allChords[chordOct] = [];
      }
      allChords[chordOct].push(note + chordName);
      allNotes[note + chordName] = chordOct;
    }
  }

}).call(this);
