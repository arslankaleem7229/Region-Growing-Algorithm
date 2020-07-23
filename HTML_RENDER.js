class HtmlRender
{
    constructor()
    {

    }
    _NOPARAMS(IMG, ORGINAL)
    {
      let COUNTER = 0;
      let TEXT = "";
      TEXT += "<tr>";
      for(let y=0; y<IMG.height; y++)
      {
        for(let x=0; x<IMG.width; x++)
        {
          let R = MAIN._GETPIX(IMG, x, y, 0);
          let G = MAIN._GETPIX(IMG, x, y, 1);
          let B = MAIN._GETPIX(IMG, x, y, 2);
          let VAL = MAIN._GETPIX(ORGINAL, x, y, 1);
          let COLOR = `rgb(${R},${G},${B})`;

          // TEXT += `<td style=background-color:${COLOR}>${VAL} <br>${x}, ${y} (${COUNTER})</td>`;
          // TEXT += `<td style=background-color:${COLOR}>${MAIN._AVGFINDER([R, G, B])} <br>${x}, ${y} ${COUNTER}</td>`;
          // TEXT += `<td style=background-color:${COLOR}>${MAIN._AVGFINDER([R, G, B])}</td>`;
          TEXT += `<td style=background-color:${COLOR}>${VAL}</td>`;
          COUNTER++;  
        }
        TEXT += "</tr><tr>";
      }
      TEXT += "</tr>";
      this._CREATEELEM(TEXT);
    }
    _CREATEELEM(DATA) 
    {
      let TABLE = document.getElementById('OUTPUT');
      TABLE.innerHTML = DATA;
      document.body.appendChild(TABLE);
    }
}