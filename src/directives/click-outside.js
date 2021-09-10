import Vue from 'vue';

Vue.directive('click-outside', {
  bind: (el, binding, vnode) => {
    const uniqueClass = `${Number(new Date) * Math.random()}`.replace('.', '-');
    el.classList.add(uniqueClass);

    const isParentClicked = path => {
      return !!path.find(el => el.classList && el.classList.contains(uniqueClass));
    }

    el.clickOutsideEvent = (event) => {
      if (!isParentClicked(event.path)) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: (el) => {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});
