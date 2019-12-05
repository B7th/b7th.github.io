(function() {
    // praesis ut prosis ne ut imperes
  // Steps to build

  // Separate note 

  // Each note is given a binary value increasing by fifth.
  // The first note (in general C) is 0o1, the Fifth is 0o2, the 2nd is 0o4, etc.
  // Playing notes together adds them, and it ends up showing that 0o23 will be major,
  // while 0o1003, or 0o31, will be minor
  var chords, currentChord, key, keyboard2notes, note2oct, noteEnd, noteStart, notes, notesPlaying, oct2note, scales, star, svg2notes, synth, synthJSON, value;

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

  currentChord = {};

  for (key in note2oct) {
    value = note2oct[key];
    currentChord[key] = false;
  }

  //name'em all
  scales = {};

  chords = {
    // 0 note
    0o0000: "silence/noise/potato",
    
    // 1 note (0001)
    0o0001: " (unison)",
    
    // 5th
    0o0003: "5",
    0o0007: "sus2no5", // 2nd
    0o0017: "69no3",
    0o0027: "majadd2",
    0o0047: "maj9sus2",
    0o0107: "sus2add#4",
    0o0207: "",
    0o0407: "",
    0o1007: "minadd2",
    0o2007: "",
    0o3007: "",
    0o0013: "6sus", // 6th
    0o0033: "6",
    0o0053: "",
    0o0113: "",
    0o0213: "",
    0o0413: "",
    0o1013: "m6",
    0o2013: "",
    0o0023: "maj", // 3rd
    0o0063: "M7",
    0o0123: "",
    0o0223: "",
    0o0423: "",
    0o1023: "",
    0o2023: "7",
    0o0043: "M7sus", // M7th
    0o0143: "",
    0o0243: "",
    0o0443: "",
    0o1043: "",
    0o2043: "",
    0o0103: "sus(#4)", // b7th
    0o0303: "",
    0o0503: "",
    0o1103: "",
    0o2103: "",
    0o0203: "sus(b2)", // b2nd
    0o0065: "",
    0o0125: "",
    0o0225: "",
    0o0425: "",
    0o1025: "",
    0o2025: "",
    0o0403: "5addb6?", // b6th
    0o1003: "min", // b3rd
    0o2003: "7sus", // b7th
    
    // 2nd
    0o0005: "2nd",
    0o0025: "add2no5", // 3rd
    0o0065: "",
    0o0125: "",
    0o0225: "",
    0o0425: "",
    0o1025: "",
    0o0045: "M7add2no3no5?", // 7th
    0o0145: "",
    0o0245: "",
    0o0445: "",
    0o1045: "",
    0o0105: "9b5no7?", // b5th
    0o0305: "",
    0o0505: "",
    0o1105: "",
    0o0205: "sus2addb2no5?", // b2nd
    0o0205: "",
    0o0205: "",
    0o0405: "9#5no3no7?", // b6th
    0o1405: "",
    0o1005: "minadd2no5?", // b3rd
    0o1405: "",
    
    // 6th
    0o0011: "6th",
    0o0111: "dimrev",
    0o0311: "",
    0o0511: "",
    0o1111: "dim7",
    0o2111: "",
    0o0211: "6susb2no5?",
    0o0611: "",
    0o1211: "",
    0o2211: "",
    0o0411: "6#5sus",
    0o1411: "",
    0o2411: "",
    
    // 3rd
    0o0021: "maj3rd",
    0o0421: "aug",
    // Maj7th
    0o0041: "min2nd",
    // Min5th
    0o0101: "min5th"
  };

  notesPlaying = {};

  notes = ['C3', 'G3', 'D3', 'A3', 'E3', 'B3', 'Gb3', 'Db3', 'Ab3', 'Eb3', 'Bb3', 'F3', 'C4', 'G4', 'D4', 'A4', 'E4', 'B4', 'Gb4', 'Db4', 'Ab4', 'Eb4', 'Bb4', 'F4', 'C5', 'G5', 'D5', 'A5', 'E5', 'B5', 'Gb5', 'Db5', 'Ab5', 'Eb5', 'Bb5', 'F5'];

  svg2notes = ['#C1', '#G1', '#D1', '#A1', '#E1', '#B1', '#Gb1', '#Db1', '#Ab1', '#Eb1', '#Bb1', '#F1', '#C2', '#G2', '#D2', '#A2', '#E2', '#B2', '#Gb2', '#Db2', '#Ab2', '#Eb2', '#Bb2', '#F2', '#C3', '#G3', '#D3', '#A3', '#E3', '#B3', '#Gb3', '#Db3', '#Ab3', '#Eb3', '#Bb3', '#F3'];

  keyboard2notes = [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61];

  star = function() {
    var base, chord2, downChord, i, j, len, octalChord, results, text, value2;
    chord2 = [];
    octalChord = 0o0;
    for (key in currentChord) {
      value = currentChord[key];
      if (value) {
        chord2.push(key);
        octalChord += note2oct[key];
      }
    }
    i = 0;
    base = 0o1;
    text = "";
    downChord = octalChord;
    while (!((chords[octalChord] != null) || i === 12)) {
      if (downChord & 0o1) {
        downChord = downChord + 0o10000;
      }
      downChord = downChord >> 1;
      i = i + 1;
      base = base * 2;
      if (chords[downChord] != null) {
        octalChord = downChord;
      }
    }
    if (chords[octalChord] != null) {
      text = chords[octalChord];
    }
    if (!octalChord) {
      base = "";
    }
    if (!text) {
      text = downChord.toString(8);
    }
    if (oct2note[base] != null) {
      text = oct2note[base] + text;
    }
    $('#play').text(text);
    
    //cord lighting

    $('#cords').children().css({
      stroke: '#b2b2b2'
    });
    $('#notes').children().css({
      fill: '#b2b2b2'
    });
    results = [];
    for (j = 0, len = chord2.length; j < len; j++) {
      value = chord2[j];
      $('#' + value).css({
        fill: '#fff'
      });
      results.push((function() {
        var k, len1, results1;
        results1 = [];
        for (k = 0, len1 = chord2.length; k < len1; k++) {
          value2 = chord2[k];
          results1.push($('#' + value + '_' + value2).remove().appendTo('#cords').css({
            stroke: '#fff'
          }));
        }
        return results1;
      })());
    }
    return results;
  };

  synthJSON = {
    envelope: {
      attack: 0.01,
      attackCurve: 'linear',
      decay: .4,
      decayCurve: 'exponential',
      sustain: 1,
      release: 1.2
    },
    oscillator: {
      type: 'custom',
      phase: 1,
      partials: [1]
    }
  };

  //reverb:
  //  decay:
  synth = new Tone.PolySynth(12, Tone.DuoSynth, synthJSON).toMaster();

  noteStart = function(note) {
    var id;
    if (note === -1 || notesPlaying[note] || (note == null)) {
      return;
    }
    notesPlaying[note] = true; //prevents repeat
    id = svg2notes[notes.indexOf(note)];
    synth.triggerAttack(note);
    currentChord[note.slice(0, -1)] = true;
    star();
    return $(id).css({
      fill: '#fff'
    });
  };

  noteEnd = function(note) {
    var id;
    if (note === -1 || (note == null)) {
      return;
    }
    notesPlaying[note] = false;
    id = svg2notes[notes.indexOf(note)];
    synth.triggerRelease(note);
    currentChord[note.slice(0, -1)] = false;
    star();
    return $(id).css({
      fill: $(id).data('color')
    });
  };

  // Teaching

  // Recording

  // Replaying

  // Touch-based playing
  $(window).on("load", function() {
    var id;
    for (key in svg2notes) {
      id = svg2notes[key];
      $(id).data('note', notes[key]);
      $(id).data('color', $(id).css('fill'));
      $(id).css({
        cursor: 'pointer'
      });
      $(id).mousedown(function() {
        return noteStart($(this).data('note'));
      });
      $(id).mouseup(function() {
        return noteEnd($(this).data('note'));
      });
      $(id).on('touchstart', function() {
        return noteStart($(this).data('note'));
      });
      $(id).on('touchend', function() {
        return noteEnd($(this).data('note'));
      });
    }
    $('body').on('keydown', function(e) {
      if (keyboard2notes.indexOf(e.which != null)) {
        noteStart(notes[keyboard2notes.indexOf(e.which)]);
      }
      return false;
    });
    return $('body').on('keyup', function(e) {
      if (keyboard2notes.indexOf(e.which != null)) {
        noteEnd(notes[keyboard2notes.indexOf(e.which)]);
      }
      return false;
    });
  });

}).call(this);
