/*
 * @Author: xuheng
 * @Date:   2017-04-24 14:04 
 * @File:   index
 * @Last Modified by:   
 * @Last Modified time: 
 * @Description:
 */

var QunarAPI = require("QunarAPI"),
    sniff = require("lib/sniff/sniff.js"),
    Alertify = require('lib/alertify/index');

$(function() {
    
    if(sniff.schema && sniff.ios && sniff.osVersion >= 7) {
        document.body.className += ' app-fullscreen';
    }
    
    var page = {
        init: function() {
            this.$back = $('#back');
            this.$submit = $('#foot');
            this.$input = $('#wxInput');
            
            this.bindEvent();
        },
        
        bindEvent: function() {
            var self = this;
            this.$back.on('click', function() {
                if(sniff.qunar) {
                    QunarAPI.ready(function() {
                        QunarAPI.hy.closeWebView({});
                    })
                } else {
                    history.back();
                }
            });
            
            this.$submit.on('click', function() {
                var value = self.$input.val();
                if(value) {
                    self.sendWX(value);
                } else {
                    self.tip('请输入正确的微信号或用于申请微信的手机号');
                }
                
            });
            
            this.$input.on('input', function() {
                var value = this.value;
                if(value) {
                    self.$submit.removeClass('disabled');
                } else {
                    self.$submit.addClass('disabled');
                }
            });
            
        },
        
        sendWX: function(wx) {
            var self = this;
            $.ajax({
                url: '',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    wechatId: wx || '',
                    channel: sniff.os
                },
                success: function(res) {
                    if(res.ret) {
                        self.tip(res.msg || '', function() {
                            if(sniff.qunar) {
                                QunarAPI.ready(function() {
                                    QunarAPI.hy.closeWebView({});
                                });
                            }
                        });
                    } else {
                        self.tip(res.msg || '绑定微信号失败');
                    }
                    
                },
                fail: function(res) {
                    self.tip(res && res.msg || '绑定微信号失败')
                }
            });
        },
        
        tip: function(msg, callback) {
            Alertify({
                close: false,
                ok: true,
                cancel: false,
                ok_text: '确定',
                clazz: 'item_pop',
                btn_class: 'pop_btn_txt',
                closeOnMask: false,
                data: {
                    title: '提示',
                    text: msg || ''
                },
                onok: function() {
                    if(typeof callback === 'function') {
                        callback();
                    }
                }
            });
        }
    };
    
    page.init();
    
});
