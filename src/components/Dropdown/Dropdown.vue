<template>
  <div class="dropdown"
       v-click-outside="closeDropdownHandler"
       @click="toggleDropdownHandler">
    <input-component :value="dropdownValue"
                     :label="label"
                     :placeholder="placeholder"
                     :readonly="true"/>
    <div class="dropdown__items-wrap"
         v-if="isOpen">
      <div class="dropdown__items">
        <div v-for="item in items"
             class="dropdown-item"
             :class="{ 'dropdown-item--selected': isItemSelected(item) }"
             @click="selectItemHandler($event, item)"
             :key="bindValue ? item[bindValue] : item">
          {{ bindLabel ? item[bindLabel] : item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputComponent from '@/components/Input/Input';

export default {
  components: {
    InputComponent,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleDropdownHandler() {
      this.isOpen = !this.isOpen;
    },
    closeDropdownHandler() {
      this.isOpen = false;
    },
    selectItemHandler(event, item) {
      this.stopEvent(event);
      const itemValue = this.bindValue ? item[this.bindValue] : item;
      if (this.multiselect) {
        let valueToUpdate = Array.isArray(this.value) ? this.value : [];
        if (this.isItemSelected(item)) {
          valueToUpdate = valueToUpdate.filter(v => v !== itemValue);
        } else {
          valueToUpdate.push(itemValue);
        }
        this.$emit('dropdownChange', valueToUpdate);
      } else {
        this.$emit('dropdownChange', itemValue);
        this.closeDropdownHandler();
      }
    },
    getDisplayedValue(value = '') {
      if (this.bindValue) {
        const item = this.items?.find(i => i[this.bindValue] === value) || '';
        return this.bindLabel ? item[this.bindLabel] : item;
      }
      return this.bindLabel ? value[this.bindValue] : value;
    },
    stopEvent(e) {
      e?.preventDefault();
      e?.stopPropagation();
    },
    isItemSelected(item) {
      const itemValue = this.bindValue ? item[this.bindValue] : item;
      if (this.multiselect && Array.isArray(this.value)) {
        return this.value.some(v => v === itemValue);
      }
      return this.value === itemValue;
    },
  },
  computed: {
    dropdownValue() {
      const displayedValue = this.multiselect
          ? this.value?.map?.(this.getDisplayedValue.bind(this)).join(', ')
          : this.getDisplayedValue(this.value);
      return displayedValue ? displayedValue : '';
    },
  },
  props: {
    value: [String, Array],
    items: {
      default: () => [],
      type: Array,
    },
    placeholder: String,
    label: String,
    bindValue: String,
    bindLabel: String,
    multiselect: Boolean,
  }
}
</script>

<style lang="scss">
@import "src/styles/common/scroll";

.dropdown {
  display: flex;
  flex-direction: column;

  &__items-wrap {
    position: relative;
  }

  &__items {
    position: absolute;
    left: 0;
    top: 8px;
    display: block;
    width: 100%;
    padding: 8px 0;
    max-height: calc(32px * 4);
    overflow-y: auto;
    border-radius: 2px;
    background: #2b2b2b;
    box-shadow: 1px 1px 5px 0 #1a1a1a;

    @include scroll;
  }
}

.dropdown-item {
  padding: 8px 16px;
  box-sizing: border-box;
  transition: .2s ease-in-out;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background: #383838;
  }

  &--selected {
    background: rgba(#C29E3E, 0.15) !important;
  }
}
</style>
