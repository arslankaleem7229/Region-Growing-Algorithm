class Main
{
    constructor() 
    {
    }
    _IMAGE_LOAD(SOURCE, CALLBACK)
    {
      let img = new Image();
      img.src = SOURCE;
      img.onload = () =>
      {
        let IMG_DATA = null;
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        IMG_DATA = ctx.getImageData(0, 0, c.width, c.height);
        CALLBACK(IMG_DATA);
      }
    }
    _APPEND_CANVAS(IMG)
    {
      let c = document.createElement('canvas');
      let ctx = c.getContext('2d');
      c.width = IMG.width;
      c.height = IMG.height;
      ctx.putImageData(IMG, 0, 0);
      document.body.append(c);
    }
    _DUPLICATE(IMG)
    {
      return (new ImageData(
        new Uint8ClampedArray(IMG.data),
        IMG.width,
        IMG.height
      ));
    }
    _SUMARR(ARRAY)
    {
      return ARRAY.reduce((SUM, VAL) => SUM+VAL);
    }
    _GETPIX(rgbs, x, y, index)
    {
      return rgbs.data[rgbs.width*(4*y)+index+(4*x)];
    }
    _SETPIX(rgbs, x, y, index, val )
    {
      rgbs.data[rgbs.width*(4*y)+index+(4*x)] = val;
    }
    _SETPIXALL(rgbs, x, y, one, two, three, val )
    {
      rgbs.data[rgbs.width*(4*y)+one+(4*x)] = val;
      rgbs.data[rgbs.width*(4*y)+two+(4*x)] = val;
      rgbs.data[rgbs.width*(4*y)+three+(4*x)] = val;
    }
    _GETALLPIX(rgbs, x, y)
    {
      return [
        rgbs.data[rgbs.width*(4*y)+0+(4*x)],
        rgbs.data[rgbs.width*(4*y)+1+(4*x)],
        rgbs.data[rgbs.width*(4*y)+2+(4*x)],
      ];
    }
    _GETINDEX(DATA, X, Y)
    {
      if(X >= DATA.width || X < 0 || Y < 0 || Y >= DATA.height)
        return false;
      return (DATA.width * Y + X);
    }
    _POINT_INFO(DATA, INDEX)
    {
      let PIXEL = 
      {
        X:0,
        Y:0,
        INDEX:0
      };
      PIXEL.X = INDEX%DATA.width;
      let counter = 0;
      let QUOTIENT = DATA.width;
      while(QUOTIENT <= INDEX)
      {
        QUOTIENT += DATA.width;
        counter++;
      }
      PIXEL.Y = counter;
      PIXEL.INDEX = this._GETINDEX(DATA, PIXEL.X, PIXEL.Y);
      return PIXEL;
    }
    _IS_CORNER(DATA, POINT)
    {
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(this._GETINDEX(DATA, (POINT.X + X), (POINT.Y + Y)) === false)
            return true;
        }
      }
      return false;
    }
    _IS_EDGE(DATA, POINT, AVG, DIFF)
    {
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {
          if(X + POINT.X < 0 || Y + POINT.Y < 0)  continue;

          let INTENSITY = this._GETPIX(DATA, X + POINT.X, Y + POINT.Y, 0);
          if(Math.abs(INTENSITY - AVG) > DIFF)
            return true;
        }
      }
      return false;
    }
    _GET_NEIGHBOURS(DATA, POINT, OBJECT, AVG, DIFF)
    {
      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {          
          if(X + POINT.X < 0 || Y + POINT.Y < 0)  continue;
          if( (X + POINT.X) > DATA.width || (Y + POINT.Y) > DATA.height) continue;
          if(X == 0 && Y == 0)  continue;

          let INDEX = this._GETINDEX(DATA, POINT.X + X, POINT.Y + Y);
          if(!INDEX) continue;
          
          let INTENSITY = this._GETPIX(DATA, X+ POINT.X, Y + POINT.Y, 0);
          let P = this._POINT_INFO(DATA, INDEX);
          console.log(P, POINT.X+X,  POINT.Y+Y,INDEX,'P');
          if(OBJECT.VISITED[INDEX]) continue;

          if(Math.abs(INTENSITY - AVG) > DIFF)
              OBJECT.OTHER[INDEX] = true;
          else
            if(!OBJECT.SIMILAR.includes(INDEX))
              if(this._IS_EDGE(DATA, P, AVG, DIFF) || this._IS_CORNER(DATA, P))
                OBJECT.SIMILAR.push(INDEX);
        }
      }
    }


    _SORT_ARR(ARRAY)
    {
      return ARRAY.sort(function(a, b){return a - b});
    }








  _CONVERT_COORDS_TO_PIXELS(IMG, POINT)
  {
    let PIXELS = [];
    for(let i=0; i<POINT.length; i++)
    {
      let COORDS = this._POINT_INFO(IMG, POINT[i]);
      PIXELS.push(this._GETPIX(IMG, COORDS.X, COORDS.Y, 0));
    }
    return PIXELS;
  }



    _INSERT_INTO(IMG, CURRENT, OBJECT)
    {
      let AVG = this._AVGFINDER(this._CONVERT_COORDS_TO_PIXELS(IMG, OBJECT.VISITED));
      // console.clear();
      // console.log(AVG, 'AVERAGE');

      for(let Y=-1; Y<2; Y++)
      {
        for(let X=-1; X<2; X++)
        {          
          let NEIGHBORS =
          {
            X: CURRENT.X + X,
            Y: CURRENT.Y + Y,
            INDEX: this._GETINDEX(IMG, CURRENT.X + X, CURRENT.Y + Y)
          }
          if(NEIGHBORS.X < 0 || NEIGHBORS.Y < 0)  continue;
          if(OBJECT.TICKED[NEIGHBORS.INDEX])  continue;
          if(OBJECT.OTHER.includes(NEIGHBORS.INDEX))  continue;

          let INTENSITY = this._GET_PIX(IMG, NEIGHBORS.INDEX);

          if(Math.abs(INTENSITY - AVG) < 20)
          {
            if(!OBJECT.SIMILAR.includes(NEIGHBORS.INDEX))
              OBJECT.SIMILAR.push(NEIGHBORS.INDEX)
          }
          else
          {
            if(!OBJECT.OTHER.includes(NEIGHBORS.INDEX))
              OBJECT.OTHER.push(NEIGHBORS.INDEX);            
          }

          // console.log(NEIGHBORS);
        }  
      }
      return OBJECT;
    }

    _GET_PIX(IMG, INDEX)
    {
      let COORDS = this._GET_COORDINATES(IMG, INDEX);
      return this._GETPIX(IMG, COORDS.X, COORDS.Y, 0);
    }
    _AVGFINDER(ARRAY)
    {
      if(ARRAY.length === 0)
        return 0;
      else
      {
        let SUM = ARRAY.reduce((SUM, VAL) => SUM+VAL);
        return Math.floor(SUM/ARRAY.length);  
      }
    }
    _READ_FILE(file, callback) 
    {
      var rawFile = new XMLHttpRequest();
      rawFile.overrideMimeType("application/json");
      rawFile.open("GET", file, true);
      rawFile.onreadystatechange = () =>
      {
          if (rawFile.readyState === 4 && rawFile.status == "200") 
          {
              callback(rawFile.responseText);
          }
      }
      rawFile.send(null);

      // USE THE FOLLOWING LINES TO CALL A FUNCTION.......
      // ....................................................
      //   MAIN._READ_FILE("data.json", (text) => {
      //     var data = JSON.parse(text);
      //     console.log(data);
      // });

    } 
}
