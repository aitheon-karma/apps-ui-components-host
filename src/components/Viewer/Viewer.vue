<template>
  <div class="viewer"
       ref="viewer">
    <div class="viewer__switch-section"
         v-if="showOrientationSwitch">
      <div class="viewer__switch viewer__switch--portrait margin-right--4"
           :class="{'viewer__switch--active' : layoutType.orientation === viewTypes.PORTRAIT }"
           @click="changeViewTypeHandler(viewTypes.PORTRAIT)"></div>
      <div class="viewer__switch viewer__switch--landscape"
           :class="{'viewer__switch--active' : layoutType.orientation === viewTypes.LANDSCAPE }"
           @click="changeViewTypeHandler(viewTypes.LANDSCAPE)"></div>
    </div>

    <div class="viewer__buttons-section"
         v-if="isCreatorStudioView">
      <button class="button button--small button--ghost"
              @click="startEditHandler"
              v-if="!application.isEditing">
        edit widgets
      </button>
      <template v-else>
        <button class="button button--small button--ghost button--error margin-right--16"
                @click="dismissEditHandler">
          cancel
        </button>
        <button class="button button--small button--ghost"
                @click="saveLayoutHandler">
          save
        </button>
      </template>
    </div>

    <template v-if="isCreatorStudioView">
      <side-panel/>
      <div class="viewer-container"
           :class="viewerClasses">
        <div class="viewer-inside-container">
          <div class="viewer-grid flex-column-container">
            <div :class="{ 'margin-bottom--16': isCreatorStudioView }">
              <grid />
            </div>
          </div>
        </div>
      </div>
    </template>

    <grid v-else/>
  </div>
</template>

<script>
import SidePanel from '@/components/SidePanel/SidePanel';
import Grid from '@/components/Grid/Grid';
import { windowMessages } from '@/shared/constants/windowMessages';
import { LAYOUTS } from '@/shared/constants/layouts';
import { VIEW_TYPE } from '@/shared/constants/viewType';

export default {
  name: 'Viewer',
  components: {
    Grid,
    SidePanel,
  },
  data() {
    return {
      observer: null,
      size: {
        width: 0,
        height: 0,
      },
      viewTypes: VIEW_TYPE,
    };
  },
  mounted() {
    this.observer = new ResizeObserver(([mutation]) => {
      const { contentRect } = mutation;
      if (this.size.width !== contentRect.width || this.size.height !== contentRect.height) {
        this.size = {
          width: contentRect.width,
          height: contentRect.height,
        };

        this.checkLayout();

        this.$store.dispatch('sendMessageAction', {
          type: windowMessages.viewport,
          data: this.size,
        });
      }
    });

    this.observer.observe(this.$refs.viewer);
  },
  methods: {
    checkLayout() {
      if (!this.application.showSidePanel) {
        const sortedLayouts = Object.values(LAYOUTS).sort((p, n) => p.width - n.width);
        let layout = sortedLayouts.find(l => l.width >= this.size.width);

        if (!layout) {
          layout = LAYOUTS.DESKTOP;
        }

        if (layout.key !== this.layoutType.key) {
          this.$store.dispatch('switchLayoutTypeAction', layout)
        }
      }
    },
    changeViewTypeHandler(type) {
      this.$store.dispatch('setApplicationDataAction', {
        layoutType: {
          ...this.layoutType,
          orientation: type,
        },
      })
    },
    startEditHandler() {
      this.$store.dispatch('startEditAction', {
        isEditing: true,
      });
    },
    dismissEditHandler() {
      this.$store.dispatch('dismissEditAction');
    },
    saveLayoutHandler() {
      this.$store.dispatch('saveActiveLayout');
    },
  },
  computed: {
    isCreatorStudioView() {
      return this.views.length && this.application.isEditable && this.application.showSidePanel;
    },
    showOrientationSwitch() {
      return [
        LAYOUTS.MOBILE.key,
        LAYOUTS.TABLET.key
      ].includes(this.layoutType.key) && this.isCreatorStudioView;
    },
    viewerClasses() {
      let classes = {};
      if (this.isCreatorStudioView) {
        const firstModifier = this.layoutType.key.toLowerCase();
        const secondModifier = this.layoutType.orientation === VIEW_TYPE.LANDSCAPE ? `-${this.layoutType.orientation.toLowerCase()}` : '';
        classes = {
          [`viewer-container--${firstModifier}${secondModifier}`]: true,
        };
      }
      return classes;
    },
    application() {
      return this.$store.state.application;
    },
    layoutType() {
      return this.application.layoutType;
    },
    views() {
      return this.$store.state.views;
    },
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
}
</script>

<style lang="scss">
@import "Viewer.scss";
</style>
