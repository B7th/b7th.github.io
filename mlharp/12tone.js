(function() {
  var i, ids, keys, len, notes, values;

  notes = {
    '#C1': 'C3',
    '#G1': 'G3',
    '#D1': 'D3',
    '#A1': 'A3',
    '#E1': 'E3',
    '#B1': 'B3',
    '#F1': 'F3',
    '#Bb1': 'Bb3',
    '#Gb1': 'Gb3',
    '#Db1': 'Db3',
    '#Ab1': 'Ab3',
    '#Eb1': 'Eb3',
    '#C2': 'C4',
    '#G2': 'G4',
    '#D2': 'D4',
    '#A2': 'A4',
    '#E2': 'E4',
    '#B2': 'B4',
    '#F2': 'F4',
    '#Bb2': 'Bb4',
    '#Gb2': 'Gb4',
    '#Db2': 'Db4',
    '#Ab2': 'Ab4',
    '#Eb2': 'Eb4',
    '#C3': 'C5',
    '#G3': 'G5',
    '#D3': 'D5',
    '#A3': 'A5',
    '#E3': 'E5',
    '#B3': 'B5',
    '#F3': 'F5',
    '#Bb3': 'Bb5',
    '#Gb3': 'Gb5',
    '#Db3': 'Db5',
    '#Ab3': 'Ab5',
    '#Eb3': 'Eb5'
  };

  ids = {};

  for (values = i = 0, len = notes.length; i < len; values = ++i) {
    keys = notes[values];
    ids[values] = keys;
  }

  keys = {
    49: 'C5',
    50: 'G5',
    51: 'D5',
    52: 'A5',
    53: 'E5',
    54: 'B5',
    55: 'Gb5',
    56: 'Db5',
    57: 'Ab5',
    48: 'Eb5',
    173: 'Bb5',
    61: 'F5',
    81: 'C4',
    87: 'G4',
    69: 'D4',
    82: 'A4',
    84: 'E4',
    89: 'B4',
    85: 'Gb4',
    73: 'Db4',
    79: 'Ab4',
    80: 'Eb4',
    219: 'Bb4',
    221: 'F4',
    65: 'C3',
    83: 'G3',
    68: 'D3',
    70: 'A3',
    71: 'E3',
    72: 'B3',
    74: 'Gb3',
    75: 'Db3',
    76: 'Ab3',
    59: 'Eb3',
    222: 'Bb3',
    13: 'F3'
  };

  $(window).on("load", function() {
    var noteEnd, noteId, noteName, noteStart, notesPlaying, synth, synthJSON;
    synth = {};
    synthJSON = {
      envelope: {
        attack: 0.05,
        attackCurve: 'exponential',
        decay: .4,
        decayCurve: 'exponential',
        sustain: 1,
        release: 0.8
      },
      oscillator: {
        type: 'custom',
        phase: 1,
        partials: [1]
      }
    };
//reverb:
//  decay:
    for (noteId in notes) {
      noteName = notes[noteId];
      $(noteId).data('note', noteName);
      $(noteId).css({
        cursor: 'pointer'
      });
      $(noteId).mousedown(function() {
        return noteStart($(this).data('note'));
      });
      $(noteId).mouseup(function() {
        return noteEnd($(this).data('note'));
      });
      $(noteId).on('touchstart', function() {
        return noteStart($(this).data('note'));
      });
      $(noteId).on('touchend', function() {
        return noteEnd($(this).data('note'));
      });
    }
    $('body').on('keydown', function(e) {
      if (keys[e.which] != null) {
        noteStart(keys[e.which]);
      }
      return false;
    });
    $('body').on('keyup', function(e) {
      if (keys[e.which] != null) {
        noteEnd(keys[e.which]);
      }
      return false;
    });
    synth = new Tone.PolySynth(synthJSON).toMaster();
    notesPlaying = {};
    noteStart = function(noteName) {
      if (notesPlaying[noteName]) {
        return;
      }
      notesPlaying[noteName] = true;
      return synth.triggerAttack(noteName);
    };
    //$(ids[noteName]).style.fill = "#fff"
    //$(ids[noteName]).style.stroke= "#fff"
    return noteEnd = function(noteName) {
      notesPlaying[noteName] = false;
      synth.triggerRelease(noteName);
      return $(ids[noteName]).css({
        "fill": ""
      });
    };
  });

}).call(this);
