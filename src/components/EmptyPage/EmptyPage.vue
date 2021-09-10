<template>
  <div class="empty">
    <div class="empty__image"></div>
    <div class="empty__title">
      There are no UI elements added
    </div>
    <div class="empty__text">
      Please add some UI elements to your flow and redeploy.
    </div>
  </div>
</template>

<script>
 export default {
   name: 'EmptyPage',
 }
</script>

<style lang="scss">
  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
    white-space: nowrap;

    &__image {
      width: 140px;
      height: 70px;
      margin-bottom: 16px;
      background: url('~@/assets/empty.svg') center center no-repeat;
      background-size: contain;
    }

    &__title {
      width: 256px;
      height: 28px;
      color: #fff;
      font-size: 18px;
      letter-spacing: 0;
      line-height: 28px;
      margin-bottom: 8px;
    }

    &__text {
      width: 380px;
      height: 20px;
      color: #7e7e7e;
      font-size: 14px;
      letter-spacing: 0.2px;
      line-height: 20px;
    }
  }
</style>
