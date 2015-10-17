/*
 * Naming Convention Note:
 * Node: tree node object of javascript
 * Element: object for html element in javascript
 * Member variant: beginning with "i"
 * Normal variant: lowercase for first word
 * Private method: beginning with "_" and first lowercase word, and first character is uppercase for other word
 * Object define: first character is uppercase for every word 
 * Public method: first character is uppercase for every word
 */

Function.prototype.bind = function( adapter )
{
    var method = this, temp = function()
    {
        return method.apply( adapter, arguments );
    };

    return temp;
}

function EventAdapter( object, htmlElement )
{
    this.iObject = object;
    // The event html element trigger
    this.iHtmlElement = htmlElement;
}

// Tree nodes
// image: index
function DynTreeNode( nodeId, parentNode, tree, symbolIndex, image, htmlCode )
{   
    this.iNodeId = tree.RegisterNewId( nodeId, this );
    if ( -1 == this.iNodeId )
    {
        return null;
    }

    this.iChildNodes = new Array();
    this.iChildCount = 0;
    this.iShowChildren = true;

    this.iTree = tree;
    // Parent tree node of this node.
    this.iParentNode = parentNode;
    this.iIndex = null;

    // The user html code to a node
    this.iHtmlCode = htmlCode;

    this.iImage = image;
    this.iSymbolIndex = symbolIndex;
    
    this.iIsSelected = false;
    
    // Identify this node's <tr> in his parent html element.
    this.iTrElement = null;

    this.iSpan = null;

    this.iTds = new Array( 4 );

    // The html tree rooted by this node.
    this.iHtmlElement = this._renderHtmlElement();

    this.iHtmlElement.iHtmlElementOwner = this;

    return this;
}

DynTreeNode.prototype._minusPlusClicked = function()
{
    if ( this.iObject.iChildCount == 0 )
    {
        return;
    }

    this.iObject.iShowChildren = !this.iObject.iShowChildren;

    // this is not DynTreeNode but adapter
    for ( var i = 0; i < this.iObject.iChildCount; i++ )
    {
        if ( this.iObject.iShowChildren ) // Children is shown, hide them
        {
            this.iObject.iChildNodes[i].iTrElement.style.display = "";
        }
        else
        // Otherwise, shown them
        {
            this.iObject.iChildNodes[i].iTrElement.style.display = "none";
        }
    }

    if ( this.iObject.iShowChildren )
    {
        if ( this.iObject.IsTail() )
            this.iHtmlElement.src = this.iObject.iTree.iImagePath + this.iObject.iTree.iSymbolArray[3];
        else
            this.iHtmlElement.src = this.iObject.iTree.iImagePath + this.iObject.iTree.iSymbolArray[4];
    }
    else
    {
        if ( this.iObject.IsTail() )
            this.iHtmlElement.src = this.iObject.iTree.iImagePath + this.iObject.iTree.iSymbolArray[6];
        else
            this.iHtmlElement.src = this.iObject.iTree.iImagePath + this.iObject.iTree.iSymbolArray[7];
    }
}

DynTreeNode.prototype._checkUncheckClicked = function()
{
    var tree = this.iObject.iTree;
    if( this.iObject.iIsSelected )
    {
        this.iHtmlElement.src = tree.iImagePath + tree.iSymbolArray[9];
        this.iObject.iIsSelected = false;
        
        //remove node from tree's selected node array
        //this.iObject.iTree.RemoveSelectedNode( this.iObject );
    }
    else
    {
        this.iHtmlElement.src = tree.iImagePath + tree.iSymbolArray[10];
        this.iObject.iIsSelected = true;
        // add to tree's selected node array
        //this.iObject.iTree.AddSelectedNode( this.iObject );
    }        
}

DynTreeNode.prototype.IsTail = function()
{
    var node = this.iParentNode;
    // root node or the last one of his parent.
    if ( node == null || node.iChildNodes[node.iChildCount-1] == this ) 
    {
        return true;
    }
    else
    {
        return false
    }
}

DynTreeNode.prototype._renderHtmlElement = function()
{
    var table = document.createElement( 'table' );
    table.className = "DefaultTreeTable";
    table.cellSpacing = 0;
    table.cellPadding = 0;

    var tbody = document.createElement( 'tbody' );

    var tr = document.createElement( 'tr' );

    // create first cell
    // <td><img border="0" align="absmiddle" style="padding: 0px;margin:0px;
    // width: px; height: px; "
    // src="images/minus5.gif"><td>
    this.iTds[0] = document.createElement( 'td' );
    this.iTds[0].className = "td1";
    var img1 = document.createElement( "img" );
    img1.className = "td1_img";
    this.iTds[0].appendChild( img1 );
    // TODO: It is better getwidth and height from Css style, but failed.
    this.iTds[0].style.width = img1.style.width = this.iTree.iSymbolWidth;
    this.iTds[0].style.height = img1.style.height = this.iTree.iSymbolHeight;
    img1.src = this.iTree.iImagePath + this.iTree.iSymbolArray[this.iSymbolIndex];
    var adapter = new EventAdapter( this, img1 );
    img1.onclick = this._minusPlusClicked.bind( adapter );
    // Absolut root node and the root node has no plus-minus icon,
    // root node's display property is set when a node changed to root node.
    if ( !this.iParentNode )
    {
       //this.iTds[0].style.display = "none";
    }
    
    // create second cell
    // <td><img border="0" align="absmiddle" style="padding: 0px;margin:0px;
    // width: px; height: px; "
    // src="images/minus5.gif"><td>
    this.iTds[1] = document.createElement( 'td' );
    this.iTds[1].className = "td2";
    var img2 = document.createElement( "img" );
    img2.className = "td2_img";
    this.iTds[1].appendChild( img2 );
    // TODO: It is better getwidth and height from Css style, but failed.
    this.iTds[1].style.width = img2.style.width = this.iTree.iLineWidth;
    this.iTds[1].style.height = img2.style.height = this.iTree.iLineHeight;
    img2.src = this.iTree.iImagePath + this.iTree.iSymbolArray[9];
    var adpt = new EventAdapter( this, img2 );
    img2.onclick = this._checkUncheckClicked.bind( adpt );
    // Absolute root node and the root node has no plus-minus icon,
    // root node's display property is set when a node changed to root node.
    if ( !this.iParentNode )
    {   
        //this.iTds[1].style.display = "none";
    }


    // create third cell
    // <td><img border="0" align="absmiddle" style="padding: 0px;margin:0px;
    // width: px; height: px; "
    // src="images/minus5.gif"><td>
    this.iTds[2] = document.createElement( 'td' );
    this.iTds[2].className = "td3";
    this.iTds[2].style.maxWidth = 32;
    var img3 = document.createElement( "img" );
    img3.className = "td3_img";
    this.iTds[2].appendChild( img3 );
    // TODO: It is better getwidth and height from Css style, but failed.
    this.iTds[2].style.width = img3.style.width = this.iTree.iIconWidth;
    this.iTds[2].style.height = img3.style.height = this.iTree.iIconHeight;
    img3.src = this.iTree.iImagePath + this.iImage;

    // create forth cell
    this.iTds[3] = document.createElement( 'td' );
    this.iTds[3].className = "td4";
    // IE justify the td3 when the length of next table row (has merge cell) increase.
    // Make td4 width 100% is to increase the length of td4 without increasing td3.
    if ( _isIE )
    {
        this.iTds[3].width = "100%";
    }
    this.iSpan = document.createElement( 'span' );
    // this.iSpan.className = "UserHtmlBlock";
    this.iSpan.innerHTML = this.iHtmlCode;
    this.iTds[3].appendChild( this.iSpan );

    for ( var i = 0; i < 4; i++ )
    {
        this.iTds[i].iParentObject = this;
        this.iTds[i].style.paddingBottom = 0;
        this.iTds[i].style.paddingTop = 0;
        tr.appendChild( this.iTds[i] );
    }

    tbody.appendChild( tr );
    table.appendChild( tbody );

    return table;
}

DynTreeNode.prototype.toString = function()
{
    return "DynTreeNode Object:" + this.iNodeId;
}

function DynTree( htmlElement, width, height )
{
    // iParentElement is the tree's parent html element
    if ( typeof ( htmlElement ) != "object" )
    {
        this.iParentElement = document.getElementById( htmlElement );
    }
    else
    {
        this.iParentElement = htmlElement;
    }

    this.iTreeWidth = width;
    this.iTreeHeight = height;

    // These properties are changed in DynTreeNode's _renderHtmlElement
    this.iSymbolWidth = 32;
    this.iSymbolHeight = 32;
    this.iLineWidth = 32;
    this.iLineHeight = 32;
    this.iIconWidth = 32;
    this.iIconHeight = 32;    
   
    this.iImagePath = "./img/";
    this.iSymbolArray = new Array( "line1.gif", "line2.gif", "line3.gif", "minus2.gif", "minus3.gif", "minus4.gif", "plus2.gif", "plus3.gif", "plus4.gif", "uncheck.gif", "Check.gif" );

    this.iAutoScroll = true;

    this.iIdPull = {};
    this.iPullSize = 0;

    this.iLineDiv = null;

    // DynTreeNode: Identify the current root node for display.
    this.iRootNode = null;
    // DynTreeNode: The absolute root of the whole tree, DynTreeNode.
    this.iAbsRootNode = null;

    // The html element representing the whole tree.
    this.iHtmlTree = null;

    // Generate the whole tree.
    this._renderSelf();

    // Tree div left top
    this.iTop = AbsTop( this.iHtmlTree );
    this.iLeft = AbsLeft( this.iHtmlTree );

    if ( window.addEventListener )
        window.addEventListener( "unload", this._onUnload, false );
    if ( window.attachEvent )
        window.attachEvent( "onunload", this._onUnload );

    return this;
}

DynTree.prototype.Destructor = function()
{
    for ( var a in this.iIdPull )
    {
        var z = this.iIdPull[a];
        if ( !z )
            continue;
        z.iChildNodes = null;
        z.iHtmlCode = null;
        z.iHtmlElement.iHtmlElementOwner = null;
        z.iHtmlElement = null;
        z.iImage = null;
        z.iTrElement = null;
        z.iParentNode = null;
        z.iSpan = null;
        z.iTree = null;
        this.iIdPull[a] = null;
    }
    this.iHtmlTree.innerHTML = "";
    for ( var a in this )
    {
        this[a] = null;
    }
}

DynTree.prototype.RegisterNewId = function( nodeId, treeNode )
{
    if ( this.FindNodeById( nodeId ) )
    {
        alert( "Duplicated node ID." );
        return -1;
    }
    this.iIdPull[nodeId] = treeNode;
    this.iPullSize++;
    return nodeId;
}

DynTree.prototype.FindNodeById = function( nodeId )
{
    var z = this.iIdPull[nodeId];
    if ( z )
    {
        return z;
    }
    return null;
}

DynTree.prototype.UnregisterNode = function( node )
{
    for ( var i = 0; i < node.iChildCount; i++ )
    {
        this.UnregisterNode(node.iChildNodes[i]);
    }

    if ( this.iIdPull[node.iNodeId] )
    {
        this.iIdPull[node.iNodeId] = null;
        this.iPullSize--;
    }
}

DynTree.prototype._renderSelf = function()
{
    var div = document.createElement( 'div' );
    div.className = "TableContainerStyle";
    div.style.width = this.iTreeWidth;
    div.style.height = this.iTreeHeight;
    // Add the tree to parent html element.
    this.iParentElement.appendChild( div );
    this.iHtmlTree = div;
}



/**
 * Description: append a new node to a existing node, AppendNewNode is faster generally.
 * Type: public. 
 * Param: nodeId - DynTreeNode ID.
 * Param: parentNodeId - DynTreeNode parent node ID.
 * Param: image - unselected image.
 * Param: selectedImage - Selected image.
 * Param: htmlCode - user html code .
 */
DynTree.prototype.AppendNewNode = function( nodeId, parentNodeId, image, htmlCode )
{
    var node = null;
    if ( this.iAbsRootNode == null ) // parentNodeId ignored
    {
        node = new DynTreeNode( nodeId, null, this, 1, image, htmlCode );
        if ( !node)
            {
                return;
            }
        this.iRootNode = this.iAbsRootNode = node;
        this.iHtmlTree.appendChild( node.iHtmlElement );
        node.iTrElement = null;
        return node;
    }

    var pNode = this.FindNodeById( parentNodeId );

    node = new DynTreeNode( nodeId, pNode, this, 1, image, htmlCode );
    if ( !node)
        {
            return;
        }
    // Appending new node is always added at tail.
    this._attachChildNode( node, null );

    return node;
}

/**
 * Description: insert a new node, AppendNewNode is faster generally.
 * Type: public. 
 * Param: nodeId - DynTreeNode ID.
 * Param: parentNodeId - DynTreeNode parent node ID.
 * Param: image - unselected image.
 * Param: selectedImage - Selected image.
 * Param: htmlCode - user html code .
 * Param: index - the index before which the node is inserted.
 */
DynTree.prototype.InsertNewNode = function( nodeId, parentNodeId, image, htmlCode, index )
{
    var node = null;
    if ( this.iAbsRootNode == null ) // parentNodeId ignored
    {
        node = new DynTreeNode( nodeId, null, this, 3, image, htmlCode );
        if ( !node)
            {
                return;
            }
        this.iRootNode = this.iAbsRootNode = node;
        this.iHtmlTree.appendChild( node.iHtmlElement );
        node.iTrElement = null;
        return node;
    }

    var pNode = this.FindNodeById( parentNodeId );
    
    if ( pNode.iChildCount > index ) 
    {
        node = new DynTreeNode( nodeId, pNode, this, 3, image, htmlCode );
    }
    else
    {
        node = new DynTreeNode( nodeId, pNode, this, 1, image, htmlCode );
    }
    
    if ( !node)
        {
            return;
        }
    this._attachChildNode( node, pNode.iChildNodes[index] );

    return node;
}

/**
 * Description: attach a child node.
 * Type: public. 
 * Param: node - DynTreeNode: node to be attached.
 * Param: beforeMe - DynTreeNode: attached before the node, if null, attach at tail.
 * return: index - DynTreeNode: attached node.
 */
DynTree.prototype._attachChildNode = function( node, beforeMe )
{
    // Absolute root node would not reach here.
    var pNode = node.iParentNode;
    // Parent node table's tboday
    var tbody = pNode.iHtmlElement.childNodes[0];

    node.iTrElement = this._createNewTr( node );

    if ( beforeMe )
    {
        tbody.insertBefore( node.iTrElement, beforeMe.iTrElement );
        // Change the symbol icon when insert middle if the node has no children
        if ( node.iChildCount == 0 )
        {
            node.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[2];
        }
        var index = beforeMe.iIndex;
        for ( var i = pNode.iChildCount; i > beforeMe.iIndex; i-- )
        {
            pNode.iChildNodes[i] = pNode.iChildNodes[i - 1];
            pNode.iChildNodes[i].iIndex = i;
        }
        pNode.iChildNodes[index] = node;     
        node.iIndex = index;
    }
    else
    {
        tbody.appendChild( node.iTrElement );

        // Change the parent symbol
        var x;
        if ( pNode.IsTail() ) 
        {
            x = pNode.iShowChildren ? ( this.iSymbolArray[3] ) : ( this.iSymbolArray[6] );
        }
        else
        {
            x = pNode.iShowChildren ? ( this.iSymbolArray[4] ) : ( this.iSymbolArray[7] );
        }
        pNode.iTds[0].childNodes[0].src = this.iImagePath + x;

        // Change previous sibling symbol
        if ( pNode.iChildCount != 0 )
        {
            var n = pNode.iChildNodes[pNode.iChildCount - 1];
            if ( n.iChildCount == 0 )
            {
                n.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[2];
            }
            else
            {
                if ( n.iShowChildren ) 
                {
                    n.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[4];
                }
                else
                {
                    n.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[7];
                }                
            }
        }

        node.iIndex = pNode.iChildCount;
        pNode.iChildNodes[pNode.iChildCount] = node;
    }
    
    pNode.iChildCount++;

    //Update parent node's lines
    if ( !pNode.IsTail() )
    {
        //tr>td0,td1,td2,td3
        node.iTrElement.childNodes[0].style.backgroundImage = "url(" + this.iImagePath + this.iSymbolArray[0]+")";
        node.iTrElement.childNodes[0].style.backgroundRepeat = "repeat-y";    
        //if previous sibling has children, update lines    
//        if ( node.iIndex != 0) 
//        {        
//            var preSiblingNode = pNode.iChildNodes[node.iIndex-1];
//            preSiblingNode.iTrElement.childNodes[0].style.backgroundImage = "url(" + this.iImagePath + this.iSymbolArray[0]+")";
//            preSiblingNode.iTrElement.childNodes[0].style.backgroundRepeat = "repeat-y";
//        }
    }            

    if ( node.iIndex > 0 ) 
    {        
        var preSiblingNode = pNode.iChildNodes[node.iIndex-1];
 
        for(var i=1; i<=preSiblingNode.iChildCount; i++)
        {
            var x =preSiblingNode.iHtmlElement.childNodes[0].childNodes[i];
            if ( preSiblingNode.iHtmlElement.childNodes[0].childNodes[i])
            {
            var y =preSiblingNode.iHtmlElement.childNodes[0].childNodes[i].childNodes[0];
            preSiblingNode.iHtmlElement.childNodes[0].childNodes[i].childNodes[0].style.backgroundImage="url(" + this.iImagePath + this.iSymbolArray[0]+")";
            preSiblingNode.iHtmlElement.childNodes[0].childNodes[i].childNodes[0].style.backgroundRepeat="repeat-y";
            }
	    } 
    }

    return node;
}

/**
 * Desc: create and return new tree row (tr). 
 * Type: private. 
 * Param: node - DynTree object which is appending to a "tr".
 */
DynTree.prototype._createNewTr = function( node )
{
    var tr = document.createElement( 'tr' );

    // Root node has no symbol and line image, as a result,
    // its children has no td1 and td2
    var td1 = document.createElement( 'td' );
    var td2 = document.createElement( 'td' );
    tr.appendChild( td1 );
    tr.appendChild( td2 );
    
    // Absoulte node has no minus and plus symbol
    if ( node.iParentNode.iNodeId == this.iAbsRootNode.iNodeId )
    {
        //td1.style.display = "none";
        //td2.style.display = "none";
    }

    var td3 = document.createElement( 'td' );
    // Note: this.iIconWidth shoul be greater than this.iSymbolWidth, -1 is for
    // td border
    td3.style.paddingLeft = ( ( this.iIconWidth - this.iSymbolWidth ) >>> 1 );
    td3.colSpan = 2;
    td3.appendChild( node.iHtmlElement );

    tr.appendChild( td3 );
    return tr;
};

/**
 * Desc: return DynTree object description. 
 * Type: public.
 */
DynTree.prototype.toString = function()
{
    return "DynTree Object";
}

DynTree.prototype._onUnload = function()
{
    try
    {
        self.Destructor();
    }
    catch ( e )
    {
    }
}

DynTree.prototype.SetAsRoot = function( node )
{
    if ( typeof ( node ) != "object" )
    {
        node = this.FindNodeById( node );
    }

    if ( this.iRootNode == node )
    {
        return;
    }
    
    // Re-add the current root node to its parent.
    var rn = this.iRootNode;    
    if ( rn.iParentNode )
    {
        rn.iTrElement.childNodes[2].appendChild( rn.iHtmlElement );
    }
    
    // Remove the node element from his parent.   
    if ( node.iParentNode )
    {
        node.iTrElement.childNodes[2].removeChild( node.iHtmlElement );
    }
    
    this.iRootNode = node;
    this.Refresh();
}

DynTree.prototype.Refresh = function()
{
    this.iParentElement.removeChild( this.iHtmlTree );
    this._renderSelf();
    this.iHtmlTree.appendChild( this.iRootNode.iHtmlElement );
}

DynTree.prototype.RemoveNode = function( node )
{
    if ( typeof ( node ) != "object" )
    {
        node = this.FindNodeById( node );
    }	

    if ( !node )
    {
        return;
    }
    
    this.UnregisterNode(node);
    
    if (node == this.iAbsRootNode) 
    {
        this.iHtmlTree.removeChild( node.iHtmlElement );   
        this.iIdPull = {};
        this.iPullSize = 0;
        this.iRootNode = null;
        this.iAbsRootNode = null;
        return;
    }
    
    var pNode = node.iParentNode;
    var index = node.iIndex;	
        
    //Update the parent symbol if it is the last item
    if (pNode.iChildCount == 1) 
    {
        if (pNode.IsTail()) 
        {
            pNode.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[1];
        }
        else
        {
            pNode.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[2];
        }
    }
    
    //Update previous node symbol
    if (node.IsTail() && pNode.iChildCount > 1) 
    {
        var preNode = pNode.iChildNodes[index-1];
        if(preNode)
        {
            if (preNode.iChildCount >0) 
            {
                preNode.iTds[0].childNodes[0].src = preNode.iShowChildren ? (this.iImagePath + this.iSymbolArray[3]):(this.iImagePath + this.iSymbolArray[6]);
            }
            else
            {
                preNode.iTds[0].childNodes[0].src = this.iImagePath + this.iSymbolArray[1];
            }        
        }

    }

    // Tbody remove tr
    pNode.iHtmlElement.childNodes[0].removeChild( node.iTrElement );
    
    for ( var i = index + 1; i < pNode.iChildCount; i++ )
    {
    	pNode.iChildNodes[i-1] = pNode.iChildNodes[i];
    }
    pNode.iChildNodes[pNode.iChildCount-1] = null;
    --pNode.iChildCount; 
}

DynTree.prototype.GetSelectedNode = function()
{
    var selectedNodes = new Array();
    var i=0;
    for ( var a in this.iIdPull )
    {
        var z = this.iIdPull[a];
        if ( !z )
            continue;
        if(z.iIsSelected)
            selectedNodes[i++] = z;
    }
    return selectedNodes;
}

DynTree.prototype.UseAbsRoot = function()
{
    this.SetAsRoot( this.iAbsRootNode );
}

DynTree.prototype.ParentAsRoot = function()
{
    if ( this.iRootNode.iParentNode )
    {
        this.SetAsRoot( this.iRootNode.iParentNode );
    }
}
















