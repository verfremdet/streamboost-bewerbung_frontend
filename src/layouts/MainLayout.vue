<template>
  <q-layout view="lHh Lpr lFf" class="background">
    <q-header elevated>
      <q-toolbar class="toolbar">
        <q-toolbar-title class="toolbar-padding">
          <q-icon
            v-bind:name="
              darkMode
                ? !darkMode
                  ? 'brightness_5'
                  : 'brightness_5'
                : 'dark_mode'
            "
            v-bind:color="darkMode ? (!darkMode ? 'white' : 'white') : 'black'"
            size="34px"
            style="top: -5px"
            @click="darkModeToggle()"
          />
        </q-toolbar-title>
        <q-list class="links">
          <EssentialLink
            v-for="link in list"
            v-show="link.show"
            :key="link.title"
            v-bind="link"
            class="essentialLinks"
          />
        </q-list>
        <q-btn
          outline
          style="color: goldenrod"
          class="logoutBtn"
          label="Logout"
        />
        <div class="toolbar-padding" @click="streamboost()">
          <img
            src="~assets/img/streamboost-bewerbung.png"
            alt="streamboost-bewerbung"
            style="width: 100px"
          />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar, setCssVar, Dark } from "quasar";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Addresses",
    caption: "Table",
    icon: "group",
    link: "#/dataTable",
    show: true,
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },
  data() {
    return {
      list: linksList,
      darkMode: false,

      whiteModeColor: "#ebebeb",
      whiteModeTextColor: "#000",

      darkModeColor: "#272727",
      darkModeTextColor: "#fff",
    };
  },
  mounted() {
    this.darkMode = localStorage.getItem("darkMode");
    console.log(localStorage.getItem("darkMode"));
    if (this.darkMode != null && this.darkMode === "true") {
      this.darkMode = true;
      setCssVar("primary", this.darkModeColor);
      setCssVar("textColor", this.darkModeTextColor);
      Dark.set(true);
    } else {
      this.darkMode = false;
      setCssVar("primary", this.whiteModeColor);
      setCssVar("textColor", this.whiteModeTextColor);
      Dark.set(false);
    }
  },
  methods: {
    streamboost() {
      window.location.replace("https://streamboost.de");
    },
    darkModeToggle() {
      Dark.toggle();
      this.darkMode = Dark.isActive;
      if (this.darkMode === true) {
        setCssVar("primary", this.darkModeColor);
        setCssVar("textColor", this.darkModeTextColor);
      } else {
        setCssVar("primary", this.whiteModeColor);
        setCssVar("textColor", this.whiteModeTextColor);
      }

      localStorage.setItem("darkMode", Dark.isActive);
    },
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.logoutBtn {
  margin-top: 9px;
  right: 20px;
}
.wrap {
  margin-right: 820px;
}
.links {
  display: inline-flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.essentialLinks {
  color: var(--q-textColor);
  border: 5px;
  box-shadow: 0px 0px 3px 0px #cecece;
  background-color: var(--q-primary);
  box-shadow: 0px 0px 3px 0px #cecece;
  border-color: #cecece;
}
.essentialLinks:hover {
  background-color: var(--q-primary);
  border-color: var(--q-primary);
}
.toolbar {
  box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.5);
}
.q-layout__section--marginal {
  background-color: var(--q-primary);
}
.toolbar-padding {
  padding-top: 10px;
}
</style>
