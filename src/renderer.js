import Word from './word.js';
import Punctuation from './punctuation.js';

class Drawer {
  constructor() {
    this.maxWidth = $(window).width()*0.5;
    this.scale = 3;
    this.maxPixels = this.maxWidth/this.scale;
    this.text = [];
    this.canvases = [];
    this.addLine();
  }

  createCanvas() {
    const c = document.createElement('canvas');
    c.width = 10;
    c.height = 10;
    c.style = `padding:${this.scale*3}px;display:block;`;
    document.getElementById("canvasDiv").appendChild(c);
    this.canvases.push(c);
  }
  currentWord() {
    const line = this.text[this.text.length - 1];
    return line[line.length - 1];
  }

  addWord() {
    this.text[this.text.length - 1].push(new Word());
  }

  addPunctuation(type) {
    this.text[this.text.length - 1].push(new Punctuation(type));
  }

  addLine() {
    this.text.push([]);
    this.createCanvas();
    this.addWord();
  }
  addFilledLine(w) {
    this.text.push([]);
    this.createCanvas();
    this.text[this.text.length - 1].push(w);
  }

  draw(l=this.text.length-1) {
    this.text[l][this.text[l].length - 1].render();
    var maxHeight = 0;
    var lineWidth = 0;
    this.text[l].forEach(w => {
      if(w.pixelArray.length > maxHeight) maxHeight = w.pixelArray.length;
      lineWidth += w.pixelArray[0].length; 
    });
    var tempWord = false;
    if (lineWidth > this.maxPixels) {
      tempWord = this.text[l][this.text[l].length - 1];
      this.text[l].pop();
    }
    const fullGrid = new Array(maxHeight).fill([]);
    for(var i = 0; i < maxHeight; i++) {
      this.text[l].forEach(w => {
        if(w.pixelArray.length > i) fullGrid[i] = fullGrid[i].concat(w.pixelArray[i]);
        else fullGrid[i] = fullGrid[i].concat(new Array(w.pixelArray[w.pixelArray.length-1].length));
        fullGrid[i] = fullGrid[i].concat(new Array(5));
      });
    }

    this.canvases[l].height = fullGrid.length*this.scale;
    this.canvases[l].width = fullGrid[0].length*this.scale;

    let ctx = this.canvases[l].getContext("2d");

    for (let y = 0; y < fullGrid.length; y++) {
      for (let x = 0; x < fullGrid[0].length; x++) {
        if(fullGrid[y][x] == 1) ctx.fillRect(x*this.scale, y*this.scale, this.scale, this.scale);
      }
    }
    if(tempWord != false) {
      this.addFilledLine(tempWord);
  
      this.draw();
    }
  }
}

const d = new Drawer();
d.draw();

$("#upScaleBtn").click(function() {
  d.scale++;
  d.maxPixels = d.maxWidth/this.scale;
  for(var i = 0; i < d.text.length; i++) d.draw(i);
  $("canvas").attr("style", `padding:${d.scale*3}px;display:block;`);
});

$("#downScaleBtn").click(function() {
  d.scale--;
  d.maxPixels = d.maxWidth/this.scale;
  for(var i = 0; i < d.text.length; i++) d.draw(i);
  $("canvas").attr("style", `padding:${d.scale*3}px;display:block;`);
});


$("#loadBtn").click(function() {
  const load = $("#saveload").val();
  $("canvas").remove();
  d.text = [];
  d.canvases = [];
  d.addLine();
  Array.from(load).forEach(c => {
    if (c == ' ') {
      d.addWord();
    }
    else if (c == '\n') {
      d.addLine();
    }
    else if(c >= "a" && c <= "z") {
      d.currentWord().addLetter(c);
      d.draw();
    }
  });
  d.draw();
});

$("#saveBtn").click(function() {
  var savedString = "";
  d.text.forEach(line => {
    line.forEach(w => {
      w.columns.forEach(c => {
        c.letters.forEach(l => {
          savedString += l.letter;
        });
      });
      savedString += " ";
    });
    savedString = savedString.slice(0, savedString.length - 1) + "\n";
  });
  savedString = savedString.slice(0, savedString.length - 1);
  $("#saveload").val(savedString);
});

$(document).keydown(function(e) {
  if(e.key == 'Backspace') {
    if(d.currentWord().delete() && (d.text[0].length > 1 || d.text.length > 1)) {
      d.text[d.text.length-1].pop();
      if(d.text[d.text.length-1].length == 0) {
        d.text.pop();
        d.canvases[d.canvases.length - 1].remove();
        d.canvases.pop();
      }
    }
    d.draw();
  }
  else if (e.key == ' ') {
    d.addWord();
  }
  else if (e.key == 'Enter') {
    d.addLine();

  }
  else if(e.key >= "a" && e.key <= "z") {
    d.currentWord().addLetter(e.key);
    d.draw();
  }
  else if (['.',',',';',':','!','?'].includes(e.key)) {
    d.addPunctuation(e.key);
    d.draw();
  }
});
