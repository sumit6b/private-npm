var configClient = require('../../../../config/config-client')();

var BaseUrlHelper = function(url){};
BaseUrlHelper.prototype.getOrigin = function(){
    return "https://www.oyorooms.com"
};
BaseUrlHelper.prototype.isUrlWithParams = function(url){
    var urlParts = url.split('?');
    if(urlParts.length > 1 && urlParts[1].length){
        return true;
    }else{
        return false;
    }
};
BaseUrlHelper.prototype.isCountryPage = function(pathname){
    var urlParts = pathname.split('/');
    if(urlParts.length>1 && configClient.countryISO3166Mapping[urlParts[1]]){
        return true;
    }else{
        return false;
    }
};
BaseUrlHelper.prototype.getISO3166FromPathname = function(pathname){
    var countryName = this.getCountryNameFromPathname(pathname);
    var countryCode = configClient.countryISO3166Mapping[countryName];
    return countryCode;
};

BaseUrlHelper.prototype.getCountryNameFromPathname = function(pathname){
    if(this.isCountryPage(pathname)){
        return pathname.split('/')[1];
    }else{
        return "";
    }
}
BaseUrlHelper.prototype.getPathname = function(url){
    //should return pathname of url
    if(url){
        var urlParts = url.split(this.getOrigin())
        if(urlParts.length>1){
            return urlParts[1]
        }else{
            return urlParts[0]
        }
    }

}
BaseUrlHelper.prototype.getUrlParameterFromUrl = function(url){
    var urlParts = url.split('?');
    if (urlParts.length > 1 && urlParts[1].length){
        return urlParts[1]
    }else{
        return "";
    }
};
BaseUrlHelper.prototype.getUrlWithoutParamFromUrl = function(url){
    return url.split('?')[0];
};
BaseUrlHelper.prototype.getUrlParameterAsObject = function(urlParams){
    var urlParamObj = {};
    var urlParams = urlParams.replace(/(^&)|(&$)/g,'');
    var urlParamsParts = urlParams.split('&');
    if(urlParamsParts.length>1 && urlParamsParts[0].length){
        for(var i in urlParamsParts) {
            var paramKeyValue = urlParamsParts[i].split('=');
            urlParamObj[paramKeyValue[0]] = paramKeyValue[1];
        }
    }
    return urlParamObj;
};
BaseUrlHelper.prototype.updateUrlParameters = function(modifier, modifiable){
    var modifiableObject = this.getUrlParameterAsObject(modifiable);
    var modifierObject = this.getUrlParameterAsObject(modifier);
    for(_property in modifierObject){
        modifiableObject[_property] = modifierObject[_property];
    }
    var updatedUrlParamString = this.getUrlParameterAsString(modifiableObject);
    return updatedUrlParamString;
};
BaseUrlHelper.prototype.getUrlParameterAsString = function(urlParamObject){
    var urlParamString = '';
    if (Object.keys(urlParamObject).length){
        for(var _property in urlParamObject){
            if(urlParamString){
                urlParamString = urlParamString + '&';
            }
            urlParamString = urlParamString + _property + '=' + urlParamObject[_property];
        }
    }
    return urlParamString;
};
BaseUrlHelper.prototype.convertStringToSlugString = function(spaceSeparatedString){
    var str = spaceSeparatedString;
    if(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }
    else {
        return "";
    }
};
module.exports = BaseUrlHelper;

// Add to exports for node, or window for browser
//if(typeof module !== 'undefined' && module.exports){
//    module.exports = BaseUrlHelper;
//}
//else{
//    this.BaseUrlHelper = BaseUrlHelper;
//}
