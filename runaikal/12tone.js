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
  var allChords, allNotes, chordMaker, chordName, chordOct, chords, colours, cords, currentChord, hexal, i, key, keyboard2notes, notal, note, note2colour, note2oct, note2volume, noteEnd, noteStart, notes, oct, oct2note, svg2notes, synth, synthJSON, synthJSONs, synthNotes, val, value, visuals, volume, volumes;

  currentChord = 0o0; // All notes being played

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
      partials: [.5, 1, .5]
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

  synthNotes = {
    "C": 0,
    "Db": 1,
    "D": 2,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "Gb": 6,
    "G": 7,
    "Ab": 8,
    "A": 9,
    "Bb": 10,
    "B": 11
  };

  volumes = [
    [
      1 / 12,
      1,
      12 / 12 //C
    ],
    [
      2 / 12,
      1,
      11 / 12 //Db
    ],
    [
      3 / 12,
      1,
      10 / 12 //D
    ],
    [
      4 / 12,
      1,
      9 / 12 //Eb
    ],
    [
      5 / 12,
      1,
      8 / 12 //E
    ],
    [
      6 / 12,
      1,
      7 / 12 //F
    ],
    [
      7 / 12,
      1,
      6 / 12 //Gb
    ],
    [
      8 / 12,
      1,
      5 / 12 //G
    ],
    [
      9 / 12,
      1,
      4 / 12 //Ab
    ],
    [
      10 / 12,
      1,
      3 / 12 //A
    ],
    [
      11 / 12,
      1,
      2 / 12 //Bb
    ],
    [
      12 / 12,
      1,
      1 / 12 //B
    ]
  ];

  synth = {};

  synthJSONs = {};

  for (i in volumes) {
    volume = volumes[i];
    synthJSONs[i] = {};
    for (key in synthJSON) {
      val = synthJSON[key];
      if (key === 'oscillator') {
        synthJSONs[i][key] = {
          type: 'custom',
          partials: volumes[i]
        };
      } else {
        synthJSONs[i][key] = val;
      }
    }
    console.log(synthJSONs[i]);
    synth[i] = new Tone.AMSynth(synthJSONs[i]).toMaster();
  }

  notal = ["C", "G", "D", "A", "E", "B", "Gb", "Db", "Ab", "Eb", "Bb", "F"];

  hexal = [0x001, 0x002, 0x004, 0x008, 0x010, 0x020, 0x040, 0x080, 0x100, 0x200, 0x400, 0x800];

  colours = [0x001010, 0x000818, 0x000020, 0x080018, 0x100010, 0x180008, 0x200000, 0x180800, 0x101000, 0x081800, 0x002000, 0x001808];

  svg2notes = ['#N0001', '#N0002', '#N0004', '#N0010', '#N0020', '#N0040', '#N0100', '#N0200', '#N0400', '#N1000', '#N2000', '#N4000'];

  notes = ['C3', 'G3', 'D3', 'A3', 'E3', 'B3', 'Gb3', 'Db3', 'Ab3', 'Eb3', 'Bb3', 'F3', 'C4', 'G4', 'D4', 'A4', 'E4', 'B4', 'Gb4', 'Db4', 'Ab4', 'Eb4', 'Bb4', 'F4', 'C5', 'G5', 'D5', 'A5', 'E5', 'B5', 'Gb5', 'Db5', 'Ab5', 'Eb5', 'Bb5', 'F5'];

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
    0x00B: "6s",
    0x00F: "69no3",
    0x011: "M3rd",
    0x013: "M",
    0x015: "add2no5",
    0x017: "Madd2",
    0x019: "",
    0x01B: "6",
    0x01F: "6/9",
    0x021: "M7th",
    0x023: "M7s",
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
    0x085: "s2sb2no5?",
    0x087: "s2addb2",
    0x089: "sb2add6no5",
    0x08B: "add6sb2",
    0x091: "",
    0x093: "Maddb2",
    0x0A1: "",
    0x0A3: "M7sb9",
    0x0C1: "",
    0x0C3: "sb2#4",
    0x0C5: "",
    0x0C9: "",
    0x101: "m6th",
    0x103: "5addb6?",
    0x105: "9#5no3no7?",
    0x109: "6#5s",
    0x111: "aug",
    0x113: "Mb6",
    0x201: "m3rd",
    0x203: "m",
    0x205: "madd2no5",
    0x207: "madd2",
    0x209: "dim",
    0x20B: "m6",
    0x20F: "m6/9",
    0x24F: "m6/9addb2",
    0x211: "",
    0x213: "Maddb3",
    0x215: "Madd9addb3",
    0x221: "",
    0x223: "mM7",
    0x225: "",
    0x241: "",
    0x243: "",
    0x245: "",
    0x249: "dim7",
    0x24B: "dim7add5",
    0x24D: "dim7add2",
    0x303: "mb6",
    0x305: "",
    0x309: "",
    0x401: "m7th",
    0x403: "7s",
    0x407: "9s2",
    0x409: "",
    0x40B: "13s",
    0x411: "7n5",
    0x413: "7",
    0x415: "9no5",
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
    0x611: "7(#9)no5",
    0x621: "m7add7no5",
    0x801: "4th",
    0x803: "s4",
    0x811: "add4no5",
    0x813: "add4",
    0x831: "M11no5",
    0x833: "M11",
    0xA01: "madd4no5",
    0xA03: "madd4",
    0xC03: "7s4",
    0xC11: "",
    0xC13: "11",
    0xE01: "m11no5",
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
  noteStart = function(note) {
    var pitch;
    if ((note == null) || note === -1) {
      return;
    }
    note = note.slice(0, -1);
    pitch = note2oct[note];
    if (currentChord & pitch) {
      return;
    }
    currentChord = currentChord | pitch;
    synth[synthNotes[note]].triggerAttack(note + "4", "+0");
    if (false) {
      $(svg2notes[notes.indexOf(note)]).css({
        "fill-opacity": '.8' //should be moved
      });
    }
    return visuals();
  };

  noteEnd = function(note) {
    var pitch;
    if ((note == null) || note === -1) {
      return;
    }
    note = note.slice(0, -1);
    pitch = note2oct[note];
    currentChord = currentChord - pitch;
    synth[synthNotes[note]].triggerRelease(note + "4");
    if (false) {
      $(svg2notes[notes.indexOf(note)]).css({
        "fill-opacity": "0"
      });
    }
    return visuals();
  };

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

  
  // Playing
  //(should analyze and dispatch work rather than work)
  visuals = function() {
    var results, value;
    if (true) { //retrieves the name for the chord played
      $('#play').text(allChords[currentChord] || (currentChord ? "?" : "..."));
    }
    if (true) { // 1 layered loops, 144+12 elements, two checks (unless(A AND B XOR A) is fun!)
      for (key in note2oct) {
        value = note2oct[key];
        $('#' + key).css({
          "fill-opacity": currentChord & value ? ".9" : ".05"
        });
      }
      results = [];
      for (key in cords) {
        value = cords[key];
        results.push($("#" + value).css({
          "stroke-opacity": !(key & currentChord ^ key) ? '.9' : ".00"
        }));
      }
      return results;
    }
  };

  // Teaching

  // Recording

  // Replaying

  // Touch-based playing
  $(window).on("load", function() {
    var id;
// get notes & chords and give them data
//$("#colour").css "opacity":.9
    for (key in svg2notes) {
      id = svg2notes[key];
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

  note2colour = {};

  for (key in notal) {
    value = notal[key];
    note2colour[value] = colours[key];
  }

  note2volume = {};

  for (key in hexal) {
    value = hexal[key];
    note2volume[value] = volume[key];
  }

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
