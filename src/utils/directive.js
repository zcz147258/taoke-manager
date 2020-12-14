/*
 * @Descripttion: 
 * @Author: mikasa
 * @Date: 2020-11-25 14:08:54
 */
import Vue from 'vue'
import store from '../store/index'
/**权限指令**/

Vue.directive('has', {
    bind: function(el, binding) {
     if (!Vue.prototype.$_has(binding.value)) {
        el.style.display = "none"
     }
    }
   });
   //权限检查方法
Vue.prototype.$_has = function(value) {

    var arr = JSON.parse(JSON.stringify(store.state.permission.permissionList))
    let isExist = false;
    arr.forEach(item => {
        if(item == value){
            isExist=true;
        }
    });
    return isExist;
};