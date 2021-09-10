<template>
  <div id="demo">
    <iframe class="app-host"
            :src="appSrc"
            ref="iframe"
            @load="appHostLoadHandler"></iframe>
  </div>
</template>

<script>
import { LAYOUTS } from '@/shared/constants/layouts';
import { addQueryParamsToUrl } from "@/shared/helpers/addQueryParamsToUrl";

export default {
  name: 'Demo',
  created() {
    let url = `${window.location.origin}/ui/`;
    url = addQueryParamsToUrl(url, this.queryParams);
    this.appSrc = url;
  },
  data() {
    return {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmJkMDYyOGI0MThlNTAwMTQ5ZDM1ZjAiLCJwcm9maWxlIjp7ImZpcnN0TmFtZSI6ImdyYXBoIiwibGFzdE5hbWUiOiJndXkifSwiZW1haWwiOiJmdXJkYWtvdi5kZXZAYWl0aGVvbi5jb20iLCJpYXQiOjE2MDYyMjQ3MTAsImV4cCI6MTMzMzc2MTY3MTB9.MXTkhV9jwc9lqlWxSTZ4NUAxGRIscGuoFQUAjHNiE38',
      organizationId: '5f3d01fe9e97d20013fb7b60',
      baseHost: 'dev.aitheon.com',
      appSrc: null,
      projectId: '5fbe236900e481001214751b',
      graphNodeId: '5fbe236900e481001214751b',
      queryParams: {
        edit: true,
        layout: LAYOUTS.DESKTOP.key,
      }
    };
  },
  methods: {
    appHostLoadHandler() {
      const iframe = this.$refs.iframe;
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: 'credentials',
          payload: {
            token: this.token,
            organizationId: this.organizationId,
            baseHost: this.baseHost,
            projectId: this.projectId,
            graphNodeId: this.graphNodeId
          },
        }, '*');
      }
    },
  }
}
</script>

<style lang="scss">
.app-host {
  width: 100vw;
  height: 100vh;
  border: none;
}

#demo {
  max-height: 100vh;
}
</style>
