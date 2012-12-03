/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-12-3
 * Time: 下午7:15
 */
function antiVerify(selector) {
    window.postMessage( {
        type:'NoSelector',
        cmd:'verify',
        selector: selector
    }, '*');
}