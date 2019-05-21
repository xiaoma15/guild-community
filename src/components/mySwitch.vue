<template>
  <div class="switch">
	    <span class="my-switch" :class="{'my-switch-on' : isChecked}" :value="value" @click="toggle" style="position:relative">
	    </span>
    </div>
</template>

<script>
export default {
props: {
    value: {
        type: Boolean,
        default: false
    },
},
data () {
    return {
        isChecked: this.value
    }
},
watch: {
    value (val) {
        this.isChecked = val
    },
},
methods: {
    toggle() {
        this.isChecked = !this.isChecked;
        this.$emit('confirmSwitch', this.isChecked)
    }
}
}
</script>

<style  scoped>
.my-switch {
    display: block;
    position: relative;
    width: 36px;
    height: 20px;
    border: 1px solid #ccc;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #ccc;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
}
.my-switch:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 36px;
    height: 20px;
    border-radius: 15px;
    border-right: 1px solid #ccc;
    background-color: #ccc;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.my-switch:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background-color: #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.my-switch-on {
    border-color: #11bff4;
    background-color: #11bff4;
}
.my-switch-on:before {
    border-color: #11bff4;
    background-color: #11bff4;
}
.my-switch-on:after {
    transform: translateX(18px);
}
</style>

