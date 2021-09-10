const demo = {
      isEditMode: true,
      layoutType: 'DESKTOP',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGMxNTU2YjNjMzY2MjAwMTBkNTBhNzkiLCJwcm9maWxlIjp7ImZpcnN0TmFtZSI6IlZpa3RvciIsImxhc3ROYW1lIjoiRnVyZGFrb3YifSwiZW1haWwiOiJ2ZnVyZGFrb3ZAYWl0aGVvbi5jb20iLCJpYXQiOjE2MDM4OTE0NzUsImV4cCI6MTMzMzUyODM0NzV9.Bm6U769Yz-NY1eBUA_wxiHg3A-s4AnS6Of_7Evvw-Hw',
      organizationId: '5925de2a16d7f20015e06169',
      baseHost: 'dev.aitheon.com',
      appSrc: null,
      localUrl: '127.0.0.1:1880',
      projectId: '5f96e033b178de0013cf2e52',
      invoke() {
        window.postMessage({
            type: 'credentials',
            payload: {
              token: this.token,
              organizationId: this.organizationId,
              baseHost: this.baseHost,
              graphNodeId: this.graphNodeId,
              localUrl: this.localUrl,
              projectId: this.projectId
            },
          }, '*');
      } 
}
demo.invoke();