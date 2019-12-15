(function() {
    // praesis ut prosis ne ut imperes
  // Steps to build

  // Separate note 

  // Picture by D Sharon Pruitt

  // Each note is given a binary value increasing by fifth.
  // The first note (in general C) is 0o1, the Fifth is 0o2, the 2nd is 0o4, etc.
  // Playing notes together adds them, and it ends up showing that 0o23 will be major,
  // while 0o1003, or 0o31, will be minor

  //event listeners for changes in currentchord and currentnotes

  // sets star's colors (will be a class soon)
  var chordAnalyser, chordLighting, chords, currentChord, currentNotes, key, keyboard2notes, note2oct, noteEnd, noteStart, notes, oct2note, scales, svg2notes, synth, synthJSON, value;

  chordLighting = function(currentChord) {
    var key, key2, results, value, value2;
    $('#cords').children().css({
      stroke: '#b2b2b2',
      "stroke-opacity": '.1'
    });
    $('#notes').children().css({
      fill: '#b2b2b2',
      "fill-opacity": ".1"
    });
    results = [];
    for (key in note2oct) {
      value = note2oct[key];
      if (currentChord & value) {
        // sets used colors for name
        $('#' + key).css({
          fill: '#fff',
          "fill-opacity": ".9"
        });
      }
      results.push((function() {
        var results1;
        results1 = [];
        for (key2 in note2oct) {
          value2 = note2oct[key2];
          // sets used colors for relations
          if (currentChord & value2 && currentChord & value) {
            results1.push($('#' + key + '_' + key2).remove().appendTo('#cords').css({
              stroke: '#fff',
              "stroke-opacity": '.9'
            }));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      })());
    }
    return results;
  };

  //retrieves the name for the chord played
  chordAnalyser = function(currentChord) {
    var base, octalChord, text;
    octalChord = currentChord;
    base = 0o1; // C
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

  synthJSON = {
    harmonicity: 1,
    modulationIndex: 2,
    envelope: {
      attack: 0.01,
      decay: 2,
      sustain: .1,
      release: 2
    },
    oscillator: {
      type: 'sine'
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

  // Playing

  //(should analyze and dispatch work rather than work)
  noteStart = function(note) {
    var currentChord, octave, pitch;
    if (note == null) {
      return;
    }
    pitch = note2oct[note.slice(0, -1)];
    octave = note.slice(-1);
    if (note === -1 || currentNotes[octave] & pitch) {
      return;
    }
    currentNotes[octave] = currentNotes[octave] | pitch; //prevents repeat
    $(svg2notes[notes.indexOf(note)]).css({
      fill: '#fff' //should be moved
    });
    currentChord = currentNotes[1] | currentNotes[2] | currentNotes[3] | currentNotes[4] | currentNotes[5];
    synth.triggerAttack(note);
    chordAnalyser(currentChord);
    return chordLighting(currentChord);
  };

  noteEnd = function(note) {
    var currentChord, octave, pitch;
    if (note === -1 || (note == null)) {
      return;
    }
    pitch = note2oct[note.slice(0, -1)];
    octave = note.slice(-1);
    currentNotes[octave] = currentNotes[octave] - pitch;
    $(svg2notes[notes.indexOf(note)]).css({
      fill: $(svg2notes[notes.indexOf(note)]).data('color')
    });
    currentChord = currentNotes[1] | currentNotes[2] | currentNotes[3] | currentNotes[4] | currentNotes[5];
    synth.triggerRelease(note);
    chordAnalyser(currentChord);
    return chordLighting(currentChord);
  };

  // Teaching

  // Recording

  // Replaying

  // Touch-based playing
  $(window).on("load", function() {
    var id, key;
    for (key in svg2notes) {
      id = svg2notes[key];
      $(id).data('note', notes[key]);
      $(id).data('color', $(id).css('fill'));
      $(id).css({
        cursor: 'pointer' //? Can I find another way?
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
    // 1 note span (unison)
    0o0001: " (unison)",
    // 2 Note span (maj fifth)
    0o0003: "5",
    
    // 3 note span (maj 2nd)
    0o0005: "2nd",
    0o0007: "sus2",
    // 4 note span (maj 6th)
    0o0011: "6th",
    0o0013: "6sus",
    0o0017: "69no3",
    // 5 Note span (maj 3rd)
    0o0021: "maj3rd",
    0o0023: "maj",
    0o0025: "add2no5",
    0o0027: "majadd2",
    0o0033: "6",
    // 6 Note span (maj 7th)
    0o0041: "min2nd",
    0o0043: "maj7sus",
    0o0045: "maj7add2no3no5?",
    0o0047: "maj9sus2",
    0o3005: "m9no5",
    0o3007: "m9",
    0o0063: "maj7",
    0o0065: "maj9no5",
    0o0067: "maj9",
    // 7 Note span (min 5th)
    0o0101: "min5th",
    0o0103: "sus(#4)",
    0o0105: "9b5no7?",
    0o0107: "sus2add#4",
    0o3011: "m13no5",
    0o0123: "majadd#4",
    0o0125: "9b5",
    0o2031: "13no5", //0145
    0o0203: "sus(b2)",
    0o0205: "sus2addb2no5?",
    0o6041: "11no5", //0207
    0o0211: "6susb2no5?",
    0o0213: "",
    0o0223: "majaddb2",
    0o0225: "",
    0o0243: "maj7susb9",
    0o0245: "",
    0o0303: "",
    0o0305: "",
    0o0311: "",
    0o0403: "5addb6?",
    0o0405: "9#5no3no7?",
    0o0407: "",
    0o0411: "6#5sus",
    0o0413: "",
    0o0421: "aug",
    0o0423: "majb6",
    0o2421: "aug7",
    0o0443: "",
    0o0445: "13/?",
    0o0503: "",
    0o0511: "",
    0o0611: "",
    0o1003: "min",
    0o1005: "minadd2no5?",
    0o1007: "minadd2",
    0o1011: "dim",
    0o1013: "m6",
    0o1023: "majaddb3",
    0o1025: "",
    0o1043: "minmaj7",
    0o1045: "",
    0o1103: "",
    0o1105: "",
    0o1111: "dim7",
    0o1211: "",
    0o1405: "",
    0o1405: "",
    0o1411: "",
    0o2003: "7sus",
    0o2007: "9sus2",
    0o2013: "13sus",
    0o2023: "7",
    0o2025: "9no5",
    0o2027: "9",
    0o2043: "",
    0o2103: "",
    0o2111: "",
    0o2121: "7b5",
    0o2211: "",
    0o2411: "",
    0o4061: "maj11no5"
  };

  notes = ['C3', 'G3', 'D3', 'A3', 'E3', 'B3', 'Gb3', 'Db3', 'Ab3', 'Eb3', 'Bb3', 'F3', 'C4', 'G4', 'D4', 'A4', 'E4', 'B4', 'Gb4', 'Db4', 'Ab4', 'Eb4', 'Bb4', 'F4', 'C5', 'G5', 'D5', 'A5', 'E5', 'B5', 'Gb5', 'Db5', 'Ab5', 'Eb5', 'Bb5', 'F5'];

  svg2notes = ['#C1', '#G1', '#D1', '#A1', '#E1', '#B1', '#Gb1', '#Db1', '#Ab1', '#Eb1', '#Bb1', '#F1', '#C2', '#G2', '#D2', '#A2', '#E2', '#B2', '#Gb2', '#Db2', '#Ab2', '#Eb2', '#Bb2', '#F2', '#C3', '#G3', '#D3', '#A3', '#E3', '#B3', '#Gb3', '#Db3', '#Ab3', '#Eb3', '#Bb3', '#F3'];

  keyboard2notes = [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222, 13, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61];

}).call(this);
