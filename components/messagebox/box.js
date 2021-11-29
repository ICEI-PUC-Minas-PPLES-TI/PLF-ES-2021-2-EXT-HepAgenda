import Template from './box.vue';

let globalOptions = {
  show: false,
  closable: true,
  title: "",
  message: {
    content: '',
    cssClass: '',
    style: {}
  },
  buttons: [],
  closeBtn: {
    enabled: true
  },
  messageBox: {
    cssClass: '',
    style: {}
  },
  msgFooter: {
    cssClass: '',
    style: {}
  }
};

let instance;

const Message = function (config = {}) {
  let Tpl = this.extend(Template);
  instance = new Tpl();
  config = {
    ...globalOptions,
    ...config
  };
  for (let key in config) {
    if (config.hasOwnProperty(key)) {
      instance.$data[key] = config[key];
    }
  }
  instance.$data.show = true;
  document.body.style.overflow = 'hidden';
  document.body.appendChild(instance.$mount().$el);


  document.addEventListener("keydown", function(e) {
    var keyCode = e.code;
    if(keyCode == 'Enter' || keyCode == 'NumpadEnter' && instance.$data.show){
      e.preventDefault()
      Dismiss()
    }
  });

}

const Alert = function (message, title, config, callback) {
  let alertConfig = {
    type: 'info',
    message: {
      content: message
    },
    title: title,
    buttons: [{
      label: 'OK',
      style: {
        margin: '0',
        width: '100%',
        height: '40px',
        lineHeight: '40px',
        boxSizing: 'border-box',
        border: 'none'
      },
      action: function () {
        Dismiss();
        callback && callback();
      }
    }],
    msgFooter: {
      style: {
        padding: '0'
      }
    }
  };

  Message.call(this, {
    ...globalOptions,
    ...alertConfig,
    ...config
  });
}

const Confirm = function (message, callback) {
  let confirmConfig = {
    type: 'info',
    message: {
      content: message
    },
    buttons: [{
      label: 'Cancelar',
      style: {
        margin: '0',
        padding: '3%',
        width: '50%',
        height: '40%',
        boxSizing: 'border-box',
        border: 'none',
        lineHeight: '2'
      },
      action: function () {
        Dismiss();
        callback && callback(false);
      }
    }, {
      label: 'Confirmar',
      style: {
        margin: '0',
        padding: '3%',
        width: '50%',
        height: '40%',
        boxSizing: 'border-box',
        border: 'none',
        borderRight: '1px solid #f8f8f8',
        lineHeight: '2'
      },
      action: function () {
        Dismiss();
        callback && callback(true);
      }
    }],
    msgFooter: {
      style: {
        padding: '0'
      }
    }
  };

  Message.call(this, {
    ...globalOptions,
    ...confirmConfig
  });
}

const Dismiss = () => {
  instance.$data.show = false;
  document.body.style.overflow = 'auto';
}

export default {
  install(Vue) {
    Vue.prototype.$Message = Message.bind(Vue);
    Vue.prototype.$Message.alert = Alert.bind(Vue);
    Vue.prototype.$Message.confirm = Confirm.bind(Vue);
    Vue.prototype.$Message['dismiss'] = Dismiss;
  }
}