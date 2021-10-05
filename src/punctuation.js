class Column {
  constructor(type) {
    this.letters = [new Letter(type)];
  }
}
class Letter{
  constructor(type){
    this.letter = type;
  }
}

class Punctuation {
  constructor(type) {
    this.columns = [new Column(type)];
    this.pixelArray = [];
    for(var i = 0; i < 20; i++) {
      const r = new Array(5);
      if (i > 2 && i < 17) r[2] = 1;
      this.pixelArray.push(r);
    }
    this.pixelArray[7] = new Array(5).fill(1);
    this.pixelArray[11] = new Array(5).fill(1);
    switch(type) {
      case ',':
        this.pixelArray[13][0] = 1;
        break;
      case ';':
        this.pixelArray[13][0] = 1;
        this.pixelArray[8][0] = 1;
        this.pixelArray[9][0] = 1;
        this.pixelArray[10][0] = 1;
        this.pixelArray[8][4] = 1;
        this.pixelArray[9][4] = 1;
        this.pixelArray[10][4] = 1;
        break;
      case ':':
        this.pixelArray[8][0] = 1;
        this.pixelArray[9][0] = 1;
        this.pixelArray[10][0] = 1;
        this.pixelArray[8][4] = 1;
        this.pixelArray[9][4] = 1;
        this.pixelArray[10][4] = 1;
        break;
      case '!':
        this.pixelArray.forEach(l => {
          l[0] = 1;
          l[4] = 1;
        });
        this.pixelArray[7][1] = 0;
        this.pixelArray[7][3] = 0;
        this.pixelArray[11][1] = 0;
        this.pixelArray[11][3] = 0;
        break;
      case '?':
        for(var i = 0; i < 8; i++)
          this.pixelArray[i][4] = 1;
        for(var i = 12; i < 20; i++)
          this.pixelArray[i][0] = 1;
        break;
    }
  }
  delete() {
    return true;
  }
  render() {
    return this.pixelArray;
  }
}

export default Punctuation;