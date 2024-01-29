<template>
  <q-layout view="lHh Lpr lFf" class="background">
    <q-header elevated>
      <q-toolbar class="shadowToolbar">
        <q-toolbar-title class="toolbar-padding"> </q-toolbar-title>
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
          class="loginBtn"
          label="Logout"
          @click="logout()"
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
const user = ref([]);

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },
  data() {
    return {
      list: linksList,
    };
  },
  methods: {
    logout() {
      window.location.replace(`${webApi.server}/logout`);
    },
    streamboost() {
      window.location.replace("https://streamboost.de");
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
  unmounted() {
    localStorage.setItem("activeUser", null);
  },
});
</script>

<style lang="scss" scoped>
.loginBtn {
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
  color: #000;
  border: 5px;
  background-color: #cecece;
  box-shadow: 0px 0px 3px 0px #cecece;
  border-color: #cecece;
}
.essentialLinks:hover {
  background-color: #c0c0c0;
  border-color: #c0c0c0;
}
.shadowToolbar {
  box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.5);
}

.toolbar-padding {
  padding-top: 10px;
}
</style>
