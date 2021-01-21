(function() {
  var cX, cY, colors, ctx, drawDonut, drawWedge2, gradient, midFrequency, radius, tones, totalArc;

  midFrequency = 440;

  tones = 12;

  colors = ['#f00', '#f80', '#ff0'];

  ctx = null;

  cX = null;

  cY = null;

  radius = null;

  totalArc = null;

  gradient = null;

  drawWedge2 = function(tones, color) {
    var arcRadians;
    arcRadians = 360 / tones * Math.PI / 180;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.arc(cX, cY, radius, totalArc, totalArc + arcRadians, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    return totalArc += arcRadians;
  };

  drawDonut = function() {
    var key, value;
    for (key in colors) {
      value = colors[key];
      drawWedge2(tones, colors[key]);
    }
    // cut out an inner-circle == donut
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.fillStyle = gradient;
    ctx.arc(cX, cY, radius * .60, 0, 2 * Math.PI, false);
    return ctx.fill();
  };

  $(window).on("load", function() {
    var canvas;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cX = Math.floor(canvas.width / 2);
    cY = Math.floor(canvas.height / 2);
    radius = Math.min(cX, cY) * .75;
    totalArc = 0;
    gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#008B8B");
    gradient.addColorStop(0.75, "#F5DEB3");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return drawDonut();
  });

}).call(this);
