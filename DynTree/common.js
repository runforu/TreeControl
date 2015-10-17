// Common functions
function outPlot( x, y, w, h, color )
{
    var line = document.createElement( "span" );
    line.style.position = "absolute";
    line.style.left = x;
    line.style.top = y;
    line.style.height = h;
    line.style.width = w;
    line.style.fontSize = 1;
    line.style.backgroundColor = color;
    return line;
}

// Class
function Point( xPos, yPos )
{
    this.xPos = xPos;
    this.yPos = yPos;
}

Point.prototype.toString = function()
{
    return "Point(" + this.xPos + "," + this.yPos + ")";
}

function VLine( x, y, thick, len, color )
{
    return outPlot( x, y, thick, len, color );
}

function HLine( x, y, thick, len, color )
{
    return outPlot( x, y, len, thick, color );
}

function AbsTop( htmlElement )
{
    var y = htmlElement.offsetTop;
    var temp = htmlElement.offsetParent;

    while ( temp )
    {
        y += temp.offsetTop;
        temp = temp.offsetParent;
    }

    return y;
}

function AbsLeft( htmlElement )
{
    var x = htmlElement.offsetLeft;
    var temp = htmlElement.offsetParent;

    while ( temp )
    {
        x += temp.offsetLeft;
        temp = temp.offsetParent;
    }

    return x;
}

var _isFF = false;
var _isIE = false;
var _isOpera = false;
var _isKHTML = false;
var _isMacOS = false;

if ( navigator.userAgent.indexOf( 'Macintosh' ) != -1 )
{
    _isMacOS = true;
}
if ( ( navigator.userAgent.indexOf( 'Safari' ) != -1 ) || ( navigator.userAgent.indexOf( 'Konqueror' ) != -1 ) )
{
    var _KHTMLrv = parseFloat( navigator.userAgent.substr( navigator.userAgent.indexOf( 'Safari' ) + 7, 5 ) );
    if ( _KHTMLrv > 525 )
    { // mimic FF behavior for Safari 3.1+

        _isFF = true;
        var _FFrv = 1.9;
    }
    else
        _isKHTML = true;
}
else if ( navigator.userAgent.indexOf( 'Opera' ) != -1 )
{
    _isOpera = true;
    _OperaRv = parseFloat( navigator.userAgent.substr( navigator.userAgent.indexOf( 'Opera' ) + 6, 3 ) );
}
else if ( navigator.appName.indexOf( "Microsoft" ) != -1 )
{
    _isIE = true;
}
else
{
    _isFF = true;
    var _FFrv = parseFloat( navigator.userAgent.split( "rv:" )[1] )
}
