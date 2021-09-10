<template>
  <div class="input-content">
    <label class="input-label"
           v-if="label">
      {{ label }}
    </label>
    <div class="input-wrap"
         :class="{ 'input-wrap--readonly': readonly }">
      <input class="input"
             v-model="inputValue"
             @input="valueChangeHandler"
             @keyup="keyupHandler"
             :readonly="readonly"
             :placeholder="placeholder"
             :type="type">
    </div>
  </div>
</template>

<script>

export default {
  name: 'InputComponent',
  data: function () {
    return {
      changeStarted: false,
      inputValue: this.value,
      typingAwaiter: null,
    }
  },
  methods: {
    keyupHandler() {
      if (this.typingAwaiter) {
        clearTimeout(this.typingAwaiter);
      }

      this.typingAwaiter = setTimeout(() => {
        this.$emit('inputChange', this.inputValue);
      }, this.valueChangeDelay);
    },
    valueChangeHandler({ target, inputType }) {
      if (inputType === 'insertFromPaste') {
        this.$emit('inputChange', target.value);
      }
    },
  },
  watch: {
    value: function (newValue) {
      if (newValue !== this.inputValue) {
        this.inputValue = newValue;
      }
    },
  },
  props: {
    value: String,
    valueChangeDelay: Number,
    label: String,
    readonly: {
      type: Boolean,
      default: () => false,
    },
    type: {
      type: String,
      default: () => 'text',
    },
    placeholder: String,
  },
};
</script>

<style lang="scss">
@import "./Input.scss";

.input-content {
  display: flex;
  flex-direction: column;
}
</style>
