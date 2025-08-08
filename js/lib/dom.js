export function isTouchEvent(e) {
    return /touch/gi.test(e.type);
}

export function getEvent(e) {
    return isTouchEvent(e)
        ? ("originalEvent" in e ? e.originalEvent : e).touches[0]
        : e;
}

export function offset(element, options) {
    if (arguments.length > 1) {
        setOffset(element, options);
        return this;
    }

    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!element.getClientRects().length) {
        return {
            top: 0,
            left: 0,
        };
    }

    // Get document-relative position by adding viewport scroll to viewport-relative gBCR
    const rect = element.getBoundingClientRect();
    const win = element.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset - document.documentElement.clientTop,
        left: rect.left + win.pageXOffset - document.documentElement.clientLeft,
    };
}

export function globalToLocal(element, { left, top }) {
    const position = offset(element);
    return {
        left: Math.floor(left - position.left),
        top: Math.floor(top - position.top),
    };
}

function setOffset(element, { top, left }) {
    const curOffset = offset(element);
    const curTop = Number.parseFloat(css(element, "top")) || 0;
    const curLeft = Number.parseFloat(css(element, "left")) || 0;
    css(element, {
        top: `${top - curOffset.top + curTop}px`,
        left: `${left - curOffset.left + curLeft}px`,
    });
    return this;
}

export function hitTestPoint(el, { x, y }) {
    const rect = el.getBoundingClientRect();
    return rect
        ? y >= rect.top && x >= rect.left && y <= rect.bottom && x <= rect.right
        : false;
}

export function hitTestElements(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(
        rect1.left > rect2.right ||
        rect1.right < rect2.left ||
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top
    );
}

export function getIntersection(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const xOverlap = Math.max(
        0,
        Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
    );
    const yOverlap = Math.max(
        0,
        Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
    );

    if (xOverlap > 0 && yOverlap > 0) {
        return {
            left: Math.max(rect1.left, rect2.left),
            top: Math.max(rect1.top, rect2.top),
            width: xOverlap,
            height: yOverlap,
            percentX:(xOverlap/rect2.width*100),
            percentY:(yOverlap/rect2.height*100),
        };
    }

    return null;
}

export function getRect(array){
    let left = Infinity;
    let right = 0;
    let top = Infinity;
    let bottom = 0;
    let width = 0;
    let height = 0;
    for(const element of array){
        const box = element.getBoundingClientRect();
        left = Math.min(box.left,left);
        right = Math.max(box.right,right);
        top = Math.min(box.top,top);
        bottom = Math.max(box.bottom,bottom);
    }
    width = right - left;
    height = bottom - top;
    return {
        left,right,top,bottom,width,height
    }
}

export function overLap(overEl, overLappedEl, percent = 100, axis = "*") {
    const overElBox = overEl.getBoundingClientRect();
    const overLappedElBox = overLappedEl.getBoundingClientRect();
    const partX = percent != undefined ? Array.isArray(percent) && percent.length === 2 ? parseInt(percent[0]) : parseInt(percent) : 100;
    const partX2 = 100 - partX;
    const partY = percent != undefined ? Array.isArray(percent) && percent.length === 2 ? parseInt(percent[1]) : parseInt(percent) : 100;
    const partY2 = 100 - partY;
    const posXOver = overElBox.left;
    const dimXOver = overElBox.width;
    const rightOver = overElBox.right;
    const dimXOver1 = Math.round(partX / 100 * dimXOver);
    const dimXOver2 = Math.round(partX2 / 100 * dimXOver);
    const partRightOver1 = rightOver - dimXOver1;
    const partRightOver2 = rightOver - dimXOver2;
    const posYOver = overElBox.top;
    const dimYOver = overElBox.height;
    const bottomOver = overElBox.bottom;
    const dimYOver1 = Math.round(partY / 100 * dimYOver);
    const dimYOver2 = Math.round(partY2 / 100 * dimYOver);
    const partBottomOver1 = bottomOver - dimYOver1;
    const partBottomOver2 = bottomOver - dimYOver2;

    const posXOverlapped = overLappedElBox.left;
    const posYOverlapped = overLappedElBox.top;
    const rightOverlapped = overLappedElBox.right;
    const bottomOverlapped = overLappedElBox.bottom;

    const xOverlap = Math.max(
        0,
        Math.min(overElBox.right, overLappedElBox.right) - Math.max(overElBox.left, overLappedElBox.left)
    );

    const yOverlap = Math.max(
        0,
        Math.min(overElBox.bottom, overLappedElBox.bottom) - Math.max(overElBox.top, overLappedElBox.top)
    );

    const percentX = (xOverlap/overLappedElBox.width*100);
    const percentY = (yOverlap/overLappedElBox.height*100);

    console.log(percentX, percentY);

    const isOverX = (partRightOver1 >= posXOverlapped && partRightOver2 <= rightOverlapped);
    const isOverY = (partBottomOver1 >= posYOverlapped && partBottomOver2 <= bottomOverlapped);
    const betweenX = (posXOver >= posXOverlapped && partRightOver2 <= rightOverlapped);
    const betweenY = (posYOver >= posYOverlapped && partBottomOver2 <= bottomOverlapped);
    const condition = (axis === "x") ? (isOverX && betweenY) : (axis === "y") ? (isOverY && betweenX) : (isOverX && isOverY);
    return condition;
}

export function pixelToPercentTranslate(options = {}) {
    const {
      element,
      pixelX = 0,
      pixelY = 0,
      relativeTo = 'self', // can be 'parent', 'self', or 'viewport'
    } = options;
  
    if (!element) {
      console.error('Element is required to calculate percentage translation');
      return { percentX: 0, percentY: 0 };
    }
  
    const getRelativeElement = () => {
      switch (relativeTo) {
        case 'parent':
          return element.parentElement || document.body;
        case 'self':
          return element;
        case 'viewport':
          return {
            offsetWidth: window.innerWidth,
            offsetHeight: window.innerHeight
          };
        default:
          return element.parentElement || document.body;
      }
    };
  
    const calculatePercentage = (pixels, dimension, isX = true) => {
      if (pixels === 0) return 0;
      
      const relativeElement = getRelativeElement();
      const relativeDimension = isX ? 
        relativeElement.offsetWidth : 
        relativeElement.offsetHeight;
  
      if (!relativeDimension) return 0;
  
      return (pixels / relativeDimension) * 100;
    };
  
    const round = (num) => Math.round(num * 100) / 100;
  
    const percentX = round(calculatePercentage(pixelX, 'width', true));
    const percentY = round(calculatePercentage(pixelY, 'height', false));
  
    return {
      percentX,
      percentY,
      toString: () => `translate(${percentX}%, ${percentY}%)`,
      cssValue: `translate(${percentX}%, ${percentY}%)`,
      values: {
        x: `${percentX}%`,
        y: `${percentY}%`
      }
    };
}

export function translationRender(obj,wrap){
    for(var [key,value] of obj){
        //Par classe
        const elems = translationGetElements(key,wrap)
        if(elems){
            for(var e=1; e<=elems.length; e++){
                const elem = elems[e-1];
                injectContent(elem,key,value);
            }    
        }
    }
}

function translationGetElements(key,wrap){
    const byClass = Array.from(wrap.querySelectorAll("."+key))
    const byAttr = Array.from(wrap.querySelectorAll('[json='+key+']'))
    return byClass.concat(byAttr)
}

function injectContent(el,prop,content){
    if(prop.indexOf("href-")!=-1){
        el.setAttribute("href",content);
    }
    else if(prop.indexOf("src-")!=-1){
        el.src = content;
    } else {
        // const matches = content.match(/<.*?>/g);
        // if(matches){
        //     for(let t=1; t<=matches.length; t++){
        //         const match = matches[t-1];
        //         if(match.indexOf("<br>")!=-1){
        //             continue;
        //         }
        //         const hasId = match.match(/id\(.*?\)/);
        //         const hasClass = match.match(/class\(.*?\)/);
        //         const id = hasId ? hasId[0].match(/\(.*?\)/).join("").replace(/\(|\)/g,"") : "";
        //         const cl = hasClass ? hasClass[0].match(/\(.*?\)/).join("").replace(/\(|\)/g,"") : "";
        //         const replacement = "<div id='"+id+"' class='"+cl+"'></div>"
        //         content = content.replace(matches[t-1],replacement);
        //     }
        // }
        el.innerHTML = content; 
    }
}
