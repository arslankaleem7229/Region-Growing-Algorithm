const MAIN = new Main();
const HTML_RENDER = new HtmlRender();

class Filter
{
    ITERATION = 1;
    constructor() 
    {
        MAIN._IMAGE_LOAD('Logos/Gucci Logo.png', (DATA) => 
        {
           
            
            let V = [0,-1, 0,0, 0,1];
            let H = [-1,0, 0,0, 1,0];
            let L = [-1,-1, 0,0, 1,1];
            let R = [1,-1, 0,0, -1,1];
            let GRID = [V, H, L, R];

            this._GUASSIAN_BLUR(DATA);
            // setInterval( () => { this._GUASSIAN_BLUR(DATA); } , 500);
            

        });
    }
    _GUASSIAN_BLUR(ORIGINAL)
    {
        let DUPLICATE = this._GRAYSCALE(ORIGINAL);
        this.ITERATION += 20;
        let OBJECT = 
        {
            EDGE:[0],
            SIMILAR:[0],
            OTHER:[],
            VISITED:[]
        }
        let CLUSTERS = [];
        let INIT = 0;
        let T = 20;

        while (INIT < 100)
        {
            let PIXEL = MAIN._POINT_INFO(DUPLICATE, OBJECT.SIMILAR.pop());
            let AVG = MAIN._AVGFINDER(MAIN._CONVERT_COORDS_TO_PIXELS(DUPLICATE, OBJECT.EDGE));
            console.clear();
            console.log(AVG, 'AVG')
            console.log(PIXEL);
            if(MAIN._IS_EDGE(DUPLICATE, PIXEL, AVG, T) || MAIN._IS_CORNER(DUPLICATE, PIXEL) &&
            (!(OBJECT.OTHER[PIXEL.INDEX] === false) &&
            !(OBJECT.VISITED[PIXEL.INDEX] === true)))
            {
                OBJECT.EDGE.push(PIXEL.INDEX);
                MAIN._GET_NEIGHBOURS(DUPLICATE, PIXEL, OBJECT, AVG, T);                
                OBJECT.OTHER[PIXEL.INDEX] = false;
            }
            OBJECT.VISITED[PIXEL.INDEX] = true;
            INIT++;
            if(OBJECT.SIMILAR.length === 0)
            {
                let NEW_INIT = 0;
                while(!(OBJECT.OTHER[NEW_INIT]))
                {
                    if(OBJECT.OTHER[NEW_INIT] == undefined)
                        break;
                    NEW_INIT++;
                }
                CLUSTERS.push(OBJECT.EDGE);                    
                OBJECT.EDGE = [NEW_INIT];
                OBJECT.SIMILAR = [NEW_INIT];
                console.log(NEW_INIT, 'NEW_INIT', CLUSTERS.length, 'CLUSTER-LENGTH');
            }
        }
        console.log(OBJECT.EDGE, 'OBJECT.EDGE');
        console.log(OBJECT.SIMILAR, 'OBJECT.SIMILAR');
        // console.log(OBJECT.OTHER, 'OBJECT.OTHER');
        // console.log(OBJECT.VISITED, 'OBJECT.VISITED');
        let COLOR = 
        [
            { R: 244, G:66, B:212 },
            { R: 66, G:134, B:244 },
            { R: 244, G:66, B:66 },
            { R: 232, G:244, B:66 },
            { R: 107, G:244, B:66 }

        ];


        this._PRINT(DUPLICATE, OBJECT.EDGE, COLOR[4]);
        if(CLUSTERS.length > 0)
        {
            let j = 0;
            for(let i=0; i<CLUSTERS.length; i++)
            {
                this._PRINT(DUPLICATE, CLUSTERS[i], COLOR[j]);
                j++;
                if(j >= COLOR.length)
                    j = 0;
                    
            }
        }
        // console.log(CLUSTERS.length);
        // MAIN._APPEND_CANVAS(DUPLICATE);
        HTML_RENDER._NOPARAMS(DUPLICATE, this._GRAYSCALE(ORIGINAL));
    }






    _PRINT(DUPLICATE, INDEX, COLOR)
    {
        for(let i=0; i<INDEX.length; i++)
        {
            let COORDS = MAIN._POINT_INFO(DUPLICATE, INDEX[i]);
            MAIN._SETPIX(DUPLICATE, COORDS.X, COORDS.Y, 0, COLOR.R);
            MAIN._SETPIX(DUPLICATE, COORDS.X, COORDS.Y, 1, COLOR.G);
            MAIN._SETPIX(DUPLICATE, COORDS.X, COORDS.Y, 2, COLOR.B);
        }
    }











    _GRAYSCALE(ORIGINAL) 
    {
        let DUPLICATE = MAIN._DUPLICATE(ORIGINAL);
        let RGB = DUPLICATE.data;
        for (let i = 0; i < RGB.length; i += 4) 
        {
            let r = RGB[i];
            let g = RGB[i + 1];
            let b = RGB[i + 2];

            let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            RGB[i] = RGB[i + 1] = RGB[i + 2] = v;
        }
        return DUPLICATE;
    }
    















}
const FILTER = new Filter();
