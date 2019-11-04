(function() {
  var notes;

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

  //$(noteId).on 'click', toggleNote noteName for noteId, noteName of notes
  $(window).on("load", function() {
    var adsr, noteId, noteName, results, synth, tonejson;
    synth = {};
    tonejson = {
      adsr: {
        attack: 0.1,
        decay: 0.2,
        sustain: 1,
        release: 0.8
      }
    };
    adsr = new Tone.Envelope(tonejson.adsr);
    results = [];
    for (noteId in notes) {
      noteName = notes[noteId];
      $(noteId).data('note', noteName);
      $(noteId).mousedown(function(e) {
        return synth[noteName].triggerAttack($(this).data('note'));
      });
      $(noteId).mouseup(function(e) {
        return synth[noteName].triggerRelease();
      });
      $(noteId).css({
        cursor: 'pointer'
      });
      synth[noteName] = new Tone.Synth().toMaster();
      results.push(adsr.connect(synth[noteName]));
    }
    return results;
  });

}).call(this);
