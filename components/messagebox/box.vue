<template>
  <transition name="modal">
    <div class="msgBox" v-if="show" @touchmove="notAllowTouchMove($event)">
      <div class="message" :class="msgBody.cssClass" :style="msgBody.style">
        <div class="title">
          {{ title }}
          <div
            v-if="closeBtn.enabled"
            class="closeBtn"
            @click="dismiss($event)"
          >
            <svg width="15" height="16" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line y1="-0.5" x2="32.5265" y2="-0.5" transform="matrix(0.707099 0.707115 -0.890758 0.454479 0.000244141 1)" stroke="#333"/>
              <line y1="-0.5" x2="31.461" y2="-0.5" transform="matrix(-0.68231 0.731063 -0.902857 -0.429942 21.4663 1)" stroke="#333"/>
            </svg>
          </div>
        </div>
        <div
          class="msg"
        >
          <div class="icon" v-if="['success','info','error'].includes(type)">
            <svg v-if="type=='info'" style="width:60px;height:60px" viewBox="0 0 24 24">
              <path fill="#555" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
            <svg v-else-if="type=='success'" style="width:60px;height:60px" viewBox="0 0 24 24">
              <path fill="green" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
            </svg>
            <svg v-else style="width:60px;height:60px" viewBox="0 0 24 24">
              <path fill="red" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
          </svg>
          </div>
          <span class="msg-content" v-html="message.content" />
        </div>
        <div
          class="msgFooter"
          :class="msgFooter.cssClass"
          :style="msgFooter.style"
        >
          <div
            class="footerBtn"
            v-for="(item, idx) in buttons"
            :key="idx"
            :class="item.cssClass"
            :style="item.style"
            @click="item.action"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="mask" ref="mask" @click="dismiss($event)"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      closable: true,
      type: "default",
      title: "",
      message: {
        content: "",
        cssClass: "",
        style: {},
      },
      buttons: [],
      closeBtn: {
        enabled: true
      },
      msgBody: {
        cssClass: "",
        style: {},
      },
      msgFooter: {
        cssClass: "",
        style: {},
      },
    };
  },
  methods: {
    dismiss(event) {
      if (!this.closable && event.target.getAttribute("role") != "close-button")
        return
      
      this.show = false
      document.body.style.overflow = "auto"
    },
    notAllowTouchMove(event) {
      event.preventDefault()
    },
  },
};
</script>

<style lang="scss" scoped>
.msgBox {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-transition: opacity 0.3s ease;
  -moz-transition: opacity 0.3s ease;
  transition: opacity 0.3s ease;
  z-index: 9999;
}
.title {
  position: relative;
  padding: 15px;
  padding-bottom: 0;
  background: #fff;
  font-weight: bold;
  text-align: center;
  font-size: 1.2rem;
}
.closeBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 99;
  &:hover{
    filter: brightness(0);
    transform: scale(1.1);
  }
}
.message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  border-radius: 10px;
  background: #fff;
  z-index: 9999;
  overflow: hidden;
}
.msg {
  position: relative;
  padding: 30px 20px;
  overflow: hidden;
  & .icon{
    display: inline;
    width: 80px;
    height: 60px;
  }
  &-content {
    width: calc(100% - 85px);
    vertical-align: top;
    word-break: break-all;
    display: inline-block;
    transform: translateY(15px);
  }
}
.msgFooter {
  position: relative;
  box-sizing: border-box;
  padding: 2%;
  border-top: 1px solid #e8e8e8;
  background: #fff;
  text-align: right;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
}
.footerBtn {
  display: inline-block;
  position: relative;
  margin-right: 5px;
  margin-bottom: 0;
  padding: 0 15px;
  line-height: 1.15;
  height: 28px;
  line-height: 28px;
  border-radius: 4px;
  border: 1px solid transparent;
  border-color: #d9d9d9;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>