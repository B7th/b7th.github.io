(function() {
    // x
  // Steps to build

  // Separate note 

  // Picture by D Sharon Pruitt

  // Each note is given a binary value increasing by fifth.
  // The first note (in general C) is 0o1, the Fifth is 0o2, the 2nd is 0o4, etc.
  // Playing notes together adds them, and it ends up showing that 0o23 will be major,
  // while 0o1003, or 0o31, will be minor

  //event listeners for changes in currentchord and currentnotes

  // sets star's colors (will be a class soon)
  var chordAnalyser, chordLighting, chordMaker, chords, colours, cords, currentChord, currentNotes, key, keyboard2notes, note2oct, noteEnd, noteStart, notes, oct2note, play, scales, svg2notes, synth, synthJSON, value;

  chordLighting = function(currentChord) {
    var colour, key, results, value;
    // 1 layered loops, 144+12 elements, two checks (unless(A AND B XOR A) is fun!)
    $("#colour").css({
      "fill": "#fff"
    });
    colour = 0xffffff;
    for (key in note2oct) {
      value = note2oct[key];
      $('#' + key).css({
        "fill-opacity": currentChord & value ? ".9" : ".05"
      });
    }
//colour=colour-colours[key] if currentChord & value
//$("#colour").css "fill":"#"+colour.toString 16
    results = [];
    for (key in cords) {
      value = cords[key];
      results.push($("#" + value).css({
        "stroke-opacity": !(key & currentChord ^ key) ? '.9' : ".00"
      }));
    }
    return results;
  };

  //retrieves the name for the chord played
  chordAnalyser = function(currentChord) {
    var base, octalChord, text;
    // TODO: Render multiple chord names. Currently only one
    octalChord = currentChord;
    base = 0o1; // C is assumed first but all notes are equal
    text = "";
    while (!((chords[octalChord] != null) || base === 0o10000)) {
      if (octalChord & 0o1) { //loop
        octalChord = octalChord + 0o10000;
      }
      octalChord = octalChord >> 1;
      base = base << 1;
    }
    if (chords[octalChord] != null) {
      text = chords[octalChord];
    }
    if (!octalChord) {
      base = "";
    }
    if (!text) {
      text = octalChord.toString(8);
    }
    if (oct2note[base] != null) {
      text = oct2note[base] + text + "(" + base.toString(8) + "'" + octalChord.toString(8) + ")";
    }
    return $('#play').text(text);
  };

  chordMaker = function(key, name = "", over = "") {
    var base, chord, note, oct, pitch, results;
    if (!name) {
      //TODO name = name # remove key from key
      key = key; // remove name from key
    }
    if (!over) {
      if (!over) { // sets the base as the key if no special over
        //TODO over = name # remove name from name if /
        //name = name # remove over from name if /
        over = key;
      }
    }

//Stop all currently playing notes
    for (pitch in currentNotes) {
      chord = currentNotes[pitch];
      for (note in note2oct) {
        oct = note2oct[note];
        if (chord & oct) {
          noteEnd(note + pitch);
        }
      }
    }
    chord = chords.indexOf(name);
    base = note2oct(key);
    while (base !== 1) {
      chord = chord << 1;
      if (chord & 0o10000) {
        chord = chord + 1;
      }
      base = base >> 1;
    }
    noteStart(over + "3");
    results = [];
    for (note in note2oct) {
      oct = note2oct[note];
      if (chord & oct) {
        results.push(noteStart(note + "4"));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  // Playing
  //(should analyze and dispatch work rather than work)
  noteStart = function(note) {
    var currentChord, octave, pitch;
    if ((note == null) || note === -1) {
      return;
    }
    pitch = note2oct[note.slice(0, -1)];
    octave = note.slice(-1);
    if (currentNotes[octave] & pitch) {
      return;
    }
    currentNotes[octave] = currentNotes[octave] | pitch; //prevents repeat
    currentChord = currentNotes[1] | currentNotes[2] | currentNotes[3] | currentNotes[4] | currentNotes[5];
    $(svg2notes[notes.indexOf(note)]).css({
      "fill-opacity": '.8' //should be moved
    });
    chordAnalyser(currentChord);
    chordLighting(currentChord);
    return synth.triggerAttack(note);
  };

  noteEnd = function(note) {
    var currentChord, octave, pitch;
    if ((note == null) || note === -1) {
      return;
    }
    pitch = note2oct[note.slice(0, -1)];
    octave = note.slice(-1);
    currentNotes[octave] = currentNotes[octave] - pitch;
    currentChord = currentNotes[1] | currentNotes[2] | currentNotes[3] | currentNotes[4] | currentNotes[5];
    $(svg2notes[notes.indexOf(note)]).css({
      "fill-opacity": ".1"
    });
    chordAnalyser(currentChord);
    chordLighting(currentChord);
    return synth.triggerRelease(note);
  };

  // Teaching

  // Recording

  // Replaying

  // Touch-based playing
  $(window).on("load", function() {
    var id, key;
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
  synthJSON = {
    harmonicity: 1,
    modulationIndex: 2,
    envelope: {
      attack: 0.01,
      decay: .7,
      sustain: 0,
      release: 6
    },
    oscillator: {
      type: 'custom',
      partials: [1, .5, .1, .5, .3]
    },
    modulation: {
      type: 'square'
    },
    modulationEnvelope: {
      attack: 0.002,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  };

  synth = new Tone.PolySynth(12, Tone.FMSynth, synthJSON).toMaster();

  note2oct = {
    "C": 0o0001,
    "G": 0o0002,
    "D": 0o0004,
    "A": 0o0010,
    "E": 0o0020,
    "B": 0o0040,
    "Gb": 0o0100,
    "Db": 0o0200,
    "Ab": 0o0400,
    "Eb": 0o1000,
    "Bb": 0o2000,
    "F": 0o4000
  };

  oct2note = {};

  for (key in note2oct) {
    value = note2oct[key];
    oct2note[value] = key;
  }

  colours = {
    "C": 0x001010,
    "G": 0x000818,
    "D": 0x000020,
    "A": 0x080018,
    "E": 0x100010,
    "B": 0x180008,
    "Gb": 0x200000,
    "Db": 0x180800,
    "Ab": 0x101000,
    "Eb": 0x081800,
    "Bb": 0x002000,
    "F": 0x001808
  };

  currentChord = 0o0;

  currentNotes = {
    1: 0o0,
    2: 0o0,
    3: 0o0,
    4: 0o0,
    5: 0o0
  };

  //name'em all
  scales = {};

  chords = {
    0o0000: "(silence)",
    // 1 note span (unison) # 2 Note span (M fifth) # 3 note span (M 2nd)
    0o0001: " (unison)",
    0o0003: "5",
    0o0005: "2nd",
    0o0007: "s2",
    0o0011: "6th",
    0o0013: "6s",
    0o0017: "69no3",
    0o0021: "M3rd",
    0o0023: "M",
    0o0025: "add2no5",
    0o0027: "Madd2",
    0o10031: "",
    0o0037: "6/9",
    0o0041: "M7th",
    0o0043: "M7s",
    0o0045: "M7s2n5",
    0o0047: "M9s2",
    0o10061: "",
    0o0063: "M7",
    0o0065: "M9no5",
    0o0067: "M9",
    0o0101: "m5th",
    0o0103: "s#4",
    0o0105: "add9b5",
    0o0107: "s2add#4",
    0o10121: "",
    0o0123: "Madd#4",
    0o0125: "9b5",
    0o0127: "add2#4",
    0o0161: "M7b5",
    0o10201: "",
    0o0203: "sb2",
    0o0205: "s2sb2no5?",
    0o0207: "s2addb2",
    0o0211: "sb2add6no5",
    0o0213: "add6sb2",
    0o0223: "Maddb2",
    0o0243: "M7sb9",
    0o10301: "",
    0o0303: "sb2#4",
    0o0305: "",
    0o0311: "",
    0o10401: "",
    0o0403: "5addb6?",
    0o0405: "9#5no3no7?",
    0o0411: "6#5s",
    0o0421: "aug",
    0o0423: "Mb6",
    0o0503: "",
    0o0511: "",
    0o0611: "",
    0o11001: "",
    0o1003: "m",
    0o1005: "madd2no5",
    0o1007: "madd2",
    0o1011: "dim",
    0o1013: "m6",
    0o1017: "m6/9",
    0o11021: "",
    0o1023: "Maddb3",
    0o1025: "Madd9addb3",
    0o11041: "",
    0o1043: "mM7",
    0o1045: "",
    0o11101: "",
    0o1103: "",
    0o1105: "",
    0o1111: "dim7",
    0o1211: "",
    0o1405: "",
    0o1411: "",
    0o12001: "",
    0o2003: "7s",
    0o2007: "9s2",
    0o2013: "13s",
    0o12021: "",
    0o2023: "7",
    0o2025: "9no5",
    0o2027: "9",
    0o2031: "13no5",
    0o2033: "13",
    0o2043: "",
    0o2103: "",
    0o2111: "13b5s",
    0o2121: "7b5",
    0o2211: "",
    0o2411: "13#5s",
    0o2421: "aug7",
    0o13001: "",
    0o3003: "m7",
    0o3005: "m9no5",
    0o3007: "m9",
    0o3011: "m13no5",
    0o3013: "m13",
    0o3017: "m9/13",
    0o3021: "7(#9)no5",
    0o3041: "m7add7no5",
    0o4061: "M11no5",
    0o4063: "M11",
    0o6023: "11",
    0o7007: "m9/11",
    0o7777: "!!!!!!??????",
    0o3777: ".....?????",
    0o1777: "....????",
    0o0777: "..??",
    0o0377: "..?",
    0o0177: ".?"
  };

  ({
    scales: {
      0o2525: " whole tone scale",
      0o4077: " major scale",
      0o5057: " melodic minor scale",
      0o5447: " harmonic minor scale",
      0o5643: " neapolitan minor scale",
      0o5253: " neapolitan major scale",
      0o2761: " enigmatic scale"
    }
  });

  notes = ['C3', 'G3', 'D3', 'A3', 'E3', 'B3', 'Gb3', 'Db3', 'Ab3', 'Eb3', 'Bb3', 'F3', 'C4', 'G4', 'D4', 'A4', 'E4', 'B4', 'Gb4', 'Db4', 'Ab4', 'Eb4', 'Bb4', 'F4', 'C5', 'G5', 'D5', 'A5', 'E5', 'B5', 'Gb5', 'Db5', 'Ab5', 'Eb5', 'Bb5', 'F5'];

  svg2notes = ['#C1', '#G1', '#D1', '#A1', '#E1', '#B1', '#Gb1', '#Db1', '#Ab1', '#Eb1', '#Bb1', '#F1', '#C2', '#G2', '#D2', '#A2', '#E2', '#B2', '#Gb2', '#Db2', '#Ab2', '#Eb2', '#Bb2', '#F2', '#C3', '#G3', '#D3', '#A3', '#E3', '#B3', '#Gb3', '#Db3', '#Ab3', '#Eb3', '#Bb3', '#F3'];

  keyboard2notes = [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61];

  cords = {
    0o0003: "C_G",
    0o0005: "C_D",
    0o0011: "C_A",
    0o0021: "C_E",
    0o0041: "C_B",
    0o0101: "C_Gb",
    0o0201: "C_Db",
    0o0401: "C_Ab",
    0o1001: "C_Eb",
    0o2001: "C_Bb",
    0o4001: "C_F",
    0o0006: "G_D",
    0o0012: "G_A",
    0o0022: "G_E",
    0o0042: "G_B",
    0o0102: "G_Gb",
    0o0202: "G_Db",
    0o0402: "G_Ab",
    0o1002: "G_Eb",
    0o2002: "G_Bb",
    0o4002: "G_F",
    0o0014: "D_A",
    0o0024: "D_E",
    0o0044: "D_B",
    0o0104: "D_Gb",
    0o0204: "D_Db",
    0o0404: "D_Ab",
    0o1004: "D_Eb",
    0o2004: "D_Bb",
    0o4004: "D_F",
    0o0030: "A_E",
    0o0050: "A_B",
    0o0110: "A_Gb",
    0o0210: "A_Db",
    0o0410: "A_Ab",
    0o1010: "A_Eb",
    0o2010: "A_Bb",
    0o4010: "A_F",
    0o0060: "E_B",
    0o0120: "E_Gb",
    0o0220: "E_Db",
    0o0420: "E_Ab",
    0o1020: "E_Eb",
    0o2020: "E_Bb",
    0o4020: "E_F",
    0o0140: "B_Gb",
    0o0240: "B_Db",
    0o0440: "B_Ab",
    0o1040: "B_Eb",
    0o2040: "B_Bb",
    0o4040: "B_F",
    0o0300: "Gb_Db",
    0o0500: "Gb_Ab",
    0o1100: "Gb_Eb",
    0o2100: "Gb_Bb",
    0o4100: "Gb_F",
    0o0600: "Db_Ab",
    0o1200: "Db_Eb",
    0o2200: "Db_Bb",
    0o4200: "Db_F",
    0o1400: "Ab_Eb",
    0o2400: "Ab_Bb",
    0o4400: "Ab_F",
    0o3000: "Eb_Bb",
    0o5000: "Eb_F",
    0o6000: "Bb_F"
  };

  play = {
    "3 span": [0o0007],
    "4 span": [0o0013, 0o2003, 0o0017],
    "5 span": [0o0023, 0o0027, 0o0025]
  };

}).call(this);
