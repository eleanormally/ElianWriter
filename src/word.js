class WordComponent {
  constructor(letter){
    this.letter = letter;
    switch(letter.toLowerCase()) {
      case 'a':
      case 'b':
      case 'c':
      case 'd':
      case 'e':
      case 'f':
      case 'g':
      case 'h':
      case 'i':
        this.type = '1u';
        break;
      
      case 'j':
      case 'q':
      case 's':
      case 'z':
        this.type = 'dr';
        break;
      case 'k':
      case 'p':
      case 't':
      case 'y':
      case 'm':
      case 'v':
        this.type = 'dl';
        break;
      case 'r':
      case 'n':
      case 'w':
        this.type = 'ul';
        break;
      case 'l':
      case 'u':
      case 'o':
      case 'x':
        this.type = 'ur';
        break;
      default:
        console.log('errror: unknown letter type');
    }
  }
  addVisualObject(obj) {
    this.visual = obj;
  }
}

class Column {
  constructor() {
    this.maxR = 0;
    this.maxL = 0;
    this.letters = []
    this.marked = 0;
    this.x = 0;
    this.row = 0;
  }
}


class Word {

  constructor(word='') {
    this.columns = [];
    this.columns.push(new Column());
    Array.from(word).forEach(l => this.addLetter(l));
    this.pixelArray = [];
  }

  delete() {
    const c = this.columns[this.columns.length - 1];
    if(c.letters.length == 0) return true;
    const l = c.letters[c.letters.length - 1];
    c.row -= 1;

    if(l.type.charAt(0) == 'u'){
      if(c.row == 1) c.row = 0;
      else if(l.type == 'ul') c.x += 1;
      else c.x -= 1;
    }
    c.letters.pop();
    var maxL = 0;
    var maxR = 0;
    c.letters.forEach(l => {
      if(maxL > l.x) maxL = l.x;
      if(maxR < l.x) maxR = l.r;
    })
    c.maxL = maxL;
    c.maxR = maxR;
    if(c.letters.length > 0){
      const ol = c.letters[c.letters.length - 1];
      c.marked = 0;
      if(ol.type.charAt(0) == 'd'){
        if(ol.type == 'dl') {
          c.marked = 1;
          c.x -= 1;
        }
        else {
          c.marked = -1;
          c.x += 1;
        }
      }
    }
    else if (c.letters.length == 0) this.columns.pop();
    if(this.columns.length == 0) {
      this.columns.push(new Column());
    }
    return false;
  }

  addLetter(letter) {

    //create new letter and reference to column
    const l = new WordComponent(letter);

    var column = this.columns[this.columns.length - 1];


    //check if down tail means new line
    if(l.type.charAt(0) && column.row == 3) {
      this.columns.push(new Column());
      column = this.columns[this.columns.length - 1];
    }

    //marked checking
    if(column.marked != 0) {
      if(column.letters[column.letters.length - 1].type.charAt(1) == l.type.charAt(1) && l.type.charAt(0) == 'u') {
        column.x -= column.marked;
      }
      else {
        column.x += column.marked;
        column.marked = 0;
      }
      if (l.type ==='ur' && column.marked == -1) {
        this.columns.push(new Column());
        column = this.columns[this.columns.length - 1];
      }
    }

    //up tail movement
    else if(l.type.charAt(0) == 'u'){
      if(column.row == 0) column.row = 1;
      else if(l.type == 'ul') column.x -= 1;
      else column.x += 1;
    }
   
    //max leftright 
    column.maxL = Math.min(column.x, column.maxL);
    column.maxR = Math.max(column.x, column.maxR);

    //add letter
    l.x = column.x;
    column.letters.push(l);

    //post letter
    column.row += 1;

    column.marked = 0;
    if(l.type.charAt(0) == 'd'){
      if(l.type == 'dl') column.marked = 1;
      else column.marked = -1;
    }
    if(column.row == 4) this.columns.push(new Column());
  }
  displayWordTest() {
    this.columns.forEach(c => {
      console.log(c.maxL + ", " + c.maxR);
      c.letters.forEach(l => {
        console.log(l.letter + " " + l.x);
      });
    });
  }
  extendGridToY(y, l, len, grid) {
    const ext = y - grid.length + 6;
    for (var i = 0; i < ext; i++) grid.push(new Array(len));
    if(l.type.charAt(0) == 'd') {
      for (var i = 0; i < 4; i++) grid.push(new Array(len));
    }
  }
  addLine(x, y, grid, v=false){
    if(v) for (var i = 0; i < 5; i++) grid[y+i][x] = 1;
    else for (var i = 0; i < 5; i++) grid[y][x+i] = 1; 
  }
  drawLetter(l, x, y, grid){
    //drawing components
    //order: top, left, right, bottom, UL tail, UR tail, DL tail, DR tail, dot
    if(['a','b','d','e','g','h','j','m','n','p','s','v','w','y'].includes(l.letter)){
      this.addLine(x, y, grid);
    }
    if(['d','e','f','g','h','i','k','m','n','o','p','q','r','t','v','w','x','y','z'].includes(l.letter)) {
      this.addLine(x, y, grid, true);
    }
    if(['a','b','c','d','e','f','j','k','l','m','n','o','q','s','t','u','v','w','x','z'].includes(l.letter)) {
      this.addLine(x+4, y, grid, true);
    }
    if(!['a','d','g','j','m','p','s','v','y'].includes(l.letter)) {
      this.addLine(x, y+4, grid);
    }
    if(['r','n','w'].includes(l.letter)) {
      this.addLine(x, y-4, grid, true);
    }
    if(['l','u','o','x'].includes(l.letter)) {
      this.addLine(x+4, y-4, grid, true);
    }
    if(['k','p','t','y','m','v'].includes(l.letter)) {
      this.addLine(x, y+4, grid, true);
    }
    if(['j','q','s','z'].includes(l.letter)) {
      this.addLine(x+4, y+4, grid, true);
    }
    if(['s','t','u','v','w','x','y','z'].includes(l.letter)) {
      grid[y+2][x+2] = 1;
    }
  }
  render() {
    if(this.columns[0].letters.length == 0) {
      this.pixelArray = [[]];
      return [[]];
    }
    const columns = [];
    this.columns.forEach(c => {
      const grid = []
      const cgLength = 5 + c.maxL*-2 + c.maxR*2;
      var x = -2*c.maxL;
      var y = 0;
      if(c.letters[0].type.charAt(0) == 'u') {
        y += 4
        for(var i = 0; i < 4; i++) grid.push(new Array(cgLength));
      }
      c.letters.forEach(l => {
        this.extendGridToY(y, l, cgLength, grid);
        x += 2*l.x;
        this.drawLetter(l, x, y, grid);      
        y += 6;
        x -= 2*l.x;
      });
      columns.push(grid);
    });
    var maxHeight = 0;
    columns.forEach(c => {
      if(c.length > maxHeight) maxHeight = c.length;
    });

    const finalGrid = new Array(maxHeight).fill([]);
    for(var i = 0; i < maxHeight; i++) {
      columns.forEach(c =>{
        if(c.length > i) finalGrid[i] = finalGrid[i].concat(c[i]);
        else finalGrid[i] = finalGrid[i].concat(new Array(c[c.length-1].length));
        finalGrid[i].push(undefined);
      });
    }
    this.pixelArray = finalGrid;
    return finalGrid;
  }
}

export default Word;